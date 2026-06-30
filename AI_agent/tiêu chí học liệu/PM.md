# HƯỚNG DẪN QUẢN LÝ MÔN HỌC & ĐỊNH HƯỚNG HỌC LIỆU (PM)
## MÔN HỌC: AI INTEGRATED IN ACTION (SPRING BOOT & JAVA ECOSYSTEM)

Tài liệu này xác định mục tiêu, cấu trúc tổng thể và các hướng dẫn quản lý (Program Management) dành cho toàn bộ khóa học **AI Integrated in Action**. Tài liệu làm cơ sở để giảng viên, trợ giảng và điều phối viên học liệu kiểm soát chất lượng đào tạo và xây dựng nội dung bài giảng đồng nhất.

---

## 1. TỔNG QUAN KHÓA HỌC

* **Tên môn học**: AI Integrated in Action
* **Đối tượng học viên**: Sinh viên chuyên ngành Công nghệ thông tin (K24), lập trình viên Java/Spring Boot.
* **Thời lượng**: 15 Sessions lý thuyết & thực hành + 1 Buổi thi cuối kỳ.
* **Định hướng cốt lõi**:
  * **Java & Spring Boot First**: Toàn bộ mã nguồn, demo và thư viện chính được giảng dạy bằng ngôn ngữ **Java** (Spring AI, Spring Boot Starter Mail, Pgvector JDBC/Spring Data,...). Tuyệt đối không dùng JavaScript hoặc Python cho các phần code lõi của học viên.
  * **Thực chiến doanh nghiệp**: Tập trung giải quyết các bài toán nghiệp vụ thực tế (ETL trích xuất thông tin, Trợ lý đặt phòng tự động, Trợ lý gửi mail tự động, Chatbot tra cứu tài liệu nội bộ, Data Analyst tự động,...).
  * **Hạ tầng Hybrid (Local + Cloud)**: SV được tiếp cận cả Local LLM (Ollama) để tối ưu tính bảo mật/chi phí, và Cloud API (OpenRouter, DeepSeek) để test nhanh và triển khai ứng dụng thực tế.

---

## 2. KHUNG CHƯƠNG TRÌNH CHI TIẾT (15 SESSIONS)

