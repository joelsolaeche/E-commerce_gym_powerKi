package com.uade.tpo.demo.controllers.auth;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.entity.UserService;
import com.uade.tpo.demo.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @Autowired
    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@AuthenticationPrincipal User user) {
        Order createdOrder = orderService.createOrder(user);
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getUserOrders(@AuthenticationPrincipal User user) {
        List<Order> orders = orderService.getOrders(user);
        return ResponseEntity.ok(orders);
    }
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId, @AuthenticationPrincipal User user) {
        boolean deleted = orderService.deleteOrder(orderId, user);
        if (!deleted) {
            return ResponseEntity.notFound().build();
    }
        return ResponseEntity.noContent().build();
}
}