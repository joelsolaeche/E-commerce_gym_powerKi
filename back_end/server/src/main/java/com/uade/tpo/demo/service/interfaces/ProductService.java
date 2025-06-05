package com.uade.tpo.demo.service.interfaces;

import java.math.BigDecimal;
import java.util.List;

import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.exceptions.ProductNotFoundException;

public interface ProductService {
    Product createProduct(Product product, String imagePath); 

    Product getProductById(Long id) throws ProductNotFoundException;

    List<Product> getAllProducts();

    Product updateProduct(Long id, Product productDetails, String imagePath) throws ProductNotFoundException; // Accept image path as String

    void deleteProduct(Long id) throws ProductNotFoundException;

    Product updateProductImage(Long productId, String image);

    List<Product> getProductsByName(String name);
    
    List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
}
