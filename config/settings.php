<?php

return [
    // 権限レベルの境界値(運用後は変更禁止)
    'roleLevel' => [
        'system' => 1,  // 開発者
        'admin' => 5,   // 管理者
        'user' => 10,   // 一般
    ]
];
