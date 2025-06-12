package com.uade.tpo.demo.dto;

import com.uade.tpo.demo.entity.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private Long userId;
    private PaymentMethod paymentMethod;
    private List<OrderProductRequest> products;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderProductRequest {
        private Long productId;
        private Integer quantity;
    }
} 