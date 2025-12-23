<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GoogleController;
use Illuminate\Support\Facades\Password;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\FLController;

use Illuminate\Http\Request;

Route::post('/forgot-password', [UserController::class, 'sendResetLink'])->middleware('guest');
Route::post('/reset-password', [UserController::class, 'resetPassword'])->middleware('guest');
Route::middleware('auth:sanctum')->post('/chang-password-logedin', [UserController::class, 'changePasswordLogedin']);



// Example API route
Route::get('/status', function () {
    return response()->json(['status' => 'API running']);
});

Route::post('/login', [UserController::class, 'login'])/*->name('login')*/->middleware('throttle:5,1');
Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout'])->name('logout')->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'getUser'])->name('get.user');
Route::middleware('auth:sanctum')->get('/userdata/{id}', [UserController::class, 'getUserData'])->name('get.userdata');
Route::post('/register', [UserController::class, 'register'])->middleware('throttle:5,1'); // 5 requests per minute per key (default key: IP);



//Route::get('/auth/google/redirect', [GoogleController::class, 'redirect']);
//Route::get('/auth/google/callback', [GoogleController::class, 'callback']);
//Route::post('/auth/google/callback', [GoogleController::class, 'authCallback']); // this route is called from googleLoginBtn in the frontend

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect()->away(config('app.frontend_url') . '/profile');
})->middleware(['auth:sanctum', 'signed'])->name('verification.verify'); 
Route::middleware('auth:sanctum')->post('/upload-user-image', [UserController::class, 'saveProfileImage']);
Route::middleware('auth:sanctum')->post('/edituser', [UserController::class, 'editUserData']);



Route::middleware('auth:sanctum')->get('/fields', [FLController::class, 'getFields']);
Route::middleware('auth:sanctum')->get('/languages', [FLController::class, 'getLanguages']);

Route::middleware('auth:sanctum')->post('/update-field', [FLController::class, 'updateField']);
Route::middleware('auth:sanctum')->post('/remove-field', [FLController::class, 'removeField']);
Route::middleware('auth:sanctum')->post('/upload-field-image', [FLController::class, 'saveFieldImage']);
Route::middleware('auth:sanctum')->post('/upload-lesson-image', [FLController::class, 'saveLessonImage']);
Route::middleware('auth:sanctum')->post('/upload-lesson-words', [FLController::class, 'saveLessonWords']);
Route::middleware('auth:sanctum')->post('/add-lesson', [FLController::class, 'addLesson']);
Route::middleware('auth:sanctum')->post('/get-lessons-cards', [FLController::class, 'getLessonsCards']);
Route::middleware('auth:sanctum')->post('/get-lessons-cards-by-field', [FLController::class, 'getLessonsCardsByField']);

Route::middleware('auth:sanctum')->post('/selected-fields', [FLController::class, 'getLessonFields']);
Route::middleware('auth:sanctum')->post('/get-lesson', [FLController::class, 'getLesson']);
Route::middleware('auth:sanctum')->post('/update-lesson', [FLController::class, 'updateLesson']);
Route::middleware('auth:sanctum')->post('/get-lesson-words', [FLController::class, 'getWords']);
Route::middleware('auth:sanctum')->post('/take-lesson-id', [FLController::class, 'takeLessonId']);
Route::middleware('auth:sanctum')->post('/take-field-id', [FLController::class, 'takeFieldId']);
Route::middleware('auth:sanctum')->post('/get-field', [FLController::class, 'getField']);


Route::middleware('auth:sanctum')->post('/get-raw-testwrite-id', [FLController::class, 'getRawTestWriteId']);

Route::middleware('auth:sanctum')->post('/update-test-writes', [FLController::class, 'updateTestWrites']);

Route::middleware('auth:sanctum')->post('/get-lesson-test-writes', [FLController::class, 'getLessonTestWrites']);


Route::middleware('auth:sanctum')->post('/get-raw-testfill-id', [FLController::class, 'getRawTestFillId']);
Route::middleware('auth:sanctum')->post('/update-test-fills', [FLController::class, 'updateTestFills']);
Route::middleware('auth:sanctum')->post('/get-lesson-test-fills', [FLController::class, 'getLessonTestFills']);

Route::middleware('auth:sanctum')->post('/get-raw-testTF-id', [FLController::class, 'getRawTestTFId']);
Route::middleware('auth:sanctum')->post('/update-test-TFs', [FLController::class, 'updateTestTFs']);
Route::middleware('auth:sanctum')->post('/get-lesson-test-TFs', [FLController::class, 'getLessonTestTFs']);

Route::middleware('auth:sanctum')->post('/get-raw-testreply-id', [FLController::class, 'getRawTestReplyId']);
Route::middleware('auth:sanctum')->post('/update-test-replies', [FLController::class, 'updateTestReplies']);
Route::middleware('auth:sanctum')->post('/get-lesson-test-replies', [FLController::class, 'getLessonTestReplies']);

Route::middleware('auth:sanctum')->post('/get-raw-testass-id', [FLController::class, 'getRawTestAssId']);
Route::middleware('auth:sanctum')->post('/update-test-asses', [FLController::class, 'updateTestAsses']);
Route::middleware('auth:sanctum')->post('/get-lesson-test-asses', [FLController::class, 'getLessonTestAsses']);
Route::middleware('auth:sanctum')->post('/archive-lesson', [FLController::class, 'archiveLesson']);
Route::middleware('auth:sanctum')->post('/change-lesson-status', [FLController::class, 'changeLessonStatus']);



















