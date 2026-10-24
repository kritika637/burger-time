package com.tastyburger.controller;

import com.tastyburger.dto.response.ApiResponse;
import com.tastyburger.entity.*;
import com.tastyburger.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public OrderController(OrderRepository orderRepository, CartItemRepository cartItemRepository,
                           AddressRepository addressRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ApiResponse<Order>> createOrder(@RequestBody java.util.Map<String, Object> body) {
        User user = getCurrentUser();
        Long addressId = Long.valueOf(body.get("addressId").toString());
        String paymentId = body.get("paymentId") != null ? body.get("paymentId").toString() : null;

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new com.tastyburger.exception.ResourceNotFoundException("Address not found"));

        List<CartItem> cartItems = cartItemRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Cart is empty"));
        }

        Order order = new Order();
        order.setOrderId("ORD-" + System.currentTimeMillis());
        order.setUser(user);
        order.setAddress(address);
        order.setPaymentId(paymentId);
        order.setPaymentStatus(paymentId != null ? "COMPLETED" : "PENDING");

        int subtotal = 0;
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cartItems) {
            MenuItem m = ci.getMenuItem();
            OrderItem oi = new OrderItem(order, m, m.getTitle(), m.getImage(), m.getPrice(), ci.getQuantity());
            orderItems.add(oi);
            subtotal += m.getPrice() * ci.getQuantity();
        }

        int deliveryFee = subtotal >= 499 ? 0 : 40;
        int tax = (int) (subtotal * 0.05);
        order.setSubtotal(subtotal);
        order.setDeliveryFee(deliveryFee);
        order.setTax(tax);
        order.setTotal(subtotal + deliveryFee + tax);
        order.setItems(orderItems);
        orderRepository.save(order);
        cartItemRepository.deleteByUserId(user.getId());

        return ResponseEntity.ok(ApiResponse.ok("Order placed successfully", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getOrders() {
        User user = getCurrentUser();
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrder(@PathVariable Long id) {
        User user = getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new com.tastyburger.exception.ResourceNotFoundException("Order not found"));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new com.tastyburger.exception.UnauthorizedException("Not authorized");
        }
        return ResponseEntity.ok(ApiResponse.ok(order));
    }
}
