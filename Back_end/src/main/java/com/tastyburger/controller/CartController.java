package com.tastyburger.controller;

import com.tastyburger.dto.request.CartAddRequest;
import com.tastyburger.dto.response.ApiResponse;
import com.tastyburger.dto.response.CartResponse;
import com.tastyburger.entity.CartItem;
import com.tastyburger.entity.MenuItem;
import com.tastyburger.entity.User;
import com.tastyburger.repository.CartItemRepository;
import com.tastyburger.repository.MenuItemRepository;
import com.tastyburger.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartItemRepository cartItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    public CartController(CartItemRepository cartItemRepository, MenuItemRepository menuItemRepository, UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    private CartResponse buildCartResponse(User user) {
        List<CartItem> cartItems = cartItemRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<CartResponse.CartItemResponse> response = new ArrayList<>();
        int subtotal = 0;
        for (CartItem ci : cartItems) {
            MenuItem m = ci.getMenuItem();
            response.add(new CartResponse.CartItemResponse(
                    ci.getId(), m.getId(), m.getTitle(), m.getImage(), m.getPrice(), ci.getQuantity(), m.getCategory()));
            subtotal += m.getPrice() * ci.getQuantity();
        }
        return new CartResponse(response, subtotal);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart() {
        User user = getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok(buildCartResponse(user)));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(@Valid @RequestBody CartAddRequest request) {
        User user = getCurrentUser();
        MenuItem menuItem = menuItemRepository.findById(request.getProductId())
                .orElseThrow(() -> new com.tastyburger.exception.ResourceNotFoundException("Menu item not found"));
        Optional<CartItem> existing = cartItemRepository.findByUserIdAndMenuItemId(user.getId(), menuItem.getId());
        if (existing.isPresent()) {
            CartItem ci = existing.get();
            ci.setQuantity(ci.getQuantity() + (request.getQuantity() != null ? request.getQuantity() : 1));
            cartItemRepository.save(ci);
        } else {
            CartItem ci = new CartItem(user, menuItem, request.getQuantity() != null ? request.getQuantity() : 1);
            cartItemRepository.save(ci);
        }
        return ResponseEntity.ok(ApiResponse.ok("Added to cart", buildCartResponse(user)));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateQuantity(@PathVariable Long productId, @RequestBody Map<String, Integer> body) {
        User user = getCurrentUser();
        CartItem ci = cartItemRepository.findByUserIdAndMenuItemId(user.getId(), productId)
                .orElseThrow(() -> new com.tastyburger.exception.ResourceNotFoundException("Item not in cart"));
        int qty = body.getOrDefault("quantity", 1);
        if (qty <= 0) {
            cartItemRepository.delete(ci);
        } else {
            ci.setQuantity(qty);
            cartItemRepository.save(ci);
        }
        return ResponseEntity.ok(ApiResponse.ok("Cart updated", buildCartResponse(user)));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(@PathVariable Long productId) {
        User user = getCurrentUser();
        CartItem ci = cartItemRepository.findByUserIdAndMenuItemId(user.getId(), productId)
                .orElseThrow(() -> new com.tastyburger.exception.ResourceNotFoundException("Item not in cart"));
        cartItemRepository.delete(ci);
        return ResponseEntity.ok(ApiResponse.ok("Removed from cart", buildCartResponse(user)));
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<ApiResponse<Void>> clearCart() {
        User user = getCurrentUser();
        cartItemRepository.deleteByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Cart cleared", null));
    }
}
