package com.microservice.paymentservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private String paymentId;
    private String status; // SUCCESS, FAILED, PENDING
    private String transactionId;
    private String message;
    private double amount;
}
