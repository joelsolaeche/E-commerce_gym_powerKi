package com.uade.tpo.demo.dto;

import lombok.Data;

@Data
public class AddProductToCartRequest {
    private Long cartId;
    private Long productId;
    private int quantity;
}
