package com.uade.tpo.demo.service.interfaces;

import java.util.List;

import com.uade.tpo.demo.entity.Cart;

public interface CartService {
    Cart createCart(Long userId);

    Cart getCartById(Long id);

    Cart getCartByUserId(Long userId);

    List<Cart> getAllCarts();

    void addProductToCart(Long cartId, Long productId, int quantity);

    void removeProductFromCart(Long cartId, Long productId);

    void deleteCart(Long id);
}
