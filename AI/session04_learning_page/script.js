/* --- DATA STORE FOR CODE SNIPPETS --- */
const CODE_DATABASE = {
  lesson1: {
    'AgentConfig.java': `package com.ai.function_calling.config;

import org.springframework.ai.chat.memory.ChatMemoryRepository;
import org.springframework.ai.chat.memory.InMemoryChatMemoryRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AgentConfig {

    // Sử dụng InMemoryChatMemoryRepository để quản lý lịch sử trò chuyện trong bộ nhớ
    @Bean
    public ChatMemoryRepository chatMemoryRepository() {
        return new InMemoryChatMemoryRepository();
    }
}`,
    'AgentChatService.java': `package com.ai.function_calling.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class AgentChatService {

    private final ChatClient chatClient;

    public AgentChatService(@Qualifier("ollamaChatModel") org.springframework.ai.chat.model.ChatModel chatModel, ChatMemory chatMemory) {
        // Khởi tạo ChatClient fluent API
        this.chatClient = ChatClient.builder(chatModel)
                .defaultSystem("Bạn là trợ lý ảo lịch sự của khách sạn Rikkei Luxury Hotel. Hãy giúp khách hàng đặt phòng.")
                // Thêm Advisor bằng Builder để tự động xử lý Chat Memory
                .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                .build();
    }

    public String chat(String chatId, String message) {
        return this.chatClient.prompt()
                .user(message)
                // Truyền ChatMemory.CONVERSATION_ID để phân biệt các phiên chat của các user khác nhau
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID, chatId))
                .call()
                .content();
    }
}`,
    'AgentChatController.java': `package com.ai.function_calling.controller;

import com.ai.function_calling.service.AgentChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/agent")
public class AgentChatController {

    private final AgentChatService agentChatService;

    public AgentChatController(AgentChatService agentChatService) {
        this.agentChatService = agentChatService;
    }

    /**
     * POST /api/v1/agent/chat
     * Body: { "chatId": "user-session-123", "message": "Tôi tên là Chinh" }
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String chatId = request.get("chatId");
        String message = request.get("message");

        if (chatId == null || message == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Thiếu tham số 'chatId' hoặc 'message'"));
        }

        String response = agentChatService.chat(chatId, message);
        return ResponseEntity.ok(Map.of("chatId", chatId, "response", response));
    }
}`
  },
  lesson2: {
    'CurrencyModel.java': `package com.ai.function_calling.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;

public class CurrencyModel {

    // JsonPropertyDescription rất quan trọng để LLM hiểu mục đích của các biến truyền vào
    public record Request(
            @JsonPropertyDescription("Số tiền cần chuyển đổi, ví dụ: 100")
            double amount,
            @JsonPropertyDescription("Mã tiền tệ gốc (3 ký tự viết hoa), ví dụ: USD, EUR, JPY")
            String from,
            @JsonPropertyDescription("Mã tiền tệ đích cần chuyển sang, ví dụ: VND, USD")
            String to
    ) {}

    public record Response(
            double resultAmount,
            String message
    ) {}
}`,
    'CurrencyExchangeFunction.java': `package com.ai.function_calling.service;

import com.ai.function_calling.model.CurrencyModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.util.function.Function;

@Slf4j
@Configuration
public class CurrencyExchangeFunction {

    @Bean
    // Description cung cấp ngữ cảnh cho AI biết KHI NÀO nên kích hoạt hàm này
    @Description("Quy đổi tỷ giá tiền tệ thực tế giữa các quốc gia như USD, EUR, VND")
    public Function<CurrencyModel.Request, CurrencyModel.Response> exchangeCurrency() {
        return request -> {
            log.info("🎯 Java Tool [exchangeCurrency] được gọi bởi AI với tham số: {} từ {} sang {}", 
                    request.amount(), request.from(), request.to());
            
            double rate = 1.0;
            String from = request.from().toUpperCase();
            String to = request.to().toUpperCase();

            // Mock tỷ giá đơn giản để demo
            if (from.equals("USD") && to.equals("VND")) rate = 25450.0;
            else if (from.equals("EUR") && to.equals("VND")) rate = 27200.0;
            else if (from.equals("VND") && to.equals("USD")) rate = 1.0 / 25450.0;

            double result = request.amount() * rate;
            String msg = String.format("Đã chuyển đổi thành công %s %s thành %s %s với tỷ giá %s", 
                    request.amount(), from, result, to, rate);

            return new CurrencyModel.Response(result, msg);
        };
    }
}`,
    'CurrencyChatService.java': `package com.ai.function_calling.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class CurrencyChatService {

    private final ChatClient chatClient;

    public CurrencyChatService(@Qualifier("ollamaChatModel") org.springframework.ai.chat.model.ChatModel chatModel) {
        this.chatClient = ChatClient.builder(chatModel)
                .defaultSystem("Bạn là trợ lý hỗ trợ chuyển đổi tiền tệ và tính toán tài chính.")
                .build();
    }

    public String askAi(String promptText) {
        return this.chatClient.prompt()
                .user(promptText)
                // Kích hoạt function bằng cách truyền tên Bean của Function vào đây
                .toolNames("exchangeCurrency")
                .call()
                .content();
    }
}`
  },
  lesson3: {
    'CustomerSupportService.java': `package com.ai.function_calling.service;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.Map;

@Slf4j
@Service
public class CustomerSupportService {

    // Giả lập database khách hàng
    private final Map<String, String> customerDb = Map.of(
        "C001", "Nguyễn Minh Chinh - Hạng: VIP - Điểm tích lũy: 1200",
        "C002", "Trần Quốc Anh - Hạng: Gold - Điểm tích lũy: 450",
        "C003", "Lê Thu Thảo - Hạng: Member - Điểm tích lũy: 50"
    );

    @Tool(description = "Tra cứu thông tin chi tiết của khách hàng bao gồm hạng thành viên và điểm tích lũy bằng ID khách hàng")
    public String getCustomerDetails(String customerId) {
        log.info("🎯 Thực thi Tool [getCustomerDetails] cho ID: {}", customerId);
        return customerDb.getOrDefault(customerId, "Không tìm thấy thông tin khách hàng có ID: " + customerId);
    }

    @Tool(description = "Tính số điểm tích lũy cần thiết để nâng hạng thành viên tiếp theo")
    public String calculatePointsToUpgrade(String customerId) {
        log.info("🎯 Thực thi Tool [calculatePointsToUpgrade] cho ID: {}", customerId);
        if (!customerDb.containsKey(customerId)) {
            return "Không tìm thấy khách hàng";
        }
        
        String info = customerDb.get(customerId);
        if (info.contains("VIP")) {
            return "Khách hàng đã đạt hạng cao nhất (VIP)";
        } else if (info.contains("Gold")) {
            return "Cần thêm 550 điểm để nâng lên hạng VIP";
        } else {
            return "Cần thêm 400 điểm để nâng lên hạng Gold";
        }
    }
}`,
    'CustomerAgentService.java': `package com.ai.function_calling.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class CustomerAgentService {

    private final ChatClient chatClient;

    public CustomerAgentService(
            @Qualifier("ollamaChatModel") org.springframework.ai.chat.model.ChatModel chatModel,
            CustomerSupportService customerSupportService) {
        
        // Đăng ký trực tiếp instance Service vào ChatClient qua defaultTools
        this.chatClient = ChatClient.builder(chatModel)
                .defaultSystem("Bạn là trợ lý chăm sóc khách hàng chuyên nghiệp. Hãy tra cứu và trả lời các câu hỏi về thành viên.")
                .defaultTools(customerSupportService) // Spring AI tự quét các method đánh dấu @Tool trong service này
                .build();
    }

    public String handleCustomerQuery(String query) {
        return this.chatClient.prompt()
                .user(query)
                .call()
                .content();
    }
}`
  },
  lesson4: {
    'Booking.java': `package com.ai.function_calling.model;

import java.time.LocalDate;

public record Booking(
    String bookingId,
    String customerName,
    String roomType,
    LocalDate checkInDate,
    int nights,
    double totalPrice,
    String status
) {}`,
    'HotelBookingService.java': `package com.ai.function_calling.service;

import com.ai.function_calling.model.Booking;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class HotelBookingService {

    // Database giả lập lưu trữ trạng thái phòng và thông tin đặt phòng
    private final Map<String, Integer> roomInventory = new ConcurrentHashMap<>();
    private final Map<String, Booking> bookingDb = new ConcurrentHashMap<>();

    public HotelBookingService() {
        // Cấu hình số phòng trống ban đầu
        roomInventory.put("STANDARD", 3);
        roomInventory.put("DELUXE", 2);
        roomInventory.put("SUITE", 1);
    }

    @Tool(description = "Kiểm tra số lượng phòng trống của một loại phòng cụ thể (STANDARD, DELUXE, SUITE)")
    public String checkRoomAvailability(String roomType) {
        String type = roomType.toUpperCase().trim();
        log.info("🎯 Tool [checkRoomAvailability] chạy cho loại phòng: {}", type);
        
        if (!roomInventory.containsKey(type)) {
            return "Loại phòng không hợp lệ. Chúng tôi chỉ có phòng STANDARD, DELUXE, SUITE.";
        }
        
        int available = roomInventory.get(type);
        return String.format("Phòng loại %s hiện còn trống %s phòng.", type, available);
    }

    @Tool(description = "Tính toán tổng chi phí đặt phòng dựa trên loại phòng (STANDARD: 900k/đêm, DELUXE: 1500k/đêm, SUITE: 3000k/đêm) và số đêm lưu trú")
    public String calculateTotalPrice(String roomType, int nights) {
        String type = roomType.toUpperCase().trim();
        log.info("🎯 Tool [calculateTotalPrice] chạy cho loại phòng: {}, số đêm: {}", type, nights);
        
        double pricePerNight;
        switch (type) {
            case "STANDARD" -> pricePerNight = 900000;
            case "DELUXE" -> pricePerNight = 1500000;
            case "SUITE" -> pricePerNight = 3000000;
            default -> {
                return "Không thể tính giá do loại phòng không hợp lệ.";
            }
        }
        
        double total = pricePerNight * nights;
        return String.format("Tổng chi phí cho %d đêm phòng %s là %,.0f VND.", nights, type, total);
    }

    @Tool(description = "Thực hiện đặt phòng và lưu thông tin vào hệ thống. Yêu cầu đầy đủ tên khách hàng, loại phòng, ngày nhận phòng (định dạng yyyy-MM-dd) và số đêm lưu trú.")
    public String createBooking(String customerName, String roomType, String checkInDateStr, int nights) {
        String type = roomType.toUpperCase().trim();
        log.info("🎯 Tool [createBooking] chạy cho: Khách hàng={}, Phòng={}, Ngày={}, Số đêm={}", 
                customerName, type, checkInDateStr, nights);

        // 1. Kiểm tra phòng trống
        int available = roomInventory.getOrDefault(type, 0);
        if (available <= 0) {
            return String.format("Rất tiếc, loại phòng %s đã hết phòng trống. Không thể tiến hành đặt phòng.", type);
        }

        // 2. Tính tiền đặt phòng
        double pricePerNight = type.equals("STANDARD") ? 900000 : (type.equals("DELUXE") ? 1500000 : 3000000);
        double total = pricePerNight * nights;

        // 3. Khởi tạo và ghi nhận Booking
        String bookingId = "BK-" + (1000 + new Random().nextInt(9000));
        
        Booking booking = new Booking(
                bookingId,
                customerName,
                type,
                LocalDate.parse(checkInDateStr),
                nights,
                total,
                "CONFIRMED"
        );

        bookingDb.put(bookingId, booking);
        roomInventory.put(type, available - 1);

        log.info("✅ Đặt phòng thành công! ID Đặt chỗ: {}", bookingId);

        return String.format("Đặt phòng thành công! Mã đặt chỗ của bạn là: %s. Khách hàng: %s, Loại phòng: %s, Nhận phòng ngày: %s, Số đêm: %d. Tổng số tiền phải thanh toán: %,.0f VND.",
                bookingId, customerName, type, checkInDateStr, nights, total);
    }
}`,
    'HotelAgentService.java': `package com.ai.function_calling.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class HotelAgentService {

    private final ChatClient chatClient;

    public HotelAgentService(
            @Qualifier("ollamaChatModel") org.springframework.ai.chat.model.ChatModel chatModel,
            ChatMemory chatMemory,
            HotelBookingService hotelBookingService) {

        this.chatClient = ChatClient.builder(chatModel)
                .defaultSystem("""
                    Bạn là Trợ lý ảo chuyên nghiệp đặt phòng tại khách sạn Rikkei Luxury Hotel.
                    Nhiệm vụ của bạn là hỗ trợ khách hàng kiểm tra thông tin phòng trống, tính toán giá tiền và hoàn tất việc đặt phòng.
                    
                    QUY TRÌNH HOẠT ĐỘNG:
                    1. Hỏi rõ loại phòng khách muốn đặt nếu họ chưa cung cấp (Chúng tôi có STANDARD, DELUXE, SUITE).
                    2. Kiểm tra phòng trống bằng công cụ checkRoomAvailability trước khi tiến hành bước tiếp theo.
                    3. Hỏi rõ số đêm lưu trú và ngày nhận phòng nếu chưa biết.
                    4. Sử dụng công cụ calculateTotalPrice để báo giá cho khách và yêu cầu khách hàng xác nhận rõ ràng trước khi đặt.
                    5. Khi khách hàng đồng ý và cung cấp đầy đủ tên, hãy gọi công cụ createBooking để tạo đặt phòng.
                    
                    Lưu ý: Luôn hành xử thân thiện, lịch sự và chuyên nghiệp.
                    """)
                .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                .defaultTools(hotelBookingService) // Đăng ký các công cụ khách sạn cho Agent
                .build();
    }

    public String chatWithAgent(String chatId, String message) {
        return this.chatClient.prompt()
                .user(message)
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID, chatId))
                .call()
                .content();
    }
}`
  }
};

