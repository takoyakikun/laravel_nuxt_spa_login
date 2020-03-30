<?php

use Illuminate\Database\Seeder;

class UserTestTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(\App\User::class)->states('test')->create();
    }
}
