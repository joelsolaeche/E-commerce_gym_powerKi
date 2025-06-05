package com.uade.tpo.demo.controllers.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.service.interfaces.OrderService;
import com.uade.tpo.demo.service.interfaces.CartService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

    @PostMapping
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> orderData) {
        // For now, we'll create an order from the first cart
        List<com.uade.tpo.demo.entity.Cart> carts = cartService.getAllCarts();
        if (carts.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Order createdOrder = orderService.createOrderFromCart(carts.get(0).getId());
        return ResponseEntity.ok(createdOrder);
    }

    @PostMapping("/fromCart/{cartId}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Order> createOrderFromCart(@PathVariable Long cartId) {
        Order createdOrder = orderService.createOrderFromCart(cartId);
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/ordersFromUser/{userId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
