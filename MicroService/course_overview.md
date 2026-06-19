# Course Overview: Microservices in Action (Spring Cloud & Java)

Tài liệu này là **Source of Truth (Điểm tham chiếu duy nhất)** về cấu trúc, nội dung môn học và các hướng dẫn biên soạn học liệu cho môn **Microservices in Action**. Tất cả các phiên làm việc tiếp theo với AI cần đọc và tuân thủ định hướng trong tài liệu này.

---

## 1. Thông tin chung môn học

*   **Tên môn học:** Microservices in Action (Microservices với Spring Boot & Spring Cloud)
*   **Ngôn ngữ lập trình:** Java (Khuyến nghị Java 17+)
*   **Framework chính:** Spring Boot 3.x, Spring Cloud 2023.x (hoặc phiên bản tương thích mới nhất)
*   **Database:** PostgreSQL / MySQL (áp dụng tư duy *Database-per-service*)
*   **Mục tiêu:** Giúp học viên nắm vững kiến thức từ lý thuyết đến thực hành thực tế về kiến trúc Microservices, cách thiết kế, phát triển, giao tiếp, kháng lỗi và tối ưu hóa hệ thống phân tán.

---

## 2. Khung chương trình chi tiết (Current Syllabus)

Dưới đây là cấu trúc 18 Sessions hiện tại của môn học:

