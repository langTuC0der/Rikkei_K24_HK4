# 📚 HỌC LIỆU CHI TIẾT: SESSION 02
## PROMPT ENGINEERING – CƠ BẢN (R-C-T-F-C-E, SHOT-PROMPTING & SYSTEM PROMPT ARCHITECTURE)

---

## 🗺️ TỔNG QUAN SESSION 02
* **Mục tiêu**: Thành thạo các kỹ thuật viết prompt cốt lõi, nắm vững cấu trúc prompt tiêu chuẩn R-C-T-F-C-E, biết cách chuyển dịch từ viết prompt tự do sang thiết kế System Prompt đa tầng (Multi-layer System Prompt Architecture), hiểu rõ cách tối ưu hóa Zero/One/Few-Shot và tận dụng Native Structured Output (Schema Enforcement) trên các mô hình thế hệ mới năm 2026.
* **Thời lượng học tập**: ~3 - 4 giờ (bao gồm lý thuyết, thực hành, bài tập và làm bài kiểm tra).
* **Cấu trúc**: 4 bài học chính (Lessons) và 1 phần kiểm tra (Quiz).

---

## 📖 BÀI HỌC CHI TIẾT

### 2.1. Lesson 2.1 — Anatomy of a Good Prompt (Giải phẫu Prompt — Phiên bản 2026)
* **Thời lượng**: ~45-60 phút
* **Mục tiêu**: Nắm vững 6 thành phần cốt lõi của một prompt hiệu quả thông qua cấu trúc R-C-T-F-C-E. Hiểu cách thiết kế Structured System Prompt thay vì viết các đoạn văn dài mơ hồ theo thói quen cũ.

#### 🔸 Lý thuyết: Cấu trúc R-C-T-F-C-E
Một câu lệnh chất lượng cao không phải là một câu hỏi ngẫu hứng, mà là một cấu trúc dữ liệu đầu vào được tổ chức chặt chẽ. Cấu trúc chuẩn hóa bao gồm:
1. **Role (Vai trò)**: AI đóng vai trò là ai? (Ví dụ: Chuyên gia bảo mật thông tin, Lập trình viên Backend).
2. **Context (Bối cảnh)**: Tình huống thực tế hoặc dữ liệu nền tảng là gì?
3. **Task (Nhiệm vụ)**: Yêu cầu AI phải thực hiện hành động cụ thể nào?
4. **Format (Định dạng)**: Đầu ra là JSON, XML, bảng Markdown, hay mã nguồn?
5. **Constraints (Ràng buộc)**: Những quy tắc nghiêm ngặt AI phải tuân thủ (ví dụ: Không dùng thư viện ngoài, tối đa 3 câu).
6. **Examples (Ví dụ mẫu)**: Cung cấp dữ liệu mẫu để AI bắt chước phong cách/định dạng mong muốn.

> [!NOTE]
> **Hình minh họa 2.1 — Giải phẫu cấu trúc Prompt (R-C-T-F-C-E)**
> * **Nội dung minh họa**: Sơ đồ khối 3D trực quan hóa 6 thành phần của Prompt, liên kết với nhau thành một khối trụ hoàn chỉnh, thể hiện sự tối ưu hóa của cấu trúc R-C-T-F-C-E.
> * **Prompt tạo ảnh (Tiêu chuẩn công nghệ + 3D + 8K - Trực quan tiếng Việt)**:
>   `A futuristic 3D isometric infographic showing the anatomy of a good AI prompt. Glassmorphic layers stack vertically, with neon outlines in cyan, purple, and gold. The layers are labeled in Vietnamese as "VAI TRÒ (ROLE)", "BỐI CẢNH (CONTEXT)", "NHIỆM VỤ (TASK)", "ĐỊNH DẠNG (FORMAT)", "RÀNG BUỘC (CONSTRAINTS)", and "VÍ DỤ (EXAMPLES)" using clean futuristic typography. Neon light rays connect the layers. Dark tech theme background with clean holographic UI components, 8k, highly detailed.`

