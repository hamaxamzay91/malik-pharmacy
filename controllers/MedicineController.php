<?php
// =====================================================
// MALIK PHARMACY - Medicine Controller
// =====================================================

class MedicineController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    // ── LIST with search, filter, pagination ──────
    public function index(): void
    {
        $lang = $_GET['lang'] ?? 'ku';
        $lang = in_array($lang, ['ku', 'en', 'ar']) ? $lang : 'ku';

        $page    = max(1, (int)($_GET['page'] ?? 1));
        $perPage = min(48, max(8, (int)($_GET['per_page'] ?? 16)));
        $search  = trim($_GET['search'] ?? '');
        $cat     = (int)($_GET['category'] ?? 0);
        $brand   = (int)($_GET['brand'] ?? 0);
        $minP    = (float)($_GET['min_price'] ?? 0);
        $maxP    = (float)($_GET['max_price'] ?? 0);
        $sort    = $_GET['sort'] ?? 'newest';
        $pres    = $_GET['prescription'] ?? '';
        $featured = (int)($_GET['featured'] ?? 0);

        $where  = ['m.is_active = 1', 'm.deleted_at IS NULL'];
        $params = [];

        if ($search) {
            $where[]  = "MATCH(m.name_ku, m.name_en, m.name_ar) AGAINST(? IN BOOLEAN MODE)";
            $params[] = $search . '*';
        }
        if ($cat)    { $where[] = 'm.category_id = ?'; $params[] = $cat; }
        if ($brand)  { $where[] = 'm.brand_id = ?';    $params[] = $brand; }
        if ($minP)   { $where[] = 'm.price >= ?';      $params[] = $minP; }
        if ($maxP)   { $where[] = 'm.price <= ?';      $params[] = $maxP; }
        if ($pres !== '') { $where[] = 'm.requires_prescription = ?'; $params[] = (int)$pres; }
        if ($featured) { $where[] = 'm.is_featured = 1'; }

        $orderBy = match ($sort) {
            'price_asc'  => 'm.price ASC',
            'price_desc' => 'm.price DESC',
            'popular'    => 'm.sales_count DESC',
            'rating'     => 'm.rating_avg DESC',
            'name'       => "m.name_{$lang} ASC",
            default      => 'm.created_at DESC',
        };

        $whereStr = implode(' AND ', $where);
        $sql = "SELECT 
                    m.id, m.uuid, m.slug, m.main_image, m.price, m.sale_price,
                    m.stock_quantity, m.requires_prescription, m.is_featured,
                    m.rating_avg, m.rating_count, m.sales_count,
                    m.name_{$lang} AS name,
                    m.short_desc_{$lang} AS short_desc,
                    c.name_{$lang} AS category_name,
                    b.name_{$lang} AS brand_name,
                    b.logo AS brand_logo
                FROM medicines m
                LEFT JOIN categories c ON m.category_id = c.id
                LEFT JOIN brands b ON m.brand_id = b.id
                WHERE $whereStr
                ORDER BY $orderBy";

        $offset  = ($page - 1) * $perPage;
        $countSql = "SELECT COUNT(*) FROM medicines m LEFT JOIN categories c ON m.category_id = c.id LEFT JOIN brands b ON m.brand_id = b.id WHERE $whereStr";

        $countStmt = $this->db->prepare($countSql);
        $countStmt->execute($params);
        $total = (int)$countStmt->fetchColumn();

        $stmt = $this->db->prepare("$sql LIMIT ? OFFSET ?");
        $stmt->execute([...$params, $perPage, $offset]);
        $items = $stmt->fetchAll();

        Response::json([
            'success' => true,
            'data'    => $items,
            'pagination' => [
                'total'        => $total,
                'per_page'     => $perPage,
                'current_page' => $page,
                'last_page'    => (int)ceil($total / $perPage),
            ],
            'filters' => [
                'search'   => $search,
                'category' => $cat,
                'brand'    => $brand,
                'sort'     => $sort,
            ]
        ]);
    }

    // ── SINGLE MEDICINE ───────────────────────────
    public function show(int $id): void
    {
        $lang = $_GET['lang'] ?? 'ku';
        $lang = in_array($lang, ['ku', 'en', 'ar']) ? $lang : 'ku';

        $stmt = $this->db->prepare("
            SELECT 
                m.*,
                m.name_{$lang} AS name,
                m.description_{$lang} AS description,
                m.short_desc_{$lang} AS short_desc,
                m.usage_{$lang} AS usage_info,
                m.ingredients_{$lang} AS ingredients,
                m.side_effects_{$lang} AS side_effects,
                c.name_{$lang} AS category_name, c.slug AS category_slug,
                b.name_{$lang} AS brand_name, b.logo AS brand_logo, b.website AS brand_website
            FROM medicines m
            LEFT JOIN categories c ON m.category_id = c.id
            LEFT JOIN brands b ON m.brand_id = b.id
            WHERE m.id = ? AND m.is_active = 1 AND m.deleted_at IS NULL
        ");
        $stmt->execute([$id]);
        $medicine = $stmt->fetch();

        if (!$medicine) {
            Response::error('Medicine not found', 404);
            return;
        }

        // Get images
        $imgStmt = $this->db->prepare(
            "SELECT * FROM medicine_images WHERE medicine_id = ? ORDER BY sort_order"
        );
        $imgStmt->execute([$id]);
        $medicine['images'] = $imgStmt->fetchAll();

        // Get related (same category)
        $relStmt = $this->db->prepare("
            SELECT id, name_{$lang} AS name, main_image, price, sale_price, rating_avg, slug
            FROM medicines
            WHERE category_id = ? AND id != ? AND is_active = 1 AND deleted_at IS NULL
            ORDER BY sales_count DESC LIMIT 8
        ");
        $relStmt->execute([$medicine['category_id'], $id]);
        $medicine['related'] = $relStmt->fetchAll();

        // Increment view count
        $this->db->prepare("UPDATE medicines SET view_count = view_count + 1 WHERE id = ?")
                 ->execute([$id]);

        Response::success($medicine);
    }

    // ── CREATE (Admin) ────────────────────────────
    public function store(array $body): void
    {
        $auth = AuthMiddleware::requireRole('admin', 'manager', 'pharmacist');

        $required = ['name_ku', 'name_en', 'name_ar', 'price', 'category_id', 'sku'];
        $errors = [];
        foreach ($required as $field) {
            if (empty($body[$field])) {
                $errors[$field] = "$field is required";
            }
        }
        if ($errors) { Response::error('Validation failed', 422, $errors); return; }

        Database::beginTransaction();
        try {
            $slug = $this->generateSlug($body['name_en']);
            $id = (new class extends BaseModel {
                protected string $table = 'medicines';
            })->create([
                'category_id'           => (int)$body['category_id'],
                'brand_id'              => !empty($body['brand_id']) ? (int)$body['brand_id'] : null,
                'sku'                   => $body['sku'],
                'slug'                  => $slug,
                'main_image'            => $body['main_image'] ?? '',
                'price'                 => (float)$body['price'],
                'sale_price'            => !empty($body['sale_price']) ? (float)$body['sale_price'] : null,
                'cost_price'            => !empty($body['cost_price']) ? (float)$body['cost_price'] : null,
                'stock_quantity'        => (int)($body['stock_quantity'] ?? 0),
                'requires_prescription' => (int)($body['requires_prescription'] ?? 0),
                'is_featured'           => (int)($body['is_featured'] ?? 0),
                'unit'                  => $body['unit'] ?? 'box',
                'name_ku'               => $body['name_ku'],
                'name_en'               => $body['name_en'],
                'name_ar'               => $body['name_ar'],
                'description_ku'        => $body['description_ku'] ?? null,
                'description_en'        => $body['description_en'] ?? null,
                'description_ar'        => $body['description_ar'] ?? null,
                'short_desc_ku'         => $body['short_desc_ku'] ?? null,
                'short_desc_en'         => $body['short_desc_en'] ?? null,
                'short_desc_ar'         => $body['short_desc_ar'] ?? null,
                'usage_ku'              => $body['usage_ku'] ?? null,
                'usage_en'              => $body['usage_en'] ?? null,
                'usage_ar'              => $body['usage_ar'] ?? null,
                'ingredients_ku'        => $body['ingredients_ku'] ?? null,
                'ingredients_en'        => $body['ingredients_en'] ?? null,
                'ingredients_ar'        => $body['ingredients_ar'] ?? null,
                'side_effects_ku'       => $body['side_effects_ku'] ?? null,
                'side_effects_en'       => $body['side_effects_en'] ?? null,
                'side_effects_ar'       => $body['side_effects_ar'] ?? null,
                'meta_title_ku'         => $body['meta_title_ku'] ?? null,
                'meta_title_en'         => $body['meta_title_en'] ?? null,
                'meta_title_ar'         => $body['meta_title_ar'] ?? null,
                'expiry_date'           => $body['expiry_date'] ?? null,
                'manufacturer_country'  => $body['manufacturer_country'] ?? null,
            ]);

            Database::commit();
            Response::created(['id' => $id, 'slug' => $slug], 'Medicine created');
        } catch (Throwable $e) {
            Database::rollback();
            throw $e;
        }
    }

    // ── UPDATE (Admin) ────────────────────────────
    public function update(int $id, array $body): void
    {
        AuthMiddleware::requireRole('admin', 'manager', 'pharmacist');

        $allowed = [
            'name_ku','name_en','name_ar','price','sale_price','cost_price',
            'stock_quantity','requires_prescription','is_featured','is_active',
            'description_ku','description_en','description_ar',
            'short_desc_ku','short_desc_en','short_desc_ar',
            'usage_ku','usage_en','usage_ar',
            'ingredients_ku','ingredients_en','ingredients_ar',
            'side_effects_ku','side_effects_en','side_effects_ar',
            'category_id','brand_id','unit','expiry_date','main_image'
        ];

        $data = array_intersect_key($body, array_flip($allowed));
        if (empty($data)) { Response::error('No valid fields to update', 422); return; }

        $stmt = $this->db->prepare("SELECT id FROM medicines WHERE id = ? AND deleted_at IS NULL");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) { Response::error('Medicine not found', 404); return; }

        $sets = implode(', ', array_map(fn($k) => "$k = ?", array_keys($data)));
        $stmt = $this->db->prepare("UPDATE medicines SET $sets, updated_at = NOW() WHERE id = ?");
        $stmt->execute([...array_values($data), $id]);

        Response::success(null, 'Medicine updated');
    }

    // ── DELETE (Admin) ────────────────────────────
    public function destroy(int $id): void
    {
        AuthMiddleware::requireRole('admin');
        $stmt = $this->db->prepare("UPDATE medicines SET deleted_at = NOW() WHERE id = ?");
        $stmt->execute([$id]);
        Response::success(null, 'Medicine deleted');
    }

    private function generateSlug(string $text): string
    {
        $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $text));
        $slug = trim($slug, '-');
        $base = $slug;
        $i = 1;
        while (true) {
            $stmt = $this->db->prepare("SELECT 1 FROM medicines WHERE slug = ?");
            $stmt->execute([$slug]);
            if (!$stmt->fetchColumn()) break;
            $slug = "$base-" . $i++;
        }
        return $slug;
    }
}
