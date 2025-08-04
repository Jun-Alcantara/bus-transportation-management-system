<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    /**
     * Show the login form.
     */
    public function showLogin(): Response
    {
        return Inertia::render('Login');
    }

    /**
     * Handle login attempt.
     */
    public function login(LoginRequest $request)
    {
        $result = $this->authService->login(
            $request->validated()
        );

        if ($result['success']) {
            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => $result['message']
        ]);
    }

    /**
     * Handle logout.
     */
    public function logout(Request $request)
    {
        $this->authService->logout();
        
        return redirect('/login');
    }
}