#### 🔸 Thiết kế Structured System Prompt (2026 Paradigm)
Năm 2026, thay vì nhồi nhét mọi thứ vào một đoạn văn tự nhiên dài dòng ở User Prompt, các kỹ sư AI sử dụng cấu trúc thẻ (HTML/XML tags) để phân định rõ ràng các vùng dữ liệu trong **System Prompt**. Cấu trúc này giúp các mô hình lớn như Claude Fable 5 và GPT-5.5 phân biệt rạch ròi đâu là vai trò, đâu là ràng buộc và đâu là ngữ cảnh đầu vào.

##### Bảng so sánh phong cách viết Prompt
| Đặc tính | Cách viết kiểu cũ (2023 - 2024) | Thiết kế có cấu trúc (2025 - 2026) |
| :--- | :--- | :--- |
| **Hình thức** | Đoạn văn mô tả dài dòng, liên tục. | Phân chia khối dữ liệu bằng thẻ XML hoặc Header Markdown. |
| **Ràng buộc** | Trộn lẫn trong yêu cầu ("lưu ý đừng làm X"). | Đứng riêng trong thẻ `<constraints>` hoặc mục `## Constraints`. |
| **Độ Steerability** | Trung bình - Dễ bị trôi chỉ dẫn đối với văn bản dài. | Rất cao - AI tuân thủ tuyệt đối nhờ phân vùng rõ ràng. |

```xml
<!-- Ví dụ: Structured System Prompt tối ưu cho Claude Fable 5 -->
<system_prompt>
  <role>Senior Backend Engineer chuyên về tối ưu hóa Python</role>
  <constraints>
    - KHÔNG sử dụng các hàm built-in phức tạp không tối ưu.
    - PHẢI viết Type Hints cho mọi function.
    - Chỉ trả về block code chính, không giải thích dài dòng.
  </constraints>
  <output_format>Mã nguồn định dạng Python chuẩn PEP8</output_format>
</system_prompt>
```

#### 🛠️ Thực hành: Phân tích & Viết lại Prompt
1. Hãy phân tích prompt sau và chỉ ra các thành phần R-C-T-F-C-E còn thiếu:
   `"Hãy viết một email phản hồi khách hàng phàn nàn về việc giao hàng trễ."`
2. Thực hiện viết lại prompt trên thành một **Structured System Prompt** hoàn chỉnh, áp dụng các thẻ XML để cấu trúc rõ ràng.

#### 📝 Bài tập Lesson 2.1
1. **Thiết kế Prompt**: Hãy viết 3 prompt hoàn chỉnh (đáp ứng đủ 6 thành phần R-C-T-F-C-E) cho 3 tác vụ khác nhau:
   * *Tác vụ 1*: Review lỗ hổng bảo mật của một đoạn code Node.js.
   * *Tác vụ 2*: Tóm tắt báo cáo phân tích tài chính dài 5 trang thành bảng so sánh.
   * *Tác vụ 3*: Viết kịch bản ngắn giới thiệu sản phẩm công nghệ mới.
2. **So sánh mô hình**: Nạp cùng một Structured System Prompt vừa viết vào **Claude Fable 5** và **GPT-5.5**. Đánh giá mức độ tuân thủ định dạng đầu ra và tính chính xác của mã nguồn/kết quả trả về.

---

### 2.2. Lesson 2.2 — Zero-Shot, One-Shot & Few-Shot Prompting
* **Thời lượng**: ~45-60 phút
* **Mục tiêu**: Hiểu rõ khi nào sử dụng kỹ thuật bắn lệnh không ví dụ (Zero-Shot) và khi nào bắt buộc phải nạp thêm ví dụ (Few-Shot). Nắm giữ quy tắc phân bổ token hiệu quả năm 2026.

