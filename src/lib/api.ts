import qs from 'qs';
import { Video, Article } from '../../types';
import { VIDEOS, ARTICLES } from '../../constants';

// Dynamic URL resolution to support mobile (local IP) and desktop (localhost)
const getBaseUrl = () => {
    if (import.meta.env.VITE_STRAPI_URL) return import.meta.env.VITE_STRAPI_URL;
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    return `http://${hostname}:1337`;
};

const STRAPI_URL = getBaseUrl();

// Type pour les formats d'image Strapi
interface StrapiImageFormats {
    large?: { url: string };
    medium?: { url: string };
    small?: { url: string };
    thumbnail?: { url: string };
}

/**
 * Get the Strapi URL from environment variables
 * @param {string} path - Path to append to URL
 * @returns {string} - Full URL
 */
export function getStrapiURL(path = '') {
    return `${STRAPI_URL}${path}`;
}

/**
 * Helper pour obtenir l'URL complète d'une image Strapi
 */
export const getStrapiMedia = (url: string | undefined | null) => {
    if (url == null) {
        return null;
    }
    if (url.startsWith('http') || url.startsWith('//')) {
        return url;
    }
    return `${STRAPI_URL}${url}`;
};

/**
 * Récupère l'URL de l'image la plus appropriée (ou l'originale si pas de format)
 */
const getImageUrl = (imageData: any, format: keyof StrapiImageFormats = 'medium') => {
    if (!imageData) return null;

    const formats = imageData.attributes?.formats || imageData.formats;
    const url = formats?.[format]?.url || imageData.attributes?.url || imageData.url;

    return getStrapiMedia(url);
};

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

export async function fetchVideos(): Promise<Video[]> {
    try {
        const res = await fetch(`${STRAPI_URL}/api/videos?populate=*`);

        if (!res.ok) {
            throw new Error(`Erreur API: ${res.statusText}`);
        }

        const json = await res.json();

        const videos: Video[] = json.data.map((item: any) => {
            const attr = item.attributes || item;
            const imageData = attr.imageUrl?.data || attr.imageUrl;

            // On essaie de récupérer une image optimisée (medium), sinon l'originale
            const imageUrl = getImageUrl(imageData, 'medium') || '/assets/videos/v1.jpg';

            return {
                id: item.id.toString(),
                title: attr.title,
                category: attr.category,
                subcategory: attr.subcategory,
                duration: attr.duration,
                imageUrl: imageUrl,
                videoUrl: attr.videoUrl,
                description: attr.description
            };
        });

        return videos;
    } catch (error) {
        console.warn("⚠️ Impossible de joindre Strapi. Utilisation des données locales.", error);
        return VIDEOS;
    }
}

export async function fetchArticles(): Promise<Article[]> {
    try {
        const res = await fetch(`${STRAPI_URL}/api/articles?populate=*`);

        if (!res.ok) {
            throw new Error(`Erreur API: ${res.statusText}`);
        }

        const json = await res.json();

        const articles: Article[] = json.data.map((item: any) => {
            const attr = item.attributes || item;
            const imageData = attr.imageUrl?.data || attr.imageUrl;
            const imageUrl = getImageUrl(imageData, 'medium') || '/assets/articles/asterix.jpg';

            return {
                id: item.id.toString(),
                title: attr.title,
                summary: attr.summary,
                content: attr.content,
                date: attr.date,
                category: attr.category,
                imageUrl: imageUrl,
                linkUrl: attr.linkUrl
            };
        });

        return articles;
    } catch (error) {
        console.warn("⚠️ Impossible de joindre Strapi (Articles). Utilisation des données locales.", error);
        return ARTICLES;
    }
}
