package com.uade.tpo.demo;

import static org.junit.jupiter.api.Assertions.*;

import java.lang.reflect.Field;

import org.junit.jupiter.api.Test;

import com.uade.tpo.demo.entity.User;

import jakarta.persistence.Column;

class UserEntityTest {

    @Test
    void emailHasUniqueConstraint() throws Exception {
        Field emailField = User.class.getDeclaredField("email");
        Column column = emailField.getAnnotation(Column.class);
        assertNotNull(column, "email field should have @Column annotation");
        assertTrue(column.unique(), "email field should be marked unique");
    }

    @Test
    void lastNameIsNotUnique() throws Exception {
        Field lastNameField = User.class.getDeclaredField("lastName");
        Column column = lastNameField.getAnnotation(Column.class);
        if (column != null) {
            assertFalse(column.unique(), "lastName field should not be unique");
        }
    }
}
