const BASE_URL = 'https://api.jikan.moe/v4';

/**
 * Fetch Top Anime
 * @param {number} page
 */
async function getTopAnime(page = 1) {
    try {
        const response = await fetch(`${BASE_URL}/top/anime?page=${page}&limit=20`);
        if (!response.ok) throw new Error('Failed to fetch data');
        return await response.json();
    } catch (error) {
        console.error("API Error: ", error);
        return { data: [] };
    }
}

/**
 * Fetch Currently Airing Anime
 * @param {number} page
 */
async function getCurrentlyAiringAnime(page = 1) {
    try {
        const response = await fetch(`${BASE_URL}/seasons/now?page=${page}&limit=10`);
        if (!response.ok) throw new Error('Failed to fetch data');
        return await response.json();
    } catch (error) {
        console.error("API Error: ", error);
        return { data: [] };
    }
}

/**
 * Search Anime by Query
 * @param {string} query
 * @param {number} page
 */
async function searchAnime(query, page = 1) {
    try {
        const response = await fetch(`${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&sfw=true`);
        if (!response.ok) throw new Error('Failed to fetch data');
        return await response.json();
    } catch (error) {
        console.error("API Error: ", error);
        return { data: [], pagination: { items: { total: 0 } } };
    }
}

/**
 * Get Anime details by ID
 * @param {number} id
 */
async function getAnimeDetails(id) {
    try {
        const response = await fetch(`${BASE_URL}/anime/${id}/full`);
        if (!response.ok) throw new Error('Failed to fetch data');
        return await response.json();
    } catch (error) {
        console.error("API Error: ", error);
        return { data: null };
    }
}

/**
 * Fetch Anime Characters and Staff
 * @param {number} id
 */
async function getAnimeCharacters(id) {
    try {
        const response = await fetch(`${BASE_URL}/anime/${id}/characters`);
        if (!response.ok) throw new Error('Failed to fetch data');
        return await response.json();
    } catch (error) {
        console.error("API Error: ", error);
        return { data: [] };
    }
}
