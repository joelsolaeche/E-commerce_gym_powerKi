package com.uade.tpo.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class Product {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column
    private Integer stock;

    @OneToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    @JsonBackReference
    private Category category;

    @Column(name = "image_url")
    private String imageUrl;
}
