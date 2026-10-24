package com.tastyburger.repository;

import com.tastyburger.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategory(String category);

    @Query("SELECT m FROM MenuItem m WHERE (:category IS NULL OR m.category = :category) AND (:isVeg IS NULL OR m.isVeg = :isVeg) AND m.isAvailable = true")
    List<MenuItem> findByFilters(@Param("category") String category, @Param("isVeg") Boolean isVeg);
}
