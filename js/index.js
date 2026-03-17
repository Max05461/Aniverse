document.addEventListener('DOMContentLoaded', async () => {
    const topGrid = document.getElementById('anime-grid');
    const topLoading = document.getElementById('top-loading');
    
    const airingGrid = document.getElementById('airing-grid');
    const airingLoading = document.getElementById('airing-loading');

    // Fetch and render concurrently to speed up load time
    const [airingRes, topRes] = await Promise.all([
        getCurrentlyAiringAnime(),
        getTopAnime()
    ]);

    // Handle Airing Anime
    airingLoading.classList.add('hidden');
    airingGrid.classList.remove('hidden');

    if (airingRes.data && airingRes.data.length > 0) {
        airingRes.data.forEach((anime, index) => {
            const delay = (index % 10) * 50;
            airingGrid.innerHTML += createAnimeCard(anime, delay);
        });
    } else {
        airingGrid.innerHTML = `<p class="col-span-full text-center text-gray-400 py-4">Failed to load currently airing anime.</p>`;
    }

    // Handle Top Anime
    topLoading.classList.add('hidden');
    topGrid.classList.remove('hidden');

    if (topRes.data && topRes.data.length > 0) {
        topRes.data.forEach((anime, index) => {
            const delay = (index % 10) * 50;
            topGrid.innerHTML += createAnimeCard(anime, delay);
        });
    } else {
        topGrid.innerHTML = `<p class="col-span-full text-center text-gray-400 py-10">Failed to load top anime.</p>`;
    }
});
