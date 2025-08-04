<?php

namespace App\Actions;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class LogoutUserAction
{
    /**
     * Execute the logout action.
     */
    public function execute(): void
    {
        Auth::logout();
        Session::invalidate();
        Session::regenerateToken();
    }
}