# Aniverse

A modern, responsive web application for discovering and exploring anime. Built with Vanilla HTML, CSS (Tailwind), and JavaScript.

## 🚀 Features

- **Home Page**: Displays "Currently Airing" and "Top Rated" anime sections.
- **Search (Search the Universe)**: Real-time search functionality to find specific anime titles.
- **Anime Details**: Deep dive into specific shows. Includes:
  - Official posters and essential information (Score, Rank, Popularity, Status, etc.).
  - Main characters and Japanese Voice Actors.
  - Streaming official availability links (e.g., Netflix, Crunchyroll).
  - Trailer embed (with YouTube search fallback functionality).
- **Modern UI**: Dark-themed, glassmorphism design with responsive support for desktop and mobile devices.

---

## 🛠️ Built With

- **HTML5** & **CSS3**
- [Tailwind CSS (via CDN)](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI styling.
- **Vanilla JavaScript** (ES6+) - Fetch API, async/await, DOM manipulation.
- [FontAwesome](https://fontawesome.com/) - Icons.

---

## 📡 API Reference

This project is powered by the **[Jikan API (v4)](https://jikan.moe/)**, which is an unofficial, open-source REST API for MyAnimeList.net.

Endpoints used:
- `/top/anime`: Fetches the highest-rated anime.
- `/seasons/now`: Fetches anime airing in the current season.
- `/anime?q={query}`: Searches for anime by name.
- `/anime/{id}/full`: Retrieves comprehensive details for a specific anime, including scores, genres, and streaming platforms.
- `/anime/{id}/characters`: Retrieves character and staff information (used to filter out Japanese Voice Actors).

---

## ⚙️ How to Run Locally

Since this is a vanilla frontend project that uses `import`/`export` or basic JS structures, it's best run via a local server to avoid CORS or file protocol issues.

**Option 1: Using VS Code (Recommended)**
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
2. Open `index.html` in your editor.
3. Click "Go Live" in the bottom right corner.

**Option 2: Using Node.js**
1. Open terminal in the project directory.
2. Run `npx serve`.
3. Open the provided `localhost` link in your browser.

---

## ⚠️ Current Known Issues & Limitations

### 1. YouTube Trailer Embed (Error 153: Video player configuration error)
Some anime details contain an `embed_url` provided by the API that fails to play directly in the `<iframe>` on the Detail Page.

**Cause**: YouTube's strict cross-origin security policies (`X-Frame-Options: SAMEORIGIN`) and certain restrictive parameters sent by the API can cause the player to refuse connection when embedded on third-party sites without an official YouTube Data API key.

**Workaround / Fixes Applied**:
- The code uses a **URL Sanitization Function** (`js/details.js`) to strip messy parameters (like `autoplay=1`) and rebuild a clean URL using just the `youtube_id`.
- The `<iframe>` is configured with strict security headers (`referrerpolicy="strict-origin-when-cross-origin"`).
- **Fallback 1**: If the video still fails to load, a *"Having trouble? Watch directly on YouTube"* link is provided below the player.
- **Fallback 2**: If the API provides no video ID at all, the player is completely hidden and replaced with a button that constructs a direct YouTube Search URL (`https://www.youtube.com/results?search_query={title}+official+trailer`).

### 2. API Rate Limiting
The Jikan API is a free, public API. If you refresh the pages rapidly or open too many tabs at once, you may encounter `429 Too Many Requests` errors. The data will load normally once the cooldown period passes.
