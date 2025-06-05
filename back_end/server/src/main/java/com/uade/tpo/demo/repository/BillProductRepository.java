package com.uade.tpo.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.demo.entity.BillProduct;

public interface BillProductRepository extends JpaRepository<BillProduct, Long> {
}