/* --- SLIDES DATABASE --- */
const SLIDES_DATABASE = {
  lesson1: [
    {
      theme: "Tech Minimalist — Slide 1/6",
      title: "Kiến trúc AI Agent & Quản lý Bộ nhớ Chat Memory",
      subtitle: "Phần 1: Khái niệm cốt lõi và Kiến trúc tổng quan",
      bullets: [
        "<strong>Bản chất AI Agent:</strong> Không giống như các chatbot trả lời tĩnh, Agent hoạt động theo chu kỳ lặp khép kín: <em>Tư duy (Reasoning) -> Hành động (Acting) -> Quan sát (Observing)</em>.",
        "<strong>Trí nhớ hội thoại (Chat Memory):</strong> Giải pháp kỹ thuật lưu giữ ngữ cảnh cuộc trò chuyện dài hạn để khắc phục hạn chế lớn nhất của LLM là tính chất <strong>Stateless</strong>.",
        "<strong>Spring AI Framework:</strong> Cung cấp các giao diện lập trình mạnh mẽ như <code>ChatMemory</code> và cơ chế <code>Advisors</code> để tự động hóa hoàn toàn việc đọc/ghi lịch sử chat."
      ],
      notes: "Hầu hết các kỹ sư khi bắt đầu làm AI đều thất bại ở bước này do không phân biệt được mô hình Stateless tĩnh và mô hình Stateful động. Hãy nhấn mạnh Agent là thực thể biết suy nghĩ và hành động."
    },
    {
      theme: "Tech Minimalist — Slide 2/6",
      title: "Tại sao LLM mặc định lại bị mất trí nhớ?",
      subtitle: "Phần 1.1: Hạn chế Stateless của giao thức gọi API Model",
      bullets: [
        "<strong>Mô hình Stateless:</strong> Mỗi truy vấn đến API của Ollama, OpenAI hay Gemini là hoàn toàn độc lập. Server mô hình không lưu giữ bất kỳ trạng thái hay nội dung nào của câu hỏi trước.",
        "<strong>Cách giải quyết duy nhất:</strong> Ứng dụng Spring Boot phải đóng vai trò trung gian, tự lưu lịch sử và gửi kèm <em>toàn bộ các tin nhắn cũ</em> vào Prompt tiếp theo của người dùng.",
        "<strong>Thách thức chi phí:</strong> Việc gửi lại toàn bộ lịch sử sẽ làm phình to dung lượng token (Context Window) gửi đi, làm tăng độ trễ và chi phí sử dụng API một cách nhanh chóng."
      ],
      notes: "Hãy so sánh LLM như một nhà thông thái bị chứng mất trí nhớ ngắn hạn. Cách duy nhất để trò chuyện là mỗi lần hỏi đều phải đưa cho họ cuốn sổ ghi chép toàn bộ nội dung trò chuyện trước đó."
    },
    {
      theme: "Tech Minimalist — Slide 3/6",
      title: "Mô hình lập luận và hành động ReAct (Reason + Act)",
      subtitle: "Phần 1.2: Vòng lặp tư duy tự sửa đổi lỗi của Tác nhân AI",
      bullets: [
        "<strong>Thought (Tư duy):</strong> LLM nhận câu hỏi, tự đánh giá xem kiến thức nội tại có đủ trả lời không. Nếu không, nó tự lên kế hoạch cần gọi công cụ (Tool) nào bên ngoài.",
        "<strong>Action (Hành động):</strong> AI phát sinh yêu cầu gọi hàm (ví dụ: truy vấn phòng trống STANDARD) và dừng lại chờ Server thực thi mã nguồn Java tương ứng.",
        "<strong>Observation (Quan sát):</strong> Nhận kết quả từ Server Java trả về (ví dụ: 'Còn trống 3 phòng'), LLM phân tích kết quả đó để quyết định dừng lại phản hồi hoặc tiếp tục vòng lập ReAct."
      ],
      notes: "Nếu không có vòng lặp ReAct, AI sẽ bị ảo tưởng (hallucination) khi đối mặt với các câu hỏi động hoặc dữ liệu thời gian thực. ReAct bắt buộc AI phải nhìn vào thực tế trước khi phát ngôn."
    },
    {
      theme: "Tech Minimalist — Slide 4/6",
      title: "Lưu trữ bộ nhớ: InMemory vs Persistent Memory",
      subtitle: "Phần 1.3: So sánh các giải pháp quản lý bộ nhớ đệm",
      bullets: [
        "<strong>InMemoryChatMemoryRepository:</strong> Lưu trữ trực tiếp trong bộ nhớ RAM của JVM. Tốc độ truy xuất cực nhanh, cấu hình đơn giản nhưng <em>mất sạch lịch sử khi restart server</em> (Chỉ dùng demo/test).",
        "<strong>Persistent Chat Memory:</strong> Lưu trữ bền vững thông qua các Adapter kết nối cơ sở dữ liệu (Redis, JDBC, VectorDB). Đảm bảo lịch sử chat của hàng triệu người dùng không bị mất khi bảo trì hệ thống.",
        "<strong>Isolation (Sự cô lập):</strong> Spring AI quản lý lịch sử thông qua khóa <code>ChatMemory.CONVERSATION_ID</code>, đảm bảo các phiên chat của các khách hàng khác nhau không bị trộn lẫn."
      ],
      notes: "Trong môi trường Production thực tế, việc sử dụng InMemory là một lỗi nghiêm trọng. Hãy hướng dẫn học viên cách cấu hình Redis hoặc JDBC để lưu trữ bền vững lịch sử chat."
    },
    {
      theme: "Tech Minimalist — Slide 5/6",
      title: "Chiến lược tối ưu hóa dung lượng Context Window",
      subtitle: "Phần 1.4: Các kỹ thuật cắt tỉa lịch sử hội thoại tự động",
      bullets: [
        "<strong>Sliding Window:</strong> Chỉ giữ lại $N$ tin nhắn gần nhất trong bộ nhớ (ví dụ: 10 câu gần nhất). Đơn giản, hiệu quả nhưng sẽ làm AI quên đi những thông tin ở đầu cuộc trò chuyện.",
        "<strong>Token-based Truncation:</strong> Tự động tính toán số lượng token của các tin nhắn cũ, thực hiện cắt bỏ dần khi tổng dung lượng đạt ngưỡng cấu hình (thường là 80% giới hạn token).",
        "<strong>Tóm tắt hội thoại (Summarization):</strong> Sử dụng một LLM phụ chạy ngầm để tóm tắt các hội thoại cũ thành một đoạn văn ngắn và đính kèm vào System Prompt, giải phóng dung lượng cực lớn."
      ],
      notes: "Khi hội thoại kéo dài hàng trăm lượt, nếu không có chiến lược cắt tỉa, ứng dụng sẽ bị ném lỗi 'Context Window Exceeded' hoặc làm hóa đơn tiền điện toán API tăng vọt."
    },
    {
      theme: "Tech Minimalist — Slide 6/6",
      title: "MessageChatMemoryAdvisor trong Spring AI",
      subtitle: "Phần 1.5: Tự động hóa quản lý bộ nhớ thông qua cơ chế Advisor",
      bullets: [
        "<strong>Cơ chế hoạt động:</strong> Advisor là một interceptor (bộ chặn) đứng giữa ChatClient và LLM. Nó tự động chen ngang luồng xử lý để nạp lịch sử vào prompt trước khi gửi đi.",
        "<strong>Tự động lưu trữ:</strong> Khi nhận phản hồi từ LLM, Advisor tự động bóc tách tin nhắn gửi đi và nhận về để ghi đè vào <code>ChatMemoryRepository</code> mà lập trình viên không cần viết code thủ công.",
        "<strong>Cấu hình Fluent API:</strong> Đăng ký cực kỳ gọn gàng thông qua phương thức <code>.defaultAdvisors(new MessageChatMemoryAdvisor(chatMemory))</code> khi build ChatClient."
      ],
      notes: "Nhấn mạnh sự tiện lợi của Advisor: Thay vì viết hàng chục dòng code lấy lịch sử từ DB, tạo danh sách Message, append tin nhắn mới, lưu lại DB... Spring AI xử lý tất cả chỉ bằng đúng 1 dòng code."
    }
  ],
  lesson2: [
    {
      theme: "Modern Tech Blue — Slide 1/5",
      title: "Cơ chế Function Calling trong Spring AI",
      subtitle: "Phần 2: Cánh cổng kết nối LLM với dịch vụ hệ thống Java",
      bullets: [
        "<strong>Định nghĩa Function Calling:</strong> Cơ chế cho phép LLM phát hiện nhu cầu lấy dữ liệu thực tế và ra lệnh gọi các API, database hoặc dịch vụ nghiệp vụ viết bằng Java.",
        "<strong>Mở rộng năng lực AI:</strong> Vượt qua giới hạn dữ liệu tĩnh của LLM, giúp AI truy cập dữ liệu thời gian thực (tỷ giá, thời tiết) và thực hiện hành động (đổi tiền, đặt chỗ).",
        "<strong>Kiến trúc hướng đối tượng:</strong> Spring AI ánh xạ các phương thức Java thông thường thành các đặc tả JSON Schema gửi đi, che giấu hoàn toàn sự phức tạp của giao thức."
      ],
      notes: "Hãy chỉ rõ cho học viên thấy: Function Calling là cốt lõi của mọi ứng dụng Agent thực tế. Nếu không có cơ chế này, AI chỉ là một chatbot chém gió lý thuyết suông."
    },
    {
      theme: "Modern Tech Blue — Slide 2/5",
      title: "Bản chất vận hành: LLM có tự chạy code Java của bạn?",
      subtitle: "Phần 2.1: Phân định vai trò quyết định và thực thi",
      bullets: [
        "<strong>LLM không chạy code Java:</strong> LLM không thể và không bao giờ được phép trực tiếp chạy code trên server của bạn. Nó chỉ đóng vai trò là <em>người ra quyết định</em>.",
        "<strong>AI sinh tham số JSON:</strong> Khi nhận diện câu hỏi đổi tiền, AI tự động tạo ra một gói dữ liệu JSON chứa tên hàm và tham số đầu vào phù hợp (ví dụ: <code>{amount: 250, from: 'USD'}</code>).",
        "<strong>Java Server thực thi:</strong> Spring Boot nhận JSON này, định tuyến và kích hoạt phương thức Java tương ứng trên Server của bạn để tính toán dữ liệu và trả kết quả ngược lại cho AI."
      ],
      notes: "Đây là hiểu lầm phổ biến nhất của lập trình viên. Hãy vẽ rõ ranh giới: AI là bộ não suy nghĩ, còn Server Java của bạn mới là cánh tay trực tiếp chạy lệnh và ghi dữ liệu."
    },
    {
      theme: "Modern Tech Blue -- Slide 3/5",
      title: "Đặc tả cấu trúc DTO: Jackson & JSON Schema",
      subtitle: "Phần 2.2: Tầm quan trọng của tài liệu hóa tham số cho AI",
      bullets: [
        "<strong>Tự động sinh Schema:</strong> Spring AI sử dụng Jackson để tự động phân tích cấu trúc lớp Request DTO (Java Record hoặc Class) thành đặc tả JSON Schema gửi tới LLM.",
        "<strong>Annotation @JsonPropertyDescription:</strong> Rất quan trọng! Dùng để viết mô tả bằng ngôn ngữ tự nhiên cho từng thuộc tính (ví dụ: 'Mã tiền tệ gốc gồm 3 ký tự viết hoa, ví dụ USD').",
        "<strong>Hạn chế lỗi truyền tham số:</strong> Nếu đặt tên biến tối nghĩa (như a, b, c) và thiếu mô tả, LLM sẽ truyền sai tham số, dẫn đến lỗi runtime của hệ thống."
      ],
      notes: "Hãy nhắc nhở học viên: AI không biết đọc code của bạn như con người. Nó đọc tài liệu mô tả. Do đó, viết mô tả biến càng chi tiết thì AI gọi hàm càng chính xác."
    },
    {
      theme: "Modern Tech Blue — Slide 4/5",
      title: "Định nghĩa Tool bằng Java Functional Interface",
      subtitle: "Phần 2.3: Sử dụng interface java.util.function.Function",
      bullets: [
        "<strong>Functional Interface:</strong> Cách kinh điển trong Spring AI để khai báo Tool là đăng ký một Bean kiểu <code>Function&lt;Request, Response&gt;</code>.",
        "<strong>Annotation @Description:</strong> Được đặt trực tiếp trên Bean để cung cấp ngữ cảnh hoạt động (ví dụ: 'Quy đổi tỷ giá tiền tệ thực tế giữa các quốc gia như USD, EUR, VND').",
        "<strong>Định tuyến tự động:</strong> Spring AI tự động quét và đăng ký Bean này vào danh sách công cụ có sẵn. Khi LLM yêu cầu gọi hàm, nó sẽ tự động kích hoạt phương thức <code>apply()</code>."
      ],
      notes: "Giải thích rõ tại sao phải dùng Functional Interface: Nó là tiêu chuẩn của Java 8 giúp định nghĩa một đầu vào và một đầu ra rõ ràng, rất dễ để Spring AI ánh xạ thành API."
    },
    {
      theme: "Modern Tech Blue — Slide 5/5",
      title: "Luồng hoạt động tuần tự chi tiết 3 bên",
      subtitle: "Phần 2.4: Mô phỏng hành trình đi và về của một yêu cầu gọi hàm",
      bullets: [
        "<strong>Bước 1:</strong> User hỏi -> Spring Boot gửi Prompt kèm danh sách đặc tả các công cụ có sẵn cho LLM.",
        "<strong>Bước 2:</strong> LLM nhận diện intent, phản hồi yêu cầu gọi hàm dưới dạng JSON -> Spring Boot tự động parse JSON và thực thi hàm Java trên server.",
        "<strong>Bước 3:</strong> Spring Boot gửi kết quả chạy hàm (dạng text/JSON) ngược lại cho LLM -> LLM đọc kết quả và viết câu trả lời tự nhiên nhất gửi tới người dùng."
      ],
      notes: "Hãy nhấn mạnh: Toàn bộ quá trình định tuyến, parse JSON và gọi lại hàm Java được Spring AI xử lý tự động ngầm. Lập trình viên chỉ cần viết nghiệp vụ Java tiêu chuẩn."
    }
  ],
  lesson3: [
    {
      theme: "Developer Dark — Slide 1/5",
      title: "Đóng gói Spring Boot Service thành AI Tool",
      subtitle: "Phần 3: Cuộc cách mạng đơn giản hóa mã nguồn trong Spring AI 1.1.5",
      bullets: [
        "<strong>Annotation @Tool:</strong> Cơ chế mới mạnh mẽ giới thiệu từ bản Spring AI 1.1.5.M1, cho phép biến bất kỳ phương thức thông thường nào trong Service thành công cụ AI.",
        "<strong>Loại bỏ boilerplate code:</strong> Không còn yêu cầu khai báo rườm rà từng Class Function Bean độc lập. Một Service Java thông thường giờ đây có thể phơi bày nhiều Tool.",
        "<strong>Tích hợp tự nhiên:</strong> AI Agent có thể trực tiếp tận dụng toàn bộ các tầng nghiệp vụ sẵn có của dự án Spring Boot mà không cần viết lại mã nguồn."
      ],
      notes: "Hãy chỉ ra sự khác biệt lớn: Phương pháp cũ bắt bạn viết mỗi hàm là một class/bean độc lập. Phương pháp @Tool mới cho phép bạn viết code tự nhiên như lập trình Java truyền thống."
    },
    {
      theme: "Developer Dark — Slide 2/5",
      title: "So sánh cấu trúc: Function Bean vs Annotation @Tool",
      subtitle: "Phần 3.1: Đánh giá tính sạch sẽ và khả năng bảo trì của mã nguồn",
      bullets: [
        "<strong>Functional Interface (Cũ):</strong> Chỉ nhận duy nhất 1 tham số đầu vào (phải đóng gói vào DTO), cấu hình phức tạp, tạo ra quá nhiều Class phụ trong project.",
        "<strong>Annotation @Tool (Mới):</strong> Phương thức nhận nhiều tham số đầu vào tự nhiên, tự động ánh xạ kiểu dữ liệu, viết trực tiếp trong tầng Service có sẵn.",
        "<strong>Quản lý tập trung:</strong> Gom nhóm các công cụ cùng nhóm nghiệp vụ vào chung một Service (ví dụ: <code>CustomerSupportService</code> chứa các tool tra cứu chi tiết và tính điểm)."
      ],
      notes: "Mã nguồn sạch là yếu tố sống còn của dự án lớn. Khuyên học viên nên chuyển hẳn sang sử dụng @Tool cho các dự án phát triển bằng Spring AI 1.1.5."
    },
    {
      theme: "Developer Dark — Slide 3/5",
      title: "Javadoc & Auto Schema: Viết tài liệu một lần, dùng mãi mãi",
      subtitle: "Phần 3.2: Cơ chế tự động sinh tài liệu thông minh của Spring AI",
      bullets: [
        "<strong>Đọc Javadoc tự động:</strong> Spring AI 1.1.5 thông minh đến mức có thể đọc trực tiếp các khối Javadoc <code>/** ... */</code> của phương thức Java để làm mô tả cho LLM.",
        "<strong>Mô tả tham số tự động:</strong> Đọc các thẻ Javadoc <code>@param</code> để sinh ra hướng dẫn chi tiết cho từng tham số mà không cần viết annotation trùng lặp.",
        "<strong>@Tool(description):</strong> Hỗ trợ khai báo mô tả nhanh ngay trong thuộc tính annotation khi không viết Javadoc, giúp code ngắn gọn và dễ đọc."
      ],
      notes: "Đây là tính năng cực kỳ tinh tế của Spring AI. Nó khuyến khích lập trình viên viết Javadoc tiêu chuẩn - vừa làm tài liệu cho team, vừa làm tài liệu hướng dẫn cho AI."
    },
    {
      theme: "Developer Dark — Slide 4/5",
      title: "Tích hợp Tool nghiệp vụ thông qua ChatClient",
      subtitle: "Phần 3.3: Cách đăng ký mặc định các Service Tool vào AI Agent",
      bullets: [
        "<strong>Builder Registry:</strong> Đăng ký trực tiếp thực thể (Instance) của Service vào ChatClient thông qua phương thức <code>.defaultTools(customerSupportService)</code>.",
        "<strong>Tự động quét linh kiện:</strong> Spring AI tự động quét qua toàn bộ các phương thức được đánh dấu bằng <code>@Tool</code> trong Service để đăng ký vào hệ thống lúc runtime.",
        "<strong>Gọi động (Dynamic Call):</strong> Cũng hỗ trợ nạp các công cụ động cho từng request cụ thể bằng cách gọi <code>.tools(object...)</code> trực tiếp trên prompt."
      ],
      notes: "Giải thích cho học viên hiểu cơ chế Dependency Injection (DI) của Spring hoạt động hoàn hảo ở đây: Spring tự động inject Service và nạp các Tool vào ChatClient."
    },
    {
      theme: "Developer Dark — Slide 5/5",
      title: "Nâng cao: Bảo mật dữ liệu với @ToolContext",
      subtitle: "Phần 3.4: Cơ chế truyền trạng thái bảo mật ẩn trước mô hình AI",
      bullets: [
        "<strong>Thách thức bảo mật:</strong> Nhiều công cụ cần thông tin nhạy cảm (như JWT Token, User ID của khách) để thực thi, nhưng chúng ta không muốn gửi thông tin này cho API của LLM bên ngoài.",
        "<strong>Giải pháp @ToolContext:</strong> Cho phép định nghĩa một tham số kiểu <code>ToolContext</code> trong phương thức Java. Thông tin này được truyền trực tiếp trên server từ Controller xuống Service.",
        "<strong>Hoàn toàn ẩn giấu:</strong> LLM hoàn toàn không biết đến sự tồn tại của ToolContext trong JSON Schema, giúp bảo vệ dữ liệu nhạy cảm của hệ thống tuyệt đối."
      ],
      notes: "Đây là tính năng cực kỳ quan trọng cho các dự án Enterprise. Hãy lấy ví dụ về việc tự động truyền JWT token để xác thực quyền đặt phòng mà AI không hề hay biết."
    }
  ],
  lesson4: [
    {
      theme: "Elite Dark — Slide 1/5",
      title: "Xây dựng AI Booking Agent đặt phòng khách sạn thực chiến",
      bullets: [
        "Tổng hợp tất cả kiến thức đã học để tạo ra một Agent đa công cụ (Multi-Tool Agent) hoàn chỉnh.",
        "Kết hợp Chat Memory và chuỗi gọi Tool liên hoàn để giải quyết yêu cầu đặt phòng phức tạp.",
        "Thiết lập cơ chế bảo vệ giao dịch và tính toàn vẹn dữ liệu cho Agent."
      ]
    },
    {
      theme: "Elite Dark — Slide 2/5",
      title: "Kiến trúc Đa công cụ (Multi-Tool Agent)",
      bullets: [
        "Khách hàng đưa ra một yêu cầu đặt phòng -> Agent tự động chia nhỏ nhiệm vụ.",
        "Nhiệm vụ 1: Gọi Tool kiểm tra phòng trống -> Nhiệm vụ 2: Gọi Tool tính tổng tiền phòng -> Nhiệm vụ 3: Yêu cầu khách hàng xác nhận giá cả -> Nhiệm vụ 4: Gọi Tool tạo đặt phòng chính thức.",
        "Tất cả các hành động này được LLM tự động lập kế hoạch và liên kết mượt mà."
      ]
    },
    {
      theme: "Elite Dark — Slide 3/5",
      title: "Phối hợp Chat Memory và Tool Calling",
      bullets: [
        "Nếu không có Chat Memory, Agent sẽ quên sạch các thông tin khách cung cấp ở câu chat trước (như loại phòng, số đêm).",
        "Nhờ MessageChatMemoryAdvisor, các chi tiết được ghi nhớ xuyên suốt phiên chat.",
        "Khi khách nói tên ở câu sau, Agent tự động lấy thông tin phòng đã lưu ở câu trước để gọi Tool createBooking chính xác."
      ]
    },
    {
      theme: "Elite Dark — Slide 4/5",
      title: "An toàn giao dịch & Idempotency",
      bullets: [
        "Các Tool ghi dữ liệu cần được bảo vệ để tránh việc AI vô tình gọi trùng lặp (lỗi tạo nhiều đơn đặt phòng).",
        "Áp dụng cơ chế Idempotency: Kiểm tra trạng thái giao dịch trước khi thực thi hoặc sử dụng ID giao dịch duy nhất.",
        "Quy định trong System Prompt: Bắt buộc AI Agent phải báo giá và hỏi xác nhận đồng ý của khách hàng rõ ràng trước khi tạo đơn."
      ]
    },
    {
      theme: "Elite Dark — Slide 5/5",
      title: "Thiết lập System Prompt cho Booking Agent",
      bullets: [
        "Cung cấp định hướng quy trình làm việc rõ ràng cho AI thông qua System Prompt.",
        "Hướng dẫn AI cách cư xử thân thiện, lịch sự của một lễ tân khách sạn Rikkei Luxury Hotel.",
        "Đăng ký đầy đủ các Tool nghiệp vụ (checkRoom, calculatePrice, createBooking) để Agent có siêu năng lực thực thi."
      ]
    }
  ]
};

