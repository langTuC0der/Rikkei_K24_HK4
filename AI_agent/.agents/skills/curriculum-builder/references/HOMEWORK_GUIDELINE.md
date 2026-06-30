# HƯỚNG DẪN THIẾT KẾ HỆ THỐNG BÀI TẬP VỀ NHÀ
## Môn học: AI Application in Action

Tài liệu này quy định các tiêu chuẩn, cấu trúc và tiêu chí đánh giá khi xây dựng hệ thống bài tập về nhà (Homework) cho từng session trong môn học "AI Application in Action". Mục tiêu là đảm bảo tính thực tiễn, nhất quán nghiệp vụ, kích thích tư duy thiết kế prompt và kiểm chứng logic của sinh viên, đồng thời cung cấp các tiêu chuẩn chấm điểm rõ ràng để AI chấm bài có thể hoạt động chính xác.

---

## I. Nguyên Tắc Cốt Lõi Khi Thiết Kế Bài Tập

Hệ thống bài tập cần tuân thủ các nguyên tắc tinh giản nhưng hiệu quả dưới đây nhằm giảm bớt sự khắt khe không cần thiết, tập trung vào trải nghiệm học tập của sinh viên:

### 1. Đóng HOW - Mở WHAT & WHY
*   **Nguyên tắc:** Giảng viên chỉ đưa ra đích đến (What) và lý do dự án cần tính năng đó (Why). Không hướng dẫn từng bước thuật toán hay các câu lệnh lập trình cụ thể.
*   **Mục tiêu:** Sinh viên đóng vai trò là người thiết kế giải pháp và prompt để AI hỗ trợ triển khai, chấm dứt tư duy thụ động.

### 2. Tư Duy Đi Trước, Hành Động Theo Sau
*   **Nguyên tắc:** Mọi bài tập đều yêu cầu sinh viên phân tích bối cảnh, xác định dữ liệu đầu vào/đầu ra (Input/Output) và thiết kế cấu trúc prompt trước khi thực hiện chạy thử nghiệm.
*   **Điều chỉnh tinh giản:** Không bắt buộc sinh viên phải vẽ sơ đồ luồng dữ liệu (flowchart) phức tạp cho tất cả các bài tập. Sơ đồ chỉ bắt buộc đối với các bài tập sáng tạo hoặc các bài toán có luồng xử lý phân nhánh phức tạp.

### 3. Lưu ý thiết kế (Khuyến khích thực hiện, không bắt buộc)
*   **Nhúng Bối Cảnh Thực Tế & Hệ Sinh Thái Nghiệp Vụ Đồng Nhất:** Khuyến khích đặt bài tập trong một bối cảnh dự án hoặc nghiệp vụ thực tế (như FinTech, E-commerce, EdTech...) để tăng tính thực tiễn. Tuy nhiên, nguyên tắc này không bắt buộc và giảng viên có thể linh hoạt thay đổi bối cảnh giữa các bài tập nếu việc tìm bối cảnh đồng nhất gặp khó khăn, tránh gò bó cứng nhắc.
*   **Cài Cắm "Bẫy Dữ Liệu" (Edge Cases):** Khuyến khích đưa thêm một số kịch bản ngoại lệ (nhập trống, dữ liệu lỗi...) để giúp sinh viên rèn luyện tư duy biên khi viết prompt, nhưng không bắt buộc phải áp dụng cho mọi bài tập.

---

## II. Cấu Trúc Hệ Thống 5 Bài Tập Mỗi Session

Mỗi session bắt buộc phải thiết kế đúng **5 bài tập** với độ khó tăng dần từ trung bình-khá đến giỏi và xuất sắc.