#### 🔸 Lý thuyết: Khái niệm Shots trong Prompting
* **Zero-Shot Prompting**: Bạn gửi thẳng yêu cầu và dữ liệu đầu vào cho AI mà không đưa ra bất kỳ ví dụ mẫu nào.
  * *Ứng dụng*: Phù hợp cho các tác vụ phổ thông, xử lý văn bản cơ bản mà AI đã được học rất kỹ trong giai đoạn Pre-training.
* **One-Shot Prompting**: Cung cấp chính xác **1 ví dụ minh họa** đầy đủ về cặp (Đầu vào - Đầu ra mong muốn).
  * *Ứng dụng*: Định hình phong cách viết, giọng văn, hoặc cấu trúc văn bản đặc thù.
* **Few-Shot Prompting**: Cung cấp từ **2 đến 5 ví dụ minh họa** trở lên.
  * *Ứng dụng*: Dành cho các bài toán phân loại nhãn phức tạp, trích xuất thực thể theo quy chuẩn doanh nghiệp, hoặc xử lý các ngôn ngữ lập trình đặc thù.

> [!NOTE]
> **Hình minh họa 2.2 — So sánh các kỹ thuật Shot Prompting**
> * **Nội dung minh họa**: Sơ đồ mô tả luồng xử lý dữ liệu của Zero-Shot (không ví dụ), One-Shot (1 ví dụ), và Few-Shot (nhiều ví dụ) đi qua bộ xử lý LLM.
> * **Prompt tạo ảnh (Tiêu chuẩn công nghệ + 3D + 8K - Trực quan tiếng Việt)**:
>   `A futuristic 3D infographic comparing three prompting methods. Three glowing glass portals showing data streams, labeled in Vietnamese with technical terms: "Zero-Shot (Không ví dụ)", "One-Shot (Một ví dụ)", and "Few-Shot (Nhiều ví dụ)" using clean glowing neon text. Left path has a single query node. Middle path has a query node and one example node. Right path has a query node with a chain of 3 example nodes. Cyberpunk dark mode background, 8k, highly detailed.`

#### 🔸 Chiến lược Shot Selection năm 2026
Với các mô hình Frontier năm 2026 như **Claude Fable 5** hay **GPT-5.5**, khả năng Zero-Shot đã tiến bộ vượt bậc. Kỹ sư AI cần tuân thủ quy tắc tối ưu hóa bộ nhớ:
* **Không lạm dụng Few-Shot**: Việc nhồi nhét quá nhiều ví dụ sẽ làm phình to Context Window (tiêu tốn RAM của AI), làm tăng chi phí API và tăng Latency mà hiệu năng không tăng đáng kể.
* **Chỉ dùng Few-Shot khi**:
  * Tác vụ yêu cầu tuân thủ một định dạng dữ liệu tự chế (Custom Format) mà LLM chưa từng gặp.
  * Bài toán phân loại cần độ nhất quán cực cao (High Consistency) qua hàng nghìn lượt chạy tự động.

#### 🛠️ Thực hành: Phân loại Email tự động
Hãy chuẩn bị 1 danh sách gồm 10 email phản hồi của khách hàng (gồm tích cực, tiêu cực, yêu cầu hỗ trợ).
1. Thử nghiệm viết **Zero-Shot Prompt** để phân loại các email này thành 3 nhóm nhãn: `[Complaint, Feedback, Support]`.
2. Viết **Few-Shot Prompt** cung cấp 3 ví dụ mẫu cho mỗi nhãn. 
3. So sánh tỷ lệ phân loại đúng trên **Claude Fable 5** và **Gemini 3.5 Flash**.

