<?php

namespace App\Http\Controllers;

// 追加フォームバリデーション
use App\Http\Requests\UserStoreRequest;

// 更新フォームバリデーション
use App\Http\Requests\UserUpdateRequest;

// ユーザーモデル
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
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
        if ((int)Auth::user()->role_level['auth'] <= (int)User::roleLevel($request->input('role'), 'auth')) {
            // 入力者より権限が同じか下の場合は入力値を設定
            $role = $request->input('role');
        } else {
            // それ以外は最低レベル(一般)の権限を設定
            $role = 3;
        }

        \DB::beginTransaction();
        try {
            $user = resolve(User::class)->create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make(\Str::random(32)),
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

        if ((int)$user->modify_flg !== 1){
            return response([], 403);
        }

        $updateData = [
            'name' => $request->input('name'),
            'email' => $request->input('email'),
        ];
        if ((int)Auth::user()->role_level['auth'] <= (int)User::roleLevel($request->input('role'), 'auth')) {
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
        $user = resolve(User::class)->find($id);

        if ((int)$user->delete_flg !== 1){
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

    /**
     * 権限の選択オプションを返す
     *
     * @return void
     */
    public function roleOptions()
    {
        $roleOptions = [];
        foreach(array_keys(\Config::get('settings.roleOptions')) as $key) {
            // ログインしているユーザーと同じか下の権限レベルのユーザー権限を返す
            if (User::roleLevel($key, 'auth') >= (int)Auth::user()->role_level['auth']) {
                $roleOptions[] = $key;
            }
        }

        return response($roleOptions);

    }

}
