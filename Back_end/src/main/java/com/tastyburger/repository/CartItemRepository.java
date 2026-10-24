package com.tastyburger.repository;

import com.tastyburger.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<CartItem> findByUserIdAndMenuItemId(Long userId, Long menuItemId);
    void deleteByUserId(Long userId);
    long countByUserId(Long userId);
}