#### 📝 Bài tập Lesson 2.2
1. **Thiết kế Few-Shot Dataset**: Tạo một bộ dữ liệu Few-Shot gồm 5 cặp mẫu để dịch các câu lệnh tiếng Anh thông dụng sang mã SQL truy vấn Database nội bộ.
2. **Đánh giá Token Budget**: Sử dụng công cụ đếm token, hãy đo lượng token tiêu hao khi dùng Few-Shot (5 ví dụ) so với Zero-Shot cho cùng một tác vụ. Tính toán chênh lệch chi phí tài chính nếu hệ thống phải xử lý 100,000 lượt yêu cầu/ngày dựa trên bảng giá API hiện tại.

---

### 2.3. Lesson 2.3 — Role Prompting, Persona Engineering & System Prompt Architecture
* **Thời lượng**: ~45-60 phút
* **Mục tiêu**: Làm chủ kỹ thuật Persona Engineering nâng cao. Xây dựng cấu trúc System Prompt đa tầng (Multi-layer) để quản lý hành vi và độ Steerability của mô hình AI trong môi trường sản xuất.

#### 🔸 Lý thuyết: Tại sao Role Prompting hoạt động?
Khi bạn định vị vai trò cho AI (ví dụ: *"Bạn là một bác sĩ tim mạch"*), bạn đang hướng mô hình thu hẹp vùng tìm kiếm xác suất của các token (Knowledge Cluster). Thay vì tìm từ vựng trong kho tri thức hỗn hợp toàn cầu, AI sẽ ưu tiên sử dụng các thuật ngữ y khoa, cách lập luận lâm sàng và văn phong chuyên nghiệp của ngành y tế.

#### 🔸 Kiến trúc System Prompt Đa Tầng (Multi-layer System Prompt)
Trong các ứng dụng thực tế năm 2026, System Prompt không được viết một cách cẩu thả mà được chia thành **5 lớp chức năng** rõ ràng:
1. **Layer 1: Identity & Role (Định danh)**: Khai báo AI là ai, kinh nghiệm bao nhiêu năm, lĩnh vực gì.
2. **Layer 2: Behavioral Constraints (Ràng buộc hành vi)**: Những điều cấm kỵ (Ví dụ: Không đưa lời khuyên đầu tư tài chính, không phân biệt chủng tộc).
3. **Layer 3: Tool Definitions (Định nghĩa công cụ)**: Danh sách các API/function mà AI được quyền gọi.
4. **Layer 4: Output Specifications (Định dạng đầu ra)**: Yêu cầu trả về JSON, XML, hay Markdown.
5. **Layer 5: Dynamic Context Slots (Vùng nạp ngữ cảnh động)**: Các vị trí chờ để nạp thông tin người dùng hoặc tài liệu truy vấn vào.

> [!NOTE]
> **Hình minh họa 2.3 — Kiến trúc System Prompt Đa Tầng**
> * **Nội dung minh họa**: Sơ đồ chồng xếp 3D (Stacked layers) mô tả 5 lớp của System Prompt phối hợp chặt chẽ để kiểm soát hành vi đầu ra của mô hình.
> * **Prompt tạo ảnh (Tiêu chuẩn công nghệ + 3D + 8K - Trực quan tiếng Việt)**:
>   `A futuristic 3D architectural diagram representing a Multi-layer System Prompt Architecture. Horizontal glowing glass shelves stacked vertically inside a holographic rack, labeled in Vietnamese: "LỚP 1: ĐỊNH DANH (IDENTITY & ROLE)", "LỚP 2: RÀNG BUỘC (CONSTRAINTS)", "LỚP 3: CÔNG CỤ (TOOL DEFINITIONS)", "LỚP 4: ĐỊNH DẠNG (OUTPUT SPECS)", "LỚP 5: NGỮ CẢNH ĐỘNG (DYNAMIC SLOTS)" with glowing neon text. Neon circuit lines connect them, showing data flow. Sleek dark mode tech theme, 8k, highly detailed.`

##### Định dạng System Prompt theo Model Provider
* **Claude Fable 5 Style**: Ưu tiên sử dụng định dạng thẻ XML rõ ràng:
  ```xml
  <role>Bảo mật viên hệ thống</role>
  <never_do>Không tiết lộ khóa API trong mọi tình huống</never_do>
  ```
