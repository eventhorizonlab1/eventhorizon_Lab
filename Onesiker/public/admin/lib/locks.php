<?php
/**
 * File locking helpers — every JSON read goes through readWithLock and every
 * JSON write through writeWithLock so two admin tabs can't truncate each other.
 */

function readWithLock(string $path): string {
    if (!file_exists($path)) return '';
    $fp = fopen($path, 'rb');
    if ($fp === false) {
        error_log("readWithLock: cannot open $path");
        return '';
    }
    try {
        if (!flock($fp, LOCK_SH)) {
            error_log("readWithLock: flock(SH) failed on $path");
            return '';
        }
        $contents = stream_get_contents($fp);
        return $contents === false ? '' : $contents;
    } finally {
        flock($fp, LOCK_UN);
        fclose($fp);
    }
}

function writeWithLock(string $path, string $contents): bool {
    $fp = fopen($path, 'cb');
    if ($fp === false) {
        error_log("writeWithLock: cannot open $path");
        return false;
    }
    try {
        if (!flock($fp, LOCK_EX)) {
            error_log("writeWithLock: flock(EX) failed on $path");
            return false;
        }
        if (!ftruncate($fp, 0)) {
            error_log("writeWithLock: ftruncate failed on $path");
            return false;
        }
        rewind($fp);
        $written = fwrite($fp, $contents);
        if ($written === false) {
            error_log("writeWithLock: fwrite failed on $path");
            return false;
        }
        fflush($fp);
        return true;
    } finally {
        flock($fp, LOCK_UN);
        fclose($fp);
    }
}