| Session | Chủ đề chính | Cấu trúc bài học chi tiết & Gợi ý nội dung |
| :--- | :--- | :--- |
| **Session 01** | **Định hướng môn học AI Integrated in Action** | **Định hướng học tập đầu môn học**:<br>- Giới thiệu tổng quan về nội dung, kiến thức cốt lõi (Spring AI, RAG, Agents, MCP, LLMOps).<br>- Tại sao cần học môn học này? Nếu không bắt kịp làn sóng AI Agent, lập trình viên sẽ bị giảm năng suất và mất ưu thế cạnh tranh ra sao. |
| **Session 02** | **Tích hợp LLM & chuẩn hóa dữ liệu với Spring AI** | **Lesson 01: Quản lý môi trường AI: Cloud API vs. Local LLMs với Ollama**<br>- *Ollama*: Chạy cục bộ Llama3/Qwen (Free, Private).<br>- *Cloud API*: Cấu hình kết nối trực tiếp (DeepSeek API) vs kết nối Hub trung gian (OpenRouter).<br>- *Spring Profiles*: Switch linh hoạt giữa các runtime mà không cần sửa code logic.<br><br>**Lesson 02: Kiến trúc Spring AI, thiết kế Loosely Coupled**<br>- Lý thuyết: Tokenization, Context Window, Hyperparameters, cách tính toán chi phí token.<br>- Cấu trúc Spring AI Abstraction: `ChatModel`, `Prompt`, `ChatResponse`. Thiết kế Loosely Coupled.<br><br>**Lesson 03: Xây dựng REST Controller, xử lý Stream API**<br>- Viết Endpoint nhận request, chuyển tiếp sang LLM API, cấu hình `ChatOptions` (Temperature, Top-P).<br><br>**Lesson 04: Chuẩn hóa dữ liệu đầu ra với Structured Output API**<br>- Kỹ thuật ép kiểu dữ liệu trả về sử dụng `StructuredOutputConverter` và `BeanOutputConverter`.<br><br>**Lesson 05: Xây dựng Module trích xuất dữ liệu (ETL với AI)**<br>- Nhận prompt văn bản thô từ Client -> Gọi LLM -> Dùng `BeanOutputConverter` ép cấu trúc trả về đúng định dạng Java Record/POJO (`BookingRequest`) -> Lưu trực tiếp vào Database. |
| **Session 03** | **Thực hành tích hợp LLM, làm quen với Spring AI** | Thực hành củng cố các kỹ thuật kết nối LLM, xử lý Stream và Structured Output bằng Spring AI. |
| **Session 04** | **Xây dựng AI Agent & Kỹ thuật Function Calling** | **Lesson 01: Kiến trúc AI Agent & Quản lý trạng thái với Chat Memory**<br>- Cơ chế ghi nhớ ngữ cảnh bằng `ChatMemory` và quản lý hội thoại dài hạn.<br><br>**Lesson 02: Cơ chế, luồng chạy của Function Calling trong Spring AI**<br>- Cách LLM đọc định nghĩa hàm, quyết định gọi hàm và trao đổi tham số dưới dạng JSON.<br><br>**Lesson 03: Đóng gói Spring Boot Services thành Tool cho AI Agent**<br>- Biến các Java Services thông thường thành các công cụ (Tools) có mô tả chi tiết để LLM tự chọn.<br><br>**Lesson 04: Xây dựng Trợ lý Đặt phòng tự động (AI Booking Agent)**<br>- Triển khai hoàn chỉnh: Agent nhận diện Intent khách hàng -> Dùng `ChatMemory` nhớ ngày đặt -> Gọi tool `getRoomAvailability` check DB -> Gọi tool `calculateTotalPrice` tính tiền -> Trả lời khách. |
| **Session 05** | **Xây dựng AI Email Automation Agent** | **Lesson 01: Cấu hình Hạ tầng Gửi Mail & Spring Boot Mail**<br>- Google App Password, cấu hình SMTP (`spring-boot-starter-mail`). Gửi mail Text và HTML qua Thymeleaf.<br><br>**Lesson 02: Thiết kế Email Agent Core & Nhận diện Intent**<br>- Dùng Prompt Template huấn luyện Agent tự bóc tách: To, Subject, Body summary từ yêu cầu tự nhiên.<br><br>**Lesson 03: Đóng gói SMTP Service thành Tool Call cho AI**<br>- Đóng gói hàm gửi email của Spring Boot thành công cụ bằng Function Calling để AI tự kích hoạt khi đủ thông tin.<br><br>**Lesson 04: Xây dựng Hệ thống Trợ lý Thư ký Email Tự động (AI Email Secretary)**<br>- Luồng hoàn chỉnh: Agent tiếp nhận lệnh thô -> Gọi API nội bộ lấy dữ liệu -> Soạn thảo mail chuyên nghiệp -> Kích hoạt SMTP tool để gửi qua Gmail -> Báo cáo trạng thái thành công. |
| **Session 06** | **Thực hành xây dựng AI Email Automation Agent** | Thực hành hoàn thiện dự án gửi mail tự động và kiểm thử độ chính xác của Agent. |
| **Session 07** | **Vector Database & kiến trúc RAG** | **Lesson 01: Vector hóa dữ liệu text (Embeddings)**<br>- Tìm hiểu mô hình Embedding, cách chuyển đổi text sang vector số thực.<br><br>**Lesson 02: Cơ chế tìm kiếm độ tương đồng (Cosine Similarity)**<br>- Toán học đằng sau tìm kiếm ngữ nghĩa và so khớp khoảng cách vector.<br><br>**Lesson 03: Tổng quan về Vector Database**<br>- Phân tích các giải pháp Vector DB phổ biến: Pgvector, Milvus, Pinecone. Định hướng thực hành: Sử dụng Pgvector trên Supabase (Cloud Free).<br><br>**Lesson 04: Xây dựng tính năng Chatbot dựa trên tài liệu đã nạp**<br>- Upload file (PDF/Markdown) -> Code Java đọc file, chia nhỏ (Chunking) -> Lưu vector vào Pgvector. Tạo chatbot chỉ trả lời trong phạm vi tài liệu đã nạp. |
| **Session 08** | **Thực hành Vector Database, RAG với AI** | Thực hành hoàn thiện luồng RAG: Chunking tài liệu, lưu trữ vào Supabase Pgvector và truy vấn ngữ nghĩa. |
| **Session 09** | **Hackathon** | SV thi đấu thiết kế và phát triển giải pháp AI kết hợp Spring Boot giải quyết bài toán thực tế trong thời gian giới hạn. |
| **Session 10** | **LangChain & LLMOps với Langfuse** | **Lesson 01: Khởi tạo LangChain & Cấu hình Langfuse**<br>- Khởi chạy Langfuse bằng Docker tự host ($0 cost) để phục vụ giám sát mô hình.<br><br>**Lesson 02: Tích hợp Langfuse SDK, truy vết API (LLM Tracing)**<br>- Tích hợp SDK để log và theo dõi chi tiết toàn bộ các lượt gọi LLM từ ứng dụng Java.<br><br>**Lesson 3: Quản lý chi phí, giám sát luồng đi của AI Agent**<br>- Phân tích latency, lượng token tiêu thụ và vẽ bản đồ thực thi các bước của Agent.<br><br>**Lesson 04: Quản lý Prompt tập trung, đánh giá đầu ra của AI**<br>- Lưu trữ prompt tập trung trên Langfuse và cấu hình kiểm thử tự động chất lượng câu trả lời. |
| **Session 11** | **Thực hành với LangChain, Langfuse** | Thực hành tích hợp Langfuse vào ứng dụng Spring Boot hiện tại để giám sát và tối ưu hóa hệ thống Agent. |
| **Session 12** | **Kiến trúc MCP (Model Context Protocol)** | **Lesson 01: Tổng quan Kiến trúc MCP & Cấu hình Client**<br>- Hiểu giao thức MCP (Prompts, Resources, Tools). Cấu hình MCP Server có sẵn (GitHub, Postgres, FileSystem) vào AI Client (như Antigravity IDE).<br><br>**Lesson 02: Xây dựng MCP Server kết nối Hệ thống Nội bộ**<br>- Viết một MCP Server bằng SDK Java/Spring Boot qua giao thức Stdio. Expose `Resources` để AI đọc dữ liệu trực tiếp từ Database PostgreSQL nội bộ.<br><br>**Lesson 03: Tích hợp MCP Server với Spring AI (Java Ecosystem)**<br>- Kết nối ứng dụng Spring Boot với MCP Server. Định tuyến và mapping từ MCP Tools sang `ChatModel`/`ChatOptions` của Spring AI.<br><br>**Lesson 04: Xây dựng AI Data Analyst Agent qua MCP Tools**<br>- Khai báo Tools trên MCP Server cho phép AI thực thi lệnh sửa dữ liệu DB -> Tác nhân tự đọc DB -> Tự phân tích -> Tự xuất file báo cáo Markdown/Excel trả về hệ thống. |
| **Session 13** | **Thực hành cấu hình MCP** | Thực hành tự dựng MCP Server và kết nối với các ứng dụng AI Agent khác nhau để thao tác tệp và cơ sở dữ liệu. |
| **Session 14** | **Mini Project tổng hợp** | **Nhiệm vụ đánh giá**: Pin-point năng lực học viên trước khi kết thúc môn học:<br>1. Làm 1 đề kiểm tra lý thuyết & thực hành ngắn **45 phút** để lấy điểm cá nhân.<br>2. Soạn thảo **tài liệu SRS (Software Requirement Specification)** cho Mini Project theo nhóm.<br>3. Ban hành **đề bài Mini Project** theo nhóm.<br>4. Tạo **link Git chứa mã nguồn Demo** cho Mini Project (chủ đề Demo bắt buộc phải khác với dự án Capstone/Showcase chính của lớp). |
| **Session 15** | **Ôn tập cuối môn** | - Ôn tập lý thuyết và bài tập thực hành tổng hợp chuẩn bị cho kỳ thi cuối kỳ.<br>- Giảng viên chốt điểm hoạt động/thái độ và điểm danh (R-points) cho học viên lớp học. |
| **Final Exam** | **Thi thực hành cuối môn** | Kiểm tra năng lực code Java Spring AI và xây dựng Agent thực chiến của sinh viên. |