* **GPT-5.5 Style**: Ưu tiên sử dụng định dạng Markdown Headers:
  ```markdown
  ## Identity
  Bạn là lập trình viên Java.
  ## Constraints
  - Chỉ viết code, không giải thích.
  ```

#### 🛠️ Thực hành: Role Stacking (Ghép vai trò)
**Role Stacking** là kỹ thuật tạo ra một siêu vai trò bằng cách kết hợp nhiều lĩnh vực chuyên môn lại với nhau để giải quyết bài toán giao thoa.
1. Hãy thiết kế một System Prompt sử dụng kỹ thuật Role Stacking để AI đóng vai trò: *"Một chuyên gia AI vừa có kiến thức luật sở hữu trí tuệ vừa có khả năng phân tích mã nguồn phần mềm".*
2. Kiểm tra độ nhạy của mô hình với các câu hỏi về bản quyền code của các thư viện Open-source.

#### 📝 Bài tập Lesson 2.3
1. **Thiết kế System Prompt đa tầng**: Hãy viết một System Prompt đa tầng hoàn chỉnh (gồm đủ 5 lớp) cho một AI Trợ lý Tư vấn Tuyển dụng Nhân sự.
2. **Tối ưu hóa đa nền tảng**: Chuyển đổi System Prompt vừa viết thành 2 phiên bản: Phiên bản XML tối ưu cho Claude và phiên bản Markdown tối ưu cho GPT. So sánh kết quả đầu ra khi chạy trên 2 mô hình tương ứng.

---

### 2.4. Lesson 2.4 — Output Formatting, Structured Output & Schema Enforcement
* **Thời lượng**: ~45-60 phút
* **Mưu tiêu**: Làm chủ kỹ thuật ép khung đầu ra (Schema Enforcement) để tích hợp AI vào hệ thống phần mềm lớn. Phân biệt JSON mode và Native Structured Output của các nhà cung cấp mô hình năm 2026.

#### 🔸 Lý thuyết: Native Structured Output vs. Prompt-based Formatting
* **Prompt-based Formatting**: Bạn yêu cầu AI trả về định dạng mong muốn bằng câu chữ trong prompt (Ví dụ: *"Hãy trả về dạng JSON"*).
  * *⚠️ Pitfall*: Mô hình dễ bị lỗi cú pháp (ví dụ: thiếu dấu phẩy, thừa lời dẫn thoại: `"Dưới đây là JSON của bạn:"`), làm hỏng các script tự động parse dữ liệu ở backend.
* **Native Structured Output (Schema Enforcement)**: Đây là tính năng của API 2026, nơi nhà phát triển định nghĩa một cấu trúc JSON Schema chuẩn và gửi kèm yêu cầu. API của mô hình (như OpenAI GPT-5.5 hay Gemini 3.5) cam kết **100% đầu ra sẽ tuân thủ tuyệt đối cấu trúc Schema** này bằng cách can thiệp trực tiếp vào quá trình dự đoán token (constrained sampling).

> [!NOTE]
> **Hình minh họa 2.4 — Cơ chế ép khung định dạng đầu ra (Schema Enforcement)**
> * **Nội dung minh họa**: Dòng chảy token đầu vào hỗn loạn đi qua một phễu lọc cấu trúc (JSON Schema Filter) và đầu ra kết tinh thành một khối lập phương JSON hoàn chỉnh, sáng bóng.
> * **Prompt tạo ảnh (Tiêu chuẩn công nghệ + 3D + 8K - Trực quan tiếng Việt)**:
>   `A futuristic 3D visualization representing Schema Enforcement or Native Structured Output. A messy fluid stream of raw text labeled "DÒNG DỮ LIỆU THÔ (RAW DATA)" in glowing green text enters a funnel glowing grid. From the bottom of the funnel, the stream exits as a neat, highly ordered 3D holographic JSON matrix cube labeled "JSON STRUCTURED OUTPUT (ĐẦU RA CẤU TRÚC)" in glowing violet text. Premium tech dark background, 8k, highly detailed.`

