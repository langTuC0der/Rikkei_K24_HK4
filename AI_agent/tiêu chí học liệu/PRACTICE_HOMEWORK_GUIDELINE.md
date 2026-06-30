# HƯỚNG DẪN THIẾT KẾ BÀI TẬP CHO CÁC BUỔI THỰC HÀNH (PRACTICE SESSIONS)
## Môn học: AI Application in Action

Tài liệu này quy định các tiêu chuẩn, cấu trúc và tiêu chí chấm điểm khi xây dựng hệ thống bài tập về nhà dành riêng cho các buổi Thực hành (như Session 04, 06, 08, 12) trong môn học "AI Application in Action". 

Các bài tập này tuy được tính là bài tập về nhà (Homework) nhưng bản chất là sinh viên sẽ thực hành trực tiếp ngay trên lớp dưới sự hướng dẫn của giảng viên. Do đó, thiết kế bài tập cần đảm bảo tính thực chiến, liền mạch và đòi hỏi sinh viên phải tự tay tương tác với AI để sinh mã nguồn, thay vì chỉ dừng lại ở phân tích lý thuyết hay chọn đáp án có sẵn.

---

## I. Nguyên Tắc Thiết Kế Cốt Lõi

### 1. Học thông qua hành (Action-Oriented Learning)
*   **Nguyên tắc:** Loại bỏ hoàn toàn các dạng bài tập chỉ yêu cầu Lựa chọn đáp án (A, B, C) hoặc Phân tích lý thuyết thuần túy mà không bắt buộc viết prompt.
*   **Yêu cầu:** Mọi bài tập từ Bài 1 đến Bài 5 đều bắt buộc sinh viên phải tự tay viết Prompt gửi cho AI, phân tích kết quả và sao chép mã nguồn Java do AI sinh ra vào file làm bài.

### 2. Tính liền mạch của hệ thống (Seamless Case Study)
*   **Nguyên tắc:** Hạn chế tối đa việc thiết kế các bài tập nhỏ lẻ, rời rạc không liên quan đến nhau. Khuyến khích xây dựng một bối cảnh dự án xuyên suốt (ví dụ: Hệ thống ví điện tử, Hệ thống đặt đồ ăn trực tuyến, Cổng thanh toán...).
*   **Yêu cầu:** Các bài tập 1, 2, 3, 4 sẽ lần lượt là các module hoặc các bước phát triển của dự án đó, đi từ khâu chọn kiến trúc -> viết thuật toán lõi -> refactor code -> tích hợp API bên thứ ba -> thiết kế nâng cấp mở rộng.

### 3. Phân bổ thời lượng và độ khó hợp lý
*   **Thời lượng ước tính:**
    *   **Bài 1 đến Bài 4 (Thực hành tổng hợp):** Thiết kế cho sinh viên làm trong khoảng 30 - 50 phút mỗi bài. Các bài tập này bám sát trực tiếp vào kiến thức lý thuyết đã học ở session ngay trước đó.
    *   **Bài 5 (Sáng tạo & Nâng cao):** Thiết kế cho sinh viên làm trong khoảng 60 - 90 phút. Đây là bài toán mở hoàn toàn, có độ khó cao, yêu cầu thiết kế hệ thống chịu lỗi hoặc tích hợp xử lý sự kiện phức tạp.

---

## II. Cấu Trúc Hệ Thống 5 Bài Tập Thực Hành

### 1. Bài 1 đến Bài 4: Thực hành Tổng hợp (Mức độ Khá -> Giỏi)
Mỗi bài tập tập trung vào một kỹ năng prompting nâng cao cụ thể, bắt buộc có đủ phần thiết kế prompt và sinh mã nguồn:
*   **Bài 1 (Multiple Options & What-if Scenario):** Thực hành yêu cầu AI tư vấn kiến trúc/thư viện lưu trữ, lập bảng so sánh và đánh giá rủi ro khi có sự cố sập hệ thống (What-if).
*   **Bài 2 (Chain-of-thought - CoT):** Thực hành hướng dẫn AI phân tích nghiệp vụ tính toán phức tạp theo từng bước, chạy thử dry-run bằng văn bản trước khi viết code Java (sử dụng `BigDecimal` để đảm bảo độ chính xác).
*   **Bài 3 (Output Refinement - Robustness & Maintainability):** Thực hành nâng cấp một đoạn code Java thô sơ "chạy được nhưng chưa tốt" thành code đạt chuẩn doanh nghiệp qua quy trình 3 vòng (Validation & Exceptions -> Transaction & Log SLF4J -> JUnit Mockito Test).
*   **Bài 4 (Technical Learning):** Thực hành đặt câu hỏi để học nhanh một công nghệ/thư viện mới (như WebClient, Spring AOP, Kafka), lập bảng so sánh với công nghệ cũ và sinh code demo tích hợp có xử lý lỗi.

