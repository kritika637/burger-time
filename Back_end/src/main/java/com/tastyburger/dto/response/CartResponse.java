package com.tastyburger.dto.response;

import java.util.List;

public class CartResponse {
    private List<CartItemResponse> cartItems;
    private int subtotal;

    public CartResponse() {}
    public CartResponse(List<CartItemResponse> cartItems, int subtotal) {
        this.cartItems = cartItems;
        this.subtotal = subtotal;
    }

    public List<CartItemResponse> getCartItems() { return cartItems; }
    public void setCartItems(List<CartItemResponse> cartItems) { this.cartItems = cartItems; }
    public int getSubtotal() { return subtotal; }
    public void setSubtotal(int subtotal) { this.subtotal = subtotal; }

    public static class CartItemResponse {
        private Long id;
        private Long productId;
        private String title;
        private String image;
        private int price;
        private int quantity;
        private String category;

        public CartItemResponse() {}
        public CartItemResponse(Long id, Long productId, String title, String image, int price, int quantity, String category) {
            this.id = id;
            this.productId = productId;
            this.title = title;
            this.image = image;
            this.price = price;
            this.quantity = quantity;
            this.category = category;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }
        public int getPrice() { return price; }
        public void setPrice(int price) { this.price = price; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }
}
