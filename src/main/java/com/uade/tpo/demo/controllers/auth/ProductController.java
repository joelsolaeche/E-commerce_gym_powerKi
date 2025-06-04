package com.uade.tpo.demo.controllers.auth;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService; // Usamos la interfaz ProductService

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAvailableProducts(); // Cambiado para usar el servicio
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.saveProduct(product); // Cambiado para usar el servicio
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id) // Cambiado para usar el servicio
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productService.getProductById(id).isPresent()) { // Cambiado para usar el servicio
            return ResponseEntity.notFound().build();
        }
        productService.deleteProduct(id); // Cambiado para usar el servicio
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productData) {
        return productService.getProductById(id) // Cambiado para usar el servicio
            .map(product -> {
                product.setName(productData.getName());
                product.setPrice(productData.getPrice());
                product.setStock(productData.getStock());
                product.setDescription(productData.getDescription());
                product.setCategory(productData.getCategory());
                product.setImageUrl(productData.getImageUrl());
                return ResponseEntity.ok(productService.saveProduct(product)); // Cambiado para usar el servicio
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
