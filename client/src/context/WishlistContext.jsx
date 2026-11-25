
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import useAuth from "../hooks/useAuth";
import {
  getWishlistIds,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistServices";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  useEffect(() => {
    let isMounted = true;

    const fetchWishlistIds = async () => {
      if (!isAuthenticated || !user?._id) {
        setWishlistIds(new Set());
        return;
      }

      try {
        setLoading(true);

        const response = await getWishlistIds();

        if (isMounted) {
          setWishlistIds(new Set((response.data || []).map(String)));
        }
      } catch (error) {
        console.error("Unable to fetch wishlist:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWishlistIds();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?._id]);

  const isWishlisted = useCallback(
    (productId) => wishlistIds.has(String(productId)),
    [wishlistIds],
  );

  const toggleWishlist = async (productId) => {
    const id = String(productId);

    if (updatingIds.has(id)) return;

    setUpdatingIds((current) => new Set(current).add(id));

    try {
      if (wishlistIds.has(id)) {
        await removeFromWishlist(id);

        setWishlistIds((current) => {
          const updated = new Set(current);
          updated.delete(id);
          return updated;
        });
      } else {
        await addToWishlist(id);

        setWishlistIds((current) => new Set(current).add(id));
      }
    } finally {
      setUpdatingIds((current) => {
        const updated = new Set(current);
        updated.delete(id);
        return updated;
      });
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isWishlisted,
        toggleWishlist,
        updatingIds,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }

  return context;
};
