package com.uade.tpo.demo.controllers.app;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.service.interfaces.CategoryService;
import com.uade.tpo.demo.service.interfaces.FileUploadService;
import com.uade.tpo.demo.service.interfaces.ProductService;

import java.io.IOException;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private FileUploadService fileUploadService;

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Product> createProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stockQuantity") Integer stockQuantity,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("originalPrice") BigDecimal originalPrice,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStockQuantity(stockQuantity);

        Category category = categoryService.getCategoryById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);

        if (image != null && !image.isEmpty()) {
            String imagePath = fileUploadService.uploadImage(image);
            product.setImage(imagePath);
        }

        
        product.setOriginalPrice(originalPrice);

        Product createdProduct = productService.createProduct(product, product.getImage());

        return ResponseEntity.status(201).body(createdProduct);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) BigDecimal price,
            @RequestParam(value = "discountPercentage", required = false) BigDecimal discountPercentage,
            @RequestParam(value = "stockQuantity", required = false) Integer stockQuantity,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        Product productDetails = productService.getProductById(id);

        if (name != null) productDetails.setName(name);
        if (description != null) productDetails.setDescription(description);
        if (price != null) productDetails.setOriginalPrice(price);
        if (discountPercentage != null) productDetails.applyDiscount(discountPercentage);
        if (stockQuantity != null) productDetails.setStockQuantity(stockQuantity);

        if (categoryId != null) {
            Category category = categoryService.getCategoryById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            productDetails.setCategory(category);
        }

        if (image != null && !image.isEmpty()) {
            try {
                String imagePath = fileUploadService.uploadImage(image);
                productDetails.setImage(imagePath);
            } catch (IOException e) {
                return ResponseEntity.status(500).body(null);
            }
        }

        Product updatedProduct = productService.updateProduct(id, productDetails, productDetails.getImage());

        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Product>> getProductsByName(@RequestParam String name) {
        List<Product> products = productService.getProductsByName(name);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/byPrice")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Product>> getProductsByPriceRange(@RequestParam BigDecimal minPrice, @RequestParam BigDecimal maxPrice) {
        List<Product> products = productService.getProductsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }
}