/* --- CURRICULUM PROGRESS STATE --- */
let PROGRESS_STATE = {
  lesson1: false,
  lesson2: false,
  lesson3: false,
  lesson4: false,
  simulator: false
};

/* --- RUNTIME VARIABLES FOR INTERACTIVE SIMULATOR --- */
let currentSlideIndexes = {
  lesson1: 0,
  lesson2: 0,
  lesson3: 0,
  lesson4: 0
};

let simIsRunning = false;

/* --- SIMULATOR SCENARIOS DEFINITION --- */
const SIMULATOR_SCENARIOS = {
  booking: [
    {
      sender: "user",
      text: "Chào bạn, tôi muốn đặt một phòng Deluxe 2 đêm từ ngày 2026-07-01",
      delay: 1000,
      anim: { from: "user", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Nhận request. Phân tích intent của người dùng...",
      delay: 1200,
      anim: { from: "spring", to: "llm" }
    },
    {
      sender: "system",
      text: "[LLM]: Phát hiện intent đặt phòng. Cần kiểm tra phòng trống loại 'DELUXE'.\n-> Yêu cầu gọi hàm: checkRoomAvailability(roomType='DELUXE')",
      delay: 1500,
      anim: { from: "llm", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Thực thi hàm Java nội bộ: HotelBookingService.checkRoomAvailability('DELUXE')",
      delay: 1000,
      anim: { from: "spring", to: "db" }
    },
    {
      sender: "tool",
      text: "🎯 Tool Output: Phòng loại DELUXE hiện còn trống 2 phòng.",
      delay: 1500,
      anim: { from: "db", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Gửi kết quả Tool cho LLM để lập kế hoạch tiếp theo...",
      delay: 1200,
      anim: { from: "spring", to: "llm" }
    },
    {
      sender: "system",
      text: "[LLM]: Phòng trống khả dụng. Cần tính toán tổng chi phí cho 2 đêm phòng Deluxe.\n-> Yêu cầu gọi hàm: calculateTotalPrice(roomType='DELUXE', nights=2)",
      delay: 1500,
      anim: { from: "llm", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Thực thi hàm Java nội bộ: HotelBookingService.calculateTotalPrice('DELUXE', 2)",
      delay: 1000,
      anim: { from: "spring", to: "db" }
    },
    {
      sender: "tool",
      text: "🎯 Tool Output: Tổng chi phí cho 2 đêm phòng DELUXE là 3,000,000 VND.",
      delay: 1500,
      anim: { from: "db", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Gửi kết quả tính tiền cho LLM để tổng hợp phản hồi...",
      delay: 1200,
      anim: { from: "spring", to: "llm" }
    },
    {
      sender: "ai",
      text: "Chào anh/chị! Khách sạn Rikkei Luxury Hotel hiện tại vẫn còn phòng Deluxe trống ạ. Tổng chi phí cho 2 đêm lưu trú từ ngày 2026-07-01 là 3,000,000 VND. Anh/chị vui lòng cung cấp họ tên và xác nhận để em tiến hành giữ phòng nhé!",
      delay: 2000,
      anim: { from: "llm", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Lưu lịch sử cuộc trò chuyện vào Chat Memory (Redis/InMemory). Gửi phản hồi cho người dùng.",
      delay: 1000,
      anim: { from: "spring", to: "user" }
    },
    // Second Turn (Prompting user confirmation)
    {
      sender: "user",
      text: "Tôi đồng ý mức giá đó, tôi tên là Nguyễn Minh Chinh",
      delay: 1500,
      anim: { from: "user", to: "spring" },
      interactiveTrigger: true // Pause here for user to click "Confirm"
    },
    {
      sender: "system",
      text: "[Spring AI]: Nhận request. Truy vấn lịch sử từ Chat Memory để lấy ngữ cảnh đặt phòng cũ...",
      delay: 1200,
      anim: { from: "spring", to: "llm" }
    },
    {
      sender: "system",
      text: "[LLM]: Khách hàng đã xác nhận đặt phòng và cung cấp tên: 'Nguyễn Minh Chinh'.\nNgữ cảnh cũ trong Memory: Loại phòng Deluxe, 2 đêm, Ngày nhận phòng 2026-07-01.\n-> Yêu cầu gọi hàm: createBooking(customerName='Nguyễn Minh Chinh', roomType='DELUXE', checkInDateStr='2026-07-01', nights=2)",
      delay: 1800,
      anim: { from: "llm", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Thực thi hàm Java ghi dữ liệu: HotelBookingService.createBooking('Nguyễn Minh Chinh', 'DELUXE', '2026-07-01', 2)",
      delay: 1200,
      anim: { from: "spring", to: "db" }
    },
    {
      sender: "tool",
      text: "🎯 Tool Output: Đặt phòng thành công! Mã đặt chỗ của bạn là: BK-8849. Khách hàng: Nguyễn Minh Chinh, Loại phòng: DELUXE, Nhận phòng ngày: 2026-07-01, Số đêm: 2. Tổng tiền: 3,000,000 VND.",
      delay: 1500,
      anim: { from: "db", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Gửi kết quả đặt phòng thành công về cho LLM...",
      delay: 1000,
      anim: { from: "spring", to: "llm" }
    },
    {
      sender: "ai",
      text: "Cảm ơn anh Chinh! Phòng Deluxe của anh đã được đặt thành công từ ngày 2026-07-01 đến ngày 2026-07-03 (2 đêm). Mã đặt phòng của anh là BK-8849. Khách sạn Rikkei Luxury rất hân hạnh được phục vụ anh ạ!",
      delay: 2000,
      anim: { from: "llm", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Lưu giao dịch thành công vào Chat Memory. Hoàn thành chu kỳ.",
      delay: 1000,
      anim: { from: "spring", to: "user" }
    }
  ],
  currency: [
    {
      sender: "user",
      text: "Tôi có 250 USD muốn đổi sang VND thì được bao nhiêu tiền thế?",
      delay: 1000,
      anim: { from: "user", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Nhận request. Phân tích intent đổi tiền ngoại tệ...",
      delay: 1000,
      anim: { from: "spring", to: "llm" }
    },
    {
      sender: "system",
      text: "[LLM]: Phát hiện intent đổi tiền. Tìm thấy Tool 'exchangeCurrency' phù hợp.\n-> Yêu cầu gọi hàm: exchangeCurrency(amount=250, from='USD', to='VND')",
      delay: 1500,
      anim: { from: "llm", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Thực thi Bean Java: CurrencyExchangeFunction.exchangeCurrency()",
      delay: 1000,
      anim: { from: "spring", to: "db" } // Using DB as Java Tool node here
    },
    {
      sender: "tool",
      text: "🎯 Tool Output: Đã chuyển đổi thành công 250.0 USD thành 6,362,500.0 VND với tỷ giá 25450.0",
      delay: 1500,
      anim: { from: "db", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Gửi kết quả quy đổi về cho LLM để phản hồi...",
      delay: 1000,
      anim: { from: "spring", to: "llm" }
    },
    {
      sender: "ai",
      text: "Với số tiền 250 USD của bạn, khi quy đổi sang tiền Việt Nam (VND) với tỷ giá hiện tại là 25,450 VND/USD, bạn sẽ nhận được tổng cộng 6,362,500 VND. Bạn có cần mình hỗ trợ tính toán thêm giao dịch nào khác không?",
      delay: 1800,
      anim: { from: "llm", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Trả kết quả cuối cùng cho người dùng.",
      delay: 800,
      anim: { from: "spring", to: "user" }
    }
  ],
  customer: [
    {
      sender: "user",
      text: "Khách hàng C002 còn thiếu bao nhiêu điểm để lên hạng thành viên tiếp theo?",
      delay: 1000,
      anim: { from: "user", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Nhận request. Phân tích intent tra cứu thông tin thành viên...",
      delay: 1000,
      anim: { from: "spring", to: "llm" }
    },
    {
      sender: "system",
      text: "[LLM]: Phát hiện yêu cầu tính điểm nâng hạng của mã khách hàng 'C002'.\nTìm thấy Tool '@Tool calculatePointsToUpgrade' phù hợp.\n-> Yêu cầu gọi hàm: calculatePointsToUpgrade(customerId='C002')",
      delay: 1500,
      anim: { from: "llm", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Thực thi Service: CustomerSupportService.calculatePointsToUpgrade('C002')",
      delay: 1000,
      anim: { from: "spring", to: "db" }
    },
    {
      sender: "tool",
      text: "🎯 Tool Output: Cần thêm 550 điểm để nâng lên hạng VIP",
      delay: 1500,
      anim: { from: "db", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Gửi kết quả tính toán về cho LLM...",
      delay: 1000,
      anim: { from: "spring", to: "llm" }
    },
    {
      sender: "ai",
      text: "Chào bạn, mình đã kiểm tra thông tin thành viên của mã khách hàng C002 (Trần Quốc Anh - hạng hiện tại: Gold). Để nâng lên hạng thành viên cao nhất là VIP, anh Quốc Anh cần tích lũy thêm 550 điểm nữa nhé!",
      delay: 1800,
      anim: { from: "llm", to: "spring" }
    },
    {
      sender: "system",
      text: "[Spring AI]: Hoàn thành gửi câu trả lời.",
      delay: 800,
      anim: { from: "spring", to: "user" }
    }
  ]
};

/* --- RUNTIME STATES --- */
let simStepIndex = 0;
let simScenarioData = null;
let simTimer = null;

/* --- ON DOM CONTENT LOADED --- */
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initTabs();
  initCodeHub();
  initTerminalEmulator();
  initSlidesDeck();
  initSimulator();
  
  // Highlight default code block
  updateCodeView('lesson1', 'AgentConfig.java');
  updateCodeView('lesson2', 'CurrencyModel.java');
  updateCodeView('lesson3', 'CustomerSupportService.java');
  updateCodeView('lesson4', 'Booking.java');
});

/* --- FUNCTIONS: NAVIGATION & PROGRESS --- */
function initNavigation() {
  const menuItems = document.querySelectorAll(".menu-item");
  const sections = document.querySelectorAll(".lesson-section");
  const headerTitle = document.querySelector(".header-title");
  
  menuItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = item.getAttribute("data-target");
      
      // Toggle Menu Active Class
      menuItems.forEach(mi => mi.classList.remove("active"));
      item.classList.add("active");
      
      // Toggle Sections
      sections.forEach(sec => sec.classList.remove("active"));
      const activeSection = document.getElementById(targetId);
      activeSection.classList.add("active");
      
      // Update Header Title
      const itemText = item.querySelector("span").textContent;
      headerTitle.innerHTML = `<i class="${item.querySelector("i").className}"></i> ${itemText}`;
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // Update Progress
      updateProgress(targetId);
    });
  });
}

function updateProgress(sectionId) {
  PROGRESS_STATE[sectionId] = true;
  
  let completedCount = 0;
  const totalKeys = Object.keys(PROGRESS_STATE).length;
  for (let key in PROGRESS_STATE) {
    if (PROGRESS_STATE[key]) completedCount++;
  }
  
  const percentage = Math.round((completedCount / totalKeys) * 100);
  
  const progressText = document.querySelector(".progress-text");
  const fillBar = document.querySelector(".progress-bar-fill");
  
  if (progressText && fillBar) {
    progressText.textContent = `${percentage}% Hoàn thành`;
    fillBar.style.width = `${percentage}%`;
  }
}

/* --- FUNCTIONS: TABS SYSTEM --- */
function initTabs() {
  const tabContainers = document.querySelectorAll(".tab-container");
  
  tabContainers.forEach(container => {
    const tabBtns = container.querySelectorAll(".tab-btn");
    const tabContents = container.parentElement.querySelectorAll(".tab-content");
    
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        
        // Remove active class from all buttons in this container
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        // Hide all contents related to these tabs
        tabContents.forEach(content => {
          if (content.getAttribute("data-content-group") === btn.getAttribute("data-group")) {
            content.classList.remove("active");
          }
        });
        
        // Show target content
        const activeContent = Array.from(tabContents).find(
          c => c.getAttribute("data-tab-id") === targetTab && c.getAttribute("data-content-group") === btn.getAttribute("data-group")
        );
        if (activeContent) {
          activeContent.classList.add("active");
        }
      });
    });
  });
}

/* --- FUNCTIONS: CODE HUB & SYNTAX HIGHLIGHT --- */
function initCodeHub() {
  // Handle copy buttons
  const copyBtns = document.querySelectorAll(".copy-btn");
  copyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const codeId = btn.getAttribute("data-code-target");
      const codeEl = document.getElementById(codeId);
      if (codeEl) {
        // Copy to clipboard
        navigator.clipboard.writeText(codeEl.textContent).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = `<i class="fas fa-check"></i> Đã sao chép!`;
          btn.style.borderColor = "var(--success)";
          btn.style.color = "var(--success)";
          
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.borderColor = "";
            btn.style.color = "";
          }, 2000);
        });
      }
    });
  });

  // Handle file switches inside code hubs
  const fileTabs = document.querySelectorAll(".code-tab-btn");
  fileTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const group = tab.getAttribute("data-code-group");
      const fileName = tab.textContent.trim();
      
      // Deactivate other tabs in group
      document.querySelectorAll(`.code-tab-btn[data-code-group="${group}"]`).forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      updateCodeView(group, fileName);
    });
  });
}

