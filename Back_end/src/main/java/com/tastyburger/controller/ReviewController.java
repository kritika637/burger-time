package com.tastyburger.controller;

import com.tastyburger.dto.response.ApiResponse;
import com.tastyburger.entity.Review;
import com.tastyburger.repository.ReviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Review>>> getReviews() {
        List<Review> reviews = reviewRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(ApiResponse.ok(reviews));
    }
}