| Session | Chủ đề chính | Chi tiết bài học / Yêu cầu thực hành |
| :--- | :--- | :--- |
| **Session 01** | **Định hướng môn học** | - Tổng quan về nội dung, kiến thức môn học.<br>- Lý do học môn này, hậu quả nếu không học (mất lợi thế cạnh tranh, khó làm dự án lớn, lúng túng khi xử lý hệ thống tải cao). |
| **Session 02** | **Từ Monolithic đến Microservice** | - **Lesson 01:** Giới thiệu Monolithic Architecture (MLA)<br>- **Lesson 02:** Giới thiệu Service-Oriented Architecture (SOA)<br>- **Lesson 03:** Giới thiệu Microservice Architecture (MSA)<br>- **Lesson 04:** Thiết kế Database cho dự án Microservice (tư duy *Database-per-service*). |
| **Session 03** | **Configuration, Service Registration & Discovery** | - **Lesson 01:** Tổng quan về Spring Cloud trong Microservice<br>- **Lesson 02:** Centralized Configuration (Config Server sử dụng Git/Local)<br>- **Lesson 03:** Xây dựng Config Server<br>- **Lesson 04:** Service Registration và Discovery (Eureka Server & Eureka Client). |
| **Session 04** | **Thực hành** | - Thực hành cấu hình Config Server, Discovery Server và kết nối các Microservice. |
| **Session 04.1** | **Container hóa với Docker & Docker Compose (Bổ sung)** | - **Lesson 01:** Giới thiệu về Containerization & Docker trong Microservices.<br>- **Lesson 02:** Viết Dockerfile tối ưu cho ứng dụng Spring Boot (Sử dụng Multi-stage builds).<br>- **Lesson 03:** Cấu hình Docker Compose để khởi chạy các Infrastructure Service (Postgres, Eureka, Config Server).<br>- **Lesson 04:** Thực hành chạy toàn bộ cụm Microservices thông qua Docker Compose. |
| **Session 05** | **API Gateway, Load Balancing** | - **Lesson 01:** Giới thiệu về API Gateway<br>- **Lesson 02:** Cấu hình API Gateway với Spring Cloud Gateway<br>- **Lesson 03:** Giới thiệu về Load Balancing trong Microservice<br>- **Lesson 04:** Cấu hình Load Balancing với Spring Cloud LoadBalancer. |
| **Session 06** | **Giao tiếp đồng bộ (Synchronous)** | - **Lesson 01:** Giới thiệu về giao tiếp đồng bộ (Service-to-service calls)<br>- **Lesson 02:** Các công nghệ giao tiếp đồng bộ<br>- **Lesson 03:** Triển khai với RestTemplate (Spring Web)<br>- **Lesson 04:** Triển khai với FeignClient (Spring Cloud OpenFeign - Khuyến nghị). |
| **Session 07** | **Thực hành** | - Thực hành cấu hình API Gateway và giao tiếp đồng bộ giữa các service bằng FeignClient. |
| **Session 07.1** | **Bảo mật với Keycloak & Spring Security (Bổ sung)** | - **Lesson 01:** Tổng quan về bảo mật phân tán (OAuth2, JWT, Identity Providers - IdP).<br>- **Lesson 02:** Thiết lập Keycloak Server làm Centralized Identity Provider.<br>- **Lesson 03:** Cấu hình API Gateway thành Authentication Gateway (xác thực JWT).<br>- **Lesson 04:** Kỹ thuật Token Propagation (Lan truyền Token) giữa các Service bằng FeignClient Interceptor.<br>- **Lesson 05:** Thực hành phân quyền chi tiết (RBAC) sử dụng `@PreAuthorize` tại Resource Server. |
| **Session 08** | **Mini Project tổng hợp (Giai đoạn 1)** | - Làm 1 bài kiểm tra 45 phút (đánh giá cá nhân).<br>- Biên soạn tài liệu SRS (Software Requirement Specification) cho Mini Project nhóm.<br>- Biên soạn đề bài Mini Project nhóm.<br>- Chuẩn bị 1 link Git Demo (Source code mẫu hoàn chỉnh, khác chủ đề với đồ án của học viên để tránh sao chép trực tiếp). |
| **Session 09** | **Hackathon** | - Buổi thực hành tập trung giải quyết bài toán thực tế nhanh hoặc hoàn thiện mốc dự án quan trọng dưới áp lực thời gian. |
| **Session 10** | **Giao tiếp bất đồng bộ & Event-Driven** | - **Lesson 01:** Giới thiệu về Asynchronous Service calls & Spring WebFlux<br>- **Lesson 02:** Cấu hình WebFlux trong Microservice<br>- **Lesson 03:** Distributed Messaging với Apache Kafka (Brokers, Topics, Partitions, Producers, Consumers)<br>- **Lesson 04:** Event-driven Architecture (Ưu điểm giảm Loose Coupling, tăng hiệu năng)<br>- **Lesson 05:** Cấu hình Apache Kafka trong Spring Boot. |
| **Session 11** | **Thực hành** | - Thực hành giao tiếp bất đồng bộ sử dụng Spring WebFlux và Apache Kafka. |
| **Session 12** | **Kháng lỗi hệ thống (Fault Tolerance)** | - **Lesson 01:** Cascading Failure (Lỗi dây chuyền) trong Microservice<br>- **Lesson 02:** Giới thiệu cơ chế Fault Tolerance<br>- **Lesson 03:** Ba trạng thái của Circuit Breaker (Closed, Open, Half-Open)<br>- **Lesson 04:** Cấu hình Circuit Breaker với Resilience4j. |
| **Session 13** | **Thực hành** | - Thực hành cấu hình kháng lỗi hệ thống với Resilience4j (Circuit Breaker, Rate Limiter, Retry). |
| **Session 14** | **Quản lý giao dịch phân tán (Saga)** | - **Lesson 01:** Distributed Transactions (Phân tích tính chất ACID và CAP theorem)<br>- **Lesson 02:** Giới thiệu về Saga Pattern<br>- **Lesson 03:** Cấu hình Choreography-based Saga (Hướng sự kiện)<br>- **Lesson 04:** Cấu hình Orchestrator-based Saga (Hướng điều phối). |
| **Session 15** | **Thực hành** | - Thực hành triển khai và cấu hình Saga Pattern (Choreography hoặc Orchestrator) để đảm bảo tính nhất quán dữ liệu giữa các service. |
| **Session 16** | **Tối ưu hiệu năng (Caching)** | - **Lesson 01:** Distributed Caching trong Microservice<br>- **Lesson 02:** Giới thiệu về Spring Cache kết hợp Redis<br>- **Lesson 03:** Chiến lược Cache-Aside Pattern<br>- **Lesson 04:** Cấu hình kết nối Redis (áp dụng `@Cacheable`, `@CachePut`, `@CacheEvict`). |
| **Session 17** | **Thực hành** | - Thực hành tối ưu hiệu năng thông qua Redis Caching cho các API đọc nhiều, ít thay đổi. |
| **Session 18** | **Mini Project tổng hợp (Giai đoạn 2)** | - Làm 1 bài kiểm tra 45 phút (đánh giá cá nhân phần nâng cao).<br>- Cập nhật SRS cho Mini Project nhóm.<br>- Đề bài Mini Project hoàn chỉnh.<br>- Cập nhật link Git Demo tích hợp Kafka, Circuit Breaker, Saga, Redis. |

