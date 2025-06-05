package com.uade.tpo.demo.controllers.app;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.exceptions.CategoryDuplicateException;
import com.uade.tpo.demo.service.interfaces.CategoryService;

@RestController
@RequestMapping("categories")
public class CategoriesController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/getAll")
    public ResponseEntity<List<Category>> getCategories() {
        List<Category> categoriesList = categoryService.getAllCategories();
        return ResponseEntity.ok(categoriesList);
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long categoryId) {
        Optional<Category> result = categoryService.getCategoryById(categoryId);
        return result.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category categoryRequest)
            throws CategoryDuplicateException {
        Category result = categoryService.createCategory(categoryRequest.getDescription());
        return ResponseEntity.created(URI.create("/categories/" + result.getId()))
                             .body(result);
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update/{categoryId}") 
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Category> updateCategory(@PathVariable Long categoryId, @RequestBody Category categoryRequest) {
        categoryRequest.setId(categoryId);
        Category updatedCategory = categoryService.updateCategory(categoryRequest);
        return ResponseEntity.ok(updatedCategory);
    }
}
