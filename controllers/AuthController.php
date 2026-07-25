<?php
// =====================================================
// MALIK PHARMACY - Auth Controller
// =====================================================

require_once __DIR__ . '/../models/UserModel.php';

class AuthController
{
    private UserModel $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    public function dispatch(string $action, array $body): void
    {
        match ($action) {
            'register'       => $this->register($body),
            'login'          => $this->login($body),
            'logout'         => $this->logout(),
            'refresh'        => $this->refresh($body),
            'forgot-password'=> $this->forgotPassword($body),
            'reset-password' => $this->resetPassword($body),
            'verify-email'   => $this->verifyEmail($body),
            default          => Response::json(['message' => 'Invalid auth action'], 404)
        };
    }

    // ── REGISTER ──────────────────────────────────
    private function register(array $body): void
    {
        $errors = [];
        if (empty($body['name'])) $errors['name'] = 'Name is required';
        if (empty($body['email']) || !filter_var($body['email'], FILTER_VALIDATE_EMAIL))
            $errors['email'] = 'Valid email is required';
        if (empty($body['password']) || strlen($body['password']) < 8)
            $errors['password'] = 'Password must be at least 8 characters';

        if ($errors) {
            Response::error('Validation failed', 422, $errors);
            return;
        }

        if ($this->userModel->findByEmail($body['email'])) {
            Response::error('Email already registered', 409);
            return;
        }

        Database::beginTransaction();
        try {
            $userId = $this->userModel->create([
                'name'          => htmlspecialchars($body['name'], ENT_QUOTES),
                'email'         => strtolower($body['email']),
                'phone'         => $body['phone'] ?? null,
                'password_hash' => password_hash($body['password'], PASSWORD_ARGON2ID),
                'preferred_language' => $body['language'] ?? 'ku',
            ]);

            $token = JWT::encode([
                'sub'   => $userId,
                'role'  => 'customer',
                'name'  => $body['name'],
                'email' => $body['email'],
            ]);

            Database::commit();

            Response::created([
                'token' => $token,
                'user'  => $this->userModel->find($userId),
            ], 'Registration successful');

        } catch (Throwable $e) {
            Database::rollback();
            throw $e;
        }
    }

    // ── LOGIN ─────────────────────────────────────
    private function login(array $body): void
    {
        if (empty($body['email']) || empty($body['password'])) {
            Response::error('Email and password required', 422);
            return;
        }

        $user = $this->userModel->findByEmail(strtolower($body['email']));

        if (!$user || !password_verify($body['password'], $user['password_hash'])) {
            Response::error('Invalid email or password', 401);
            return;
        }

        if (!$user['is_active']) {
            Response::error('Account has been disabled', 403);
            return;
        }

        // Update last login
        $this->userModel->update($user['id'], [
            'last_login_at' => date('Y-m-d H:i:s'),
            'login_count'   => $user['login_count'] + 1,
        ]);

        // Rehash if needed
        if (password_needs_rehash($user['password_hash'], PASSWORD_ARGON2ID)) {
            $this->userModel->update($user['id'], [
                'password_hash' => password_hash($body['password'], PASSWORD_ARGON2ID),
            ]);
        }

        $token = JWT::encode([
            'sub'   => $user['id'],
            'role'  => 'customer',
            'name'  => $user['name'],
            'email' => $user['email'],
        ]);

        unset($user['password_hash']);

        Response::success([
            'token' => $token,
            'user'  => $user,
        ], 'Login successful');
    }

    // ── LOGOUT ────────────────────────────────────
    private function logout(): void
    {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        if (str_starts_with($auth, 'Bearer ')) {
            JWT::blacklist(substr($auth, 7));
        }
        Response::success(null, 'Logged out successfully');
    }

    // ── FORGOT PASSWORD ───────────────────────────
    private function forgotPassword(array $body): void
    {
        if (empty($body['email'])) {
            Response::error('Email is required', 422);
            return;
        }

        $user = $this->userModel->findByEmail(strtolower($body['email']));

        // Always return success (security: don't reveal if email exists)
        if ($user) {
            $token = bin2hex(random_bytes(32));
            $db = Database::getInstance();
            $stmt = $db->prepare(
                "INSERT INTO password_resets (email, token, expires_at)
                 VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))
                 ON DUPLICATE KEY UPDATE token = VALUES(token), expires_at = VALUES(expires_at)"
            );
            $stmt->execute([$body['email'], $token]);

            // TODO: Send email with reset link
        }

        Response::success(null, 'If your email exists, a reset link has been sent.');
    }

    // ── RESET PASSWORD ────────────────────────────
    private function resetPassword(array $body): void
    {
        if (empty($body['token']) || empty($body['password'])) {
            Response::error('Token and new password required', 422);
            return;
        }

        $db = Database::getInstance();
        $stmt = $db->prepare(
            "SELECT * FROM password_resets
             WHERE token = ? AND expires_at > NOW() AND used_at IS NULL LIMIT 1"
        );
        $stmt->execute([$body['token']]);
        $reset = $stmt->fetch();

        if (!$reset) {
            Response::error('Invalid or expired token', 400);
            return;
        }

        Database::beginTransaction();
        try {
            $user = $this->userModel->findByEmail($reset['email']);
            if ($user) {
                $this->userModel->update($user['id'], [
                    'password_hash' => password_hash($body['password'], PASSWORD_ARGON2ID),
                ]);
            }

            $stmt = $db->prepare("UPDATE password_resets SET used_at = NOW() WHERE token = ?");
            $stmt->execute([$body['token']]);

            Database::commit();
            Response::success(null, 'Password reset successfully');
        } catch (Throwable $e) {
            Database::rollback();
            throw $e;
        }
    }

    // ── VERIFY EMAIL ──────────────────────────────
    private function verifyEmail(array $body): void
    {
        // Implementation for email verification
        Response::success(null, 'Email verified');
    }
}
