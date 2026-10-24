package com.tastyburger.controller;

import com.tastyburger.dto.request.WishlistToggleRequest;
import com.tastyburger.dto.response.ApiResponse;
import com.tastyburger.entity.MenuItem;
import com.tastyburger.entity.User;
import com.tastyburger.entity.Wishlist;
import com.tastyburger.repository.MenuItemRepository;
import com.tastyburger.repository.UserRepository;
import com.tastyburger.repository.WishlistRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    public WishlistController(WishlistRepository wishlistRepository, MenuItemRepository menuItemRepository, UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Wishlist>>> getWishlist() {
        User user = getCurrentUser();
        List<Wishlist> wishlist = wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(wishlist));
    }

    @PostMapping("/toggle")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleWishlist(@Valid @RequestBody WishlistToggleRequest request) {
        User user = getCurrentUser();
        MenuItem menuItem = menuItemRepository.findById(request.getProductId())
                .orElseThrow(() -> new com.tastyburger.exception.ResourceNotFoundException("Menu item not found"));
        boolean exists = wishlistRepository.existsByUserIdAndMenuItemId(user.getId(), menuItem.getId());
        Map<String, Object> data = new HashMap<>();
        if (exists) {
            wishlistRepository.findByUserIdAndMenuItemId(user.getId(), menuItem.getId())
                    .ifPresent(wishlistRepository::delete);
            data.put("added", false);
        } else {
            wishlistRepository.save(new Wishlist(user, menuItem));
            data.put("added", true);
        }
        data.put("wishlist", wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
        return ResponseEntity.ok(ApiResponse.ok(exists ? "Removed from wishlist" : "Added to wishlist", data));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkWishlist(@PathVariable Long productId) {
        User user = getCurrentUser();
        boolean inWishlist = wishlistRepository.existsByUserIdAndMenuItemId(user.getId(), productId);
        Map<String, Boolean> data = new HashMap<>();
        data.put("isInWishlist", inWishlist);
        return ResponseEntity.ok(ApiResponse.ok(data));
    }
}
