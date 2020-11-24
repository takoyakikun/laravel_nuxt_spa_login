<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\CustomResetPassword;
use Tests\Feature\Common\UsersTestTrait;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Notification;
use Mockery;

class UsersTest extends TestCase
{
    use RefreshDatabase;
    use UsersTestTrait;

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

    public function tearDown(): void
    {
        parent::tearDown();

        Mockery::close();
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

        // 一般ユーザーはアクセス不可
        $response = $this->actingAs($this->user)
            ->json('GET', route('users.index'), [], ['X-Requested-With' => 'XMLHttpRequest']);
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
        // 実際にメール送信しないようにする
        Notification::fake();

        // 追加するデータ
        $newData = [
            'name'  => 'テスト',
            'email' => 'sample@test.com',
            'role' => 3
        ];

        // 一般ユーザーはアクセス不可
        $response = $this->actingAs($this->user)
            ->json('POST', route('users.store'), $newData, ['X-Requested-With' => 'XMLHttpRequest']);
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

        // ログインユーザーパスワード設定メール送信共通のテスト
        $this->userPasswordSetMail();

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
            'role' => 3
        ]);

        // 編集するデータ
        $newData = [
            'name'  => '編集テスト',
            'email' => 'change@test.com',
            'role' => 2
        ];

        // 管理者ユーザーからリクエストを送信
        $response = $this->actingAs($this->adminUser)
            ->json('PATCH', route('users.update', $sample->id), $newData, ['X-Requested-With' => 'XMLHttpRequest']);

        // 正常レスポンスを返す
        $response->assertStatus(200);

        // データベースに編集したユーザーデータが入っているか確認
        $this->assertDatabaseHas('users', [
            'name'  => $newData['name'],
            'email' => $newData['email'],
            'role' => $newData['role']
        ]);

    }

    /**
     * ログインユーザー編集アクセス権限テスト
     *
     * @return void
     */
    public function testUpdateAuth()
    {
        // サンプルデータを追加
        $sample = factory(User::class)->create([
            'email' => 'sample@test.com',
            'role' => 3
        ]);
        $sampleAdmin = factory(User::class)->create([
            'email' => 'sample_admin@test.com',
            'role' => 2
        ]);
        $sampleSystem = factory(User::class)->create([
            'email' => 'sample_system@test.com',
            'role' => 1
        ]);

        // 編集するデータ
        $newData = [
            'name'  => '編集テスト',
            'email' => 'change@test.com',
            'role' => 3
        ];

        // モデルをモックする
        $userMock = Mockery::mock(User::class);
        $userMock->shouldReceive('find')->andReturnUsing(function ($arg) {
            $user = Mockery::mock(User::find($arg));
            $user->shouldReceive('fill->save');
            return $user;
        });
        $this->instance(User::class, $userMock);

        // 一般ユーザーはアクセス不可
        $response = $this->actingAs($this->user)
            ->json('PATCH', route('users.update', $sample->id), $newData, ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(403);


        // 管理者ユーザーから開発者ユーザー変更はアクセス不可
        $response = $this->actingAs($this->adminUser)
            ->json('PATCH', route('users.update', $sampleSystem->id), $newData, ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(403);

        // 管理者ユーザーから管理者ユーザー変更は正常レスポンスを返す
        $response = $this->actingAs($this->adminUser)
            ->json('PATCH', route('users.update', $sampleAdmin->id), $newData, ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(200);

        // 管理者ユーザーから一般ユーザー変更は正常レスポンスを返す
        $response = $this->actingAs($this->adminUser)
            ->json('PATCH', route('users.update', $sample->id), $newData, ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(200);


        // 開発者ユーザーから開発者ユーザー変更は正常レスポンスを返す
        $response = $this->actingAs($this->systemUser)
            ->json('PATCH', route('users.update', $sampleSystem->id), $newData, ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(200);

        // 開発者ユーザーから管理者ユーザー変更は正常レスポンスを返す
        $response = $this->actingAs($this->systemUser)
            ->json('PATCH', route('users.update', $sampleAdmin->id), $newData, ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(200);

        // 開発者ユーザーから一般ユーザー変更は正常レスポンスを返す
        $response = $this->actingAs($this->systemUser)
            ->json('PATCH', route('users.update', $sample->id), $newData, ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(200);
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
            'role' => 3
        ]);

        // 管理者ユーザーからリクエストを送信
        $response = $this->actingAs($this->adminUser)
            ->json('DELETE', route('users.destroy', $sample->id), [], ['X-Requested-With' => 'XMLHttpRequest']);

         // 正常レスポンスを返す
         $response->assertStatus(200);

        // ユーザーが削除されているか確認
        $this->assertDeleted($sample);

    }

    /**
     * ログインユーザー削除アクセス権限テスト
     *
     * @return void
     */
    public function testDestroyAuth()
    {
        // サンプルデータを追加
        $sample = factory(User::class)->create([
            'email' => 'sample@test.com',
            'role' => 3
        ]);
        $sampleAdmin = factory(User::class)->create([
            'email' => 'sample_admin@test.com',
            'role' => 2
        ]);
        $sampleSystem = factory(User::class)->create([
            'email' => 'sample_system@test.com',
            'role' => 1
        ]);

        // モデルをモックする
        $userMock = Mockery::mock(User::class);
        $userMock->shouldReceive('destroy');
        $userMock->shouldReceive('find')->andReturnUsing(function ($arg) {
            return User::find($arg);
        });
        $this->instance(User::class, $userMock);

        // 一般ユーザーはアクセス不可
        $response = $this->actingAs($this->user)
            ->json('DELETE', route('users.destroy', $sample->id), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(403);


        // 管理者ユーザーから自ユーザー削除はアクセス不可
        $response = $this->actingAs($this->adminUser)
            ->json('DELETE', route('users.destroy', $this->adminUser->id), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(403);

        // 管理者ユーザーから開発者ユーザー削除はアクセス不可
        $response = $this->actingAs($this->adminUser)
            ->json('DELETE', route('users.destroy', $sampleSystem->id), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(403);

        // 管理者ユーザーから管理者ユーザー削除は正常レスポンスを返す
        $response = $this->actingAs($this->adminUser)
            ->json('DELETE', route('users.destroy', $sampleAdmin->id), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(200);

        // 管理者ユーザーから一般ユーザー削除は正常レスポンスを返す
        $response = $this->actingAs($this->adminUser)
            ->json('DELETE', route('users.destroy', $sample->id), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(200);


        // 開発者ユーザーから自ユーザー削除はアクセス不可
        $response = $this->actingAs($this->systemUser)
            ->json('DELETE', route('users.destroy', $this->systemUser->id), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(403);

        // 開発者ユーザーから開発者ユーザー削除は正常レスポンスを返す
        $response = $this->actingAs($this->systemUser)
            ->json('DELETE', route('users.destroy', $sampleSystem->id), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(200);

        // 開発者ユーザーから管理者ユーザー削除は正常レスポンスを返す
        $response = $this->actingAs($this->systemUser)
            ->json('DELETE', route('users.destroy', $sampleAdmin->id), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(200);

        // 開発者ユーザーから一般ユーザー削除は正常レスポンスを返す
        $response = $this->actingAs($this->systemUser)
            ->json('DELETE', route('users.destroy', $sample->id), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(200);

    }

    /**
     * 権限の選択オプションテスト
     *
     * @return void
     */
    public function testRoleOptions()
    {
        // 一般ユーザーはアクセス不可
        $response = $this->actingAs($this->user)
            ->json('GET', route('users.roleOptions'), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(403);

        // 管理者ユーザーは開発者ユーザー以下の権限レベルの選択オプションを返す
        $response = $this->actingAs($this->adminUser)
            ->json('GET', route('users.roleOptions'), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(200)
            ->assertJson([2,3]);

        // 開発者ユーザーは全選択オプションを返す
        $response = $this->actingAs($this->systemUser)
            ->json('GET', route('users.roleOptions'), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(200)
            ->assertJson(array_keys(\Config::get('settings.roleOptions')));

    }

}
