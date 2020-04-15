<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

// 追加フォームバリデーション
use App\Http\Requests\MyuserStoreRequest;

// 更新フォームバリデーション
use App\Http\Requests\MyuserUpdateRequest;

// ユーザーモデル
use App\Models\User;

class MyuserController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\MyuserStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(MyuserStoreRequest $request)
    {
        
        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'role' => \Config::get('settings.roleLevel.user'),
        ]);
        return response($user);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\MyuserUpdateRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function update(MyuserUpdateRequest $request)
    {
        $updateData = [
            'name' => $request->input('name'),
            'email' => $request->input('email'),
        ];

        $user = User::find(\Auth::user()->id);
        $user->fill($updateData)->save();
        return response($user);
    }

}
