package com.uade.tpo.demo.service;



import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.CartItem;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.entity.Cart;
import com.uade.tpo.demo.controllers.dto.AddToCartRequest;
import com.uade.tpo.demo.repository.CartItemRepository;
import com.uade.tpo.demo.repository.CartRepository;
import com.uade.tpo.demo.repository.ProductRepository;
import com.uade.tpo.demo.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;

    @Transactional
    public Cart addToCart(AddToCartRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart nuevoCarrito = new Cart();
            nuevoCarrito.setUser(user);
            return cartRepository.save(nuevoCarrito);
        });

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProduct(product);
        item.setCantidad(request.getCantidad());

        cartItemRepository.save(item);

        cart.getItems().add(item);
        return cartRepository.save(cart);
    }

    public  Cart getCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return cartRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Carrito no encontrado"));
    }

    public void clearCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public Cart removeProductFromCart(Long userId, Long productId) {
        Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));
    
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
    
        return cartRepository.save(cart);
    }
    
}

