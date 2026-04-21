<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$storageFile = __DIR__ . '/counter-data.json';
$timezone = new DateTimeZone('Europe/Paris');
$today = (new DateTime('now', $timezone))->format('Y-m-d');

$defaultData = [
    'total' => 0,
    'days' => []
];

$handle = @fopen($storageFile, 'c+');
if ($handle === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Counter storage is not writable.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!flock($handle, LOCK_EX)) {
    fclose($handle);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Counter storage lock failed.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$existingContent = stream_get_contents($handle);
$data = $defaultData;

if (is_string($existingContent) && trim($existingContent) !== '') {
    $decoded = json_decode($existingContent, true);
    if (is_array($decoded)) {
        $data = array_merge($defaultData, $decoded);
        if (!isset($data['days']) || !is_array($data['days'])) {
            $data['days'] = [];
        }
    }
}

$data['total'] = (int)($data['total'] ?? 0) + 1;
if (!isset($data['days'][$today])) {
    $data['days'][$today] = 0;
}
$data['days'][$today] = (int)$data['days'][$today] + 1;

// Optional housekeeping: keep only last 120 day entries.
if (count($data['days']) > 120) {
    ksort($data['days']);
    $data['days'] = array_slice($data['days'], -120, null, true);
}

rewind($handle);
ftruncate($handle, 0);
fwrite($handle, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
fflush($handle);
flock($handle, LOCK_UN);
fclose($handle);

echo json_encode([
    'success' => true,
    'date' => $today,
    'counters' => [
        'total' => (int)$data['total'],
        'today' => (int)$data['days'][$today]
    ]
], JSON_UNESCAPED_UNICODE);
