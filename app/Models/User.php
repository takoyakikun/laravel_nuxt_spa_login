<?php

namespace App\Models;

use App\Notifications\CustomVerifyEmail;
use App\Notifications\CustomResetPassword;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'role'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * 認証メールを紐付ける
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new CustomVerifyEmail());
    }

    /**
     * パスワードリセットメールを紐付ける
     *
     * @param string $token
     * @return void
     */
    public function sendPasswordResetNotification($token) {
        $this->notify(new CustomResetPassword($token));
    }

    /**
     * 権限レベルのカラム
     *
     * @return array
     */
    public function getRoleLevelAttribute () {
        $roleLevels = [];
        foreach (array_keys(\Config::get('settings.roleLevel')) as $roleTypeKey) {
            $roleLevels[$roleTypeKey] = $this->roleLevel($this->role, $roleTypeKey);
        }

        return $roleLevels;
    }

    /**
     * 権限レベルを返す
     *
     * @param int $role
     * @param string $roleType
     * @return int
     */
    static public function roleLevel ($role, $roleType = 'auth') {
        $roleTypeLevel = \Config::get('settings.roleLevel.'.$roleType);
        if (\Config::get('settings.role.'.$role.'.'.$roleType)) {
            $roleKey = \Config::get('settings.role.'.$role.'.'.$roleType);
        } else {
            $roleTypeLevelMax = array_keys($roleTypeLevel, max($roleTypeLevel));
            $roleKey = $roleTypeLevelMax[0];
        }
        $roleLevel = $roleTypeLevel[$roleKey];

        return $roleLevel;
    }
}
