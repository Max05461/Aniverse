# Aniverse

A modern, responsive web application for discovering and exploring anime. Built with Vanilla HTML, CSS (Tailwind), and JavaScript.

##  Features

- **Home Page**: Displays "Currently Airing" and "Top Rated" anime sections.
- **Search (Search the Universe)**: Real-time search functionality to find specific anime titles.
- **Anime Details**: Deep dive into specific shows. Includes:
  - Official posters and essential information (Score, Rank, Popularity, Status, etc.).
  - Main characters and Japanese Voice Actors.
  - Streaming official availability links (e.g., Netflix, Crunchyroll).
  - Trailer embed (with YouTube search fallback functionality).
- **Modern UI**: Dark-themed, glassmorphism design with responsive support for desktop and mobile devices.

---

##  Built With

- **HTML5** & **CSS3**
- [Tailwind CSS (via CDN)](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI styling.
- **Vanilla JavaScript** (ES6+) - Fetch API, async/await, DOM manipulation.
- [FontAwesome](https://fontawesome.com/) - Icons.

---

##  API Reference

This project is powered by the **[Jikan API (v4)](https://jikan.moe/)**, which is an unofficial, open-source REST API for MyAnimeList.net.

Endpoints used:
- `/top/anime`: Fetches the highest-rated anime.
- `/seasons/now`: Fetches anime airing in the current season.
- `/anime?q={query}`: Searches for anime by name.
- `/anime/{id}/full`: Retrieves comprehensive details for a specific anime, including scores, genres, and streaming platforms.
- `/anime/{id}/characters`: Retrieves character and staff information (used to filter out Japanese Voice Actors).
