import { useState, useEffect } from "react";
import { useAuth } from "../../Context/useAuth";

function WishlistHeart({ productId }) {
  const { isAuthenticated, isInWishlist, toggleWishlist } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      isInWishlist(productId).then(setIsWishlisted);
    }
  }, [isAuthenticated, productId, isInWishlist]);

  if (!isAuthenticated) return null;

  const handleToggle = async (e) => {
    e.stopPropagation();
    const result = await toggleWishlist(productId);
    if (result.success) {
      setIsWishlisted(result.added);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="border-0 bg-transparent p-0"
      style={{ cursor: "pointer" }}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <i
        className={`bi ${isWishlisted ? "bi-heart-fill text-danger" : "bi-heart text-muted"}`}
        style={{ fontSize: "1.2rem" }}
      ></i>
    </button>
  );
}

export default WishlistHeart;
