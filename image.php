<?php
/**
 * Image Streamer & Auto-sync for Cuanki Laksana Real Photos
 */
$brainUploaded = 'C:/Users/BTI02/.gemini/antigravity-ide/brain/e1438e7b-f90c-41b5-a245-40c67d9d0331/.user_uploaded';

$img = isset($_GET['img']) ? $_GET['img'] : '';

$fileMap = [
    'kemasan' => [
        'src' => $brainUploaded . '/media_1790135411969.jpg',
        'dest' => __DIR__ . '/cuanki_kemasan.jpg',
        'mime' => 'image/jpeg'
    ],
    'sajian' => [
        'src' => $brainUploaded . '/media_1790134433949.jpg',
        'dest' => __DIR__ . '/cuanki_sajian.jpg',
        'mime' => 'image/jpeg'
    ],
    'kemasan_standing' => [
        'src' => $brainUploaded . '/media_1790134413909.png',
        'dest' => __DIR__ . '/cuanki_kemasan_standing.png',
        'mime' => 'image/png'
    ],
    'pouch' => [
        'src' => $brainUploaded . '/media_1790132615656.png',
        'dest' => __DIR__ . '/cuanki_pouch.png',
        'mime' => 'image/png'
    ]
];

if (isset($fileMap[$img])) {
    $target = $fileMap[$img];
    
    // Auto sync to local folder
    if (file_exists($target['src'])) {
        @copy($target['src'], $target['dest']);
        header('Content-Type: ' . $target['mime']);
        header('Cache-Control: public, max-age=86400');
        readfile($target['src']);
        exit;
    }
}

// Fallback 404
http_response_code(404);
echo "Image not found";
