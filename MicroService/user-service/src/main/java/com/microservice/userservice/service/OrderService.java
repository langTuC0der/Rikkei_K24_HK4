package com.microservice.userservice.service;

import com.microservice.userservice.dto.request.PaymentRequest;
import com.microservice.userservice.dto.response.PaymentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OrderService {

    @Autowired
    private RestTemplate restTemplate;

    public PaymentResponse processPayment(PaymentRequest request) {
        // ✅ ĐÚNG: Dùng tên service thay vì hardcoded URL
        // Eureka + LoadBalancer tự tìm địa chỉ thật
        String url = "http://payment-service/api/payments";

        return restTemplate.postForObject(url, request, PaymentResponse.class);
    }
}