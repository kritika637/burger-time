package com.tastyburger.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CouponValidateRequest {
    @NotBlank(message = "Coupon code is required")
    private String code;

    @NotNull(message = "Subtotal is required")
    private Integer subtotal;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Integer getSubtotal() { return subtotal; }
    public void setSubtotal(Integer subtotal) { this.subtotal = subtotal; }
}
