<?php

namespace Tests\Feature;

use App\Models\User;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UsersTest extends TestCase
{
    use RefreshDatabase;

    // テスト一般ユーザ
    protected $user;

    // テスト管理者ユーザ
    protected $adminUser;

    // テスト開発者ユーザ
    protected $systemUser;

    public function setUp(): void
    {
        parent::setUp();

        // テスト一般ユーザ作成
        $this->user = factory(User::class)->states('test_user')->create();

        // テスト管理者ユーザ作成
        $this->adminUser = factory(User::class)->states('test_admin')->create();

        // テスト開発者ユーザ作成
        $this->systemUser = factory(User::class)->states('test_system')->create();
    }

    /**
     * ログインユーザー一覧取得テスト
     *
     * @return void
     */
    public function testIndex()
    {
        // サンプルデータを追加
        factory(User::class)->create([
            'email' => 'sample@test.com',
        ]);

        // 一般ユーザーからリクエストを送信
        $response = $this->actingAs($this->user)
            ->json('GET', route('users.index'), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // 一般ユーザーはアクセス不可
        $response->assertStatus(403);

        // 管理者ユーザーからリクエストを送信
        $response = $this->actingAs($this->adminUser)
            ->json('GET', route('users.index'), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返り、登録されているデータの個数とサンプルデータが正しく出力されているか確認
        $response->assertStatus(200)
            ->assertJsonCount(4)
            ->assertJsonFragment([
                'email' => 'sample@test.com',
            ]);

    }

    /**
     * ログインユーザー追加テスト
     *
     * @return void
     */
    public function testStore()
    {
        // 追加するデータ
        $newData = [
            'name'  => 'テスト',
            'email' => 'sample@test.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => \Config::get('settings.roleLevel.user')
        ];

        // 一般ユーザーからリクエストを送信
        $response = $this->actingAs($this->user)
            ->json('POST', route('users.store'), $newData, ['X-Requested-With' => 'XMLHttpRequest']);

        // 一般ユーザーはアクセス不可
        $response->assertStatus(403);

        // 管理者ユーザーからリクエストを送信
        $response = $this->actingAs($this->adminUser)
            ->json('POST', route('users.store'), $newData, ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // データベースに追加したユーザーデータが入っているか確認
        $this->assertDatabaseHas('users', [
            'name'  => $newData['name'],
            'email' => $newData['email'],
            'role' => $newData['role']
        ]);

    }

    /**
     * ログインユーザー編集テスト
     *
     * @return void
     */
    public function testUpdate()
    {
        // サンプルデータを追加
        $sample = factory(User::class)->create([
            'email' => 'sample@test.com',
        ]);

        // 編集するデータ
        $newData = [
            'name'  => '編集テスト',
            'email' => 'change@test.com',
            'role' => \Config::get('settings.roleLevel.admin')
        ];

        // 一般ユーザーからリクエストを送信
        $response = $this->actingAs($this->user)
            ->json('PATCH', route('users.update', $sample->id), $newData, ['X-Requested-With' => 'XMLHttpRequest']);

        // 一般ユーザーはアクセス不可
        $response->assertStatus(403);

        // 管理者ユーザーからリクエストを送信
        $response = $this->actingAs($this->adminUser)
            ->json('PATCH', route('users.update', $sample->id), $newData, ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // データベースに編集したユーザーデータが入っているか確認
        $this->assertDatabaseHas('users', [
            'name'  => $newData['name'],
            'email' => $newData['email'],
            'role' => $newData['role']
        ]);

    }

    /**
     * ログインユーザー削除テスト
     *
     * @return void
     */
    public function testDestroy()
    {
        // サンプルデータを追加
        $sample = factory(User::class)->create([
            'email' => 'sample@test.com',
        ]);

        // 一般ユーザーからリクエストを送信
        $response = $this->actingAs($this->user)
            ->json('DELETE', route('users.destroy', $sample->id), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // 一般ユーザーはアクセス不可
        $response->assertStatus(403);

        // 管理者ユーザーからリクエストを送信
        $response = $this->actingAs($this->adminUser)
            ->json('DELETE', route('users.destroy', $sample->id), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // ユーザーが削除されているか確認
        $this->assertDeleted($sample);

    }

}
