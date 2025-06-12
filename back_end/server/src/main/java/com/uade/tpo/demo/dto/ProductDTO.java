package com.uade.tpo.demo.dto;

import java.math.BigDecimal;

import com.uade.tpo.demo.entity.Product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal originalPrice;
    private BigDecimal price;
    private BigDecimal discountPercentage;
    private String image;
    private String category;
    private Long categoryId;
    private int stockQuantity;
    private Long sellerId;
    private String sellerName;
    
    // Static method to convert Product entity to ProductDTO
    public static ProductDTO fromEntity(Product product) {
        if (product == null) return null;
        
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .originalPrice(product.getOriginalPrice())
                .price(product.getPrice())
                .discountPercentage(product.getDiscountPercentage())
                .image(product.getImage())
                .category(product.getCategory() != null ? product.getCategory().getDescription() : null)
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .stockQuantity(product.getStockQuantity())
                .sellerId(product.getSeller() != null ? product.getSeller().getId() : null)
                .sellerName(product.getSeller() != null ? 
                    product.getSeller().getFirstName() + " " + product.getSeller().getLastName() : 
                    "Power Ki Gym")
                .build();
    }
    
    // Convert ProductDTO to Product entity (useful for updates)
    public Product toEntity() {
        Product product = new Product();
        product.setId(this.id);
        product.setName(this.name);
        product.setDescription(this.description);
        product.setOriginalPrice(this.originalPrice);
        product.setPrice(this.price);
        product.setDiscountPercentage(this.discountPercentage);
        product.setImage(this.image);
        product.setStockQuantity(this.stockQuantity);
        // Note: Category and Seller need to be set separately
        
        return product;
    }
} 