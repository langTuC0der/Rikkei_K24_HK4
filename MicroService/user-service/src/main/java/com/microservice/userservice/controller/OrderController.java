package com.microservice.userservice.controller;

import com.microservice.userservice.dto.request.PaymentRequest;
import com.microservice.userservice.dto.response.PaymentResponse;
import com.microservice.userservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/payment")
    public PaymentResponse payOrder(@RequestBody PaymentRequest request) {
        return orderService.processPayment(request);
    }
}
