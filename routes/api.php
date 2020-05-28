<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// ログイン・ログアウト
Auth::routes(['register' => false, 'reset' => false, 'confirm' => false, 'verify' => false]);

// ユーザー追加
Route::post('register', 'MyuserController@store')->name('register');

// ユーザーを取得
Route::get('/user', function () {
    if (Gate::allows('user-higher')) {
        return Auth::user();
    }
})->name('user');

// 全ユーザ
Route::group(['middleware' => ['auth', 'can:user-higher']], function () {

    // アクセス権限のチェック
    Route::get('permission/{category}', function ($category) {
        return response([Gate::allows($category)]);
    });

    // ユーザー編集
    Route::patch('myuser/update', 'MyuserController@update')->name('myuser.update');

    // パスワード変更
    Route::patch('myuser/passwordChange', 'MyuserController@passwordChange')->name('myuser.passwordChange');

});

// 管理者以上
Route::group(['middleware' => ['auth', 'can:admin-higher']], function () {
    // ログインユーザー
    Route::resource('users', 'UsersController', ['only' => ['index', 'store', 'update', 'destroy']]);

});

// 開発者のみ
Route::group(['middleware' => ['auth', 'can:system-only']], function () {

});