---

## 3. Đề xuất cải tiến & Bổ sung (Suggestions for Curriculum Expansion)

Để môn học thực tiễn hơn và tiệm cận với tiêu chuẩn công nghiệp hiện nay, dưới đây là các phần **khuyến nghị bổ sung** mà giảng viên hoặc AI có thể gợi ý tích hợp vào học liệu:

### 💡 Đề xuất 1: Bảo mật trong Microservices (Microservices Security) - [Đã bổ sung thành Session 07.1]
*   **Vấn đề hiện tại:** Khung chương trình chưa đề cập đến bảo mật. Một hệ thống microservices thực tế không thể thiếu cơ chế xác thực và phân quyền tập trung.
*   **Nội dung bổ sung đề xuất:**
    *   Sử dụng **Keycloak** hoặc tự dựng **OAuth2 Authorization Server** với Spring Security.
    *   Cấu hình API Gateway làm điểm đầu mối xác thực (Authentication Gateway), chuyển đổi JWT thành User Context truyền xuống các service phía sau.
    *   Phân quyền chi tiết (RBAC - Role-Based Access Control) tại từng Microservice thông qua Spring Security Method Security (`@PreAuthorize`).
*   **Nơi tích hợp tốt nhất:** Sau *Session 07 (Thực hành Gateway)* hoặc lồng ghép vào *Session 08 (Mini Project)*.

### 💡 Đề xuất 2: Giám sát và Vết luồng hệ thống (Observability & Distributed Tracing)
*   **Vấn đề hiện tại:** Khi chạy hàng chục service, việc debug lỗi rất khó khăn nếu không biết request bị lỗi ở bước nào.
*   **Nội dung bổ sung đề xuất:**
    *   **Distributed Tracing:** Sử dụng **Micrometer Tracing** (thay thế cho Spring Cloud Sleuth ở Boot 3.x) kết hợp với **Zipkin** hoặc **Jaeger** để theo dõi vết của một request qua nhiều service.
    *   **Metrics & Monitoring:** Sử dụng **Spring Boot Actuator**, thu thập metrics bằng **Prometheus** và trực quan hóa bằng dashboard của **Grafana**.
    *   **Centralized Logging:** Giới thiệu cơ bản về ELK Stack (Elasticsearch, Logstash, Kibana) hoặc PLG Stack (Prometheus, Loki, Grafana) để gom log tập trung.
*   **Nơi tích hợp tốt nhất:** Tích hợp vào *Session 13 (Thực hành Kháng lỗi)* vì khi hệ thống lỗi, giám sát là công cụ đầu tiên cần sử dụng.

### 💡 Đề xuất 3: Container hóa và Triển khai (Docker & Docker Compose) - [Đã bổ sung thành Session 04.1]
*   **Vấn đề hiện tại:** Học viên chạy local từng service bằng IDE sẽ rất tốn tài nguyên và khó quản lý các dịch vụ đi kèm như Kafka, Redis, Eureka, Postgres.
*   **Nội dung bổ sung đề xuất:**
    *   Viết `Dockerfile` tối ưu cho Spring Boot (Sử dụng Multi-stage build để giảm dung lượng image).
    *   Viết file `docker-compose.yml` để khởi chạy toàn bộ hạ tầng (Postgres, Redis, Kafka, Eureka, Config Server, API Gateway) chỉ bằng 1 câu lệnh.
