package com.uade.tpo.demo.service.interfaces;

import java.util.List;

import com.uade.tpo.demo.entity.Order;

public interface OrderService {
    Order createOrder(Long userId, List<Long> productIds, List<Integer> quantities);
    Order createOrderFromCart(Long cartId);
    Order getOrderById(Long id);
    List<Order> getAllOrders();
    List<Order> getOrdersByUserId(Long userId);
    void deleteOrder(Long id);
}
