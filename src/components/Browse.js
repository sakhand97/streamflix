import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import '../styles/Browse.css';

const API_KEY = 'af5bbda93fd08d621f0a5f3e33cf0c0b';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

const Browse = () => {
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [featuredTrailer, setFeaturedTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    const newQuery = query || '';
    
    // Reset when search query changes
    if (newQuery !== searchQuery) {
      setSearchQuery(newQuery);
      setPage(1);
      setMovies([]);
      setFeaturedMovie(null);
    }
  }, [location.search, searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery, page);
    } else {
      fetchMovies(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  const fetchMovies = async (pageNum) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${pageNum}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        if (pageNum === 1) {
          setMovies(data.results);
          setFeaturedMovie(data.results[0]);
          // Fetch trailer for featured movie
          fetchFeaturedTrailer(data.results[0].id);
        } else {
          setMovies(prev => [...prev, ...data.results]);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const fetchSearchResults = async (query, pageNum) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${pageNum}`
      );
      if (!response.ok) {
        throw new Error('Failed to search movies');
      }
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        if (pageNum === 1) {
          setMovies(data.results);
          setFeaturedMovie(null);
        } else {
          setMovies(prev => [...prev, ...data.results]);
        }
      } else if (pageNum === 1) {
        setMovies([]);
        setFeaturedMovie(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error searching movies:', error);
      setLoading(false);
    }
  };

  const fetchFeaturedTrailer = async (movieId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
      );
      const data = await response.json();
      const videoTrailers = data.results.filter(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      if (videoTrailers.length > 0) {
        setFeaturedTrailer(videoTrailers[0]);
      }
    } catch (error) {
      console.error('Error fetching featured trailer:', error);
    }
  };

  const handlePlayClick = () => {
    if (featuredTrailer) {
      setShowTrailer(true);
    } else {
      // Navigate to movie detail page if no trailer
      navigate(`/movie/${featuredMovie.id}`);
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleWishlistClick = async (e, movie) => {
    e.stopPropagation();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      await toggleWishlist(movie);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert(error.message || 'Failed to update wishlist');
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && !featuredMovie) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="browse-container">
      {/* Trailer Modal */}
      {showTrailer && featuredTrailer && (
        <div className="trailer-modal" onClick={handleCloseTrailer}>
          <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="trailer-close-btn" onClick={handleCloseTrailer}>
              ×
            </button>
            <div className="trailer-modal-player">
              <iframe
                className="trailer-iframe"
                src={`https://www.youtube.com/embed/${featuredTrailer.key}?autoplay=1&rel=0&modestbranding=1`}
                title={featuredTrailer.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Featured Hero Section */}
      {featuredMovie && (
        <div
          className="hero-section"
          style={{
            backgroundImage: featuredMovie.backdrop_path
              ? `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${BACKDROP_BASE_URL}${featuredMovie.backdrop_path})`
              : 'linear-gradient(to bottom, rgba(20,20,20,0.9), rgba(0,0,0,0.95))',
          }}
        >
          <div className="hero-content">
            <h1 className="hero-title">{featuredMovie.title}</h1>
            <p className="hero-overview">
              {featuredMovie.overview || 'No description available.'}
            </p>
            <div className="hero-buttons">
              <button
                className="btn btn-play"
                onClick={handlePlayClick}
              >
                ▶ Play
              </button>
              <button
                className="btn btn-info"
                onClick={() => handleMovieClick(featuredMovie.id)}
              >
                ℹ More Info
              </button>
              {currentUser && (
                <button
                  className={`btn btn-wishlist ${isInWishlist(featuredMovie.id) ? 'active' : ''}`}
                  onClick={(e) => handleWishlistClick(e, featuredMovie)}
                  title={isInWishlist(featuredMovie.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isInWishlist(featuredMovie.id) ? '❤️' : '🤍'} Wishlist
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Movies Grid */}
      <div className="movies-section">
        <h2 className="section-title">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Movies'}
          {searchQuery && movies.length > 0 && (
            <span className="result-count"> ({movies.length} results)</span>
          )}
        </h2>
        {searchQuery && movies.length === 0 && !loading && (
          <div className="no-results">
            <p>No movies found for "{searchQuery}"</p>
            <p className="no-results-hint">Try searching for a different movie title</p>
          </div>
        )}
        <div className="movies-grid">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => handleMovieClick(movie.id)}
            >
              <div className="movie-poster">
                <img
                  src={
                    movie.poster_path
                      ? `${IMG_BASE_URL}${movie.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image'
                  }
                  alt={movie.title}
                  loading="lazy"
                />
                <div className="movie-overlay">
                  <button className="play-icon">▶</button>
                </div>
              </div>
              <div className="movie-info">
                <div className="movie-info-header">
                  <h3 className="movie-title">{movie.title}</h3>
                  {currentUser && (
                    <button
                      className={`wishlist-icon ${isInWishlist(movie.id) ? 'active' : ''}`}
                      onClick={(e) => handleWishlistClick(e, movie)}
                      title={isInWishlist(movie.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {isInWishlist(movie.id) ? '❤️' : '🤍'}
                    </button>
                  )}
                </div>
                <div className="movie-rating">
                  <span className="rating-star">⭐</span>
                  <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!loading && movies.length > 0 && (
          <button className="load-more-btn" onClick={loadMore}>
            Load More
          </button>
        )}
        {loading && (
          <div className="loading-more">
            <div className="loader-small"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;