---

## 3. CÁC TIÊU CHUẨN XÂY DỰNG HỌC LIỆU

Để đảm bảo học liệu chất lượng cao, người biên soạn bài giảng bắt buộc phải đối chiếu với bộ tiêu chí trong các tài liệu hướng dẫn sau:
1. **Thiết kế Bài học (Lesson Content)**: Thực hiện theo đúng cấu trúc 7 phần của [CONTENT_DEVELOPMENT.md](file:///c:/Users/MChinh/Desktop/rikkei/AI_agent/ti%C3%AAu%20ch%C3%AD%20h%E1%BB%8Dc%20li%E1%BB%87u/CONTENT_DEVELOPMENT.md) (Mục tiêu, Đặt vấn đề, Kiến thức cốt lõi, Phân tích tình huống, Demo bằng mã nguồn Java, Tổng kết, Câu hỏi tự luận).
2. **Thiết kế Sơ đồ & Minh họa**: Bắt buộc vẽ sơ đồ dạng văn bản ASCII trực tiếp trong tài liệu học tập kèm theo đoạn mô tả tiếng Anh và Prompt DALL-E để người học tự sinh hình ảnh minh họa chất lượng cao.
3. **Quản lý Bài tập về nhà**:
   - Đối với bài lý thuyết/phân tích: Tuân thủ quy chuẩn chấm điểm và cấu trúc của [HOMEWORK_GUIDELINE.md](file:///c:/Users/MChinh/Desktop/rikkei/AI_agent/ti%C3%AAu%20ch%C3%AD%20h%E1%BB%8Dc%20li%E1%BB%87u/HOMEWORK_GUIDELINE.md).
   - Đối với bài thực hành lập trình: Tuân thủ cấu trúc của [PRACTICE_HOMEWORK_GUIDELINE.md](file:///c:/Users/MChinh/Desktop/rikkei/AI_agent/ti%C3%AAu%20ch%C3%AD%20h%E1%BB%8Dc%20li%E1%BB%87u/PRACTICE_HOMEWORK_GUIDELINE.md) (bắt buộc cung cấp skeleton code và các chốt chặn Assertions kiểm thử tự động).
4. **Quản lý Câu hỏi trắc nghiệm (Quiz)**:
   - Thực hiện theo quy chuẩn [QUIZ_FORMAT.md](file:///c:/Users/MChinh/Desktop/rikkei/AI_agent/ti%C3%AAu%20ch%C3%AD%20h%E1%BB%8Dc%20li%E1%BB%87u/QUIZ_FORMAT.md).
   - **Tuyệt đối không gộp chung Quiz vào file bài học khi chưa nghiệm thu xong lý thuyết.**
   - Lưu trữ Quiz trong các tệp tin tách biệt: `session_XX_quizz_dau_gio.md`, `session_XX_quizz_cuoi_gio.md`,... và tệp tổng hợp `quizz_exam.md` ở root.
5. **Định dạng Bản đồ tư duy**:
   - Các slide hoặc mindmap định hướng buổi học bắt buộc sử dụng định dạng Mermaid.js theo quy chuẩn [MINDMAP_FORMAT.md](file:///c:/Users/MChinh/Desktop/rikkei/AI_agent/ti%C3%AAu%20ch%C3%AD%20h%E1%BB%8Dc%20li%E1%BB%87u/MINDMAP_FORMAT.md).

---

## 4. QUY TRÌNH HỌC TẬP VÀ ĐÁNH GIÁ (R-POINTS)

* **R-points (Rikkei Points)**: Hệ thống điểm tích lũy dùng để ghi nhận thái độ học tập và mức độ đóng góp của sinh viên trong suốt môn học.
* **Quy tắc cộng/trừ R-points**:
  * Cộng điểm cho sinh viên phát hiện lỗi trong bài giảng, có giải pháp code tối ưu hơn giảng viên, hoặc tích cực đóng góp trong các buổi Hackathon/Mini Project.
  * Giảng viên chốt R-points vào cuối Session 15 để làm điểm cộng vào kết quả kiểm tra định kỳ hoặc thi thực hành cuối môn học.
