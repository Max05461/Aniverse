document.addEventListener('DOMContentLoaded', async () => {
    const loading = document.getElementById('loading');
    const container = document.getElementById('details-container');
    const errorState = document.getElementById('error-state');

    // Get ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        loading.classList.add('hidden');
        errorState.classList.remove('hidden');
        return;
    }

    // Fetch details
    const { data } = await getAnimeDetails(id);

    loading.classList.add('hidden');

    if (!data) {
        errorState.classList.remove('hidden');
        return;
    }

    // Populate UI
    document.title = `${data.title} - Aniverse`;
    
    document.getElementById('anime-poster').src = data.images?.webp?.large_image_url || data.images?.jpg?.image_url;
    document.getElementById('anime-title').textContent = data.title_english || data.title;
    document.getElementById('anime-japanese-title').textContent = data.title_japanese || '';
    
    document.getElementById('anime-score').textContent = data.score ? data.score.toFixed(2) : '-';
    document.getElementById('anime-rank').textContent = data.rank ? `#${data.rank}` : '-';
    document.getElementById('anime-popularity').textContent = data.popularity ? `#${data.popularity}` : '-';
    
    document.getElementById('anime-synopsis').textContent = data.synopsis || 'No synopsis available.';

    // Genres
    const genresContainer = document.getElementById('anime-genres');
    if (data.genres && data.genres.length > 0) {
        genresContainer.innerHTML = data.genres.map(g => `<span class="px-3 py-1 bg-brand-900/40 text-brand-300 rounded-lg text-xs font-bold uppercase tracking-wider border border-brand-500/30 shadow-sm">${g.name}</span>`).join('');
    }

    // Info Sidebar (Both Desktop and Mobile)
    const infoHtml = `
        <li class="flex justify-between border-b border-slate-700/50 pb-2"><strong class="text-white/80">Type</strong> <span class="text-right">${data.type || 'Unknown'}</span></li>
        <li class="flex justify-between border-b border-slate-700/50 pb-2"><strong class="text-white/80">Episodes</strong> <span class="text-right">${data.episodes || 'Unknown'}</span></li>
        <li class="flex justify-between border-b border-slate-700/50 pb-2"><strong class="text-white/80">Status</strong> <span class="text-right text-brand-300">${data.status || 'Unknown'}</span></li>
        <li class="flex justify-between border-b border-slate-700/50 pb-2"><strong class="text-white/80">Aired</strong> <span class="text-right text-xs mt-0.5">${data.aired?.string || 'Unknown'}</span></li>
        <li class="flex justify-between border-b border-slate-700/50 pb-2"><strong class="text-white/80">Studios</strong> <span class="text-right">${data.studios?.map(s => s.name).join(', ') || 'Unknown'}</span></li>
        <li class="flex justify-between border-b border-slate-700/50 pb-2"><strong class="text-white/80">Duration</strong> <span class="text-right text-xs mt-0.5">${data.duration || 'Unknown'}</span></li>
        <li class="flex justify-between"><strong class="text-white/80">Rating</strong> <span class="text-right text-xs mt-0.5">${data.rating || 'Unknown'}</span></li>
    `;
    document.getElementById('anime-info-list').innerHTML = infoHtml;
    document.getElementById('mobile-anime-info-list').innerHTML = infoHtml;

    // Streaming Platforms
    if (data.streaming && data.streaming.length > 0) {
        const streamSection = document.getElementById('streaming-section');
        const streamList = document.getElementById('streaming-list');
        streamList.innerHTML = data.streaming.map(platform => createStreamingButton(platform)).join('');
        streamSection.classList.remove('hidden');
    }

    // Trailer Integraton
    const trailerSection = document.getElementById('trailer-section');
    const iframe = document.getElementById('anime-trailer');
    
    // Prioritize embed_url
    let rawEmbedUrl = data.trailer?.embed_url;
    
    // Function to sanitize the YouTube embed URL
    const sanitizeYoutubeUrl = (url) => {
        if (!url) return null;
        try {
            const parsedUrl = new URL(url);
            // Ensure HTTPS
            if (parsedUrl.protocol === 'http:') {
                parsedUrl.protocol = 'https:';
            }
            
            // Extract Video ID if possible to rebuild a clean URL
            // Jikan embed_url is usually like: https://www.youtube.com/embed/XXXXXX?enablejsapi=1&wmode=opaque&autoplay=1
            let videoId = '';
            if (parsedUrl.hostname.includes('youtube.com') && parsedUrl.pathname.includes('/embed/')) {
                videoId = parsedUrl.pathname.split('/embed/')[1];
            } else if (data.trailer?.youtube_id) {
                videoId = data.trailer.youtube_id;
            }
            
            if (videoId) {
                // Rebuild completely clean URL
                return `https://www.youtube.com/embed/${videoId}`;
            }

            // Fallback: Just strip problematic params if ID parsing fails
            parsedUrl.searchParams.delete('autoplay');
            parsedUrl.searchParams.delete('enablejsapi');
            parsedUrl.searchParams.delete('wmode');
            return parsedUrl.toString();

        } catch (e) {
            console.error("Error parsing trailer URL:", e);
            return url;
        }
    };

    const finalEmbedUrl = sanitizeYoutubeUrl(rawEmbedUrl) || (data.trailer?.youtube_id ? `https://www.youtube.com/embed/${data.trailer.youtube_id}` : null);
    
    if (finalEmbedUrl) {
        iframe.src = finalEmbedUrl;
        
        // Strict Security & App Permissions
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('frameborder', '0');
        
        // Add fallback link under the player
        if (data.trailer?.url) {
            const fallbackLink = document.createElement('div');
            fallbackLink.className = 'mt-3 text-center text-sm';
            fallbackLink.innerHTML = `<span class="text-gray-400">Having trouble?</span> <a href="${data.trailer.url}" target="_blank" rel="noopener noreferrer" class="text-brand-400 hover:text-brand-300 hover:underline inline-flex items-center gap-1"><i class="fa-brands fa-youtube"></i> Watch directly on YouTube</a>`;
            trailerSection.appendChild(fallbackLink);
        }

        trailerSection.classList.remove('hidden');
    } else {
        // Fallback: Embed YouTube search results for the trailer
        const searchTitle = data.title_english || data.title;
        
        trailerSection.innerHTML = `
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2 text-white border-b border-slate-800 pb-2">
                <i class="fa-brands fa-youtube text-red-500"></i> Trailer
            </h3>
            <div class="bg-slate-800 border border-slate-700 p-6 rounded-xl text-center">
                <p class="text-gray-400 mb-4 text-sm">Trailer embed is missing from the database. You can search for it on YouTube.</p>
                <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(searchTitle + ' official trailer')}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-lg transition-colors font-bold shadow-lg shadow-red-500/30">
                    <i class="fa-brands fa-youtube text-lg"></i> Search Trailer on YouTube
                </a>
            </div>
        `;
        trailerSection.classList.remove('hidden');
    }

    // Show initial container
    container.classList.remove('hidden');

    // Fetch and render Characters (Async without blocking main Details)
    loadCharacters(id);
});

async function loadCharacters(id) {
    const charsList = document.getElementById('characters-list');
    const charsLoading = document.getElementById('characters-loading');
    
    const charsRes = await getAnimeCharacters(id);
    
    charsLoading.classList.add('hidden');
    charsList.classList.remove('hidden');

    if (charsRes.data && charsRes.data.length > 0) {
        // Filter Main Characters only, or top 10 if we want
        const mainChars = charsRes.data.filter(c => c.role === 'Main');
        // If not enough Main, fallback to showing all up to 10
        const displayChars = mainChars.length > 0 ? mainChars : charsRes.data.slice(0, 10);
        
        displayChars.forEach((charData, index) => {
            const delay = (index % 10) * 40;
            charsList.innerHTML += createCharacterCard(charData, delay);
        });

        if(displayChars.length === 0) {
            charsList.innerHTML = `<p class="col-span-full text-gray-400 italic">No main characters found.</p>`;
        }
    } else {
        charsList.innerHTML = `<p class="col-span-full text-gray-400 italic">No character data available.</p>`;
    }
}
