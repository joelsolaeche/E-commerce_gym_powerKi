package com.uade.tpo.demo.service.interfaces;

import java.util.List;

import com.uade.tpo.demo.entity.Bill;
import com.uade.tpo.demo.entity.PaymentMethod;

public interface BillService {
    Bill convertOrderToBill(Long orderId, PaymentMethod paymentMethod);
    Bill getBillById(Long id);
    List<Bill> getAllBills();
    List<Bill> getBillsByUserId(Long userId);
    boolean isValidPaymentMethod(String paymentMethod); 
    public Bill markBillAsPaid(Long orderId);
}