### 1. Bài 1 đến Bài 4: Bài Tập Standard / Củng Cố (Mức độ Khá -> Giỏi)
Các bài tập này nhằm củng cố trực tiếp kiến thức cốt lõi của session hiện tại. Giảng viên cần linh hoạt áp dụng các dạng bài tập dưới đây thay vì rập khuôn một kiểu:
*   **Dạng Phân tích và Lựa chọn (Analysis & Selection):** Đưa ra một tình huống nghiệp vụ và cung cấp sẵn 3-4 phương án prompt (hoặc cách tiếp cận logic). Yêu cầu sinh viên lựa chọn phương án tối ưu nhất, giải thích chi tiết lý do dựa trên kiến thức đã học và phân tích tại sao các phương án còn lại chưa tốt.
*   **Dạng Tối ưu Prompt (Prompt Refinement):** Cung cấp một prompt thô sơ, thiếu cấu trúc dẫn đến đầu ra của AI bị lỗi hoặc không đầy đủ thông tin. Sinh viên phải áp dụng các kỹ thuật trong session để viết lại prompt tối ưu, xử lý các bẫy dữ liệu và đạt kết quả mong muốn.
*   **Dạng Đọc hiểu và Dò lỗi (Code Tracing & AI Verification):** Cung cấp một đoạn mã Java ngắn chứa lỗi logic và một prompt mẫu. Sinh viên phân tích tại sao prompt mẫu không giúp AI phát hiện ra lỗi, sau đó thiết kế một prompt mới để AI tìm ra lỗi và đề xuất bản vá chuẩn xác.

### 2. Bài 5: Bài Tập Sáng Tạo (Mức độ Xuất sắc)
*   **Mô tả:** Đây là bài tập mở hoàn toàn và là bài duy nhất yêu cầu tính sáng tạo vượt bậc. Đề bài đưa ra một nhu cầu nghiệp vụ lớn chưa được định hình chi tiết của khách hàng.
*   **Yêu cầu:** Sinh viên tự đóng vai kỹ sư thiết kế: định nghĩa chi tiết yêu cầu bài toán, thiết kế giải pháp hệ thống, xây dựng prompt/workflow hoàn chỉnh và thực hiện chạy thử nghiệm thực tế với AI để chứng minh tính hiệu quả của giải pháp.

---

## III. Bài Tập Tự Thực Hành Có Hướng Dẫn (Tutorial Homework)

Mỗi session (ngoại trừ Session 1 và các session thực hành thực tế 4, 6, 8, 12) sẽ đi kèm một tài liệu hướng dẫn tự thực hành độc lập, đặt tên là `session_xx_tutorial_homework.md`.

*   **Mục tiêu:** Giúp sinh viên củng cố kiến thức lý thuyết ngay sau khi học xong lesson bằng cách tự thực hành tương tác từng bước (step-by-step) với AI.
*   **Tính chất:** Đây là bài tập **Tự học / Tự thực hành**, hoàn toàn không yêu cầu sinh viên phải nộp bài, không có hướng dẫn nộp bài hay kiểm tra, và không có tiêu chí chấm điểm.
*   **Thời lượng ước tính:** Khoảng 30 phút.
*   **Cấu trúc nội dung:**
    1.  **Mục tiêu & Chuẩn bị:** Nêu rõ các kỹ năng sẽ đạt được sau bài thực hành và các công cụ cần mở sẵn (AI, IDE...).
    2.  **Kịch bản & Hướng dẫn từng bước:** Dẫn dắt sinh viên thực hiện từng bước (sử dụng code mẫu, viết prompt thô, gửi AI, quan sát và phân tích hành vi ảo tưởng hoặc kết quả chưa tối ưu của AI, sau đó viết prompt nâng cấp có cấu trúc, chat điều chỉnh lặp để tối ưu kết quả).

---

## IV. Giới Hạn Phạm Vi Kiến Thức Theo Session

