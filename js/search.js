document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const grid = document.getElementById('anime-grid');
    const loading = document.getElementById('loading');
    const initialState = document.getElementById('initial-state');
    const stats = document.getElementById('search-stats');

    // Handle form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (!query) return;

        // UI updates
        initialState.classList.add('hidden');
        grid.classList.add('hidden');
        stats.classList.add('hidden');
        loading.classList.remove('hidden');
        grid.innerHTML = '';

        // Fetch data
        const { data, pagination } = await searchAnime(query);

        loading.classList.add('hidden');
        grid.classList.remove('hidden');

        if (data && data.length > 0) {
            stats.innerHTML = `Found ${pagination.items.total} results for "<span class="text-white">${query}</span>"`;
            stats.classList.remove('hidden');

            data.forEach((anime, index) => {
                const delay = (index % 10) * 30;
                grid.innerHTML += createAnimeCard(anime, delay);
            });
        } else {
            grid.innerHTML = `
                <div class="col-span-full text-center py-16">
                    <i class="fa-regular fa-face-frown-open text-5xl text-slate-600 mb-4"></i>
                    <p class="text-xl text-slate-400">No results found for "${query}"</p>
                </div>
            `;
        }
    });

    // Check for URL query parameter to auto-search
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
        input.value = q;
        form.dispatchEvent(new Event('submit'));
    }
});
