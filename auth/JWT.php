<?php
// =====================================================
// MALIK PHARMACY - JWT Authentication
// =====================================================

class JWT
{
    public static function encode(array $payload): string
    {
        $header = self::base64UrlEncode(json_encode([
            'typ' => 'JWT',
            'alg' => 'HS256'
        ]));

        $payload['iat'] = time();
        $payload['exp'] = time() + JWT_EXPIRY;

        $payloadEncoded = self::base64UrlEncode(json_encode($payload));
        $signature = self::base64UrlEncode(
            hash_hmac('sha256', "$header.$payloadEncoded", JWT_SECRET, true)
        );

        return "$header.$payloadEncoded.$signature";
    }

    public static function decode(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$header, $payload, $signature] = $parts;

        $expectedSig = self::base64UrlEncode(
            hash_hmac('sha256', "$header.$payload", JWT_SECRET, true)
        );

        if (!hash_equals($expectedSig, $signature)) return null;

        $data = json_decode(self::base64UrlDecode($payload), true);

        if (!$data || !isset($data['exp']) || $data['exp'] < time()) return null;

        // Check blacklist
        if (self::isBlacklisted($token)) return null;

        return $data;
    }

    public static function blacklist(string $token): void
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return;

        $hash = hash('sha256', $token);
        $data = json_decode(self::base64UrlDecode($parts[1]), true);
        $expires = $data['exp'] ?? time() + 3600;

        $db = Database::getInstance();
        $stmt = $db->prepare(
            "INSERT IGNORE INTO token_blacklist (token_hash, expires_at) VALUES (?, FROM_UNIXTIME(?))"
        );
        $stmt->execute([$hash, $expires]);
    }

    private static function isBlacklisted(string $token): bool
    {
        $hash = hash('sha256', $token);
        $db = Database::getInstance();
        $stmt = $db->prepare(
            "SELECT 1 FROM token_blacklist WHERE token_hash = ? AND expires_at > NOW() LIMIT 1"
        );
        $stmt->execute([$hash]);
        return (bool) $stmt->fetchColumn();
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}


// =====================================================
// AUTH MIDDLEWARE
// =====================================================
class AuthMiddleware
{
    public static function requireAuth(): array
    {
        $token = self::getBearerToken();
        if (!$token) {
            Response::json(['message' => 'Unauthorized'], 401);
            exit;
        }

        $payload = JWT::decode($token);
        if (!$payload) {
            Response::json(['message' => 'Token invalid or expired'], 401);
            exit;
        }

        return $payload;
    }

    public static function requireRole(string ...$roles): array
    {
        $payload = self::requireAuth();
        if (!in_array($payload['role'] ?? '', $roles)) {
            Response::json(['message' => 'Forbidden'], 403);
            exit;
        }
        return $payload;
    }

    public static function optionalAuth(): ?array
    {
        $token = self::getBearerToken();
        if (!$token) return null;
        return JWT::decode($token);
    }

    private static function getBearerToken(): ?string
    {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        if (str_starts_with($auth, 'Bearer ')) {
            return substr($auth, 7);
        }
        return null;
    }
}
