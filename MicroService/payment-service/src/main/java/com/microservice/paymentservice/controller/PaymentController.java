package com.microservice.paymentservice.controller;

import com.microservice.paymentservice.dto.request.PaymentRequest;
import com.microservice.paymentservice.dto.response.PaymentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Value("${server.port}")
    private String port;

    @PostMapping
    public PaymentResponse processPayment(@RequestBody PaymentRequest request) {
        String paymentId = "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String message = "Payment of " + request.getAmount() + " processed successfully by payment-service running on port " + port;

        return new PaymentResponse(
                paymentId,
                "SUCCESS",
                transactionId,
                message,
                request.getAmount()
        );
    }
}
