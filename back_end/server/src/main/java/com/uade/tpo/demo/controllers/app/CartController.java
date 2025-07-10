package com.uade.tpo.demo.controllers.app;

import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.demo.dto.AddProductToCartRequest;
import com.uade.tpo.demo.dto.UpdateCartItemRequest;
import com.uade.tpo.demo.entity.Cart;
import com.uade.tpo.demo.service.interfaces.CartService;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Cart> getCartByUserId(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        if (cart == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(cart);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Cart> getCurrentUserCart() {
        // For now, just return all carts endpoint for admin
        // This should be fixed to get the current user's cart based on authentication
        List<Cart> carts = cartService.getAllCarts();
        if (carts.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(carts.get(0));
    }

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<String> addToCart(@RequestBody AddProductToCartRequest request) {
        try {
            cartService.addProductToCart(request.getCartId(), request.getProductId(), request.getQuantity());
            return ResponseEntity.ok("Product added to cart");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    @PostMapping("/update")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<String> updateCartItemQuantity(@RequestBody UpdateCartItemRequest request) {
        try {
            // Remove the product from cart and add it with new quantity
            cartService.removeProductFromCart(request.getCartId(), request.getProductId());
            cartService.addProductToCart(request.getCartId(), request.getProductId(), request.getQuantity());
            
            return ResponseEntity.ok("Cart item quantity updated");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    @DeleteMapping("/remove/{productId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<String> removeFromCart(@PathVariable Long productId) {
        try {
            // Get cart ID from authentication or request
            // For now, we'll use the first cart available
            List<Cart> carts = cartService.getAllCarts();
            if (carts.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No cart found");
            }
            Long cartId = carts.get(0).getId();
            
            cartService.removeProductFromCart(cartId, productId);
            return ResponseEntity.ok("Product removed from cart");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    @DeleteMapping("/clear")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Void> clearCart() {
        // Get cart ID from authentication or request
        // For now, we'll use the first cart available
        List<Cart> carts = cartService.getAllCarts();
        if (!carts.isEmpty()) {
            cartService.deleteCart(carts.get(0).getId());
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/clear")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<String> clearCartProducts(@RequestBody Map<String, Long> request) {
        try {
            Long cartId = request.get("cartId");
            if (cartId == null) {
                return ResponseEntity.badRequest().body("Cart ID is required");
            }
            
            cartService.clearCartProducts(cartId);
            return ResponseEntity.ok("Cart products cleared successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error clearing cart: " + e.getMessage());
        }
    }
}
