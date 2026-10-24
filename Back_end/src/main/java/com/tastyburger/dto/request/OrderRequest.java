package com.tastyburger.dto.request;

import jakarta.validation.constraints.NotNull;

public class OrderRequest {
    @NotNull(message = "Address ID is required")
    private Long addressId;

    private String paymentId;

    @NotNull(message = "Items are required")
    private Object[] items;

    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }
    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
    public Object[] getItems() { return items; }
    public void setItems(Object[] items) { this.items = items; }
}
