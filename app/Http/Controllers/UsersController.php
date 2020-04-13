<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

// 追加フォームバリデーション
use App\Http\Requests\UserStoreRequest;

// 更新フォームバリデーション
use App\Http\Requests\UserUpdateRequest;

// ユーザーモデル
use App\Models\User;

class UsersController extends Controller
{
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
        if ($request->input('role')) {
            if (Gate::allows('system-only')) {
                // 入力者が開発者権限の場合は入力値を設定
                $role = $request->input('role');
            } elseif (Gate::allows('admin-higher') && $request->input('role') !== \Config::get('settings.roleLevel.system')) {
                // 入力者が管理者権限の場合は開発者権限以外の入力値を設定
                $role = $request->input('role');
            } else {
                // それ以外は最低レベル(一般)の権限を設定
                $role = \Config::get('settings.roleLevel.user');
            }
        } else {
            // 権限の入力がない場合は最低レベル(一般)の権限を設定
            $role = \Config::get('settings.roleLevel.user');
        }

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'role' => $role,
        ]);
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
        $updateData = [
            'name' => $request->input('name'),
            'email' => $request->input('email'),
        ];
        if ($request->input('role')) {
            if (Gate::allows('system-only')) {
                // 入力者が開発者権限の場合は入力値を設定
                $updateData['role'] = $request->input('role');
            } elseif (Gate::allows('admin-higher') && $request->input('role') !== \Config::get('settings.roleLevel.system')) {
                // 入力者が管理者権限の場合は開発者権限以外の入力値を設定
                $updateData['role'] = $request->input('role');
            } else {
                // それ以外は最低レベル(一般)の権限を設定
                $updateData['role'] = \Config::get('settings.roleLevel.user');
            }
        } else {
            // 権限の入力がない場合は最低レベル(一般)の権限を設定
            $updateData['role'] = \Config::get('settings.roleLevel.user');
        }

        $user = User::find($id);
        $user->fill($updateData)->save();
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
        User::destroy($id);
        return response([]);
    }
}
