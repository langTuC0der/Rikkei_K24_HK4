package com.microservice.test_ai.controller;

import com.microservice.test_ai.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller for synchronous (blocking) chat requests with LLMs.
 */
@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*") // Allow frontend requests
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * POST /api/chat
     * Request body: { "message": "some prompt..." }
     * Response: JSON containing response and token stats.
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");

        if (userMessage == null || userMessage.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message không được trống"));
        }

        Map<String, Object> result = chatService.chatWithUsageTracking(userMessage);
        return ResponseEntity.ok(result);
    }

    /**
     * POST /api/chat/custom
     * Allows custom role settings.
     */
    @PostMapping("/custom")
    public ResponseEntity<String> customChat(@RequestBody ChatRequest request) {
        String response = chatService.chatWithRole(
            request.systemPrompt(),
            request.message()
        );
        return ResponseEntity.ok(response);
    }

    // ChatRequest record for strong binding
    public record ChatRequest(String message, String systemPrompt, float temperature) {}
}
