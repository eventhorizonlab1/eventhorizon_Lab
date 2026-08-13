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
    
    // on*="…" event handlers (do this first so we don't have to worry about them in href parsing)
    $html = preg_replace('/(<[^>]+)\s+on\w+\s*=\s*(["\'])[^\2]*\2/i', '$1', $html);

    // Filter dangerous href attributes (javascript:, vbscript:, data:)
    // Accounts for HTML entities and whitespace bypasses.
    $html = preg_replace_callback('/(<a\s+[^>]*?)(href\s*=\s*(?:(["\'])(.*?)\3|([^\s>]+)))([^>]*>)/is', function($matches) {
        $prefix = $matches[1];
        $hrefValue = !empty($matches[3]) ? $matches[4] : $matches[5];
        $suffix = $matches[6];
        
        $decodedHref = html_entity_decode($hrefValue, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $cleanHref = strtolower(preg_replace('/[\x00-\x20\x7F]+/', '', $decodedHref));
        
        if (strpos($cleanHref, 'javascript:') === 0 || 
            strpos($cleanHref, 'vbscript:') === 0 || 
            strpos($cleanHref, 'data:') === 0) {
            return $prefix . ltrim($suffix); // Strip the href
        }
        return $matches[0];
    }, $html);
    return $html;
}

/**
 * Plain-text sanitizer for alt-text fields (alt_fr / alt_en on hero, boutique,
 * artworks). Strips ALL HTML tags (alt should never contain markup) and caps
 * the length so a runaway paste cannot bloat the JSON file.
 */
function sanitizeAltText($value, int $maxLen = 200): string {
    if (!is_string($value)) return '';
    $s = strip_tags($value);
    $s = trim($s);
    return mb_substr($s, 0, $maxLen);
}
