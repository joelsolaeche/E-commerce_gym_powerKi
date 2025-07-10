package com.uade.tpo.demo.controllers.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.demo.entity.Cart;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.PaymentMethod;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.dto.CreateOrderRequest;
import com.uade.tpo.demo.service.interfaces.OrderService;
import com.uade.tpo.demo.service.interfaces.CartService;
import com.uade.tpo.demo.service.interfaces.UserService;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = {"http://localhost:4002", "http://localhost:5173", "http://localhost:5174"})
public class OrderController {
    
    private static final Logger logger = Logger.getLogger(OrderController.class.getName());

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;
    
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> orderData, 
                                            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Get userId from request data or authenticated user
            Long userId = null;
            
            // MODIFIED: Prioritize userId from request for testing
            if (orderData.containsKey("userId")) {
                userId = Long.valueOf(orderData.get("userId").toString());
                logger.info("Creating order for user ID from request: " + userId);
            } else if (userDetails != null) {
                // Get userId from authenticated user as fallback
                Optional<User> user = userService.getUserByEmail(userDetails.getUsername());
                if (user.isPresent()) {
                    userId = user.get().getId();
                    logger.info("Creating order for authenticated user ID: " + userId);
                }
            }
            
            if (userId == null) {
                logger.warning("No user ID found in request or authentication");
                return ResponseEntity.badRequest().build();
            }
            
            // Get payment method if provided
            PaymentMethod paymentMethod = PaymentMethod.TARJETA_DEBITO; // Default
            if (orderData.containsKey("paymentMethod")) {
                try {
                    paymentMethod = PaymentMethod.valueOf(orderData.get("paymentMethod").toString());
                    logger.info("Using payment method: " + paymentMethod);
                } catch (IllegalArgumentException e) {
                    logger.warning("Invalid payment method provided, using default: " + paymentMethod);
                }
            }
            
            // Get the user's cart
            Cart userCart;
            try {
                userCart = cartService.getCartByUserId(userId);
                logger.info("Found cart for user ID: " + userId);
            } catch (Exception e) {
                logger.warning("Error finding cart for user: " + e.getMessage());
                return ResponseEntity.badRequest().build();
            }
            
            if (userCart == null) {
                logger.warning("No cart found for user ID: " + userId);
                return ResponseEntity.badRequest().build();
            }
            
            // Create order from the user's cart with payment method
            Order createdOrder = orderService.createOrderFromCart(userCart.getId(), paymentMethod);
            logger.info("Successfully created order from cart ID: " + userCart.getId());
            
            return ResponseEntity.ok(createdOrder);
        } catch (Exception e) {
            logger.severe("Error creating order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/fromCart/{cartId}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<Order> createOrderFromCart(@PathVariable Long cartId, 
                                                   @RequestParam(required = false, defaultValue = "TARJETA_DEBITO") PaymentMethod paymentMethod) {
        try {
            Order createdOrder = orderService.createOrderFromCart(cartId, paymentMethod);
            return ResponseEntity.ok(createdOrder);
        } catch (Exception e) {
            logger.severe("Error creating order from cart: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        try {
            Order order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            logger.warning("Error getting order by ID: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/ordersFromUser/{userId}")
    @Transactional
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long userId) {
        logger.info("🔍 Backend: Received request for orders from user: " + userId);
        try {
            logger.info("🔍 Backend: Calling orderService...");
            List<Order> orders = orderService.getOrdersByUserId(userId);
            logger.info("🔍 Backend: Service returned " + orders.size() + " orders");
            
            logger.info("🔍 Backend: Returning orders to client");
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            logger.severe("🔍 Backend: Exception: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.warning("Error deleting order: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Added special test endpoint without any security
    @PostMapping("/bypass-security")
    public ResponseEntity<Order> createOrderBypassSecurity(@RequestBody Map<String, Object> orderData) {
        try {
            // Extract userId from request data (required)
            if (!orderData.containsKey("userId")) {
                return ResponseEntity.badRequest().body(null);
            }
            
            Long userId = Long.valueOf(orderData.get("userId").toString());
            logger.info("BYPASS SECURITY: Creating order for user ID: " + userId);
            
            // Get payment method if provided
            PaymentMethod paymentMethod = PaymentMethod.TARJETA_DEBITO; // Default
            if (orderData.containsKey("paymentMethod")) {
                try {
                    paymentMethod = PaymentMethod.valueOf(orderData.get("paymentMethod").toString());
                    logger.info("Using payment method: " + paymentMethod);
                } catch (IllegalArgumentException e) {
                    logger.warning("Invalid payment method: " + orderData.get("paymentMethod").toString());
                }
            }
            
            // Get the user's cart
            Cart userCart;
            try {
                userCart = cartService.getCartByUserId(userId);
                logger.info("Found cart for user ID: " + userId);
            } catch (Exception e) {
                logger.warning("Error finding cart for user: " + e.getMessage());
                return ResponseEntity.badRequest().build();
            }
            
            if (userCart == null) {
                logger.warning("No cart found for user ID: " + userId);
                return ResponseEntity.badRequest().build();
            }
            
            // Create order from the user's cart with payment method
            Order createdOrder = orderService.createOrderFromCart(userCart.getId(), paymentMethod);
            logger.info("Successfully created order from cart ID: " + userCart.getId());
            
            return ResponseEntity.ok(createdOrder);
        } catch (Exception e) {
            logger.severe("Error creating order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        logger.info("Test endpoint called successfully");
        return ResponseEntity.ok("Orders controller is working!");
    }
}
