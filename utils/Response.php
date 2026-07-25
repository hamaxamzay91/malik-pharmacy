<?php
// =====================================================
// MALIK PHARMACY - Response Helper
// =====================================================

class Response
{
    public static function json(mixed $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    public static function success(mixed $data = null, string $message = 'Success', int $status = 200): void
    {
        self::json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $status);
    }

    public static function paginated(array $paginated, string $message = 'Success'): void
    {
        self::json([
            'success'      => true,
            'message'      => $message,
            'data'         => $paginated['data'],
            'pagination'   => [
                'total'        => $paginated['total'],
                'per_page'     => $paginated['per_page'],
                'current_page' => $paginated['current_page'],
                'last_page'    => $paginated['last_page'],
                'from'         => $paginated['from'],
                'to'           => $paginated['to'],
            ],
        ]);
    }

    public static function error(string $message, int $status = 400, array $errors = []): void
    {
        self::json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ], $status);
    }

    public static function created(mixed $data = null, string $message = 'Created'): void
    {
        self::success($data, $message, 201);
    }
}
