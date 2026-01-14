<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GoogleController;
use Illuminate\Support\Facades\Password;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\FLController;
use App\Http\Controllers\FLUController;

use Illuminate\Http\Request;

Route::post('/forgot-password', [UserController::class, 'sendResetLink'])->middleware('guest');
Route::post('/reset-password', [UserController::class, 'resetPassword'])->middleware('guest');
Route::middleware('auth:sanctum')->post('/change-password-logedin', [UserController::class, 'changePasswordLogedin']);



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
Route::middleware('auth:sanctum')->post('/upload-lesson-tech-words', [FLController::class, 'saveLessonTechWords']);
//Route::middleware('auth:sanctum')->post('/upload-lesson-tech-words', [FLController::class, 'saveLessonTechWords']);
Route::middleware('auth:sanctum')->post('/add-lesson', [FLController::class, 'addLesson']);
//Route::middleware('auth:sanctum')->post('/get-lessons-cards', [FLController::class, 'getLessonsCards']);
Route::middleware('auth:sanctum')->post('/get-lessons-cards-by-field', [FLController::class, 'getLessonsCardsByField']);
Route::middleware('auth:sanctum')->post('/update-lessons-orders', [FLController::class, 'updateLessonsOrders']);

Route::middleware('auth:sanctum')->post('/selected-fields', [FLController::class, 'getLessonFields']);
Route::middleware('auth:sanctum')->post('/get-lesson', [FLController::class, 'getLesson']);
Route::middleware('auth:sanctum')->post('/update-lesson', [FLController::class, 'updateLesson']);
Route::middleware('auth:sanctum')->post('/get-lesson-words', [FLController::class, 'getWords']);
Route::middleware('auth:sanctum')->post('/get-lesson-tech-words', [FLController::class, 'getTechWords']);
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

Route::middleware('auth:sanctum')->post('/get-raw-dd-test-id', [FLController::class, 'getRawDDTestId']);
Route::middleware('auth:sanctum')->post('/update-dd-tests', [FLController::class, 'updateDDTests']);
Route::middleware('auth:sanctum')->post('/get-lesson-defdetect-tests', [FLController::class, 'getLessonDDTests']);

Route::middleware('auth:sanctum')->post('/get-raw-wdm-test-id', [FLController::class, 'getRawWdmTestId']);
Route::middleware('auth:sanctum')->post('/update-wdm-tests', [FLController::class, 'updateWdmTests']);
Route::middleware('auth:sanctum')->post('/get-lesson-wdm-tests', [FLController::class, 'getLessonWdmTests']);



Route::middleware('auth:sanctum')->post('/archive-lesson', [FLController::class, 'archiveLesson']);
Route::middleware('auth:sanctum')->post('/change-lesson-status', [FLController::class, 'changeLessonStatus']);

Route::middleware('auth:sanctum')->post('/get-raw-word-id', [FLController::class, 'getRawWordId']);
Route::middleware('auth:sanctum')->post('/get-raw-tech-word-id', [FLController::class, 'getRawTechWordId']);
//Route::middleware('auth:sanctum')->post('/update-wdm-tests', [FLController::class, 'updateWdmTests']);
//Route::middleware('auth:sanctum')->post('/get-lesson-wdm-tests', [FLController::class, 'getLessonWdmTests']);

Route::middleware('auth:sanctum')->post('/get-user-fields', [FLUController::class, 'getUserFields']);
Route::middleware('auth:sanctum')->post('/get-user-lessons-by-field', [FLUController::class, 'getUserLessonsByField']);
Route::middleware('auth:sanctum')->post('/upload-user-fields', [FLUController::class, 'uploadUserFields']);
Route::middleware('auth:sanctum')->post('/save-uiwords', [FLUController::class, 'saveUserInteractiveWords']);

Route::middleware('auth:sanctum')->post('/get-iwords', [FLController::class, 'getInteractiveWords']);

Route::middleware('auth:sanctum')->post('/get-user-test-writes', [FLUController::class, 'getUsrTestWrites']);
Route::middleware('auth:sanctum')->post('/save-usr-testwrite-answer', [FLUController::class, 'saveUsrTestWriteAnswer']);
Route::middleware('auth:sanctum')->post('/get-user-stared-words', [FLUController::class, 'getUserStaredWords']);
Route::middleware('auth:sanctum')->post('/save-user-stared-words', [FLUController::class, 'saveUserStaredWords']);

Route::middleware('auth:sanctum')->post('/get-user-dd-tests', [FLUController::class, 'getUsrDDTests']);
Route::middleware('auth:sanctum')->post('/get-user-wdm-tests', [FLUController::class, 'getUsrWdmTests']);

Route::middleware('auth:sanctum')->post('/get-user-test-fills', [FLUController::class, 'getUsrTestFills']);
Route::middleware('auth:sanctum')->post('/save-user-testfills-answer', [FLUController::class, 'saveUsrTestFillsAnswer']);

























