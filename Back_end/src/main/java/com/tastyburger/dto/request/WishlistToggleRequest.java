package com.tastyburger.dto.request;

import jakarta.validation.constraints.NotNull;

public class WishlistToggleRequest {
    @NotNull(message = "Product ID is required")
    private Long productId;

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
}