Để tránh làm sinh viên bị ngợp và đảm bảo tính sư phạm:
*   **Nguyên tắc:** Mức độ khó và kiến thức yêu cầu trong các bài tập phải nằm hoàn toàn trong phạm vi của Session đó hoặc các Session trước đó.
*   **Nghiêm cấm:** Đưa các kỹ thuật nâng cao hoặc công cụ chưa học vào đề bài.
    *   *Ví dụ:* Tại Session 3 (Kỹ thuật đặt Prompt căn bản), bài tập chỉ yêu cầu sinh viên áp dụng cấu trúc Prompt 5 thành phần để xử lý văn bản đơn giản. Không được yêu cầu sinh viên sử dụng Chain-of-thought (học ở Session 5) hoặc tạo mã nguồn dự án bằng Antigravity (học ở Session 11).

---

## V. Quy Định Nhúng Mã Nguồn Java

Môn học này tập trung vào tư duy làm việc với AI và kỹ thuật prompting, không phải môn học thuần code. Tuy nhiên, sinh viên đã có nền tảng Java từ trước:
*   **Mục đích sử dụng Java:** Chỉ sử dụng Java làm ngữ cảnh nghiệp vụ, mã nguồn mẫu cần tối ưu, hoặc hiện trường chứa lỗi để sinh viên viết prompt tương tác.
*   **Quy định:**
    *   Không yêu cầu sinh viên viết thủ công các đoạn code Java dài hoặc phức tạp từ đầu.
    *   Tập trung vào việc viết prompt yêu cầu AI giải thích code Java, tối ưu code cũ theo tiêu chuẩn Clean Code, viết test case, hoặc sinh mã nguồn tự động từ prompt.
    *   Đoạn code Java mẫu đưa vào đề bài phải ngắn gọn (dưới 50 dòng), rõ ràng và tập trung trực tiếp vào logic nghiệp vụ cần xử lý.

---

## VI. Tiêu Chí Chấm Điểm Chi Tiết Cho AI (Strict Rubric for AI Grader)

Bộ tiêu chí này được thiết kế theo dạng quy tắc nghiêm ngặt để AI chấm bài có thể đánh giá bài làm của sinh viên một cách khách quan và nhất quán:

*   **Quy định thang điểm:** Mỗi bài tập trong số 5 bài tập đều áp dụng độc lập **thang điểm 100** (mỗi bài được tính tối đa 100 điểm, không cộng dồn hay phân chia điểm số chung giữa các bài).
*   **Điểm số thành phần:** Điểm thành phần của từng bài tập sẽ được quy định cụ thể dưới thang điểm 100 này (ví dụ: các tiêu chí con cộng lại bằng 100 điểm cho mỗi bài).


### 1. Rubric cho Dạng Bài tập Phân tích và Lựa chọn
*   **Lựa chọn đáp án (30% số điểm):** Chọn chính xác phương án tối ưu theo đáp án của giảng viên.
*   **Phân tích phương án chọn (40% số điểm):** Giải thích rõ ràng tại sao phương án đó tối ưu (ví dụ: chỉ ra các từ khóa, cấu trúc vai trò, ngữ cảnh hoặc ràng buộc được thiết lập tốt trong prompt đã chọn).
*   **Phân tích phương án loại trừ (30% số điểm):** Chỉ rõ nhược điểm hoặc lỗ hổng logic của các phương án còn lại (ví dụ: thiếu ràng buộc định dạng đầu ra, dễ dẫn đến hiện tượng AI ảo tưởng thông tin, hoặc bỏ sót bẫy dữ liệu).

### 2. Rubric cho Dạng Bài tập Tối ưu/Viết Prompt
*   **Cấu trúc Prompt (30% số điểm):** Prompt sinh viên viết phải chứa đầy đủ các thành phần cốt lõi của session (ví dụ: đối với Session 3 phải có đủ: Vai trò, Mục tiêu, Ngữ cảnh, Ràng buộc, Định dạng).
*   **Xử lý ngoại lệ/Bẫy dữ liệu (30% số điểm):** Prompt có các câu lệnh hoặc điều kiện tường minh để hướng dẫn AI xử lý các trường hợp biên hoặc dữ liệu bất thường (Edge Cases). *(Lưu ý: Chỉ áp dụng nếu đề bài yêu cầu xử lý lỗi biên. Nếu đề bài không cài cắm bẫy dữ liệu, 30% số điểm này sẽ được cộng gộp vào phần Kết quả đầu ra).*
*   **Kết quả đầu ra (40% số điểm):** Kết quả AI sinh ra từ prompt của sinh viên phải chính xác, khớp hoàn toàn với yêu cầu nghiệp vụ và định dạng mong muốn của đề bài.

