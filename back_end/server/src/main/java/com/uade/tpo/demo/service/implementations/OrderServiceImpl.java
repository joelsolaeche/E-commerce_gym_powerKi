package com.uade.tpo.demo.service.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.Cart;
import com.uade.tpo.demo.entity.CartProduct;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.OrderProduct;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.repository.CartRepository;
import com.uade.tpo.demo.repository.OrderRepository;
import com.uade.tpo.demo.repository.ProductRepository;
import com.uade.tpo.demo.service.interfaces.OrderService;
import com.uade.tpo.demo.service.interfaces.UserService;

import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    @Transactional
    @Override
    public Order createOrder(Long userId, List<Long> productIds, List<Integer> quantities) {
        if (productIds.size() != quantities.size()) {
            throw new IllegalArgumentException("Product IDs and quantities must have the same size");
        }

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BigDecimal totalAmount = BigDecimal.ZERO;

        Order order = Order.builder()
                .user(user)
                .orderDate(new Date())
                .orderProducts(new HashSet<>())
                .totalAmount(totalAmount)
                .build();

        for (int i = 0; i < productIds.size(); i++) {
            Long productId = productIds.get(i);
            Integer quantity = quantities.get(i);

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderProduct orderProduct = OrderProduct.builder()
                    .order(order)
                    .product(product)
                    .quantity(quantity)
                    .build();

            order.getOrderProducts().add(orderProduct);

            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
        }

        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    @Transactional
    @Override
    public Order createOrderFromCart(Long cartId) {
        BigDecimal totalAmount = BigDecimal.ZERO;

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Order order = Order.builder()
                .user(cart.getUser())
                .orderDate(new Date())
                .orderProducts(new HashSet<>())
                .totalAmount(BigDecimal.ZERO)
                .build();

        for (CartProduct cartProduct : cart.getCartProducts()) {
            Product product = cartProduct.getProduct();
            int quantity = cartProduct.getQuantity();

            BigDecimal productTotalPrice = product.getPrice().multiply(BigDecimal.valueOf(quantity));

            OrderProduct orderProduct = OrderProduct.builder()
                    .order(order)
                    .product(product)
                    .quantity(quantity)
                    .build();

            order.getOrderProducts().add(orderProduct);

            totalAmount = totalAmount.add(productTotalPrice);
        }

        order.setTotalAmount(totalAmount);

        // Guardar la orden antes de retornar
        Order savedOrder = orderRepository.save(order);

        // Inicializar la colección lazy si es necesario
        if (savedOrder.getUser() != null && savedOrder.getUser().getCart() != null) {
            savedOrder.getUser().getCart().getCartProducts().size();
        }

        return savedOrder;
    }

    @Transactional
    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Transactional
    @Override
    public void deleteOrder(Long id) {
        Order order = getOrderById(id);

        // Restore product stock
        for (OrderProduct orderProduct : order.getOrderProducts()) {
            Product product = orderProduct.getProduct();
            int quantity = orderProduct.getQuantity();
            product.setStockQuantity(product.getStockQuantity() + quantity);
            productRepository.save(product);
        }

        // Delete the order
        orderRepository.deleteById(id);
    }
}
