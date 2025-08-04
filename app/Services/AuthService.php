<?php

namespace App\Services;

use App\Actions\LoginUserAction;
use App\Actions\LogoutUserAction;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function __construct(
        private LoginUserAction $loginUserAction,
        private LogoutUserAction $logoutUserAction
    ) {}

    /**
     * Attempt to log in a user.
     */
    public function login(array $credentials): array
    {
        return $this->loginUserAction->execute($credentials);
    }

    /**
     * Log out the current user.
     */
    public function logout(): void
    {
        $this->logoutUserAction->execute();
    }

    /**
     * Check if user is authenticated.
     */
    public function isAuthenticated(): bool
    {
        return Auth::check();
    }

    /**
     * Get the current authenticated user.
     */
    public function user()
    {
        return Auth::user();
    }
}