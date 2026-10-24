package com.tastyburger.dto.request;

import jakarta.validation.constraints.NotNull;

public class PaymentRequest {
    @NotNull(message = "Amount is required")
    private Integer amount;

    public Integer getAmount() { return amount; }
    public void setAmount(Integer amount) { this.amount = amount; }
}
