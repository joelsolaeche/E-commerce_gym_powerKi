package com.uade.tpo.demo.controllers.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.entity.Cart;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.PaymentMethod;
import com.uade.tpo.demo.repository.UserRepository;
import com.uade.tpo.demo.service.interfaces.CartService;
import com.uade.tpo.demo.service.interfaces.OrderService;

import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:4002", "http://localhost:5173"})
public class TestController {

    private static final Logger logger = Logger.getLogger(TestController.class.getName());
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/db-status")
    public ResponseEntity<String> checkDatabaseConnection() {
        try {
            long userCount = userRepository.count();
            return ResponseEntity.ok("Database connection successful. User count: " + userCount);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Database connection failed: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public String allAccess() {
        return "Public Content.";
    }

    @GetMapping("/user")
    public String userAccess() {
        return "User Content.";
    }

    @GetMapping("/admin")
    public String adminAccess() {
        return "Admin Board.";
    }
    
    // NEW TEST ENDPOINT FOR CREATING ORDERS
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrderTest(@RequestBody Map<String, Object> orderData) {
        try {
            // Log the received data
            logger.info("TEST ENDPOINT: Received order data: " + orderData);
            
            // Extract userId from request data (required)
            if (!orderData.containsKey("userId")) {
                logger.warning("TEST ENDPOINT: Missing userId in request");
                return ResponseEntity.badRequest().body("Missing userId in request");
            }
            
            Long userId = Long.valueOf(orderData.get("userId").toString());
            logger.info("TEST ENDPOINT: Creating order for user ID: " + userId);
            
            // Get payment method if provided
            PaymentMethod paymentMethod = PaymentMethod.TARJETA_DEBITO; // Default
            if (orderData.containsKey("paymentMethod")) {
                try {
                    paymentMethod = PaymentMethod.valueOf(orderData.get("paymentMethod").toString());
                    logger.info("TEST ENDPOINT: Using payment method: " + paymentMethod);
                } catch (IllegalArgumentException e) {
                    logger.warning("TEST ENDPOINT: Invalid payment method: " + orderData.get("paymentMethod").toString());
                }
            }
            
            // Get the user's cart
            Cart userCart;
            try {
                userCart = cartService.getCartByUserId(userId);
                logger.info("TEST ENDPOINT: Found cart for user ID: " + userId);
            } catch (Exception e) {
                logger.warning("TEST ENDPOINT: Error finding cart for user: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.badRequest().body("Error finding cart: " + e.getMessage());
            }
            
            if (userCart == null) {
                logger.warning("TEST ENDPOINT: No cart found for user ID: " + userId);
                return ResponseEntity.badRequest().body("No cart found for user ID: " + userId);
            }
            
            // Create order from the user's cart with payment method
            Order createdOrder;
            try {
                createdOrder = orderService.createOrderFromCart(userCart.getId(), paymentMethod);
                logger.info("TEST ENDPOINT: Successfully created order from cart ID: " + userCart.getId());
            } catch (Exception e) {
                logger.severe("TEST ENDPOINT: Error creating order: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
            }
            
            return ResponseEntity.ok(createdOrder);
        } catch (Exception e) {
            logger.severe("TEST ENDPOINT: Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Unexpected error: " + e.getMessage());
        }
    }
} 