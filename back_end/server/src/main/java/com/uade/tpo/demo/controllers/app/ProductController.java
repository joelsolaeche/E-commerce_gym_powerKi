package com.uade.tpo.demo.controllers.app;

import java.math.BigDecimal;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.Optional;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.demo.dto.ProductDTO;
import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.service.interfaces.CategoryService;
import com.uade.tpo.demo.service.interfaces.FileUploadService;
import com.uade.tpo.demo.service.interfaces.ProductService;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.service.interfaces.UserService;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@RestController
@RequestMapping("/products")
public class ProductController {

    private static final Logger logger = Logger.getLogger(ProductController.class.getName());

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private FileUploadService fileUploadService;
    
    @Autowired
    private DataSource dataSource;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        List<ProductDTO> productDTOs = products.stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ProductDTO.fromEntity(product));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ProductDTO> createProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stockQuantity") Integer stockQuantity,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("originalPrice") BigDecimal originalPrice,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "imageUrl", required = false) String imageUrl,
            @RequestParam(value = "sellerId", required = false) Long sellerId) throws IOException {

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStockQuantity(stockQuantity);

        Category category = categoryService.getCategoryById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);

        // Handle image - prefer file upload over URL
        if (image != null && !image.isEmpty()) {
            logger.info("Processing uploaded image file for new product: " + name);
            String imagePath = fileUploadService.uploadImage(image);
            product.setImage(imagePath);
        } else if (imageUrl != null && !imageUrl.isEmpty()) {
            logger.info("Using provided image URL for new product: " + name);
            product.setImage(imageUrl);
        }
        
        product.setOriginalPrice(originalPrice);
        
        // If sellerId is provided, link the product to the seller
        if (sellerId != null) {
            try {
                // Find the user by ID
                Optional<User> seller = userService.getUserById(sellerId);
                if (seller.isPresent()) {
                    product.setSeller(seller.get());
                    logger.info("Product assigned to seller: " + seller.get().getFirstName() + " " + seller.get().getLastName());
                } else {
                    logger.warning("Seller not found with ID: " + sellerId);
                }
            } catch (Exception e) {
                logger.warning("Error setting seller: " + e.getMessage());
            }
        }

        Product createdProduct = productService.createProduct(product, product.getImage());

        return ResponseEntity.status(201).body(ProductDTO.fromEntity(createdProduct));
    }

    @PutMapping(value = "/update/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) BigDecimal price,
            @RequestParam(value = "originalPrice", required = false) BigDecimal originalPrice,
            @RequestParam(value = "discountPercentage", required = false) BigDecimal discountPercentage,
            @RequestParam(value = "stockQuantity", required = false) Integer stockQuantity,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "imageUrl", required = false) String imageUrl,
            @RequestParam(value = "sellerId", required = false) Long sellerId) {

        logger.info("Updating product ID: " + id);
        logger.info("Received parameters: name=" + name + ", description=" + 
                    (description != null ? description.substring(0, Math.min(20, description.length())) + "..." : null) + 
                    ", price=" + price + ", originalPrice=" + originalPrice + 
                    ", categoryId=" + categoryId + 
                    ", image present=" + (image != null) + ", imageUrl=" + imageUrl +
                    ", sellerId=" + sellerId);

        Product productDetails = productService.getProductById(id);

        if (name != null) productDetails.setName(name);
        if (description != null) productDetails.setDescription(description);
        
        // Handle price and discount separately
        if (originalPrice != null) productDetails.setOriginalPrice(originalPrice);
        if (price != null) productDetails.setPrice(price);
        
        // Apply discount if provided
        if (discountPercentage != null) productDetails.applyDiscount(discountPercentage);
        
        if (stockQuantity != null) productDetails.setStockQuantity(stockQuantity);

        if (categoryId != null) {
            Category category = categoryService.getCategoryById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            productDetails.setCategory(category);
        }

        // Handle image - prefer file upload over URL
        if (image != null && !image.isEmpty()) {
            try {
                logger.info("Processing uploaded image file for updating product ID: " + id);
                String imagePath = fileUploadService.uploadImage(image);
                productDetails.setImage(imagePath);
                logger.info("Image updated to: " + imagePath);
            } catch (IOException e) {
                logger.severe("Error uploading image for product ID: " + id + ", error: " + e.getMessage());
                return ResponseEntity.status(500).body(null);
            }
        } else if (imageUrl != null && !imageUrl.isEmpty()) {
            logger.info("Using provided image URL for updating product ID: " + id);
            productDetails.setImage(imageUrl);
            logger.info("Image URL updated to: " + imageUrl);
        }
        
        // If sellerId is provided, update the seller
        if (sellerId != null) {
            try {
                Optional<User> seller = userService.getUserById(sellerId);
                if (seller.isPresent()) {
                    productDetails.setSeller(seller.get());
                    logger.info("Product seller updated to: " + seller.get().getFirstName() + " " + seller.get().getLastName());
                } else {
                    logger.warning("Seller not found with ID: " + sellerId);
                }
            } catch (Exception e) {
                logger.warning("Error updating seller: " + e.getMessage());
            }
        }

        Product updatedProduct = productService.updateProduct(id, productDetails, productDetails.getImage());
        logger.info("Product updated successfully: " + updatedProduct.getId());

        return ResponseEntity.ok(ProductDTO.fromEntity(updatedProduct));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> getProductsByName(@RequestParam String name) {
        List<Product> products = productService.getProductsByName(name);
        List<ProductDTO> productDTOs = products.stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productDTOs);
    }

    @GetMapping("/byPrice")
    public ResponseEntity<List<ProductDTO>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice, 
            @RequestParam BigDecimal maxPrice) {
        List<Product> products = productService.getProductsByPriceRange(minPrice, maxPrice);
        List<ProductDTO> productDTOs = products.stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productDTOs);
    }
    
    @GetMapping("/byCategory/{categoryName}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable String categoryName) {
        List<Product> products = productService.getAllProducts().stream()
                .filter(p -> p.getCategory() != null && 
                        p.getCategory().getDescription().equalsIgnoreCase(categoryName))
                .collect(Collectors.toList());
                
        List<ProductDTO> productDTOs = products.stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(productDTOs);
    }
    
    // Testing endpoint for manual stock updates
    @PostMapping("/updateStock/{id}/{quantity}")
    public ResponseEntity<ProductDTO> updateStockManually(
            @PathVariable Long id,
            @PathVariable Integer quantity) {
        
        logger.info("Manual stock update request for product ID " + id + " with quantity " + quantity);
        
        try {
            // Get the current product to log before state
            Product currentProduct = productService.getProductById(id);
            logger.info("Current stock for product " + currentProduct.getName() + ": " + currentProduct.getStockQuantity());
            
            // Update the stock directly
            Product updatedProduct = productService.updateStockOnPurchase(id, quantity);
            logger.info("Stock updated. New stock: " + updatedProduct.getStockQuantity());
            
            // Verify the change persisted by fetching fresh from DB
            Product verifiedProduct = productService.getProductById(id);
            logger.info("Verified stock from fresh DB query: " + verifiedProduct.getStockQuantity());
            
            return ResponseEntity.ok(ProductDTO.fromEntity(verifiedProduct));
        } catch (Exception e) {
            logger.severe("Error updating stock: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // Testing endpoint for direct SQL stock updates
    @PostMapping("/directUpdateStock/{id}/{quantity}")
    public ResponseEntity<String> updateStockDirectly(
            @PathVariable Long id,
            @PathVariable Integer quantity) {
        
        logger.info("Direct SQL stock update request for product ID " + id + " with quantity " + quantity);
        
        try {
            // Get the current product to log before state
            Product currentProduct = productService.getProductById(id);
            logger.info("Current stock for product " + currentProduct.getName() + ": " + currentProduct.getStockQuantity());
            
            int newStockQuantity = currentProduct.getStockQuantity() - quantity;
            if (newStockQuantity < 0) {
                return ResponseEntity.badRequest().body("Not enough stock!");
            }
            
            // Direct SQL update via JDBC
            Connection conn = null;
            PreparedStatement stmt = null;
            
            try {
                conn = dataSource.getConnection();
                String sql = "UPDATE products SET stock_quantity = ? WHERE id = ?";
                stmt = conn.prepareStatement(sql);
                stmt.setInt(1, newStockQuantity);
                stmt.setLong(2, id);
                
                int rowsAffected = stmt.executeUpdate();
                
                if (rowsAffected > 0) {
                    logger.info("Direct SQL update successful! Rows affected: " + rowsAffected);
                    
                    // Verify the change by querying again
                    Product verifiedProduct = productService.getProductById(id);
                    logger.info("Verified stock after update: " + verifiedProduct.getStockQuantity());
                    
                    return ResponseEntity.ok("Stock updated successfully! New stock: " + verifiedProduct.getStockQuantity());
                } else {
                    logger.severe("Direct SQL update failed - no rows affected");
                    return ResponseEntity.status(500).body("Update failed - no rows were affected");
                }
            } finally {
                // Close resources
                try {
                    if (stmt != null) stmt.close();
                    if (conn != null) conn.close();
                } catch (SQLException e) {
                    logger.severe("Error closing SQL resources: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            logger.severe("Error in direct stock update: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