function updateCodeView(lessonKey, fileName) {
  const codeElementId = `${lessonKey}-code-block`;
  const codeEl = document.getElementById(codeElementId);
  
  if (codeEl && CODE_DATABASE[lessonKey] && CODE_DATABASE[lessonKey][fileName]) {
    const rawCode = CODE_DATABASE[lessonKey][fileName];
    codeEl.innerHTML = highlightJava(rawCode);
  }
}

// Lightweight Java Syntax Highlighter
function highlightJava(codeText) {
  // Escape HTML tags to prevent breaking
  let html = codeText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Highlight comments and strings in a single pass to prevent nested corruption
  html = html.replace(/(\/\*[\s\S]*?\*\/)|(\/\/.*)|("""[\s\S]*?"")|("(?:\\.|[^"\\])*")/g, (match, blockComment, lineComment, textBlock, doubleQuoteStr) => {
    if (blockComment) return `<span class="j-comment">${blockComment}</span>`;
    if (lineComment) return `<span class="j-comment">${lineComment}</span>`;
    if (textBlock) return `<span class="j-string">${textBlock}</span>`;
    if (doubleQuoteStr) return `<span class="j-string">${doubleQuoteStr}</span>`;
    return match;
  });
  
  // Highlight annotations
  html = html.replace(/(@\w+)/g, '<span class="j-keyword">$1</span>');
  
  // Highlight Java keywords
  const keywords = [
    'package', 'import', 'public', 'private', 'class', 'interface', 'record', 
    'new', 'return', 'this', 'void', 'double', 'int', 'boolean', 'switch', 
    'case', 'default', 'extends', 'implements', 'throws', 'try', 'catch', 
    'finally', 'null', 'final', 'else', 'if'
  ];
  
  // Robust replacement: match HTML tags or words, only wrap keywords if they are not inside tags
  html = html.replace(/(<span class="j-(?:comment|string|keyword)">[\s\S]*?<\/span>)|(<span[^>]*>|<\/span>)|(\b\w+\b)/g, (match, skipSpan, tag, word) => {
    if (skipSpan) return skipSpan; // Return comments, strings, annotations untouched
    if (tag) return tag; // Return other HTML tags untouched
    if (keywords.includes(word)) {
      return `<span class="j-keyword">${word}</span>`;
    }
    return word;
  });
  
  return html;
}

/* --- FUNCTIONS: TERMINAL EMULATOR --- */
function initTerminalEmulator() {
  const runBtns = document.querySelectorAll(".run-cmd-btn");
  
  runBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const termId = btn.getAttribute("data-term-target");
      const commandText = btn.getAttribute("data-cmd");
      const outputText = btn.getAttribute("data-output");
      
      const termBody = document.getElementById(termId);
      const runBtn = btn;
      
      if (termBody && commandText && outputText) {
        runBtn.disabled = true;
        termBody.innerHTML = ""; // Clear
        
        // Step 1: Append prompt
        const line = document.createElement("div");
        line.className = "terminal-line";
        line.innerHTML = `<span class="terminal-prompt">$ </span><span class="terminal-command-text"></span>`;
        termBody.appendChild(line);
        
        const cmdSpan = line.querySelector(".terminal-command-text");
        
        // Typewriter effect for command
        let charIndex = 0;
        const typeSpeed = 25; // ms
        
        function typeChar() {
          if (charIndex < commandText.length) {
            cmdSpan.textContent += commandText.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, typeSpeed);
          } else {
            // Typing complete, simulate latency
            setTimeout(showLoadingAndOutput, 500);
          }
        }
        
        typeChar();
        
        function showLoadingAndOutput() {
          // Loading indicator
          const loadingLine = document.createElement("div");
          loadingLine.className = "terminal-line text-muted";
          loadingLine.textContent = "Connecting to localhost:8080... Sending HTTP request...";
          termBody.appendChild(loadingLine);
          
          setTimeout(() => {
            loadingLine.remove();
            
            // Show Output
            const outputDiv = document.createElement("pre");
            outputDiv.className = "terminal-output";
            outputDiv.style.display = "block";
            outputDiv.textContent = outputText;
            termBody.appendChild(outputDiv);
            
            // Scroll terminal to bottom
            termBody.scrollTop = termBody.scrollHeight;
            
            // Re-enable button
            runBtn.disabled = false;
          }, 1200);
        }
      }
    });
  });
}

/* --- FUNCTIONS: SLIDES DECK --- */
function initSlidesDeck() {
  const slideDecks = document.querySelectorAll(".slides-deck");
  
  slideDecks.forEach(deck => {
    const lessonKey = deck.getAttribute("data-lesson");
    const prevBtn = deck.querySelector(".slide-prev");
    const nextBtn = deck.querySelector(".slide-next");
    const counter = deck.querySelector(".slide-counter");
    
    const themeEl = deck.querySelector(".slide-theme");
    const titleEl = deck.querySelector(".slide-title-main");
    const bulletsEl = deck.querySelector(".slide-body-bullets");
    
    function renderSlide() {
      const slides = SLIDES_DATABASE[lessonKey];
      const index = currentSlideIndexes[lessonKey];
      const slide = slides[index];
      
      themeEl.textContent = slide.theme;
      titleEl.textContent = slide.title;
      
      // Render subtitle
      let subtitleEl = deck.querySelector(".slide-subtitle");
      if (slide.subtitle) {
        if (!subtitleEl) {
          subtitleEl = document.createElement("div");
          subtitleEl.className = "slide-subtitle";
          titleEl.parentNode.insertBefore(subtitleEl, titleEl.nextSibling);
        }
        subtitleEl.textContent = slide.subtitle;
        subtitleEl.style.display = "block";
      } else if (subtitleEl) {
        subtitleEl.style.display = "none";
      }
      
      // Render bullets
      bulletsEl.innerHTML = "";
      slide.bullets.forEach(bullet => {
        const li = document.createElement("li");
        li.innerHTML = bullet;
        bulletsEl.appendChild(li);
      });
      
      // Render presenter notes / takeaway
      let notesEl = deck.querySelector(".slide-notes-card");
      if (slide.notes) {
        if (!notesEl) {
          notesEl = document.createElement("div");
          notesEl.className = "slide-notes-card";
          bulletsEl.parentNode.appendChild(notesEl);
        }
        notesEl.innerHTML = `<strong>💡 Presenter Notes:</strong> ${slide.notes}`;
        notesEl.style.display = "block";
      } else if (notesEl) {
        notesEl.style.display = "none";
      }
      
      // Update counter
      counter.textContent = `${index + 1} / ${slides.length}`;
      
      // Disable/enable buttons
      prevBtn.disabled = (index === 0);
      nextBtn.disabled = (index === slides.length - 1);
      
      // Visual disabled styling
      prevBtn.style.opacity = (index === 0) ? "0.5" : "1";
      nextBtn.style.opacity = (index === slides.length - 1) ? "0.5" : "1";
    }
    
    // Initial Render
    renderSlide();
    
    prevBtn.addEventListener("click", () => {
      if (currentSlideIndexes[lessonKey] > 0) {
        currentSlideIndexes[lessonKey]--;
        renderSlide();
      }
    });
    
    nextBtn.addEventListener("click", () => {
      if (currentSlideIndexes[lessonKey] < SLIDES_DATABASE[lessonKey].length - 1) {
        currentSlideIndexes[lessonKey]++;
        renderSlide();
      }
    });
  });
}

/* --- FUNCTIONS: INTERACTIVE SIMULATOR --- */
function initSimulator() {
  const scenarioSelect = document.getElementById("sim-scenario-select");
  const chatArea = document.getElementById("sim-chat-box");
  const sendBtn = document.getElementById("sim-send-btn");
  const inputField = document.getElementById("sim-input-field");
  
  // Set default scenario description
  scenarioSelect.addEventListener("change", () => {
    resetSimulator();
  });
  
  sendBtn.addEventListener("click", () => {
    startSimulation();
  });
  
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !simIsRunning) {
      startSimulation();
    }
  });
  
  resetSimulator();
}

function resetSimulator() {
  const chatArea = document.getElementById("sim-chat-box");
  const scenarioSelect = document.getElementById("sim-scenario-select");
  const sendBtn = document.getElementById("sim-send-btn");
  const inputField = document.getElementById("sim-input-field");
  const statusIndicator = document.querySelector(".sim-status");
  const statusDotText = document.querySelector(".sim-status-text");
  
  // Clear timer
  if (simTimer) clearTimeout(simTimer);
  
  simIsRunning = false;
  simStepIndex = 0;
  sendBtn.disabled = false;
  inputField.disabled = false;
  
  statusIndicator.classList.remove("active");
  statusDotText.textContent = "Ready";
  
  chatArea.innerHTML = "";
  
  // Populate default greeting / instruction
  const greetMsg = document.createElement("div");
  greetMsg.className = "sim-msg system";
  greetMsg.textContent = `[Hệ thống]: Trình giả lập AI Agent đã sẵn sàng. Hãy chọn kịch bản phía trên rồi bấm 'Simulate Agent' để theo dõi các bước suy luận và gọi hàm trực quan.`;
  chatArea.appendChild(greetMsg);
  
  // Set input placeholder based on scenario
  const scenario = scenarioSelect.value;
  if (scenario === "booking") {
    inputField.value = "Tôi muốn đặt phòng Deluxe 2 đêm từ ngày 2026-07-01, tôi tên là Minh Chinh";
  } else if (scenario === "currency") {
    inputField.value = "Tôi có 250 USD muốn đổi sang VND thì được bao nhiêu tiền thế?";
  } else if (scenario === "customer") {
    inputField.value = "Khách hàng C002 còn thiếu bao nhiêu điểm để lên hạng thành viên tiếp theo?";
  }
  
  // Reset all SVG connection lines
  document.querySelectorAll(".sim-connection-path").forEach(path => {
    path.classList.remove("active-path");
    path.style.stroke = "";
  });
}

function startSimulation() {
  if (simIsRunning) return;
  
  const scenarioSelect = document.getElementById("sim-scenario-select");
  const sendBtn = document.getElementById("sim-send-btn");
  const inputField = document.getElementById("sim-input-field");
  const statusIndicator = document.querySelector(".sim-status");
  const statusDotText = document.querySelector(".sim-status-text");
  
  simIsRunning = true;
  sendBtn.disabled = true;
  inputField.disabled = true;
  
  statusIndicator.classList.add("active");
  statusDotText.textContent = "Running Simulation";
  
  const scenario = scenarioSelect.value;
  simScenarioData = SIMULATOR_SCENARIOS[scenario];
  simStepIndex = 0;
  
  // Clear chat area first, then start steps
  const chatArea = document.getElementById("sim-chat-box");
  chatArea.innerHTML = "";
  
  runNextSimStep();
}

function runNextSimStep() {
  if (!simScenarioData || simStepIndex >= simScenarioData.length) {
    // End of simulation
    endSimulation();
    return;
  }
  
  const step = simScenarioData[simStepIndex];
  
  // Check if we hit an interactive pause trigger (e.g. user needs to submit the name for booking confirmation)
  if (step.interactiveTrigger) {
    // Render the user confirmation step, but prompt an interactive button
    renderInteractiveConfirmation();
    return;
  }
  
  // 1. Render Chat Message
  renderChatMessage(step.sender, step.text);
  
  // 2. Animate Data Packet
  if (step.anim) {
    animatePacket(step.anim.from, step.anim.to);
  }
  
  // 3. Increment and schedule next step
  simStepIndex++;
  simTimer = setTimeout(runNextSimStep, step.delay);
}

function renderChatMessage(sender, text) {
  const chatArea = document.getElementById("sim-chat-box");
  const msg = document.createElement("div");
  msg.className = `sim-msg ${sender}`;
  
  // Convert newlines to breaks
  msg.innerHTML = text.replace(/\n/g, "<br/>");
  chatArea.appendChild(msg);
  
  // Smooth scroll to bottom
  chatArea.scrollTop = chatArea.scrollHeight;
}

function renderInteractiveConfirmation() {
  const chatArea = document.getElementById("sim-chat-box");
  
  const systemPrompt = document.createElement("div");
  systemPrompt.className = "sim-msg system";
  systemPrompt.textContent = `[Hệ thống]: Agent đã tính toán tổng giá là 3.0M VND. AI đang chờ phản hồi xác nhận họ tên của bạn...`;
  chatArea.appendChild(systemPrompt);
  
  const confirmBtnArea = document.createElement("div");
  confirmBtnArea.style.display = "flex";
  confirmBtnArea.style.justifyContent = "center";
  confirmBtnArea.style.margin = "8px 0";
  confirmBtnArea.id = "sim-interactive-confirm-area";
  
  const confirmBtn = document.createElement("button");
  confirmBtn.className = "run-cmd-btn";
  confirmBtn.innerHTML = `<i class="fas fa-check-circle"></i> Xác nhận: "Tôi đồng ý, tôi tên là Nguyễn Minh Chinh"`;
  confirmBtn.addEventListener("click", () => {
    confirmBtnArea.remove();
    systemPrompt.remove();
    
    // Resume simulation by rendering the user's confirmation message
    const step = simScenarioData[simStepIndex];
    renderChatMessage("user", step.text);
    animatePacket(step.anim.from, step.anim.to);
    
    simStepIndex++;
    simTimer = setTimeout(runNextSimStep, 1000);
  });
  
  confirmBtnArea.appendChild(confirmBtn);
  chatArea.appendChild(confirmBtnArea);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function endSimulation() {
  const sendBtn = document.getElementById("sim-send-btn");
  const inputField = document.getElementById("sim-input-field");
  const statusIndicator = document.querySelector(".sim-status");
  const statusDotText = document.querySelector(".sim-status-text");
  
  simIsRunning = false;
  sendBtn.disabled = false;
  inputField.disabled = false;
  
  statusIndicator.classList.remove("active");
  statusDotText.textContent = "Completed";
  
  // Mark simulator progress as complete
  updateProgress('simulator');
}

/* --- ANIMATE PACKET FUNCTION --- */
function animatePacket(fromNodeName, toNodeName) {
  const fromEl = document.querySelector(`.node-${fromNodeName}`);
  const toEl = document.querySelector(`.node-${toNodeName}`);
  const packet = document.getElementById("sim-packet-element");
  const container = document.querySelector(".sim-visualizer");
  
  if (!fromEl || !toEl || !packet || !container) return;
  
  // Highlight active path in SVG
  const pathId = `path-${fromNodeName}-${toNodeName}` || `path-${toNodeName}-${fromNodeName}`;
  const pathEl = document.getElementById(pathId) || document.getElementById(`path-${toNodeName}-${fromNodeName}`);
  
  // Reset all paths
  document.querySelectorAll(".sim-connection-path").forEach(path => {
    path.classList.remove("active-path");
    path.style.stroke = "";
  });
  
  if (pathEl) {
    pathEl.classList.add("active-path");
    
    // Set color based on target node
    if (toNodeName === "llm") {
      pathEl.style.stroke = "var(--secondary)";
    } else if (toNodeName === "db") {
      pathEl.style.stroke = "var(--success)";
    } else if (toNodeName === "spring") {
      pathEl.style.stroke = "var(--primary)";
    } else {
      pathEl.style.stroke = "var(--text-muted)";
    }
  }
  
  // Calculate relative coordinates
  const containerRect = container.getBoundingClientRect();
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();
  
  const startX = (fromRect.left - containerRect.left) + (fromRect.width / 2) - 6;
  const startY = (fromRect.top - containerRect.top) + (fromRect.height / 2) - 6;
  
  const endX = (toRect.left - containerRect.left) + (toRect.width / 2) - 6;
  const endY = (toRect.top - containerRect.top) + (toRect.height / 2) - 6;
  
  // Position packet at start
  packet.style.left = `${startX}px`;
  packet.style.top = `${startY}px`;
  packet.style.display = "block";
  packet.style.transform = "scale(1)";
  packet.style.transition = "none";
  
  // Animate to end
  setTimeout(() => {
    packet.style.transition = "left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    packet.style.left = `${endX}px`;
    packet.style.top = `${endY}px`;
  }, 50);
  
  // Hide packet after arrival
  setTimeout(() => {
    packet.style.transform = "scale(0)";
    packet.style.transition = "transform 0.2s ease";
  }, 850);
}