##### So sánh các phương thức xuất dữ liệu có cấu trúc
| Tiêu chí | Prompt-based JSON | Native JSON Mode | Schema Enforcement (API) |
| :--- | :--- | :--- | :--- |
| **Độ tin cậy cú pháp** | 85% - 90% (Dễ lỗi) | 98% (Vẫn có thể sai schema) | 100% (Cam kết bởi API) |
| **Tốc độ xử lý** | Bình thường | Nhanh hơn | Tối ưu nhất |
| **Độ phức tạp tích hợp** | Thấp (chỉ cần viết prompt) | Trung bình | Cao (phải viết code khai báo Schema) |

#### 🛠️ Thực hành: Native Structured Output với Pydantic/JSON Schema
Hãy thực hành giả lập cấu hình một API call ép định dạng đầu ra cho tác vụ trích xuất thông tin khách hàng từ đoạn chat chat log:
```python
# Ví dụ cấu hình Schema Enforcement bằng JSON Schema
response_format = {
    "type": "json_schema",
    "json_schema": {
        "name": "customer_extraction",
        "schema": {
            "type": "object",
            "properties": {
                "customer_name": {"type": "string"},
                "phone_number": {"type": "string"},
                "sentiment": {"type": "string", "enum": ["Happy", "Angry", "Neutral"]},
                "issue_summary": {"type": "string"}
            },
            "required": ["customer_name", "sentiment", "issue_summary"]
        }
    }
}
```
1. Viết một script giả lập hoặc prompt ép định dạng đầu ra để trích xuất dữ liệu từ đoạn chat sau:
   `"Chào shop, mình là Nam (SĐT: 0905123456). Mình nhận được hàng từ hôm qua nhưng bị bể màn hình rồi. Shop hỗ trợ đổi trả giúp mình gấp!"`

#### 📝 Bài tập Lesson 2.4
1. **Xây dựng Pipeline trích xuất**: Thiết kế một hệ thống prompt trích xuất thông tin bệnh án điện tử từ lời thoại ghi âm của bác sĩ. Đầu ra yêu cầu định dạng JSON chứa các trường: `[Patient_Name, Age, Symptoms, Diagnosed_Disease, Prescription_List]`.
2. **Đánh giá Edge-cases**: Thử nghiệm gửi dữ liệu nhiễu hoặc văn bản không liên quan vào hệ thống trên. Ghi nhận xem cơ chế Schema Enforcement của mô hình xử lý như thế nào (AI có tự động để trống trường hay bị crash cú pháp).

---

## 🧪 QUIZ KIỂM TRA SESSION 02
*Hãy chọn đáp án đúng nhất cho các câu hỏi sau:*

#### Câu 1: Thành phần nào trong cấu trúc R-C-T-F-C-E quyết định trực tiếp việc thu hẹp vùng tìm kiếm xác suất từ vựng (Knowledge Cluster) của LLM?
* A. Constraints (Ràng buộc).
* B. Role (Vai trò).
* C. Format (Định dạng).
* D. Examples (Ví dụ mẫu).
* * **Đáp án đúng**: **B**
  * *Giải thích*: Role (Vai trò) định vị AI vào một nhóm tri thức cụ thể, giúp nó ưu tiên lựa chọn các token liên quan mật thiết đến ngành nghề/chuyên môn đó.

