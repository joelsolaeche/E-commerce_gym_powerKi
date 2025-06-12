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
    
    /**
     * Updates the stock quantity for a product during purchase.
     * 
     * @param productId The ID of the product to update
     * @param quantity The quantity to reduce from the stock (positive value)
     * @return The updated product
     * @throws ProductNotFoundException if the product is not found
     * @throws IllegalArgumentException if there's not enough stock
     */
    Product updateStockOnPurchase(Long productId, int quantity) throws ProductNotFoundException, IllegalArgumentException;
}
