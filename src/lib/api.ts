import qs from 'qs';

/**
 * Get the Strapi URL from environment variables
 * @param {string} path - Path to append to URL
 * @returns {string} - Full URL
 */
export function getStrapiURL(path = '') {
    return `${import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337'
        }${path}`;
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path - Path to endpoint
 * @param {Object} urlParamsObject - URL parameters object
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
export async function fetchAPI(
    path: string,
    urlParamsObject = {},
    options = {}
) {
    // Merge default and user options
    const mergedOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${getStrapiURL(
        `/api${path}${queryString ? `?${queryString}` : ''}`
    )}`;

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);

    // Handle response
    if (!response.ok) {
        console.error(response.statusText);
        throw new Error(`An error occured please try again`);
    }
    const data = await response.json();
    return data;
}

/**
 * Helper to get the full media URL
 * @param {string} url - Media URL
 * @returns {string} - Full Media URL
 */
export function getStrapiMedia(url: string | null) {
    if (url == null) {
        return null;
    }

    // Return the full URL if the media is hosted on an external provider
    if (url.startsWith('http') || url.startsWith('//')) {
        return url;
    }

    // Otherwise prepend the URL path with the Strapi URL
    return `${getStrapiURL()}${url}`;
}
