package com.uade.tpo.demo.repository;


import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByUser(User user);
}
