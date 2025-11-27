<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GoogleController;
use Illuminate\Support\Facades\Password;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

use Illuminate\Http\Request;

Route::post('/forgot-password', [UserController::class, 'sendResetLink'])->middleware('guest');
Route::post('/reset-password', [UserController::class, 'resetPassword'])->middleware('guest');


// Example API route
Route::get('/status', function () {
    return response()->json(['status' => 'API running']);
});

Route::post('/login', [UserController::class, 'login'])/*->name('login')*/->middleware('throttle:5,1');;
Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout'])->name('logout')->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'getUser'])->name('get.user');
Route::post('/register', [UserController::class, 'register'])->middleware('throttle:5,1'); // 5 requests per minute per key (default key: IP);



//Route::get('/auth/google/redirect', [GoogleController::class, 'redirect']);
//Route::get('/auth/google/callback', [GoogleController::class, 'callback']);
//Route::post('/auth/google/callback', [GoogleController::class, 'authCallback']); // this route is called from googleLoginBtn in the frontend

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect()->away(config('app.frontend_url') . '/profile');
})->middleware(['auth:sanctum', 'signed'])->name('verification.verify'); 

