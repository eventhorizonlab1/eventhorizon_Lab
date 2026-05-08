<?php
/**
 * Single helper for emitting JSON responses + exiting. Used by every endpoint.
 */

function jsonResponse($data, int $code = 200): void {
    http_response_code($code);
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Cache-Control: post-check=0, pre-check=0', false);
    header('Pragma: no-cache');
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}
