package com.microservice.userservice.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RefreshScope  // ← Cho phép refresh config không cần restart
public class UserController {

    // Inject trực tiếp từ Config Server
    @Value("${app.welcome-message:Hello}")
    private String welcomeMessage;

    @Value("${app.max-login-attempts:5}")
    private int maxLoginAttempts;

    @GetMapping("/config-demo")
    public String getConfig() {
        return String.format(
                "Welcome: %s | Max Attempts: %d",
                welcomeMessage,
                maxLoginAttempts
        );
    }
}