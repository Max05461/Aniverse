// Shared UI Components
const Navbar = `
    <nav class="glass-nav sticky top-0 z-50 transition-all duration-300 shadow-lg border-b border-white/5">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
            <a href="index.html" class="flex items-center gap-2 group">
                <i class="fa-solid fa-meteor text-brand-500 text-2xl group-hover:rotate-12 transition-transform"></i>
                <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-brand-400 transition-colors tracking-tight">Aniverse</span>
            </a>
            <div class="flex gap-4 sm:gap-6 items-center">
                <a href="index.html" class="text-gray-300 hover:text-white transition-colors text-sm font-medium">Home</a>
                <a href="search.html" class="text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 shadow-sm backdrop-blur-sm">
                    <i class="fa-solid fa-magnifying-glass text-brand-400"></i> <span class="hidden sm:inline">Search</span>
                </a>
            </div>
        </div>
    </nav>
`;

const Footer = `
    <footer class="border-t border-gray-800 bg-dark-900/50 mt-12 py-8 backdrop-blur-sm relative z-10">
        <div class="container mx-auto px-4 text-center text-gray-400 text-sm flex flex-col items-center justify-center gap-2">
            <a href="index.html" class="flex items-center gap-2 mb-2">
                <i class="fa-solid fa-meteor text-brand-500"></i>
                <span class="font-bold text-white tracking-wide">Aniverse</span>
            </a>
            <p>Powered by <a href="https://jikan.moe/" target="_blank" class="text-brand-400 hover:text-brand-300 hover:underline transition-colors font-medium">Jikan API</a></p>
            <p>&copy; ${new Date().getFullYear()} Aniverse. This is a demo project.</p>
        </div>
    </footer>
`;

document.addEventListener('DOMContentLoaded', () => {
    const navEl = document.getElementById('navbar');
    const footerEl = document.getElementById('footer');
    
    if (navEl) navEl.innerHTML = Navbar;
    if (footerEl) footerEl.innerHTML = Footer;
});

// Helper for generic anime card
function createAnimeCard(anime, delay = 0) {
    const imageUrl = anime.images?.webp?.large_image_url || anime.images?.jpg?.image_url;
    const title = anime.title_english || anime.title;
    const score = anime.score ? anime.score.toFixed(1) : '-';
    const year = anime.year || 'TBA';
    const episodes = anime.episodes ? `${anime.episodes} eps` : (anime.airing ? 'Airing' : '? eps');
    
    return `
        <a href="details.html?id=${anime.mal_id}" class="anime-card group relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700 fade-in" style="animation-delay: ${delay}ms; opacity: 0; fill-mode: forwards;">
            <div class="aspect-[3/4] overflow-hidden relative">
                <img src="${imageUrl}" alt="${title}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <div class="absolute top-2 right-2 badge px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-lg text-white">
                    <i class="fa-solid fa-star text-yellow-400"></i> ${score}
                </div>
                <!-- Overlay details -->
                <div class="overlay absolute inset-0 flex flex-col justify-end p-4">
                    <p class="text-xs sm:text-sm text-gray-200 mb-1.5 font-medium drop-shadow-md">${year} • ${episodes}</p>
                    <div class="flex flex-wrap gap-1">
                        ${anime.genres?.slice(0, 2).map(g => `<span class="px-1.5 py-0.5 bg-brand-600/90 shadow-md rounded text-[9px] sm:text-[10px] text-white font-semibold uppercase tracking-wider">${g.name}</span>`).join('') || ''}
                    </div>
                </div>
            </div>
            <div class="p-3 sm:p-4 bg-slate-800 group-hover:bg-slate-750 transition-colors">
                <h3 class="font-semibold text-gray-100 line-clamp-1 group-hover:text-brand-400 text-sm sm:text-base transition-colors" title="${title}">${title}</h3>
            </div>
        </a>
    `;
}

// Helper for Character Card
function createCharacterCard(characterData, delay = 0) {
    const character = characterData.character;
    const charImg = character.images?.webp?.image_url || character.images?.jpg?.image_url;
    const charName = character.name;
    const role = characterData.role;

    // Find Japanese VA
    const voiceActors = characterData.voice_actors || [];
    const jpVA = voiceActors.find(va => va.language === 'Japanese');
    
    let vaHtml = '';
    if (jpVA) {
        const vaName = jpVA.person.name;
        const vaImg = jpVA.person.images?.jpg?.image_url;
        vaHtml = `
            <div class="flex items-center gap-3 text-right">
                <div class="flex flex-col justify-center">
                    <span class="text-sm font-semibold text-gray-200 line-clamp-1">${vaName}</span>
                    <span class="text-[10px] text-gray-500 uppercase tracking-wider">Japanese</span>
                </div>
                <img src="${vaImg}" alt="${vaName}" loading="lazy" class="w-12 h-16 object-cover rounded-md shadow-sm border border-slate-700 bg-slate-700">
            </div>
        `;
    }

    return `
        <div class="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden flex justify-between p-2 sm:p-3 fade-in shadow-md hover:shadow-lg transition-shadow hover:border-slate-600" style="animation-delay: ${delay}ms; opacity: 0; fill-mode: forwards;">
            <!-- Character Side -->
            <div class="flex items-center gap-3 w-1/2 pr-2 border-r border-slate-700/50 text-left">
                <img src="${charImg}" alt="${charName}" loading="lazy" class="w-12 h-16 object-cover rounded-md shadow-sm border border-slate-700 bg-slate-700">
                <div class="flex flex-col justify-center">
                    <span class="text-sm font-bold text-brand-300 line-clamp-1" title="${charName}">${charName}</span>
                    <span class="text-[10px] text-gray-400 uppercase tracking-widest">${role}</span>
                </div>
            </div>
            
            <!-- VA Side -->
            <div class="w-1/2 pl-2 flex justify-end items-center">
                ${vaHtml || '<span class="text-xs text-gray-500 italic">No VA data</span>'}
            </div>
        </div>
    `;
}

// Helper for Streaming Platform Button
function createStreamingButton(platform) {
    return `
        <a href="${platform.url}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600 border border-slate-600 hover:border-brand-500 px-4 py-2 rounded-lg text-sm text-white font-medium transition-all hover:shadow-lg hover:-translate-y-0.5">
            <i class="fa-solid fa-square-arrow-up-right text-brand-400"></i> ${platform.name}
        </a>
    `;
}
