package com.uade.tpo.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.demo.entity.OrderProduct;

public interface OrderProductRepository extends JpaRepository<OrderProduct, Long> {
}
