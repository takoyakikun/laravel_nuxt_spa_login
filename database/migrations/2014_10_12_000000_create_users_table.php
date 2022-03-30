<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->comment('ログインユーザー名');
            $table->string('login_id')->unique();
            $table->timestamp('login_id_verified_at')->nullable()->comment('ログインID認証日時');
            $table->timestamp('password_set_at')->nullable()->comment('パスワード登録日時');
            $table->tinyInteger('role')->default(0)->index('index_role')->comment('権限');
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
