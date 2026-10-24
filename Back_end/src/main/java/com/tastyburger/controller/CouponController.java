package com.tastyburger.controller;

import com.tastyburger.dto.request.CouponValidateRequest;
import com.tastyburger.dto.response.ApiResponse;
import com.tastyburger.entity.Coupon;
import com.tastyburger.repository.CouponRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponRepository couponRepository;

    public CouponController(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Coupon>>> getCoupons() {
        List<Coupon> coupons = couponRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(coupons));
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validateCoupon(@Valid @RequestBody CouponValidateRequest request) {
        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndIsActiveTrue(request.getCode())
                .orElseThrow(() -> new com.tastyburger.exception.ResourceNotFoundException("Invalid coupon code"));

        if (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Coupon has expired"));
        }
        if (coupon.getMaxUses() > 0 && coupon.getCurrentUses() >= coupon.getMaxUses()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Coupon usage limit reached"));
        }
        if (request.getSubtotal() < coupon.getMinOrderValue()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Minimum order value not met. Required: ₹" + coupon.getMinOrderValue()));
        }

        int discount = 0;
        if ("flat".equalsIgnoreCase(coupon.getDiscountType())) {
            discount = coupon.getDiscountValue().intValue();
        } else {
            discount = request.getSubtotal() * coupon.getDiscountValue().intValue() / 100;
        }

        Map<String, Object> data = new HashMap<>();
        data.put("valid", true);
        data.put("discount", discount);
        data.put("code", coupon.getCode());
        data.put("description", coupon.getDescription());
        return ResponseEntity.ok(ApiResponse.ok("Coupon applied", data));
    }
}