#### Câu 2: Trong trường hợp nào kỹ sư AI BẮT BUỘC nên sử dụng Few-Shot Prompting thay vì Zero-Shot?
* A. Khi cần AI viết một bài thơ chúc mừng sinh nhật.
* B. Khi cần trích xuất thông tin từ tài liệu theo một định dạng dữ liệu tự chế (Custom Format) đặc thù.
* C. Khi sử dụng các mô hình suy luận sâu như GPT-5 Pro.
* D. Khi muốn tiết kiệm tối đa chi phí sử dụng API.
* * **Đáp án đúng**: **B**
  * *Giải thích*: Few-Shot đặc biệt hiệu quả khi cần dạy mô hình một mẫu phân loại hoặc định dạng đầu ra độc quyền mà nó chưa từng được huấn luyện trước đó.

#### Câu 3: Điểm khác biệt cốt lõi giữa Native Structured Output (Schema Enforcement) và việc yêu cầu định dạng bằng Prompt thông thường là gì?
* A. Native Structured Output chỉ hoạt động với ngôn ngữ tiếng Anh.
* B. Native Structured Output can thiệp vào quá trình lấy mẫu xác suất token của API để đảm bảo 100% không bao giờ sai cấu trúc JSON.
* C. Native Structured Output giúp AI trả lời dài hơn.
* D. Không có sự khác biệt nào về độ tin cậy.
* * **Đáp án đúng**: **B**
  * *Giải thích*: Schema Enforcement là cơ chế can thiệp trực tiếp vào quá trình giải mã (decoding) của mô hình ở mức độ API, loại bỏ hoàn toàn các token vi phạm cấu trúc Schema đã khai báo.

#### Câu 4: Việc lạm dụng nạp quá nhiều ví dụ mẫu (n > 10) trong Few-Shot Prompting gây ra pitfall gì?
* A. Làm mô hình AI bị quá tải nhiệt phần cứng.
* B. Tiêu hao quá nhiều token trong Context Window, làm tăng chi phí và tăng Latency phản hồi.
* C. Làm mô hình trả lời hoàn toàn ngẫu nhiên.
* D. Bắt buộc mô hình phải tự động chuyển sang chế độ suy nghĩ sâu.
* * **Đáp án đúng**: **B**
  * *Giải thích*: Mọi token của ví dụ đều chiếm dụng không gian của Context Window. Việc nhồi nhét quá nhiều ví dụ không cần thiết sẽ làm tăng chi phí sử dụng và thời gian xử lý của API.

#### Câu 5: Trong kiến trúc System Prompt Đa Tầng (Multi-layer), phần cấm đoán AI tiết lộ mật khẩu hệ thống sẽ được xếp vào lớp nào?
* A. Layer 1: Identity & Role.
* B. Layer 2: Behavioral Constraints.
* C. Layer 3: Tool Definitions.
* D. Layer 4: Output Specifications.
* * **Đáp án đúng**: **B**
  * *Giải thích*: Các quy tắc cấm kỵ, điều hướng bảo mật, và giới hạn hoạt động của AI thuộc về lớp Lớp 2: Behavioral Constraints (Ràng buộc hành vi).

---

## ⚡ BỘ PROMPTS MẪU CHO SLIDE & VIDEO (SESSION 02)

### 1. Prompts tạo slide bài giảng (Dành cho Gamma.app / Marp)

#### 🔹 Slide Prompt 1: Giải phẫu Prompt & Shots-Prompting (Lesson 2.1 & 2.2)
```markdown
Role: Bạn là chuyên gia thiết kế bài giảng về Công nghệ AI.
Nhiệm vụ: Hãy soạn thảo mã nguồn Markdown theo chuẩn Marp để tạo các slide thuyết trình giới thiệu về "Giải phẫu cấu trúc Prompt R-C-T-F-C-E và Nghệ thuật Shots-Prompting".

Cấu trúc Slide yêu cầu:
- Slide 1: Tiêu đề lớn "Làm chủ cấu trúc Prompt & Kỹ thuật Shot selection".
- Slide 2: Giải thích chi tiết 6 thành phần của R-C-T-F-C-E.
- Slide 3: So sánh chi tiết cấu trúc System Prompt cũ vs Structured System Prompt thời đại mới.
- Slide 4: Khái niệm Shots trong Prompting: Zero-shot vs. One-shot vs. Few-shot.
- Slide 5: Quy tắc vàng 2026: Khi nào nên bắn Zero-shot và khi nào bắt buộc dùng Few-shot để tối ưu hóa chi phí API.
- Slide 6: Bài tập thực hành tại lớp phân loại email khách hàng.

Thiết kế slide: Tối giản, hiện đại, sử dụng bullet points ngắn gọn, chia block rõ ràng.
```

