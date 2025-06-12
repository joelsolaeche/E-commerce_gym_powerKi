package com.uade.tpo.demo.service.interfaces;

import java.util.List;

import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.PaymentMethod;

public interface OrderService {
    Order createOrder(Long userId, List<Long> productIds, List<Integer> quantities, PaymentMethod paymentMethod);
    Order createOrderFromCart(Long cartId, PaymentMethod paymentMethod);
    Order getOrderById(Long id);
    List<Order> getAllOrders();
    List<Order> getOrdersByUserId(Long userId);
    void deleteOrder(Long id);
}
