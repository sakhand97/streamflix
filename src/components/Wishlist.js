import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import '../styles/Wishlist.css';

const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const Wishlist = () => {
  const { currentUser } = useAuth();
  const { wishlist, loading, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-empty">
          <h2>Please sign in to view your wishlist</h2>
          <button onClick={() => navigate('/login')} className="auth-redirect-btn">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-container">
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-container">
        <h1 className="wishlist-title">My Wishlist</h1>
        <div className="wishlist-empty">
          <div className="empty-icon">🤍</div>
          <h2>Your wishlist is empty</h2>
          <p>Start adding movies you want to watch later!</p>
          <button onClick={() => navigate('/')} className="browse-btn">
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">My Wishlist ({wishlist.length})</h1>
      <div className="wishlist-grid">
        {wishlist.map((movie) => (
          <div
            key={movie.id}
            className="wishlist-card"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <div className="wishlist-poster">
              <img
                src={
                  movie.poster_path
                    ? `${IMG_BASE_URL}${movie.poster_path}`
                    : 'https://via.placeholder.com/500x750?text=No+Image'
                }
                alt={movie.title}
              />
              <div className="wishlist-overlay">
                <button
                  className="wishlist-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(movie);
                  }}
                  title="Remove from wishlist"
                >
                  ❌
                </button>
              </div>
            </div>
            <div className="wishlist-info">
              <h3 className="wishlist-movie-title">{movie.title}</h3>
              {movie.vote_average && (
                <div className="wishlist-rating">
                  ⭐ {movie.vote_average.toFixed(1)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;



