import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    const wishlistRef = collection(db, 'users', currentUser.uid, 'wishlist');
    
    const unsubscribe = onSnapshot(wishlistRef, (snapshot) => {
      const movies = [];
      snapshot.forEach((doc) => {
        movies.push({ id: doc.id, ...doc.data() });
      });
      setWishlist(movies);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addToWishlist = async (movie) => {
    if (!currentUser) {
      throw new Error('You must be logged in to add to wishlist');
    }

    const movieRef = doc(db, 'users', currentUser.uid, 'wishlist', movie.id.toString());
    await setDoc(movieRef, {
      ...movie,
      addedAt: new Date().toISOString()
    });
  };

  const removeFromWishlist = async (movieId) => {
    if (!currentUser) {
      throw new Error('You must be logged in to remove from wishlist');
    }

    const movieRef = doc(db, 'users', currentUser.uid, 'wishlist', movieId.toString());
    await deleteDoc(movieRef);
  };

  const isInWishlist = (movieId) => {
    return wishlist.some((movie) => movie.id === movieId || movie.id?.toString() === movieId?.toString());
  };

  const toggleWishlist = async (movie) => {
    if (!currentUser) {
      throw new Error('You must be logged in to manage wishlist');
    }

    if (isInWishlist(movie.id)) {
      await removeFromWishlist(movie.id);
    } else {
      await addToWishlist(movie);
    }
  };

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist
  };
}



