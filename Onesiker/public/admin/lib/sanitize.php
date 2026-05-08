<?php
/**
 * Whitelist-based sanitizer for rich-text fields (news excerpts, gallery details,
 * artwork titles). Only the tags below survive; everything else is stripped:
 *
 *   <a> <b> <i> <strong> <em> <br>
 *
 * On top of strip_tags():
 *   1. javascript: URLs in <a href="…"> are scrubbed.
 *   2. Inline event handlers (onclick="…", onerror="…", etc.) are removed.
 *
 * We deliberately do NOT depend on HTMLPurifier — too heavy for OVH mutualisé.
 * If you ever need to allow more tags (lists, headings, …) extend the strip_tags
 * argument here AND re-test the dangerouslySetInnerHTML render sites in the
 * frontend (Contacts.tsx -> gallery details).
 */

function sanitizeHtml(string $html, int $maxLen = 50000): string {
    if (strlen($html) > $maxLen) {
        $html = substr($html, 0, $maxLen);
    }
    $html = strip_tags($html, '<a><b><i><strong><em><br>');
    // href="javascript:…"
    $html = preg_replace('/(<a\s[^>]*)href\s*=\s*["\']?javascript:[^"\'\s>]*/i', '$1', $html);
    // on*="…" event handlers
    $html = preg_replace('/(<[^>]+)\s+on\w+\s*=\s*(["\'])[^\2]*\2/i', '$1', $html);
    return $html;
}
