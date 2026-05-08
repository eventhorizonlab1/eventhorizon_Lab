<?php
// Mock
$_POST = ['action' => 'upload_image', 'folder' => 'Hero'];
$_FILES = [
    'image' => [
        'name' => 'test.png',
        'type' => 'image/png',
        'tmp_name' => __DIR__ . '/test.png',
        'error' => UPLOAD_ERR_OK,
        'size' => 100
    ]
];
file_put_contents(__DIR__ . '/test.png', 'fake image content');

// We can't really run the full api.php because of session and auth
// But we can check if there are syntax errors in it
exec('php -l public/admin/api.php', $out, $ret);
echo "Lint: $ret\n";
