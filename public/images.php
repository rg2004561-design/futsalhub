<?php
/**
 * Image proxy for InfinityFree - bypass 403 errors
 * Usage: /images.php?path=courts/filename.jpg
 */

// Security
$path = $_GET['path'] ?? '';
if (empty($path) || strpos($path, '..') !== false) {
    http_response_code(404);
    exit('Image not found');
}

// Allowed directories
$allowedDirs = ['courts', 'photos'];
$pathParts = explode('/', $path);
if (!in_array($pathParts[0], $allowedDirs)) {
    http_response_code(403);
    exit('Access denied');
}

// Construct full path
$imagePath = __DIR__ . '/storage/' . $path;

// Check if file exists
if (!file_exists($imagePath)) {
    http_response_code(404);
    exit('Image not found');
}

// Get file info
$imageInfo = getimagesize($imagePath);
if (!$imageInfo) {
    http_response_code(400);
    exit('Invalid image');
}

// Set headers
header('Content-Type: ' . $imageInfo['mime']);
header('Content-Length: ' . filesize($imagePath));
header('Cache-Control: public, max-age=31536000');

// Output image
readfile($imagePath);
?>
