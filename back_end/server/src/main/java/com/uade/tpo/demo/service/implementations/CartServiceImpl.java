package com.uade.tpo.demo.service.implementations;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.demo.entity.Cart;
import com.uade.tpo.demo.entity.CartProduct;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.repository.CartRepository;
import com.uade.tpo.demo.repository.ProductRepository;
import com.uade.tpo.demo.repository.UserRepository;
import com.uade.tpo.demo.service.interfaces.CartService;
import com.uade.tpo.demo.service.interfaces.UserService;

import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Optional;
import java.util.HashSet;
import java.util.logging.Logger;

@Service
public class CartServiceImpl implements CartService {
    
    private static final Logger logger = Logger.getLogger(CartServiceImpl.class.getName());

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Cart createCart(Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = Cart.builder()
                .user(user)
                .cartProducts(new java.util.ArrayList<>())
                .build();

        return cartRepository.save(cart);
    }

    @Transactional
    public void addProductToCart(Long cartId, Long productId, int quantity) {
        // Fetch the cart along with its products
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found"));
    
        // Check for existing CartProduct
        Optional<CartProduct> existingCartProductOpt = cart.getCartProducts().stream()
                .filter(cp -> cp.getProduct().getId().equals(productId))
                .findFirst();
    
        if (existingCartProductOpt.isPresent()) {
            CartProduct cartProduct = existingCartProductOpt.get();
            int newQuantity = cartProduct.getQuantity() + quantity;
    
            Product product = cartProduct.getProduct();
            // Check if there's enough stock
            if (product.getStockQuantity() < newQuantity) {
                throw new RuntimeException("Not enough stock for Product ID: " + productId);
            }

            if (newQuantity < 1) {
                throw new RuntimeException("Product Quantity can't be less than 1. Remove the product if needed.");
            }

            cartProduct.setQuantity(newQuantity);
            logger.info("Updated quantity for product " + productId + " in cart " + cartId + " to " + newQuantity);
        } else {
            // If it doesn't exist, fetch the product
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new EntityNotFoundException("Product not found"));
                    
            if (quantity < 1) {
                throw new RuntimeException("Product Quantity can't be less than 1. Remove the product if needed.");
            }

            // Check stock availability for the new product
            if (product.getStockQuantity() < quantity) {
                throw new RuntimeException("Not enough stock for Product ID: " + productId);
            }
    
            // Create new CartProduct and add it to the cart's product set
            CartProduct newCartProduct = CartProduct.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .build();
    
            cart.getCartProducts().add(newCartProduct);
            logger.info("Added product " + productId + " to cart " + cartId + " with quantity " + quantity);
        }
    
        // Save the updated cart
        cartRepository.save(cart);
    }    
    
    @Transactional
    public void removeProductFromCart(Long cartId, Long productId) {
        // Fetch the cart
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found"));

        // Find the CartProduct associated with the given productId
        CartProduct cartProduct = cart.getCartProducts().stream()
                .filter(cp -> cp.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Product not found in the cart"));

        // Remove the CartProduct from the cart
        cart.getCartProducts().remove(cartProduct);
        logger.info("Removed product " + productId + " from cart " + cartId);

        // Save the updated cart
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void clearCartProducts(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
            .orElseThrow(() -> new EntityNotFoundException("Cart not found"));
        
        // Initialize collection to avoid lazy loading issues
        cart.getCartProducts().size();
        
        // Clear all products from cart but keep the cart itself
        cart.getCartProducts().clear();
        cartRepository.save(cart);
        
        logger.info("Cleared all products from cart " + cartId);
    }

    @Override
    @Transactional
    public void deleteCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
            .orElseThrow(() -> new EntityNotFoundException("Cart not found"));
        // Initialize collection
        cart.getCartProducts().size();
        cartRepository.delete(cart);
        logger.info("Deleted cart " + cartId);
    }
    
    @Override
    public Cart getCartById(Long id) {
        return cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    
    @Override
    @Transactional
    public Cart getCartByUserId(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("Cart not found"));
        // Force initialization of the collection
        cart.getCartProducts().size();
        return cart;
    }
    
    @Override
    public List<Cart> getAllCarts() {
        return cartRepository.findAllWithCartProducts();
    }    

}
