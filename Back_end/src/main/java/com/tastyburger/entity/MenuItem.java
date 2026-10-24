package com.tastyburger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "menu_items")
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String image;

    @Column
    private Double rating = 0.0;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "is_veg")
    private boolean isVeg = true;

    @Column(name = "is_available")
    private boolean isAvailable = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public MenuItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public boolean isVeg() { return isVeg; }
    public void setVeg(boolean isVeg) { this.isVeg = isVeg; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean isAvailable) { this.isAvailable = isAvailable; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
