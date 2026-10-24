package com.tastyburger.controller;

import com.tastyburger.dto.request.PaymentRequest;
import com.tastyburger.dto.response.ApiResponse;
import com.tastyburger.dto.response.PaymentResponse;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.validation.Valid;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${app.razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key-secret}")
    private String razorpayKeySecret;

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<PaymentResponse>> createOrder(@Valid @RequestBody PaymentRequest request) {
        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.getAmount() * 100);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_" + System.currentTimeMillis());
            com.razorpay.Order order = client.orders.create(orderRequest);
            PaymentResponse response = new PaymentResponse(order.get("id"), request.getAmount(), "INR");
            return ResponseEntity.ok(ApiResponse.ok("Payment order created", response));
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to create payment order: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Void>> verifyPayment(@RequestBody java.util.Map<String, String> body) {
        try {
            String razorpayOrderId = body.get("razorpayOrderId");
            String razorpayPaymentId = body.get("razorpayPaymentId");
            String razorpaySignature = body.get("razorpaySignature");

            String expectedSignature = org.apache.commons.codec.digest.HmacUtils
                    .hmacSha256Hex(razorpayKeySecret, razorpayOrderId + "|" + razorpayPaymentId);

            if (expectedSignature.equals(razorpaySignature)) {
                return ResponseEntity.ok(ApiResponse.ok("Payment verified successfully", null));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("Payment verification failed"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Verification error: " + e.getMessage()));
        }
    }
}
