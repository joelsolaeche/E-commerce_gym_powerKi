package com.uade.tpo.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.uade.tpo.demo.entity.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.cartProducts")
    List<Cart> findAllWithCartProducts();

    @Query("SELECT c FROM Cart c WHERE c.id = :cartId")
    Cart findByCartId(@Param("cartId") Long cartId);

    Optional<Cart> findByUserId(Long userId);

}