package com.tastyburger.controller;

import com.tastyburger.dto.response.ApiResponse;
import com.tastyburger.entity.MenuItem;
import com.tastyburger.repository.MenuItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuItemRepository menuItemRepository;

    public MenuController(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItem>>> getMenu(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean diet) {
        List<MenuItem> items = menuItemRepository.findByFilters(category, diet);
        return ResponseEntity.ok(ApiResponse.ok(items));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItem>> getMenuItem(@PathVariable Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new com.tastyburger.exception.ResourceNotFoundException("Menu item not found"));
        return ResponseEntity.ok(ApiResponse.ok(item));
    }
}
