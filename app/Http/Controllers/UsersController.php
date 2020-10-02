<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;

// 追加フォームバリデーション
use App\Http\Requests\UserStoreRequest;

// 更新フォームバリデーション
use App\Http\Requests\UserUpdateRequest;

// ユーザーモデル
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    use SendsPasswordResetEmails;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::get();

        return response($users);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\UserStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserStoreRequest $request)
    {
        if ((int)$request->input('role') <= (int)Auth::user()->role) {
            // 入力者より権限が同じか下の場合は入力値を設定
            $role = $request->input('role');
        } else {
            // それ以外は最低レベル(一般)の権限を設定
            $role = \Config::get('settings.roleLevel.user');
        }

        \DB::beginTransaction();
        try {
            $user = resolve(User::class)->create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
                'role' => $role,
            ]);
            $this->broker()->sendResetLink(
                $this->credentials($request)
            );

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw $e;
        }

        return response($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UserUpdateRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UserUpdateRequest $request, $id)
    {
        $user = resolve(User::class)->find($id);

        if ((int)$user->role < (int)Auth::user()->role) {
            // 入力者より権限が上の場合は変更不可
            return response([], 403);
        }

        $updateData = [
            'name' => $request->input('name'),
            'email' => $request->input('email'),
        ];
        if ((int)$request->input('role') >= (int)Auth::user()->role) {
            // 入力者より権限が同じか下の場合は入力値を設定
            $updateData['role'] = $request->input('role');
        }

        \DB::beginTransaction();
        try {
            $user->fill($updateData)->save();
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw $e;
        }

        return response($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if ((int)$id === (int)Auth::id()) {
            // 自ユーザーの場合は削除不可
            return response([], 403);
        }
        
        $user = resolve(User::class)->find($id);

        if ((int)$user->role < (int)Auth::user()->role) {
            // 入力者より権限が上の場合は削除不可
            return response([], 403);
        }
    
        \DB::beginTransaction();
        try {
            resolve(User::class)->destroy($id);
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw $e;
        }
        return response([]);
    }
}
