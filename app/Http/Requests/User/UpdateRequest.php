<?php

namespace App\Http\Requests\User;

use App\Models\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;

class UpdateRequest extends FormRequest
{
    /**
     * ユーザーデータ
     *
     * @var App\Models\User
     */
    public $user;

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->user = $this->route()->parameter('user');
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // 管理者以上を許可
        if (Gate::allows('admin-higher')) {
            // 自ユーザーは拒否
            if ($this->user->id === \Auth::user()->id) {
                return false;
            }
            // 入力した権限レベルが入力者より上の場合は拒否
            if ((int)\Auth::user()->role_level['auth'] > (int)resolve(User::class)->roleLevel($this->user->role, 'auth')) {
                return false;
            }
            return true;
        }
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'login_id' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($this->user->id)],
            'role' => ['required', 'numeric', Rule::in(array_keys(config('role.role')))],
        ];
    }
}