### 2. Bài 5: Sáng tạo nâng cao (Mức độ Xuất sắc)
*   **Mô tả:** Bài toán nghiệp vụ lớn, chịu tải cao và chịu lỗi (Fault-tolerant high-load system) chưa được định hình chi tiết.
*   **Yêu cầu:** Sinh viên tự thiết kế giải pháp xử lý, phân tích bẫy dữ liệu và kịch bản sập dịch vụ (What-if), xây dựng workflow 3 bước tương tác với AI và sao chép toàn bộ log chat chạy thực tế chứng minh tính đúng đắn của giải pháp.

---

## III. Tiêu Chí Chấm Điểm Chi Tiết Cho AI (Strict Rubric for AI Grader)

Mỗi bài tập trong số 5 bài tập đều được tính độc lập trên **thang điểm 100**.

### 1. Rubric cho Bài 1 đến Bài 4 (Thực hành tổng hợp)
*   **Thiết kế Prompt tối ưu (30% số điểm):** Prompt sinh viên tự thiết kế phải chuyên nghiệp, có đầy đủ các thành phần cốt lõi (Role, Goal, Context, Constraint, Format) và áp dụng đúng kỹ thuật nâng cao được yêu cầu của bài đó.
*   **Phân tích kỹ thuật & Đánh giá (30% số điểm):** Phần trình bày lập luận bằng văn bản của sinh viên về kiến trúc, sự đánh đổi hoặc thuật toán phải rõ ràng, logic và chính xác.
*   **Chất lượng mã nguồn Java sinh ra (40% số điểm):** Mã nguồn Java do AI phản hồi (được sinh viên dán vào file bài làm) phải hoạt động chính xác, sạch sẽ, không lỗi cú pháp, có validate đầu vào và bắt ngoại lệ đầy đủ.

### 2. Rubric cho Bài 5 (Sáng tạo nâng cao)
*   **Phân tích & Thiết kế giải pháp (30% số điểm):** Trình bày rõ ràng bài toán tự định nghĩa, sơ đồ luồng dữ liệu xử lý (khuyến khích sơ đồ ASCII) và cách giải quyết bài toán chống trùng lặp (Idempotency).
*   **Chất lượng Prompt/Workflow (30% số điểm):** Prompt có tính phòng thủ cao, lường trước các kịch bản What-if sập dịch vụ trung gian, cấu hình tham số hàng đợi/bộ đệm an toàn.
*   **Kiểm chứng thực tế & Mã nguồn (40% số điểm):** Cung cấp đầy đủ text log hội thoại 3 bước trực tiếp trong file. Mã nguồn Listener/Consumer Java do AI sinh ra phải hoàn chỉnh, có cơ chế lưu vết log, xử lý lỗi Dead Letter Queue và đảm bảo idempotency.

---

## IV. Quy Định Nộp Bài Nghiêm Ngặt

Để hệ thống AI chấm bài tự động hoạt động chính xác và chống gian lận học thuật:
1.  Sinh viên chỉ được nộp **01 file Markdown duy nhất (.md)**.
2.  Tất cả các bài chạy thử nghiệm với AI (từ Bài 1 đến Bài 5) **bắt buộc phải sao chép toàn bộ text log cuộc hội thoại** (bao gồm prompt của sinh viên và câu trả lời của AI) dưới dạng khối mã code block Markdown.
3.  **Tuyệt đối nghiêm cấm** việc sử dụng ảnh chụp màn hình (screenshot) hoặc các đường link chia sẻ cuộc hội thoại (Share Link). Mọi vi phạm quy định này sẽ bị AI chấm bài đánh giá không hợp lệ và **trừ 100% số điểm** của phần thực nghiệm đó.
