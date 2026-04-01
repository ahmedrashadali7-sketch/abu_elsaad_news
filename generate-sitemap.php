<?php
// هذا الملف يتطلب وجود PHP على السيرفر
// ضعه في المجلد الرئيسي وشغله كل فترة

require_once 'vendor/autoload.php'; // لو استخدمت Firebase PHP SDK

use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

$factory = (new Factory)
    ->withServiceAccount('path/to/firebase-credentials.json')
    ->withDatabaseUri('https://abu-el-saad-news.firebaseio.com');

$firestore = $factory->createFirestore();
$database = $firestore->database();
$newsRef = $database->collection('news')->documents();

$xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
$xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">' . "\n";

foreach ($newsRef as $news) {
    $data = $news->data();
    $date = $data['createdAt'] ? $data['createdAt']->toDateTime()->format('Y-m-d') : date('Y-m-d');
    
    $xml .= '  <url>' . "\n";
    $xml .= '    <loc>https://abusaladnews.com/article.html?id=' . $news->id() . '</loc>' . "\n";
    $xml .= '    <news:news>' . "\n";
    $xml .= '      <news:publication>' . "\n";
    $xml .= '        <news:name>أبو السعد للاخبار</news:name>' . "\n";
    $xml .= '        <news:language>ar</news:language>' . "\n";
    $xml .= '      </news:publication>' . "\n";
    $xml .= '      <news:publication_date>' . $date . '</news:publication_date>' . "\n";
    $xml .= '      <news:title>' . htmlspecialchars($data['title']) . '</news:title>' . "\n";
    $xml .= '    </news:news>' . "\n";
    $xml .= '  </url>' . "\n";
}

$xml .= '</urlset>';

file_put_contents('sitemap-news.xml', $xml);
echo "تم تحديث sitemap-news.xml بنجاح!";
?>