### 3. Rubric cho Dạng Bài tập Sáng tạo (Bài 5)
*   **Phân tích & Thiết kế giải pháp (30% số điểm):** Trình bày rõ ràng bài toán tự định nghĩa, xác định chính xác Input/Output và các bước xử lý logic (đánh giá cao nếu có sơ đồ ASCII mô tả luồng).
*   **Chất lượng Prompt/Workflow (40% số điểm):** Prompt có cấu trúc chuyên nghiệp, chặt chẽ, áp dụng hiệu quả các kỹ thuật của session và xử lý tốt các bẫy dữ liệu tự giả định.
*   **Kiểm chứng thực tế (30% số điểm):** Cung cấp đầy đủ minh chứng chạy thử nghiệm thành công bằng cách sao chép đầy đủ nội dung cuộc hội thoại dưới dạng văn bản (text log/markdown block) trực tiếp vào tệp bài làm. Kết quả hiển thị mượt mà, thân thiện và không bị crash logic khi gặp dữ liệu thử nghiệm dị biệt. Tuyệt đối không chấp nhận đường link chia sẻ cuộc hội thoại.

---

## VII. Hướng Dẫn Nộp Bài Dành Cho Sinh Viên

Sinh viên cần tuân thủ cấu trúc nộp bài dưới đây để hệ thống AI chấm bài tự động có thể quét và ghi nhận kết quả:

### 1. Định dạng và Tên file nộp
*   Sinh viên nộp bài dưới dạng text, bắt buộc sử dụng **một file Markdown duy nhất (.md)**.
*   Tên file Markdown phải đặt theo cú pháp:
    `[Session_XX]_[Họ_và_Tên]_[Mã_Sinh_Viên].md`
    *Ví dụ:* `SS03_NguyenVanA_HE150123.md`

### 3. Cấu trúc nội dung file Markdown
Nội dung file Markdown phải sử dụng các thẻ tiêu đề rõ ràng để AI chấm bài dễ dàng phân tách thông tin:
1.  **Thông tin cá nhân:** Họ và tên, Mã sinh viên, Lớp, Link Github (nếu có).
2.  **Nội dung Bài 1 đến Bài 4:**
    *   Đáp án lựa chọn hoặc nội dung Prompt sinh viên thiết kế (nằm trong khối code markdown).
    *   Phần phân tích, giải thích chi tiết (sử dụng gạch đầu dòng rõ ràng).
    *   Kết quả phản hồi của AI (nằm trong khối code markdown).
3.  **Nội dung Bài 5 (Sáng tạo):**
    *   Bối cảnh, vai trò và mô tả bài toán tự thiết kế.
    *   Thiết kế luồng logic (bằng văn bản hoặc sơ đồ ASCII).
    *   Nội dung Prompt/Workflow hoàn chỉnh.
    *   **Bắt buộc:** Sao chép đầy đủ nội dung cuộc hội thoại dưới dạng văn bản (text log/markdown block) trực tiếp vào file bài làm để minh họa kết quả chạy thực tế.

> [!WARNING]
> Cách duy nhất được chấp nhận để làm minh chứng chạy thực tế là sao chép trực tiếp toàn bộ nội dung văn bản cuộc trò chuyện (text log) vào tệp Markdown. Mọi bài nộp sử dụng link chia sẻ cuộc hội thoại (Share Link) hoặc ảnh chụp màn hình (screenshot) sẽ bị AI chấm bài đánh giá là không hợp lệ và bị trừ 100% số điểm của phần thực nghiệm đó để đảm bảo tính trung thực học thuật.
