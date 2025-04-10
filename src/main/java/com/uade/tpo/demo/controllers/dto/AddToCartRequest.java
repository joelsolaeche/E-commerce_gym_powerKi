package com.uade.tpo.demo.controllers.dto;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Long userId;
    private Long productId;
    private int cantidad;
}

