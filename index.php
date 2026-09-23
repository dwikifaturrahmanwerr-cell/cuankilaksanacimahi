<?php
// Auto-copy real photos from user upload store to current umkm directory
$brainUploaded = 'C:/Users/BTI02/.gemini/antigravity-ide/brain/e1438e7b-f90c-41b5-a245-40c67d9d0331/.user_uploaded';

$syncMap = [
    $brainUploaded . '/media_1790135411969.jpg' => __DIR__ . '/cuanki_kemasan.jpg',
    $brainUploaded . '/media_1790134433949.jpg' => __DIR__ . '/cuanki_sajian.jpg',
    $brainUploaded . '/media_1790134413909.png' => __DIR__ . '/cuanki_kemasan_standing.png',
    $brainUploaded . '/media_1790132615656.png' => __DIR__ . '/cuanki_pouch.png',
];

foreach ($syncMap as $src => $dest) {
    if (file_exists($src)) {
        if (!file_exists($dest) || filesize($dest) === 0 || $dest === __DIR__ . '/cuanki_kemasan.jpg') {
            @copy($src, $dest);
        }
    }
}

// Serve landing page
include __DIR__ . '/index.html';
