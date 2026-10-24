package com.tastyburger.repository;

import com.tastyburger.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Wishlist> findByUserIdAndMenuItemId(Long userId, Long menuItemId);
    boolean existsByUserIdAndMenuItemId(Long userId, Long menuItemId);
}
