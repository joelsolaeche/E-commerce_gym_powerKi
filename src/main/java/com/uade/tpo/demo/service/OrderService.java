package com.uade.tpo.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.Cart;
import com.uade.tpo.demo.entity.EstadoOrden;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.OrderItem;
import com.uade.tpo.demo.entity.Role;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.repository.CartItemRepository;
import com.uade.tpo.demo.repository.CartRepository;
import com.uade.tpo.demo.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;


    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        CartItemRepository cartItemRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    public Order createOrder(User user) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        Order order = new Order();
        order.setUser(user);
        order.setFecha(LocalDateTime.now());
        order.setEstado(EstadoOrden.PENDIENTE);

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setCantidad(cartItem.getCantidad());
            return orderItem;
        }).collect(Collectors.toList());

        order.setItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        // Limpiar carrito
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    public List<Order> getOrders(User user) {
        return orderRepository.findByUserId(user.getId());
    }

    public boolean deleteOrder(Long orderId, User user) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            if (order.getUser().getId().equals(user.getId()) || user.getRole().equals(Role.ADMIN)) {
                orderRepository.delete(order);
                return true;
            }
        }
        return false;
    }
}

