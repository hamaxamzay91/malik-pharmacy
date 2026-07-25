<?php
// =====================================================
// MALIK PHARMACY - API Entry Point
// =====================================================

declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Bootstrap
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../auth/JWT.php';
require_once __DIR__ . '/../middleware/CORS.php';
require_once __DIR__ . '/../middleware/RateLimit.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../utils/FileUpload.php';

// Auto-load controllers & models
spl_autoload_register(function(string $class) {
    $dirs = [
        __DIR__ . '/../controllers/',
        __DIR__ . '/../models/',
    ];
    foreach ($dirs as $dir) {
        $file = $dir . $class . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

// Handle CORS & Preflight
CORS::handle();

// Rate limiting
RateLimit::check();

// Parse request
$method = $_SERVER['REQUEST_METHOD'];
$path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path   = preg_replace('#^/api/v1#', '', $path);
$path   = trim($path, '/');

// Parse JSON body
$body = [];
if (in_array($method, ['POST', 'PUT', 'PATCH'])) {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true) ?? [];
}

// =====================================================
// ROUTER
// =====================================================
try {
    route($method, $path, $body);
} catch (Throwable $e) {
    $code = ($e instanceof RuntimeException) ? 400 : 500;
    if (APP_ENV === 'development') {
        Response::json(['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()], $code);
    } else {
        Response::json(['message' => 'Server error. Please try again.'], 500);
        error_log($e->getMessage() . "\n" . $e->getTraceAsString());
    }
}

function route(string $method, string $path, array $body): void
{
    $segments = explode('/', $path);
    $resource = $segments[0] ?? '';
    $id       = isset($segments[1]) ? (int)$segments[1] : null;
    $sub      = $segments[2] ?? null;

    match (true) {
        // ── AUTH ─────────────────────────────────────────
        $resource === 'auth' && $method === 'POST' && $id === null && $sub === null
            => (new AuthController())->dispatch($segments[1] ?? '', $body),

        // ── MEDICINES ────────────────────────────────────
        $resource === 'medicines' && $method === 'GET' && !$id
            => (new MedicineController())->index(),
        $resource === 'medicines' && $method === 'GET' && $id
            => (new MedicineController())->show($id),
        $resource === 'medicines' && $method === 'POST'
            => (new MedicineController())->store($body),
        $resource === 'medicines' && $method === 'PUT' && $id
            => (new MedicineController())->update($id, $body),
        $resource === 'medicines' && $method === 'DELETE' && $id
            => (new MedicineController())->destroy($id),

        // ── CATEGORIES ───────────────────────────────────
        $resource === 'categories' && $method === 'GET'
            => (new CategoryController())->index(),
        $resource === 'categories' && $method === 'POST'
            => (new CategoryController())->store($body),

        // ── CART ─────────────────────────────────────────
        $resource === 'cart' && $method === 'GET'
            => (new CartController())->index(),
        $resource === 'cart' && $method === 'POST'
            => (new CartController())->store($body),
        $resource === 'cart' && $method === 'PUT' && $id
            => (new CartController())->update($id, $body),
        $resource === 'cart' && $method === 'DELETE' && $id
            => (new CartController())->destroy($id),

        // ── ORDERS ───────────────────────────────────────
        $resource === 'orders' && $method === 'GET' && !$id
            => (new OrderController())->index(),
        $resource === 'orders' && $method === 'GET' && $id
            => (new OrderController())->show($id),
        $resource === 'orders' && $method === 'POST'
            => (new OrderController())->store($body),
        $resource === 'orders' && $method === 'PATCH' && $id
            => (new OrderController())->updateStatus($id, $body),

        // ── PRESCRIPTIONS ────────────────────────────────
        $resource === 'prescriptions' && $method === 'POST'
            => (new PrescriptionController())->upload(),
        $resource === 'prescriptions' && $method === 'GET'
            => (new PrescriptionController())->index(),

        // ── REVIEWS ──────────────────────────────────────
        $resource === 'reviews' && $method === 'GET'
            => (new ReviewController())->index(),
        $resource === 'reviews' && $method === 'POST'
            => (new ReviewController())->store($body),

        // ── COUPONS ──────────────────────────────────────
        $resource === 'coupons' && $path === 'coupons/validate' && $method === 'POST'
            => (new CouponController())->validate($body),

        // ── WISHLIST ─────────────────────────────────────
        $resource === 'wishlist' && $method === 'GET'
            => (new WishlistController())->index(),
        $resource === 'wishlist' && $method === 'POST'
            => (new WishlistController())->toggle($body),

        // ── BLOG ─────────────────────────────────────────
        $resource === 'blogs' && $method === 'GET' && !$id
            => (new BlogController())->index(),
        $resource === 'blogs' && $method === 'GET' && $id
            => (new BlogController())->show($id),
        $resource === 'blogs' && $method === 'POST'
            => (new BlogController())->store($body),

        // ── CONTACT ──────────────────────────────────────
        $resource === 'contact' && $method === 'POST'
            => (new ContactController())->store($body),

        // ── USER PROFILE ─────────────────────────────────
        $resource === 'profile' && $method === 'GET'
            => (new UserController())->profile(),
        $resource === 'profile' && $method === 'PUT'
            => (new UserController())->update($body),
        $resource === 'profile' && $path === 'profile/addresses' && $method === 'GET'
            => (new UserController())->addresses(),
        $resource === 'profile' && $path === 'profile/addresses' && $method === 'POST'
            => (new UserController())->addAddress($body),

        // ── ADMIN ────────────────────────────────────────
        $resource === 'admin' && $method === 'GET' && ($segments[1] ?? '') === 'dashboard'
            => (new AdminController())->dashboard(),
        $resource === 'admin' && ($segments[1] ?? '') === 'users'
            => (new AdminController())->users($method, $id, $body),
        $resource === 'admin' && ($segments[1] ?? '') === 'analytics'
            => (new AdminController())->analytics(),
        $resource === 'admin' && ($segments[1] ?? '') === 'settings'
            => (new AdminController())->settings($method, $body),
        $resource === 'admin' && ($segments[1] ?? '') === 'backup'
            => (new AdminController())->backup(),

        // ── SEARCH ───────────────────────────────────────
        $resource === 'search' && $method === 'GET'
            => (new SearchController())->search(),

        // ── NOTIFICATIONS ────────────────────────────────
        $resource === 'notifications' && $method === 'GET'
            => (new NotificationController())->index(),
        $resource === 'notifications' && $method === 'PATCH' && $id
            => (new NotificationController())->markRead($id),

        // ── SETTINGS (public) ────────────────────────────
        $resource === 'settings' && $method === 'GET'
            => (new SettingsController())->publicSettings(),

        // ── FAQ ──────────────────────────────────────────
        $resource === 'faqs' && $method === 'GET'
            => (new FaqController())->index(),

        // ── CAREERS ──────────────────────────────────────
        $resource === 'careers' && $method === 'GET'
            => (new CareerController())->index(),
        $resource === 'careers' && $method === 'POST' && $id && $sub === 'apply'
            => (new CareerController())->apply($id),

        // ── BANNERS ──────────────────────────────────────
        $resource === 'banners' && $method === 'GET'
            => (new BannerController())->index(),

        // ── DEFAULT ──────────────────────────────────────
        default => Response::json(['message' => 'Endpoint not found', 'path' => $path], 404)
    };
}
