package com.uade.tpo.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.repository.CategoryRepository;
import com.uade.tpo.demo.repository.ProductRepository;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            seedCategories();
        }
        
        if (productRepository.count() == 0) {
            seedProducts();
        }
    }
    
    private void seedCategories() {
        List<String> categoryNames = Arrays.asList(
            "Suplementos", "Proteínas", "Accesorios", "Vitaminas",
            "Ropa", "Equipamiento", "Pre-entreno", "Post-entreno"
        );
        
        categoryNames.forEach(name -> {
            Category category = new Category();
            category.setDescription(name);
            categoryRepository.save(category);
        });
        
        System.out.println("Categories seeded successfully!");
    }
    
    private void seedProducts() {
        // Get categories
        List<Category> suplementos = categoryRepository.findByDescription("Suplementos");
        List<Category> proteinas = categoryRepository.findByDescription("Proteínas");
        List<Category> accesorios = categoryRepository.findByDescription("Accesorios");
        List<Category> vitaminas = categoryRepository.findByDescription("Vitaminas");
        List<Category> equipamiento = categoryRepository.findByDescription("Equipamiento");
        
        // Sample products
        if (!suplementos.isEmpty()) {
            Category suplementosCategory = suplementos.get(0);
            
            Product creatina = new Product();
            creatina.setName("Creatina Monohidratada");
            creatina.setDescription("Suplemento de creatina para aumentar la fuerza y el rendimiento muscular. 300g de polvo.");
            creatina.setOriginalPrice(new BigDecimal("39.99"));
            creatina.setPrice(new BigDecimal("34.99"));
            creatina.setDiscountPercentage(new BigDecimal("12.5"));
            creatina.setImage("https://m.media-amazon.com/images/I/61F4HUrEqeL._AC_SL1500_.jpg");
            creatina.setCategory(suplementosCategory);
            creatina.setStockQuantity(50);
            productRepository.save(creatina);
            
            Product bcaa = new Product();
            bcaa.setName("BCAA 2:1:1");
            bcaa.setDescription("Aminoácidos de cadena ramificada para mejorar la recuperación muscular. 200 cápsulas.");
            bcaa.setOriginalPrice(new BigDecimal("29.99"));
            bcaa.setPrice(new BigDecimal("29.99"));
            bcaa.setDiscountPercentage(BigDecimal.ZERO);
            bcaa.setImage("https://m.media-amazon.com/images/I/71IbMNXpczL._AC_SL1500_.jpg");
            bcaa.setCategory(suplementosCategory);
            bcaa.setStockQuantity(30);
            productRepository.save(bcaa);
        }
        
        if (!proteinas.isEmpty()) {
            Category proteinasCategory = proteinas.get(0);
            
            Product wheyProtein = new Product();
            wheyProtein.setName("Whey Protein Isolate");
            wheyProtein.setDescription("Proteína de suero aislada de alta calidad. 2kg de polvo sabor chocolate.");
            wheyProtein.setOriginalPrice(new BigDecimal("79.99"));
            wheyProtein.setPrice(new BigDecimal("69.99"));
            wheyProtein.setDiscountPercentage(new BigDecimal("12.5"));
            wheyProtein.setImage("https://m.media-amazon.com/images/I/71-FXBmpCtL._SL1500_.jpg");
            wheyProtein.setCategory(proteinasCategory);
            wheyProtein.setStockQuantity(25);
            productRepository.save(wheyProtein);
            
            Product casein = new Product();
            casein.setName("Caseína Micelar");
            casein.setDescription("Proteína de liberación lenta ideal para tomar antes de dormir. 1kg de polvo sabor vainilla.");
            casein.setOriginalPrice(new BigDecimal("49.99"));
            casein.setPrice(new BigDecimal("49.99"));
            casein.setDiscountPercentage(BigDecimal.ZERO);
            casein.setImage("https://m.media-amazon.com/images/I/61CYuMdJhIL._AC_SL1500_.jpg");
            casein.setCategory(proteinasCategory);
            casein.setStockQuantity(15);
            productRepository.save(casein);
        }
        
        if (!accesorios.isEmpty()) {
            Category accesoriosCategory = accesorios.get(0);
            
            Product bottle = new Product();
            bottle.setName("Shaker Premium");
            bottle.setDescription("Botella agitadora de 600ml con filtro anti-grumos para preparar tus batidos proteicos.");
            bottle.setOriginalPrice(new BigDecimal("14.99"));
            bottle.setPrice(new BigDecimal("12.99"));
            bottle.setDiscountPercentage(new BigDecimal("13.34"));
            bottle.setImage("https://m.media-amazon.com/images/I/61pXXK5gJwL._AC_SL1500_.jpg");
            bottle.setCategory(accesoriosCategory);
            bottle.setStockQuantity(100);
            productRepository.save(bottle);
            
            Product gloves = new Product();
            gloves.setName("Guantes de Entrenamiento");
            gloves.setDescription("Guantes de fitness con soporte para muñeca y palma acolchada. Talla L.");
            gloves.setOriginalPrice(new BigDecimal("24.99"));
            gloves.setPrice(new BigDecimal("24.99"));
            gloves.setDiscountPercentage(BigDecimal.ZERO);
            gloves.setImage("https://m.media-amazon.com/images/I/71vkZyZlDQL._AC_SL1500_.jpg");
            gloves.setCategory(accesoriosCategory);
            gloves.setStockQuantity(35);
            productRepository.save(gloves);
        }
        
        if (!vitaminas.isEmpty()) {
            Category vitaminasCategory = vitaminas.get(0);
            
            Product multivitamin = new Product();
            multivitamin.setName("Multivitamínico Deportivo");
            multivitamin.setDescription("Complejo multivitamínico diseñado para deportistas. 90 tabletas.");
            multivitamin.setOriginalPrice(new BigDecimal("34.99"));
            multivitamin.setPrice(new BigDecimal("29.99"));
            multivitamin.setDiscountPercentage(new BigDecimal("14.29"));
            multivitamin.setImage("https://m.media-amazon.com/images/I/71-lCuRLhKL._AC_SL1500_.jpg");
            multivitamin.setCategory(vitaminasCategory);
            multivitamin.setStockQuantity(40);
            productRepository.save(multivitamin);
        }
        
        if (!equipamiento.isEmpty()) {
            Category equipamientoCategory = equipamiento.get(0);
            
            Product dumbbell = new Product();
            dumbbell.setName("Mancuernas Ajustables 20kg");
            dumbbell.setDescription("Par de mancuernas ajustables de 2kg a 20kg cada una. Perfectas para entrenamiento en casa.");
            dumbbell.setOriginalPrice(new BigDecimal("199.99"));
            dumbbell.setPrice(new BigDecimal("179.99"));
            dumbbell.setDiscountPercentage(new BigDecimal("10.0"));
            dumbbell.setImage("https://m.media-amazon.com/images/I/71+8aYnF6RL._AC_SL1500_.jpg");
            dumbbell.setCategory(equipamientoCategory);
            dumbbell.setStockQuantity(10);
            productRepository.save(dumbbell);
        }
        
        System.out.println("Products seeded successfully!");
    }
} 