#### 🔹 Slide Prompt 2: System Prompt Architecture & Schema Enforcement (Lesson 2.3 & 2.4)
```markdown
Role: Chuyên gia thiết kế Slide bài giảng công nghệ.
Nhiệm vụ: Tạo kịch bản slide thuyết trình chi tiết về "Thiết kế System Prompt đa tầng và Ép khung đầu ra Schema Enforcement".

Cấu trúc Slide yêu cầu:
- Slide 1: Tiêu đề "Kiến trúc System Prompt đa tầng & Định dạng đầu ra an toàn".
- Slide 2: Giới thiệu 5 lớp của Multi-layer System Prompt Architecture.
- Slide 3: So sánh định dạng System Prompt tối ưu cho Claude (XML) vs GPT (Markdown).
- Slide 4: Thất bại của Prompt-based Formatting và Sự ra đời của Native Structured Output (Schema Enforcement).
- Slide 5: Đoạn code Python ví dụ cấu hình API call ép cấu trúc JSON bằng Schema.
- Slide 6: Thảo luận nhóm về ứng dụng Schema Enforcement trong phát triển app thực tế.

Định dạng đầu ra: Ghi rõ nội dung hiển thị trên slide và phần Speaker Notes hỗ trợ giảng viên đứng lớp.
```

---

### 2. Prompts cấu hình Audio Overview / Video Podcast bằng NotebookLM

#### 🔹 NotebookLM Custom Prompt: Thảo luận chuyên sâu về Session 02
> Sao chép đoạn này dán vào hộp thoại cấu hình Customization của NotebookLM:
```markdown
Hãy tạo một buổi thảo luận Podcast dài giữa 2 chuyên gia (một nam, một nữ) về chủ đề "Prompt Engineering - Cơ bản trong kỷ nguyên AI 2026".

Các yêu cầu nội dung và phong cách:
1. Phong cách hội thoại: Cực kỳ tự nhiên, hào hứng, tranh luận cởi mở. Sử dụng ngôn từ tiếng Việt hiện đại của giới công nghệ, giữ nguyên các từ chuyên ngành tiếng Anh (như R-C-T-F-C-E, XML, System Prompt, Schema Enforcement, JSON).
2. Trọng tâm tranh luận:
   - Tại sao việc viết prompt tự do như viết thư tình năm 2023 đã lỗi thời? Tại sao bây giờ chúng ta phải "thiết kế" prompt như thiết kế kiến trúc phần mềm?
   - Phân tích sâu cấu trúc R-C-T-F-C-E và cách áp dụng XML tag cho Claude.
   - Thảo luận thực tế: Khi nào Zero-shot là đủ? Đừng phí tiền nạp Few-shot vô tội vạ.
   - Làm rõ cơ chế hoạt động của Schema Enforcement: Tại sao nó đảm bảo 100% không bao giờ lỗi parse dữ liệu JSON ở backend?
3. Phân vai: MC Nữ đóng vai trò là một Product Manager luôn muốn tiết kiệm chi phí và tích hợp AI nhanh chóng. MC Nam đóng vai trò là Senior AI Engineer giải thích các giải pháp kỹ thuật, phân tích tại sao dùng Schema Enforcement và cấu trúc System Prompt đa tầng là lựa chọn sống còn của dự án.
```
