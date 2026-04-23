<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('role', '!=', 'admin')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }
}
