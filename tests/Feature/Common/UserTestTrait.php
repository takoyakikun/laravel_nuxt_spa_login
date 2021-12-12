<?php

namespace Tests\Feature\Common;

use App\Models\User;
use App\Notifications\CustomResetPassword;

use Illuminate\Support\Facades\Notification;
use PHPUnit\Framework\Assert;

trait UserTestTrait
{
    // テスト一般ユーザ
    protected $user;

    // テスト管理者ユーザ
    protected $adminUser;

    // テスト開発者ユーザ
    protected $systemUser;

    /**
     * テストユーザーを作成してセットする
     *
     * @return void
     */
    public function userSetUp()
    {
        // テスト一般ユーザ作成
        $this->user = factory(User::class)->states('test_user')->create();

        // テスト管理者ユーザ作成
        $this->adminUser = factory(User::class)->states('test_admin')->create();

        // テスト開発者ユーザ作成
        $this->systemUser = factory(User::class)->states('test_system')->create();

    }

    /**
     * ログインユーザーパスワード設定メール送信共通のテスト
     *
     * @return void
     */
    public function userPasswordSetMail()
    {
        // パスワード設定メールが入力されたメールアドレスに送信されているか確認
        $user = User::orderBy('id', 'desc')->first();
        $token = '';
        $actionUrl = '';
        Notification::assertSentTo(
            $user,
            CustomResetPassword::class,
            function (CustomResetPassword $notification) use (&$token, &$actionUrl, $user) {
                $actionUrl = $notification->toMail($user)->actionUrl;
                $token = $notification->token;
                return true;
            }
        );

        // 送信されたメールのボタンリンクがパスワード設定URLになっているか
        Assert::assertSame($actionUrl, url('passwordSet/' . $token));

        // メール認証のアクセス権限のリクエストを送信
        $response = $this->actingAs($user)->json('GET', route('permission', ['verified']), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // この時点ではメール認証されていないのでfalseを返す
        $response->assertJson([false]);

        // 設定するパスワードデータ
        $newPasswordData = [
            'token'  => $token,
            'login_id' => $user->login_id,
            'password' => 'password',
            'password_confirmation' => 'password'
        ];

        // パスワード設定のリクエストを送信
        $response = $this->json('POST', route('password.passwordSet'), $newPasswordData, ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // 認証されていることを確認
        $this->assertTrue(\Auth::check());

        // 設定されたパスワードが保存されていることを確認
        $this->assertTrue(\Hash::check($newPasswordData['password'], $user->fresh()->password));

        // データベースにメール認証時刻とパスワード設定時刻が入っているか確認
        $verificationUser = User::find($user->id);
        $this->assertNotNull($verificationUser->login_id_verified_at);
        $this->assertNotNull($verificationUser->password_set_at);

        // メール認証のアクセス権限のリクエストを送信
        $response = $this->actingAs($verificationUser)->json('GET', route('permission', ['verified']), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // メール認証済なのでtrueを返す
        $response->assertJson([true]);
    }

}
