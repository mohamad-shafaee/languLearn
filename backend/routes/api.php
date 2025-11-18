<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GoogleController;

use Illuminate\Http\Request;

// Example API route
Route::get('/status', function () {
    return response()->json(['status' => 'API running']);
});

Route::post('/login', [UserController::class, 'login'])/*->name('login')*/->middleware('throttle:5,1');;
Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout'])->name('logout')->middleware('throttle:5,1');;

Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'getUser'])->name('get.user');
Route::post('/register', [UserController::class, 'register'])->middleware('throttle:5,1'); // 5 requests per minute per key (default key: IP);



//Route::get('/auth/google/redirect', [GoogleController::class, 'redirect']);
//Route::get('/auth/google/callback', [GoogleController::class, 'callback']);
//Route::post('/auth/google/callback', [GoogleController::class, 'authCallback']); // this route is called from googleLoginBtn in the frontend 

