<?php

use Illuminate\Database\Seeder;
use App\Models\User;

class UserTestTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(User::class)->states('test')->create();
    }
}
