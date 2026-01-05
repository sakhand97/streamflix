# StreamFlix - Netflix-like Streaming App

A beautiful, responsive React streaming application with a Netflix-inspired UI and YouTube-style video player.

## Features

- 🎬 Netflix-style browse page with featured hero section
- 📱 Fully responsive design for all devices
- 🎥 YouTube-style video player for trailers
- ✨ Smooth animations and transitions
- 🎨 Modern, attractive UI design
- ⚡ Fast loading with lazy images
- 🔍 Movie details with ratings, genres, and overviews

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## API

This app uses The Movie Database (TMDB) API:
- Popular movies: `https://api.themoviedb.org/3/movie/popular`
- Movie trailers: `https://api.themoviedb.org/3/movie/{id}/videos`

## Technologies Used

- React 18
- React Router DOM
- TMDB API
- YouTube Embed API
- CSS3 with animations

## Project Structure

```
src/
  ├── components/
  │   ├── Header.js      # Navigation header
  │   ├── Browse.js      # Main browse page
  │   └── MovieDetail.js # Movie detail & player page
  ├── styles/
  │   ├── index.css      # Global styles
  │   ├── App.css        # App-wide styles
  │   ├── Header.css     # Header styles
  │   ├── Browse.css     # Browse page styles
  │   └── MovieDetail.css # Detail page styles
  ├── App.js             # Main app component
  └── index.js           # Entry point
```

## Features in Detail

### Browse Page
- Hero section with featured movie
- Grid layout of popular movies
- Hover effects with play overlay
- Load more functionality
- Smooth animations

### Movie Detail Page
- YouTube-style video player
- Movie information display
- Genre tags
- Multiple trailer selection
- Responsive layout

## License

MIT


# streamflix