*   **Nơi tích hợp tốt nhất:** Ngay tại *Session 04 (Thực hành Eureka/Config Server)* để từ Session 05 trở đi học viên có thể chạy hạ tầng qua Docker Compose.

### 💡 Đề xuất 4: Quản lý Migration Database trong Microservices
*   **Vấn đề hiện tại:** Với mô hình *Database-per-service*, việc đồng bộ cấu trúc bảng và dữ liệu mẫu giữa các môi trường (Dev, Staging, Production) rất phức tạp nếu làm bằng tay.
*   **Nội dung bổ sung đề xuất:**
    *   Sử dụng **Flyway** hoặc **Liquibase** tích hợp trực tiếp vào từng Spring Boot service để tự động chạy các script migration khi khởi động ứng dụng.
*   **Nơi tích hợp tốt nhất:** Lồng ghép vào *Session 02 (Lesson 04 - Thiết kế Database)*.

### 💡 Đề xuất 5: Kiểm thử Microservices (Contract Testing)
*   **Vấn đề hiện tại:** Kiểm thử tích hợp giữa các service (Integration Testing) rất dễ bị vỡ khi một service thay đổi API mà service khác chưa kịp cập nhật.
*   **Nội dung bổ sung đề xuất:**
    *   Giới thiệu **Consumer-Driven Contract Testing** sử dụng **Pact framework** hoặc **Spring Cloud Contract**.
    *   Sử dụng **WireMock** để giả lập các service phụ thuộc khi viết Unit/Integration Test độc lập.
*   **Nơi tích hợp tốt nhất:** Đưa vào tài liệu hướng dẫn làm bài *Mini Project* hoặc bổ sung vào một buổi thực hành.

---

## 4. Hướng dẫn thiết kế học liệu dành cho AI (AI Prompting Rules)

Khi yêu cầu AI viết bài giảng, bài thực hành hoặc đề thi cho môn học này, hãy yêu cầu tuân thủ các quy tắc sau:

1.  **Phiên bản đồng nhất:** Luôn sử dụng Spring Boot 3.x, Java 17+, Maven/Gradle mới, Spring Cloud tương thích (ví dụ: Spring Cloud Gateway, Resilience4j, Spring Cloud OpenFeign thay vì các thư viện đã deprecated như Zuul, Hystrix, Ribbon).
2.  **Domain nghiệp vụ thực tế:** Sử dụng một domain xuyên suốt (ví dụ: E-commerce với `Product Service`, `Order Service`, `Inventory Service`, `Notification Service`, `Payment Service`). Điều này giúp học viên dễ hình dung sự liên kết giữa các bài học.
3.  **Code sạch & Cấu trúc chuẩn:** Cung cấp code có cấu trúc thư mục rõ ràng, phân chia các layer (`Controller`, `Service`, `Repository`, `DTO`, `Entity`, `Exception Handler`) chuẩn mực.
4.  **Hướng dẫn từng bước (Step-by-step):** Bài thực hành phải chỉ rõ:
    *   Dependencies cần thêm trong `pom.xml` / `build.gradle`.
    *   Cấu hình chi tiết trong file `application.yml` (hoặc cấu hình trên Config Server).
    *   Các annotation cần thiết trên Main class hoặc Configuration class.
    *   Cách chạy và kiểm tra kết quả (sử dụng Postman, cURL hoặc trình duyệt).
5.  **Luôn giải thích lý do (The "Why"):** Không chỉ đưa code mẫu, cần giải thích rõ tại sao sử dụng giải pháp này, ưu nhược điểm so với giải pháp khác.
