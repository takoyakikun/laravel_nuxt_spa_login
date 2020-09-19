<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\CustomVerifyEmail;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Notification;

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
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => \Config::get('settings.roleLevel.user')
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

        // 追加したユーザーのメールアドレスに送信されているか確認
        $user = User::orderBy('id', 'desc')->first();
        $url = '';
        Notification::assertSentTo(
            $user,
            CustomVerifyEmail::class,
            function (CustomVerifyEmail $notification) use (&$url, $user) {
                $mail = $notification->toMail($user);
                $url = $mail->actionUrl;
                return true;
            }
        );

        // メール認証のアクセス権限のリクエストを送信
        $response = $this->actingAs($user)->json('GET', route('permission', ['verified']), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // この時点ではメール認証されていないのでfalseを返す
        $response->assertJson([false]);

        // メール認証ボタンを押す
        $response = $this->actingAs($user)->get($url);

        // Topへリダイレクトすることを確認
        $response->assertStatus(302)->assertRedirect('/');

        // データベースにメール認証時刻が入っているか確認
        $verificationUser = User::find($user->id);
        $this->assertNotNull($verificationUser->email_verified_at);

        // メール認証のアクセス権限のリクエストを送信
        $response = $this->actingAs($user)->json('GET', route('permission', ['verified']), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // メール認証済なのでtrueを返す
        $response->assertJson([true]);

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
            'role' => 10
        ]);
        $sampleSystem = factory(User::class)->create([
            'email' => 'sample_system@test.com',
            'role' => 1
        ]);

        // 編集するデータ
        $newData = [
            'name'  => '編集テスト',
            'email' => 'change@test.com',
            'role' => \Config::get('settings.roleLevel.admin')
        ];

        // 一般ユーザーはアクセス不可
        $response = $this->actingAs($this->user)
            ->json('PATCH', route('users.update', $sample->id), $newData, ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(403);

        // 管理者ユーザーから開発者ユーザー変更はアクセス不可
        $response = $this->actingAs($this->adminUser)
            ->json('PATCH', route('users.update', $sampleSystem->id), $newData, ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(403);

        // 管理者ユーザーは正常レスポンスを返す
        $response = $this->actingAs($this->adminUser)
            ->json('PATCH', route('users.update', $sample->id), $newData, ['X-Requested-With' => 'XMLHttpRequest']);
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
            'role' => 10
        ]);
        $sampleSystem = factory(User::class)->create([
            'email' => 'sample_system@test.com',
            'role' => 1
        ]);

        // 一般ユーザーはアクセス不可
        $response = $this->actingAs($this->user)
            ->json('DELETE', route('users.destroy', $sample->id), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(403);

        // 管理者ユーザーから開発者ユーザー削除はアクセス不可
        $response = $this->actingAs($this->adminUser)
            ->json('DELETE', route('users.destroy', $sampleSystem->id), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(403);

        // 開発者ユーザーから自ユーザー削除はアクセス不可
        $response = $this->actingAs($this->systemUser)
            ->json('DELETE', route('users.destroy', $this->systemUser->id), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(403);

        // 管理者ユーザーは正常レスポンスを返す
        $response = $this->actingAs($this->adminUser)
            ->json('DELETE', route('users.destroy', $sample->id), [], ['X-Requested-With' => 'XMLHttpRequest']);
        $response->assertStatus(200);

        // ユーザーが削除されているか確認
        $this->assertDeleted($sample);

    }

}
