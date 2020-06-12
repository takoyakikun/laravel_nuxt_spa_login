<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\CustomVerifyEmail;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Notification;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    public function setUp(): void
    {
        parent::setUp();

        // テストユーザ作成
        $this->user = factory(User::class)->create();
    }

    /**
     * ログイン認証テスト
     */
    public function testLogin(): void
    {
        // 作成したテストユーザのemailとpasswordで認証リクエスト
        $response = $this->json('POST', route('login'), [
            'email' => $this->user->email,
            'password' => 'password',
        ], ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返り、ユーザ名が取得できることを確認
        $response
            ->assertStatus(200)
            ->assertJson(['name' => $this->user->name]);

        // 指定したユーザーが認証されていることを確認
        $this->assertAuthenticatedAs($this->user);
    }

    /**
     * ログアウトテスト
     */
    public function testLogout(): void
    {
        // actingAsヘルパで現在認証済みのユーザーを指定する
        $actingAs = $this->actingAs($this->user);

        // ログアウトページへリクエストを送信
        $response = $actingAs->json('POST', route('logout'), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // ログアウト後のレスポンスで、HTTPステータスコードが正常であることを確認
        $response->assertStatus(200);

        // ユーザーが認証されていないことを確認
        $this->assertGuest();
    }

    /**
     * ユーザー取得テスト
     */
    public function testUser(): void
    {
        // actingAsヘルパで現在認証済みのユーザーを指定する
        $actingAs = $this->actingAs($this->user);

        // ユーザー取得リクエストを送信
        $response = $actingAs->json('GET', route('user'), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返り、ユーザ名が取得できることを確認
        $response
            ->assertStatus(200)
            ->assertJson(['name' => $this->user->name]);

        // 指定したユーザーが認証されていることを確認
        $this->assertAuthenticatedAs($this->user);

    }

    /**
     * 認証メール再送信テスト
     *
     * @return void
     */
    public function testVerificationResend()
    {
        // 実際にメール送信しないようにする
        Notification::fake();

        // サンプルデータを追加
        $user = factory(User::class)->create([
            'email' => 'sample@test.com',
            'email_verified_at' => null,
        ]);

        // 認証メール再送信のリクエストを送信
        $response = $this->actingAs($user)->json('POST', route('verification.resend'), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // 認証メール再送信したユーザーのメールアドレスに送信されているか確認
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

}
