<?php

namespace Tests\Unit\Requests\User;

use App\Http\Requests\User\UpdateRequest;
use App\Models\User;

use Tests\TestCase;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Route;
class UpdateRequestTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    public function setUp(): void
    {
        parent::setUp();

        // テストユーザ作成
        $this->user1 = factory(User::class)->create([
            'login_id' => 'test1@test.com',
        ]);
        $this->user2 = factory(User::class)->create([
            'login_id' => 'test2@test.com',
        ]);

    }

    /**
     * バリデーションテスト
     *
     * @param string $item
     * @param string $data
     * @param bool $expect
     * @param array $options
     * @return void
     * @dataProvider dataprovider
     */
    public function testValidation($item, $data, $expect, $options = array()): void
    {
        $request  = new UpdateRequest();
        $request->user = $this->user1;
        $rules    = $request->rules();
        $rule     = \Arr::only($rules, $item);

        $dataList = [$item => $data];

        $validator = Validator::make($dataList, $rule);
        $result    = $validator->passes();

        $this->assertEquals($expect, $result);
    }

    /**
     * dataprovider
     *
     * @return array
     */
    public function dataprovider(): array
    {
        return [
            // ユーザー名
            'name_true' => ['name', 'テスト', true],
            'name_required_null' => ['name', null, false],
            'name_required_empty' => ['name', '', false],
            'name_max_false' => ['name', str_repeat('a', 256), false],
            'name_max_true' => ['name', str_repeat('a', 255), true],

            // メールアドレス
            'login_id_true' => ['login_id', 'test_validation@test.com', true],
            'login_id_required_null' => ['login_id', null, false],
            'login_id_required_empty' => ['login_id', '', false],
            'login_id_email' => ['login_id', 'test', false],
            'login_id_max_false' => ['login_id', str_repeat('a', 247) . '@test.com', false],
            'login_id_max_true' => ['login_id', str_repeat('a', 246) . '@test.com', true],
            'login_id_unique_myuser' => ['login_id', 'test1@test.com', true],
            'login_id_unique_other' => ['login_id', 'test2@test.com', false],

            // 権限
            'role_true' => ['role', 1, true],
            'role_required_null' => ['role', null, false],
            'role_required_empty' => ['role', '', false],
            'role_numeric_string' => ['role', 'test', false],

        ];
    }
}
