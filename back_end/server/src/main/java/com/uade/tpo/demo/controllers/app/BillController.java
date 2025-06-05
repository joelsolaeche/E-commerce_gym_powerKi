package com.uade.tpo.demo.controllers.app;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.demo.entity.Bill;
import com.uade.tpo.demo.entity.PaymentMethod;
import com.uade.tpo.demo.service.interfaces.BillService;

@RestController
@RequestMapping("/bills")
public class BillController {

    @Autowired
    private BillService billService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Bill> getBillById(@PathVariable Long id) {
        Bill bill = billService.getBillById(id);
        return ResponseEntity.ok(bill);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Bill>> getAllBills() {
        List<Bill> bills = billService.getAllBills();
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/billsFromUser/{userId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<List<Bill>> getBillsByUserId(@PathVariable Long userId) {
        List<Bill> bills = billService.getBillsByUserId(userId);
        return ResponseEntity.ok(bills);
    }

    @PostMapping("/convertOrderToBill/{orderId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> convertOrderToBill(@PathVariable Long orderId, @RequestParam String paymentMethod) {
        if (!billService.isValidPaymentMethod(paymentMethod)) {
            return ResponseEntity.badRequest().body("Invalid payment method");
        }
        
        PaymentMethod method = PaymentMethod.valueOf(paymentMethod.toUpperCase());
        Bill bill = billService.convertOrderToBill(orderId, method); 
        return ResponseEntity.ok(bill);
    }

    @PostMapping("/markAsPaid/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Bill> markBillAsPaid(@PathVariable Long id) {
        Bill bill = billService.markBillAsPaid(id);
        return ResponseEntity.ok(bill);
    }
}