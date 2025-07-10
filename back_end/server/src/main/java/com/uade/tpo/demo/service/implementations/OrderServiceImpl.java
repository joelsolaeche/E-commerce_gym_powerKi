package com.uade.tpo.demo.service.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.Cart;
import com.uade.tpo.demo.entity.CartProduct;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.OrderProduct;
import com.uade.tpo.demo.entity.PaymentMethod;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.repository.CartRepository;
import com.uade.tpo.demo.repository.OrderRepository;
import com.uade.tpo.demo.repository.ProductRepository;
import com.uade.tpo.demo.service.interfaces.OrderService;
import com.uade.tpo.demo.service.interfaces.ProductService;
import com.uade.tpo.demo.service.interfaces.UserService;

import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.logging.Logger;

@Service
public class OrderServiceImpl implements OrderService {
    
    private static final Logger logger = Logger.getLogger(OrderServiceImpl.class.getName());

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ProductService productService;

    @Autowired
    private CartRepository cartRepository;

    @Transactional
    @Override
    public Order createOrder(Long userId, List<Long> productIds, List<Integer> quantities, PaymentMethod paymentMethod) {
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
                .paymentMethod(paymentMethod)
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
            
            // Update product stock
            try {
                productService.updateStockOnPurchase(productId, quantity);
            } catch (Exception e) {
                logger.severe("Failed to update stock for product " + productId + ": " + e.getMessage());
                throw new RuntimeException("Failed to process order due to stock issues", e);
            }
        }

        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    @Transactional
    @Override
    public Order createOrderFromCart(Long cartId, PaymentMethod paymentMethod) {
        logger.info("============ CREATING ORDER FROM CART ============");
        logger.info("Cart ID: " + cartId + ", Payment Method: " + paymentMethod);
        
        BigDecimal totalAmount = BigDecimal.ZERO;

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        logger.info("Found cart for user ID: " + cart.getUser().getId());
        logger.info("Cart has " + cart.getCartProducts().size() + " products");

        Order order = Order.builder()
                .user(cart.getUser())
                .orderDate(new Date())
                .orderProducts(new HashSet<>())
                .totalAmount(BigDecimal.ZERO)
                .paymentMethod(paymentMethod)
                .build();
        
        // Process each cart item, update stock, and create order products
        for (CartProduct cartProduct : cart.getCartProducts()) {
            Product product = cartProduct.getProduct();
            int quantity = cartProduct.getQuantity();
            
            logger.info("Processing product: " + product.getId() + " - " + product.getName());
            logger.info("Quantity: " + quantity + ", Current stock: " + product.getStockQuantity());

            BigDecimal productTotalPrice = product.getPrice().multiply(BigDecimal.valueOf(quantity));

            OrderProduct orderProduct = OrderProduct.builder()
                    .order(order)
                    .product(product)
                    .quantity(quantity)
                    .build();

            order.getOrderProducts().add(orderProduct);
            totalAmount = totalAmount.add(productTotalPrice);
            
            // Update product stock
            try {
                logger.info("Calling updateStockOnPurchase for product " + product.getId() + " with quantity " + quantity);
                Product updatedProduct = productService.updateStockOnPurchase(product.getId(), quantity);
                logger.info("Stock updated successfully. New stock: " + updatedProduct.getStockQuantity());
            } catch (Exception e) {
                logger.severe("Failed to update stock for product " + product.getId() + ": " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Failed to process order due to stock issues", e);
            }
        }

        order.setTotalAmount(totalAmount);
        logger.info("Total order amount before save: " + order.getTotalAmount());
        // Save the order
        Order savedOrder = orderRepository.save(order);
        logger.info("Order saved with total amount: " + savedOrder.getTotalAmount());

        logger.info("Order saved with ID: " + savedOrder.getId());
        
        // Clear the cart after successful order creation
        logger.info("Clearing cart items");
        cart.getCartProducts().clear();
        cartRepository.save(cart);
        logger.info("Cart cleared and saved");

        // Initialize lazy collections if needed
        if (savedOrder.getUser() != null && savedOrder.getUser().getCart() != null) {
            savedOrder.getUser().getCart().getCartProducts().size();
        }
        
        logger.info("============ ORDER CREATION COMPLETED ============");
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
