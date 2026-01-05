import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import '../styles/MovieDetail.css';

const API_KEY = 'af5bbda93fd08d621f0a5f3e33cf0c0b';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [movie, setMovie] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerKey, setPlayerKey] = useState(0);

  useEffect(() => {
    fetchMovieDetails();
    fetchTrailers();
    fetchRecommendedMovies();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
      );
      const data = await response.json();
      setMovie(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setLoading(false);
    }
  };

  const fetchTrailers = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`
      );
      const data = await response.json();
      const videoTrailers = data.results.filter(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      setTrailers(videoTrailers);
      if (videoTrailers.length > 0) {
        setSelectedTrailer(videoTrailers[0]);
      }
    } catch (error) {
      console.error('Error fetching trailers:', error);
    }
  };

  const fetchRecommendedMovies = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&page=1`
      );
      const data = await response.json();
      if (data.results) {
        // Limit to 10 recommended movies
        setRecommendedMovies(data.results.slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching recommended movies:', error);
    }
  };

  const handleRecommendedClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWishlistClick = async () => {
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

  const handleBack = () => {
    navigate(-1);
  };

  const handleTrailerChange = (trailer) => {
    setSelectedTrailer(trailer);
    setPlayerKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-container">
        <h2>Movie not found</h2>
        <button onClick={handleBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="movie-detail-container">
      <button className="back-button" onClick={handleBack}>
        ← Back
      </button>

      {/* Main Content Layout - Player on left, Recommendations on right */}
      <div className="detail-main-layout">
        {/* Left Side - Video Player */}
        <div className="player-sidebar-layout">
          <div className="player-section">
            {selectedTrailer ? (
              <div className="video-wrapper">
                <iframe
                  key={playerKey}
                  className="video-player"
                  src={`https://www.youtube.com/embed/${selectedTrailer.key}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedTrailer.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div
                className="video-placeholder"
                style={{
                  backgroundImage: movie.backdrop_path
                    ? `url(${BACKDROP_BASE_URL}${movie.backdrop_path})`
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <div className="placeholder-content">
                  <h2>No trailer available</h2>
                  <p>Enjoy the movie backdrop</p>
                </div>
              </div>
            )}
          </div>

          {/* Movie Info Section */}
          <div className="movie-info-section">
            <div className="movie-info-content">
              <div className="movie-poster-section">
                <img
                  src={
                    movie.poster_path
                      ? `${IMG_BASE_URL}${movie.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image'
                  }
                  alt={movie.title}
                  className="detail-poster"
                />
              </div>
              <div className="movie-details">
                <div className="detail-title-section">
                  <h1 className="detail-title">{movie.title}</h1>
                  {currentUser && (
                    <button
                      className={`detail-wishlist-btn ${isInWishlist(movie.id) ? 'active' : ''}`}
                      onClick={handleWishlistClick}
                      title={isInWishlist(movie.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {isInWishlist(movie.id) ? '❤️' : '🤍'}
                    </button>
                  )}
                </div>
                <div className="detail-meta">
                  <span className="release-date">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                  <span className="runtime">{movie.runtime} min</span>
                  <span className="rating">
                    ⭐ {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
                  </span>
                </div>
                <p className="detail-overview">{movie.overview}</p>
                
                {movie.genres && movie.genres.length > 0 && (
                  <div className="genres">
                    <h3>Genres:</h3>
                    <div className="genre-tags">
                      {movie.genres.map((genre) => (
                        <span key={genre.id} className="genre-tag">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trailer Selection */}
                {trailers.length > 1 && (
                  <div className="trailer-selection">
                    <h3>Available Trailers:</h3>
                    <div className="trailer-buttons">
                      {trailers.map((trailer) => (
                        <button
                          key={trailer.id}
                          className={`trailer-btn ${
                            selectedTrailer?.id === trailer.id ? 'active' : ''
                          }`}
                          onClick={() => handleTrailerChange(trailer)}
                        >
                          {trailer.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Recommended Videos */}
        {recommendedMovies.length > 0 && (
          <div className="recommended-sidebar">
            <h3 className="recommended-title">More Videos</h3>
            <div className="recommended-list">
              {recommendedMovies.map((recMovie) => (
                <div
                  key={recMovie.id}
                  className="recommended-item"
                  onClick={() => handleRecommendedClick(recMovie.id)}
                >
                  <div className="recommended-thumbnail">
                    <img
                      src={
                        recMovie.poster_path
                          ? `${IMG_BASE_URL}${recMovie.poster_path}`
                          : 'https://via.placeholder.com/200x300?text=No+Image'
                      }
                      alt={recMovie.title}
                    />
                    <div className="recommended-play-overlay">
                      <span className="recommended-play-icon">▶</span>
                    </div>
                  </div>
                  <div className="recommended-info">
                    <h4 className="recommended-item-title">{recMovie.title}</h4>
                    <div className="recommended-meta">
                      <span className="recommended-year">
                        {recMovie.release_date
                          ? new Date(recMovie.release_date).getFullYear()
                          : 'N/A'}
                      </span>
                      <span className="recommended-rating">
                        ⭐ {recMovie.vote_average
                          ? recMovie.vote_average.toFixed(1)
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;

