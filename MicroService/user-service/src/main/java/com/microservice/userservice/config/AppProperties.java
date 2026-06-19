package com.microservice.userservice.config;


import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
@RefreshScope
public class AppProperties {

    private String welcomeMessage = "Hello";
    private int maxLoginAttempts = 5;
    private String featureFlag = "disabled";

    // Getters & Setters
    public String getWelcomeMessage() { return welcomeMessage; }
    public void setWelcomeMessage(String welcomeMessage) {
        this.welcomeMessage = welcomeMessage;
    }

    public int getMaxLoginAttempts() { return maxLoginAttempts; }
    public void setMaxLoginAttempts(int maxLoginAttempts) {
        this.maxLoginAttempts = maxLoginAttempts;
    }

    public String getFeatureFlag() { return featureFlag; }
    public void setFeatureFlag(String featureFlag) {
        this.featureFlag = featureFlag;
    }
}