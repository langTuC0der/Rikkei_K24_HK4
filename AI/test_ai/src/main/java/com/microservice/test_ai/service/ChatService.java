package com.microservice.test_ai.service;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Service to interact with the LLM model in a loosely-coupled way.
 */
@Service
public class ChatService {

    private final ChatModel chatModel;

    // ChatModel is auto-injected by Spring based on the configured starter
    public ChatService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    /**
     * Basic chat call with a single user message.
     */
    public String simpleChat(String userMessage) {
        Prompt prompt = new Prompt(userMessage);
        ChatResponse response = chatModel.call(prompt);
        return response.getResult().getOutput().getText();
    }

    /**
     * Chat call with System Prompt (role setup) and User Message.
     */
    public String chatWithRole(String systemPrompt, String userMessage) {
        List<Message> messages = List.of(
            new SystemMessage(systemPrompt),
            new UserMessage(userMessage)
        );
        Prompt prompt = new Prompt(messages);
        ChatResponse response = chatModel.call(prompt);
        return response.getResult().getOutput().getText();
    }

    /**
     * Chat call with usage tracking metadata (tokens information).
     */
    public Map<String, Object> chatWithUsageTracking(String userMessage) {
        ChatResponse response = chatModel.call(new Prompt(userMessage));
        var usage = response.getMetadata().getUsage();

        return Map.of(
            "content",       response.getResult().getOutput().getText(),
            "inputTokens",   usage.getPromptTokens() != null ? usage.getPromptTokens() : 0,
            "outputTokens",  usage.getCompletionTokens() != null ? usage.getCompletionTokens() : 0,
            "totalTokens",   usage.getTotalTokens() != null ? usage.getTotalTokens() : 0
        );
    }
}
