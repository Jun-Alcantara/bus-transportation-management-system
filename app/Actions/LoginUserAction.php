<?php

namespace App\Actions;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class LoginUserAction
{
    /**
     * Execute the login action.
     */
    public function execute(array $credentials): array
    {
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return [
                'success' => false,
                'message' => 'The provided credentials do not match our records.'
            ];
        }

        Auth::login($user);

        return [
            'success' => true,
            'user' => $user,
            'message' => 'Login successful.'
        ];
    }
}