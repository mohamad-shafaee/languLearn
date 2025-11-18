<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

/*Route::get('/', function () {
    return view('welcome-prev');
});*/

//Route::get('/', fn() => response()->json(['status' => 'API is running']));



Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '^(?!api).*$');


