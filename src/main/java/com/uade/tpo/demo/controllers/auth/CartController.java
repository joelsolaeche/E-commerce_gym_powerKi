package com.uade.tpo.demo.controllers.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.controllers.dto.AddToCartRequest;
import com.uade.tpo.demo.entity.Cart;
import com.uade.tpo.demo.service.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(request));
    }

    @GetMapping("/{userId}") //obtenercarrito
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @DeleteMapping("/{userId}/clear") //vaciar carritoentero
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}/product/{productId}")//quitar un producto
public ResponseEntity<Cart> removeProductFromCart(
        @PathVariable Long userId,
        @PathVariable Long productId) {
    return ResponseEntity.ok(cartService.removeProductFromCart(userId, productId));
}

}
