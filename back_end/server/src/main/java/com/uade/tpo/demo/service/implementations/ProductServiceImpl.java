package com.uade.tpo.demo.service.implementations;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.exceptions.ProductNotFoundException;
import com.uade.tpo.demo.repository.ProductRepository;
import com.uade.tpo.demo.service.interfaces.ProductService;

@Service
public class ProductServiceImpl implements ProductService {
    
    private static final Logger logger = Logger.getLogger(ProductServiceImpl.class.getName());

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private DataSource dataSource;

    @Override
    public Product createProduct(Product product, String imagePath) {
        if (imagePath != null && !imagePath.isEmpty()) {
            product.setImage(imagePath);
        }
        if (product.getOriginalPrice() == null) {
            throw new IllegalArgumentException("originalPrice no puede ser null");
        }
        return productRepository.save(product);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Producto no encontrado con ID: " + id));
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, Product productDetails, String imagePath) {
        Product product = getProductById(id);
    
        Optional.ofNullable(productDetails.getName()).ifPresent(product::setName);
        Optional.ofNullable(productDetails.getDescription()).ifPresent(product::setDescription);
        Optional.ofNullable(productDetails.getStockQuantity()).ifPresent(product::setStockQuantity);
        Optional.ofNullable(productDetails.getCategory()).ifPresent(product::setCategory);
        
        // Handle price updates
        if (productDetails.getOriginalPrice() != null) {
            product.setOriginalPrice(productDetails.getOriginalPrice());
        }
        
        if (productDetails.getPrice() != null) {
            product.setPrice(productDetails.getPrice());
        }
    
        // Apply discount if provided
        if (productDetails.getDiscountPercentage() != null && 
            productDetails.getDiscountPercentage().compareTo(BigDecimal.ZERO) != 0) {
            product.applyDiscount(productDetails.getDiscountPercentage());
        }
    
        if (imagePath != null && !imagePath.isEmpty()) {
            product.setImage(imagePath);
        }
    
        return productRepository.save(product);
    }
    
    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException("Producto no encontrado con ID: " + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    public Product updateProductImage(Long productId, String image) {
        Product product = getProductById(productId);
        product.setImage(image);
        return productRepository.save(product);
    }

    @Override
    public List<Product> getProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }
    
    @Override
    @Transactional
    public Product updateStockOnPurchase(Long productId, int quantity) throws ProductNotFoundException, IllegalArgumentException {
        // First log the current state
        System.out.println("==== STOCK UPDATE STARTED =====");
        System.out.println("Updating stock for product ID: " + productId);
        
        // Get the product to check current stock
        Product product = getProductById(productId);
        System.out.println("Product name: " + product.getName());
        System.out.println("Current stock: " + product.getStockQuantity());
        System.out.println("Quantity to reduce: " + quantity);
        
        // Check if there's enough stock
        if (product.getStockQuantity() < quantity) {
            String errorMessage = "Not enough stock for product: " + product.getName() + 
                ". Available: " + product.getStockQuantity() + 
                ", Requested: " + quantity;
            System.out.println("ERROR: " + errorMessage);
            throw new IllegalArgumentException(errorMessage);
        }
        
        // Calculate new stock
        int newStock = product.getStockQuantity() - quantity;
        System.out.println("New stock value calculated: " + newStock);
        
        // Try direct JDBC update first (more reliable than JPA in some environments)
        Connection conn = null;
        PreparedStatement stmt = null;
        boolean jdbcUpdateSuccessful = false;
        
        try {
            conn = dataSource.getConnection();
            String sql = "UPDATE products SET stock_quantity = ? WHERE id = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, newStock);
            stmt.setLong(2, productId);
            
            int rowsAffected = stmt.executeUpdate();
            
            if (rowsAffected > 0) {
                System.out.println("Direct SQL update succeeded. Rows affected: " + rowsAffected);
                jdbcUpdateSuccessful = true;
            } else {
                System.out.println("Direct SQL update failed. No rows affected.");
            }
        } catch (SQLException e) {
            System.out.println("SQL Error during direct update: " + e.getMessage());
            e.printStackTrace();
        } finally {
            // Close resources
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                System.out.println("Error closing SQL resources: " + e.getMessage());
            }
        }
        
        // If JDBC update failed, fall back to JPA
        if (!jdbcUpdateSuccessful) {
            System.out.println("Falling back to JPA update...");
            // Update the stock via JPA
            product.setStockQuantity(newStock);
            product = productRepository.save(product);
            System.out.println("JPA update completed. New stock from entity: " + product.getStockQuantity());
        }
        
        // Verify the change - read fresh from database
        Product verifiedProduct = productRepository.findById(productId)
            .orElseThrow(() -> new ProductNotFoundException("Product not found after stock update"));
        
        System.out.println("Verified stock after update: " + verifiedProduct.getStockQuantity());
        System.out.println("==== STOCK UPDATE COMPLETED =====");
        
        // Return the product with updated stock
        return verifiedProduct;
    }
}
