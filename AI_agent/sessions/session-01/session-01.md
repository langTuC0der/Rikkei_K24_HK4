# 📚 HỌC LIỆU CHI TIẾT: SESSION 01
## NỀN TẢNG & BỐI CẢNH AI 2026 (PROMPT, CONTEXT & HARNESS ENGINEERING)

---

## 🗺️ TỔNG QUAN SESSION 01
* **Mục tiêu**: Hiểu bản chất cách LLM xử lý dữ liệu và sinh văn bản, cập nhật landscape mô hình AI mới nhất (tính đến tháng 06/2026), làm chủ 3 trụ cột (Prompt - Context - Harness), nắm vững mô hình tư duy Karpathy (LLM = CPU, Context = RAM) và đón đầu xu hướng Agentic Workflows.
* **Thời lượng học tập**: ~3 - 4 giờ (bao gồm lý thuyết, thực hành, bài tập và làm bài kiểm tra).
* **Cấu trúc**: 4 bài học chính (Lessons) và 1 phần kiểm tra (Quiz).

---

## 📖 BÀI HỌC CHI TIẾT

### 1.1. Lesson 1.1 — LLM hoạt động như thế nào? (Phiên bản 2026)
* **Thời lượng**: ~45-60 phút
* **Mục tiêu**: Nắm vững cơ chế Tokenization, Attention Mechanism, Next-token Prediction và cách các tham số như Temperature/Top-p ảnh hưởng đến kết quả đầu ra. So sánh cấu hình của các mô hình hàng đầu thế giới năm 2026.

#### 🔸 Lý thuyết: Cơ chế vận hành của Transformer
Large Language Models (LLMs) hoạt động dựa trên mạng nơ-ron Transformer. Bản chất của quá trình này gồm 3 bước chính:
1. **Tokenization (Mã hóa)**: Chuyển đổi văn bản tự nhiên thành các chuỗi số (Token). Mỗi model có một bảng từ vựng (Vocabulary) riêng và cách cắt token khác nhau. Ví dụ cụm từ `"Xin chào"` có thể tách thành `["X", "in", " ch", "ào"]`.
2. **Attention Mechanism (Cơ chế chú ý)**: Giúp mô hình tính toán mối liên hệ ngữ nghĩa giữa các từ trong câu, biết được từ nào cần "chú ý" nhiều hơn khi xử lý.
3. **Next-Token Prediction (Dự đoán token tiếp theo)**: Bản chất LLM là một máy tính toán xác suất. Nó không thực sự "hiểu" theo cách của con người mà liên tục dự đoán token tiếp theo có khả năng xuất hiện cao nhất dựa trên ngữ cảnh trước đó.
4. **Các tham số cấu hình**:
   * **Temperature** (Nhiệt độ): Dao động từ `0` đến `2`. `0` giúp câu trả lời nhất quán và chính xác (Deterministic); `1` hoặc cao hơn tạo ra câu trả lời sáng tạo, ngẫu nhiên hơn.
   * **Top-p** (Nucleus Sampling): Giới hạn việc chọn lọc token trong nhóm có tổng xác suất tích lũy bằng `p` (ví dụ: `top-p = 0.9` sẽ chỉ chọn các token nằm trong 90% xác suất cao nhất).

> [!NOTE]
> **Hình minh họa 1.1 — Kiến trúc xử lý ngôn ngữ của LLM**
> * **Nội dung minh họa**: Quy trình từ văn bản đầu vào đi qua bộ Tokenizer -> Flow qua các Layer của Attention Mechanism -> Predict ra Token tiếp theo ở đầu ra.
> * **Prompt tạo ảnh (Tiêu chuẩn công nghệ + 3D + 8K)**:
>   `A futuristic 3D isometric infographic showing LLM brain architecture. On the left side, input text "Hello AI" enters a sleek glass-textured processor that splits the words into glowing blocks (representing tokenization). In the middle, the blocks flow through a complex glowing network of rings representing the "Self-Attention Mechanism" with vibrant blue, purple, and neon pink light beams connecting them. On the right side, the next-token prediction output emerges as a floating holographic text block. Premium dark mode background, high-tech corporate aesthetic, clean glassmorphism, volumetric lighting, 8k resolution, raytracing, unreal engine 5 render, highly detailed.`

#### 🔸 Sự tiến hóa của Context Window & Frontier Models (06/2026)
* **Context Window (Cửa sổ ngữ cảnh)**: Là dung lượng bộ nhớ làm việc tạm thời của AI. Nếu vượt quá giới hạn này, AI sẽ bị "mất trí nhớ" tạm thời đối với những phần thông tin cũ.
* **Timeline tiến hóa**: 
  * 2022: **4,096 tokens** (GPT-3.5)
  * 2024: **200,000 tokens** (Claude 3) / **1,000,000 tokens** (Gemini 1.5 Pro)
  * 2026: **1,000,000+ tokens** trở thành tiêu chuẩn trên các dòng Flash (Gemini 3.5 Flash) giúp xử lý sách, video dài hoặc toàn bộ codebase trong một lần chat.

> [!NOTE]
> **Hình minh họa 1.2 — Sự tiến hóa các AI Models từ 2023 đến 2026**
> * **Nội dung minh họa**: Biểu đồ cột 3D thể hiện sự tăng trưởng vượt bậc của kích thước Context Window qua các năm, kết hợp với độ phức tạp tính toán của mô hình.
> * **Prompt tạo ảnh (Tiêu chuẩn công nghệ + 3D + 8K)**:
>   `A 3D timeline chart showing AI models context window evolution from 2023 to 2026. Chronological glass pillars representing key milestones: 2023 (GPT-4), 2024 (Claude 3, Gemini 1.5), 2025 (GPT-5, Claude Opus 4), and 2026 (Claude Fable 5, GPT-5.5, Gemini 3.5 Flash). The pillars grow exponentially taller and more complex, glowing with energy. The 2026 pillar is the tallest and brightest, featuring holographic icons of massive context windows (1M+ tokens) and agentic brains. Futuristic dark tech UI background, neon glowing lines connecting the pillars, glassmorphism nodes, 8k, photorealistic, 3D render.`

##### Bảng So Sánh Frontier Models (Cập nhật 06/2026)
| Provider | Model | Reasoning | Coding | Speed | Cost | Context Window |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Anthropic** | **Claude Fable 5** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐☆☆ | $$ | 200K+ |
| | **Claude Opus 4.8** | ⭐⭐⭐⭐☆ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐☆ | $$ | 200K |
| **OpenAI** | **GPT-5.5** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐☆ | ⭐⭐⭐⭐☆ | $$$ | 128K+ |
| | **GPT-5 Pro** (Reasoning) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐☆ | ★★☆☆☆ | $$$$ | 128K+ |
| **Google** | **Gemini 3.5 Flash** | ⭐⭐⭐⭐☆ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $ | 1M+ |
| | **Gemini 3.5 Pro** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐☆ | ★★★☆☆ | $$ | 1M+ |

> [!TIP]
> **Phân biệt Reasoning Models vs. Standard Models (2026)**:
> * **Reasoning Models** (GPT-5 Pro, Gemini 3.5 Pro): Tích hợp sẵn cơ chế "suy nghĩ ngầm" (Internal Chain-of-Thought) trước khi trả lời. Thích hợp cho lập trình phức tạp, toán học, phân tích chiến lược sâu. Tốc độ phản hồi chậm hơn và giá đắt hơn.
> * **Standard Models** (GPT-5.5, Claude Opus 4.8): Trả lời nhanh, mượt mà, lý tưởng cho tác vụ sáng tạo văn bản, chat hàng ngày, tổng hợp nhanh.

#### 🛠️ Thực hành: Đánh giá & So sánh
Hãy sử dụng cùng một câu hỏi kiểm tra logic để đánh giá độ chính xác và tốc độ phản hồi trên 3 mô hình: **Claude Fable 5, GPT-5.5 và Gemini 3.5 Flash**.

* **Mẫu Prompt thử nghiệm**:
  ```markdown
  Giải bài toán sau và giải thích chi tiết từng bước:
  Một nhà máy có 3 dây chuyền sản xuất. Dây chuyền A sản xuất 40% sản phẩm với tỷ lệ lỗi 2%. Dây chuyền B sản xuất 35% sản phẩm với tỷ lệ lỗi 3%. Dây chuyền C sản xuất 25% sản phẩm với tỷ lệ lỗi 5%.
  Nếu chọn ngẫu nhiên 1 sản phẩm bị lỗi, xác suất nó đến từ dây chuyền B là bao nhiêu?
  ```

#### 📝 Bài tập Lesson 1.1
1. **Phân tích so sánh**: Viết một bài luận ngắn (300-500 từ) giải thích nguyên nhân cùng một prompt nhưng các mô hình lại đưa ra kết quả và cách lập luận khác nhau. Trích dẫn số liệu từ bảng so sánh mô hình 2026.
2. **Lập ma trận Task**: Tạo bảng so sánh hiệu quả thực tế của 3 mô hình trên cho 3 nhóm công việc: Lập trình (Coding), Phân tích số liệu (Analysis), và Viết lách sáng tạo (Creative writing).
3. **Đánh giá suy luận**: Thử nghiệm 5 câu đố logic phức tạp trên **GPT-5.5 (Standard)** và **GPT-5 Pro (Reasoning)**. Ghi nhận tỷ lệ chính xác (Accuracy) và thời gian xử lý (Latency) để rút ra kết luận khi nào nên bật chế độ suy nghĩ (Thinking mode).

---

### 1.2. Lesson 1.2 — Prompt → Context → Harness: Ba Trụ Cột & Sự dịch chuyển 2025-2026
* **Thời lượng**: ~45-60 phút
* **Mục tiêu**: Hiểu rõ mối quan hệ lồng ghép giữa Prompt Engineering, Context Engineering và Harness Engineering. Giải mã xu hướng chuyển dịch trọng tâm công nghệ trong năm 2025-2026.

#### 🔸 Lý thuyết: Định nghĩa 3 Trụ Cột
Để xây dựng các hệ thống AI đáng tin cậy, kỹ sư AI (AI Engineer) cần nắm vững ba cấp độ thiết kế:
* **Prompt Engineering (Kỹ thuật câu lệnh)**: Thiết kế các câu lệnh đầu vào tối ưu để mô hình hiểu đúng nhiệm vụ. Đây là tầng cốt lõi nhất (nhân).
* **Context Engineering (Kỹ thuật ngữ cảnh)**: Quản lý, chọn lọc và sắp xếp toàn bộ thông tin được nạp vào Context Window (bao gồm tài liệu hướng dẫn, lịch sử chat, định nghĩa công cụ - tool schemas).
* **Harness Engineering (Kỹ thuật bao bọc/điều phối)**: Thiết kế hạ tầng phần mềm xung quanh LLM. Bao gồm việc xây dựng pipeline, thiết lập các chốt chặn an toàn (guardrails), và cơ chế gọi hàm tự động (tool use/function calling).

```
┌─────────────────────────────────────────┐
│            HARNESS ENGINEERING          │
│  ┌───────────────────────────────────┐  │
│  │       CONTEXT ENGINEERING         │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │    PROMPT ENGINEERING       │  │  │
│  │  │  "Viết câu hỏi thông minh" │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  "Cung cấp đúng thông tin"       │  │
│  └───────────────────────────────────┘  │
│  "Xây dựng hệ sinh thái điều phối"     │
└─────────────────────────────────────────┘
```

> [!NOTE]
> **Hình minh họa 1.3 — Mối quan hệ lồng ghép giữa 3 tầng công nghệ**
> * **Nội dung minh họa**: Sơ đồ 3 hình tròn đồng tâm dạng 3D, từ trong ra ngoài: Prompt -> Context -> Harness, thể hiện mối quan hệ bao bọc và phụ thuộc lẫn nhau.
> * **Prompt tạo ảnh (Tiêu chuẩn công nghệ + 3D + 8K)**:
>   `A premium 3D concentric nested cylinder diagram illustrating the three pillars of AI Engineering. The innermost cylinder represents "Prompt Engineering" (glowing in warm gold), nested inside a larger middle cylinder representing "Context Engineering" (glowing in neon cyan), which is further nested inside the outermost and largest cylinder representing "Harness Engineering" (glowing in vivid magenta). Clean glassmorphism textures, glowing labels with futuristic typography pointing to each cylinder, high-tech interface grid background, dark room with subtle volumetric lighting, 3D vector style, 8k resolution, modern corporate tech graphic.`

* **💡 Phép so sánh (Analogy)**:
  * **Prompt Engineering** giống như việc bạn viết một bức thư giao việc rất ngắn gọn, rõ ràng.
  * **Context Engineering** giống như việc bạn chuẩn bị đầy đủ hồ sơ, tài liệu, và dữ liệu lịch sử đặt lên bàn làm việc của nhân viên trước khi họ đọc thư giao việc.
  * **Harness Engineering** giống như quy trình vận hành của cả phòng ban, có người giám sát, có công cụ hỗ trợ và có quy định kiểm duyệt đầu ra.

#### 🔸 Sự dịch chuyển công nghệ (Paradigm Shift 2025-2026)
Vào giữa năm 2025, Andrej Karpathy đã đưa ra nhận định làm thay đổi tư duy của giới công nghệ:
> *"Prompt Engineering giờ chỉ là kỹ năng cơ bản ai cũng phải biết (table stakes). Context Engineering mới là thứ tạo ra sự khác biệt lớn nhất cho các hệ thống Agentic AI. Lỗi của các AI Agents 80% đến từ việc nạp sai/thiếu ngữ cảnh (Context Failures) chứ không phải do viết prompt không hay."*

##### Bảng so sánh tư duy phát triển AI
| Đặc tính | Cận 2023 - 2024 (Tư duy cũ) | Từ 2025 - 2026 (Tư duy mới) |
| :--- | :--- | :--- |
| **Trọng tâm** | Tìm kiếm câu chữ "thần kỳ", định hình Persona. | Quản lý kiến trúc luồng dữ liệu, lọc nhiễu ngữ cảnh. |
| **Kiểm thử** | Đọc thử thủ công vài lần bằng mắt (Vibe-check). | Đánh giá tự động định lượng trên các tập dữ liệu chuẩn (Golden Datasets). |
| **Luồng làm việc** | Một lịch sử chat kéo dài liên tục. | Quản lý trạng thái (State), thiết lập Tool Schemas và Agent Handoff. |
| **Bảo mật** | Viết prompt dặn dò AI "không được tiết lộ hệ thống". | Chốt chặn an toàn đa tầng (System-level Guardrails) + Giám sát con người. |

#### 📝 Bài tập Lesson 1.2
1. **Thiết kế sơ đồ tư duy (Mindmap)**: Vẽ một sơ đồ phân tích chi tiết mối quan hệ giữa 3 khái niệm: Prompt - Context - Harness. Đưa ra ví dụ thực tế tương ứng với các công cụ phát triển AI của năm 2026 (như MCP, LangGraph, CrewAI).
2. **Phân tích lỗi Context**: Tìm hiểu và viết một bài báo cáo (400-600 từ) về chủ đề "Các lỗi hệ thống AI Agent do thất bại trong quản lý Context". Đưa ra ít nhất 3 kịch bản thực tế (ví dụ: Agent gọi sai công cụ, Agent bị loãng thông tin do nhồi nhét quá nhiều tài liệu không liên quan).

---

### 1.3. Lesson 1.3 — Mental Model: LLM là CPU, Context là RAM, Kỹ sư là OS
* **Thời lượng**: ~45-60 phút
* **Mục tiêu**: Làm quen với mô hình tư duy chuẩn hóa của Andrej Karpathy để thiết kế ứng dụng AI hiệu quả. Hiểu khái niệm Steerability và sự thay đổi trong cách viết prompt cho các dòng mô hình mới.

#### 🔸 Lý thuyết: Khung tư duy Karpathy (LLM = CPU, Context = RAM)
Để không bị nhầm lẫn về khả năng của AI, chúng ta cần ánh xạ các thành phần của hệ thống AI sang kiến trúc máy tính truyền thống:
* **LLM đóng vai trò là CPU**: Nó là bộ vi xử lý cực mạnh, có khả năng tính toán ngữ nghĩa rất nhanh, nhưng nó **không có bộ nhớ lưu trữ chủ động**. Khi nhận đầu vào, nó xử lý và trả ra kết quả đầu ra rồi ngay lập tức giải phóng bộ nhớ.
* **Context Window đóng vai trò là RAM**: Đây là bộ nhớ truy xuất ngẫu nhiên tạm thời. Toàn bộ thông tin cần thiết để CPU xử lý (System Prompt, tài liệu, lịch sử chat, các API schema) phải được nạp vào đây. Nếu thông tin không nằm trên RAM (Context Window), CPU (LLM) hoàn toàn không biết đến sự tồn tại của nó và sẽ dẫn đến hiện tượng ảo giác (Hallucination).
* **Kỹ sư AI đóng vai trò là OS (Hệ điều hành)**: Nhiệm vụ của bạn là quản lý RAM. Bạn phải quyết định nạp cái gì vào RAM, giải phóng RAM khi đầy, và lên lịch trình (Schedule) cho các tác vụ của CPU.

> [!NOTE]
> **Hình minh họa 1.4 — Khung tư duy kiến trúc Karpathy**
> * **Nội dung minh họa**: Sơ đồ kỹ thuật mô tả Kỹ sư đóng vai trò OS điều phối nạp dữ liệu vào thanh RAM (Context Window) chứa System Prompt, Docs, Tools, và truyền tải thông tin này xuống Chip CPU (LLM) để xử lý.
> * **Prompt tạo ảnh (Tiêu chuẩn công nghệ + 3D + 8K)**:
>   `A futuristic 3D architectural diagram of the Karpathy AI Mental Model. At the top, a stylized hologram user representation representing the "Operating System (OS)" manages the data flow. Below it, a large horizontal glowing glass block representing the "Context Window (RAM)" is divided into slots labeled: "System Prompt", "Retrieved Docs", "Tool Schemas", and "Chat History". At the bottom, a powerful silicon processor chip representing the "LLM (CPU)" with cyan neural-like pathways running through it, processes the data loaded from the RAM. High-tech glowing circuitry, neon color accents (gold, cyan, magenta), glassmorphism, 8K resolution, Unreal Engine 5 render, isometric view.`

#### 🔸 Khái niệm Steerability (Khả năng điều hướng)
* **Steerability** là độ nhạy và khả năng tuân thủ định hướng của mô hình trước các chỉ dẫn cụ thể trong prompt. 
* Prompt càng rõ ràng, các ràng buộc đầu ra càng chặt chẽ thì mức độ Steerability càng cao, giảm thiểu tối đa các câu trả lời lan man.

##### Ví dụ cải thiện Steerability:
* ❌ **Prompt mơ hồ (Low Steerability)**: `Hãy viết code Python để sắp xếp danh sách.` (AI không biết sắp xếp thuật toán gì, kiểu dữ liệu nào, định dạng code ra sao).
*  **Prompt tối ưu (High Steerability)**: `Viết một hàm Python sắp xếp danh sách các số nguyên không âm theo thuật toán Merge Sort. Yêu cầu: Sử dụng Type Hints đầy đủ, viết Docstring giải thích tham số, xử lý trường hợp danh sách rỗng. Định dạng đầu ra: Chỉ trả về khối code, không giải thích gì thêm.`

#### ⚠️ Cập nhật quan trọng 2026: Lạm dụng suy nghĩ (Double-Reasoning)
Với sự xuất hiện của các mô hình suy luận chuyên sâu (Reasoning Models) như **GPT-5 Pro** và **Gemini 3.5 Pro**, câu lệnh huyền thoại `"Let's think step by step"` (Hãy suy nghĩ từng bước) có thể **không còn hiệu quả hoặc gây phản tác dụng**.
* Các mô hình này đã tự động chạy luồng suy luận ngầm trước khi đưa ra câu trả lời cuối cùng.
* Nếu chúng ta ép mô hình "suy nghĩ từng bước" ở đầu ra, nó sẽ thực hiện hai lần suy luận (Double-Reasoning), dẫn đến việc tăng đáng kể thời gian phản hồi (Latency) và chi phí sử dụng API mà không cải thiện độ chính xác.

#### 🛠️ Thực hành: Test độ nhạy và Đo Latency
1. Chuẩn bị 1 bài toán phức tạp và gửi cho **GPT-5.5** và **GPT-5 Pro**.
2. Với mỗi model, chạy 2 lần: Lần 1 dùng prompt thông thường; Lần 2 dùng prompt có thêm yêu cầu `"Let's think step by step"`.
3. Ghi lại: Kết quả có chính xác hơn không? Thời gian phản hồi chênh lệch bao nhiêu giây?

#### 📝 Bài tập Lesson 1.3
1. **Viết lại Prompt**: Thực hiện chuyển đổi 5 câu lệnh mơ hồ sau đây thành các câu lệnh có độ Steerability cao (thiết lập rõ vai trò, nhiệm vụ, định dạng đầu ra, và các ràng buộc cụ thể):
   * *a) "Tóm tắt bài viết này."*
   * *b) "Tìm lỗi sai trong đoạn code C++ này."*
   * *c) "Hãy viết một bài đăng quảng cáo cho sản phẩm cà phê mới."*
   * *d) "Viết API kết nối database."*
   * *e) "Hãy giúp tôi lập kế hoạch tài chính cá nhân."*
2. **Thiết lập Decision Matrix**: Viết một hướng dẫn ngắn (khoảng 300 từ) kèm bảng tiêu chí quyết định (Decision Matrix): Khi nào dự án của bạn nên chọn Standard Model (tối ưu chi phí/tốc độ) và khi nào bắt buộc phải nâng cấp lên Reasoning Model.

---

### 1.4. Lesson 1.4 — Phân loại tác vụ (Taxonomy) & Agentic Workflows 2026
* **Thời lượng**: ~45-60 phút
* **Mục tiêu**: Phân loại 7 nhóm tác vụ AI cốt lõi và ứng dụng cấu trúc đầu ra phù hợp. Nắm bắt bản chất hệ kiến trúc AI tự chủ (Agentic Workflows) sử dụng giao thức kết nối MCP.

#### 🔸 Lý thuyết: Taxonomy của AI Tasks
Các yêu cầu làm việc với AI trong thực tế luôn nằm trong 7 nhóm tác vụ cơ bản sau:
1. **Generation (Tạo nội dung)**: Viết bài viết, soạn email, viết kịch bản. (Đầu ra: Markdown/Text).
2. **Classification (Phân loại)**: Xác định sắc thái bình luận (Tích cực/Tiêu cực), lọc spam. (Đầu ra: Nhãn/Label, JSON).
3. **Extraction (Trích xuất)**: Lấy thông tin từ CV, hóa đơn, bài báo. (Đầu ra: JSON, CSV).
4. **Transformation (Chuyển đổi)**: Dịch thuật, định dạng lại dữ liệu từ XML sang JSON. (Đầu ra: File cấu trúc).
5. **Summarization (Tóm tắt)**: Rút gọn văn bản dài, tóm tắt biên bản họp. (Đầu ra: Bullet points).
6. **Reasoning (Suy luận)**: Giải toán, gỡ lỗi logic thuật toán khó. (Đầu ra: Step-by-step logic).
7. **Code Generation (Viết mã nguồn)**: Tạo hàm, class hoặc toàn bộ cấu trúc dự án. (Đầu ra: Code Blocks).

> [!NOTE]
> **Hình minh họa 1.5 — Bản đồ phân loại tác vụ AI (Taxonomy)**
> * **Nội dung minh họa**: Biểu đồ phân nhánh 3D hiện đại thể hiện 7 nhánh tác vụ chính, mỗi nhánh đi kèm một biểu tượng công nghệ đặc trưng và cấu trúc định dạng đầu ra tương ứng.
> * **Prompt tạo ảnh (Tiêu chuẩn công nghệ + 3D + 8K)**:
>   `A futuristic 3D infographic showing the taxonomy of 7 AI Tasks: Generation, Classification, Extraction, Transformation, Summarization, Reasoning, and Code Generation. Seven glowing hexagonal glass nodes arranged in a circular dashboard, each node displaying a unique neon micro-icon (e.g., a glowing quill for Generation, a label tag for Classification, database brackets for Extraction). Holographic UI style, dark theme, smooth violet and magenta gradient glows, sharp details, floating glass panels, 8k resolution, futuristic concept art, 3D render.`

#### 🔸 Xu hướng Agentic Workflows (2026)
Năm 2026 đánh dấu bước chuyển mình từ việc con người tương tác thủ công với Chatbot sang việc triển khai các **AI Agents tự chủ chạy ngầm (Background Agents)**.
* **Cơ chế hoạt động**: AI Agent nhận mục tiêu lớn từ người dùng -> Tự phân rã thành các nhiệm vụ nhỏ -> Tự chọn và gọi các công cụ (Tools) cần thiết -> Tự sửa sai nếu gặp lỗi -> Trả ra kết quả cuối cùng.
* **Giao thức MCP (Model Context Protocol)**: Được ví như cổng *"USB-C của thế giới AI"*. Đây là giao thức mã nguồn mở chuẩn hóa do Anthropic phát triển, giúp kết nối bất kỳ AI Model nào với các tài nguyên dữ liệu và công cụ chạy trên máy tính nội bộ hoặc cloud một cách bảo mật và tức thời.

```
┌──────────────┐
│  Ý định User  │  "Phân tích báo cáo tài chính năm 2025"
└──────┬───────┘
       ▼
┌──────────────┐     ┌────────────────────┐
│ Agent Router  │────▶│ Background Agent   │ (Chạy ngầm bất đồng bộ,
│ (Điều phối)  │     │ (chạy tác vụ dài)  │  tự sửa lỗi)
└──────┬───────┘     └────────┬───────────┘
       │                      │
       ▼                      ▼
┌──────────────┐     ┌────────────────────┐
│ Gọi công cụ  │     │ Nhận thông báo     │
│ thông qua MCP│     │ từ Webhook         │ (Hoàn thành nhiệm vụ!)
└──────────────┘     └────────────────────┘
```

> [!NOTE]
> **Hình minh họa 1.6 — Mô hình kiến trúc Agentic Workflow 2026**
> * **Nội dung minh họa**: Quy trình khép kín mô tả cách Agent tiếp nhận mục tiêu, tương tác qua lại với MCP Server để đọc/ghi file và kết quả trả về cho hệ thống.
> * **Prompt tạo ảnh (Tiêu chuẩn công nghệ + 3D + 8K)**:
>   `A detailed 3D flowchart depicting a 2026 Agentic AI Workflow. Nodes connect sequentially with glowing laser paths: 1. User Intent input node -> 2. Agent Router (central glowing core processor) -> 3. Tool Calls via MCP (Model Context Protocol, visualized as a futuristic glowing connector plug linking to databases and search engines) -> 4. Asynchronous Background Agent -> 5. Webhook Notification showing a successful completion checkmark. Modern dark dashboard interface background, high tech design, metallic and glass textures, neon cyan and deep violet lighting, 8k resolution, photorealistic 3D render.`

##### Hướng dẫn chọn mô hình tối ưu theo nhóm Task (06/2026)
| Nhóm Tác Vụ | Mô Hình Khuyên Dùng | Lý Do Lựa Chọn |
| :--- | :--- | :--- |
| Chat thường ngày / Biên soạn tài liệu | **GPT-5.5** | Khả năng tổng hợp thông tin cân biến nhất, giọng văn tự nhiên. |
| Phát triển phần mềm / Sửa code | **Claude Fable 5** | Độ tin cậy về cú pháp và logic cấu trúc code tốt nhất hiện tại. |
| Xử lý tài liệu siêu dài / Phân tích log | **Gemini 3.5 Flash** | Context Window 1M+ tokens vượt trội, xử lý dữ liệu lớn giá cực rẻ. |
| Giải toán nâng cao / Suy luận nghiên cứu | **Gemini 3.5 Pro** / **GPT-5 Pro** | Có chế độ tư duy sâu tự động giúp giải quyết các bài toán hóc búa. |
| Hệ thống Agent tự chủ gọi Tool | **Claude Opus 4.8** | Khả năng tuân thủ định dạng Schema đầu ra chuẩn xác nhất, ít lỗi gọi API. |

#### 📝 Bài tập Lesson 1.4
1. **Thiết kế luồng Agentic**: Hãy tự lên kế hoạch thiết kế một AI Agent tự động hóa việc: "Đọc email khách hàng -> Phân loại cảm xúc -> Tra cứu thông tin trên database nội bộ -> Tự động soạn email trả lời phù hợp". Mô tả rõ Agent này cần những công cụ (Tools) nào và bạn sẽ kết nối chúng qua MCP ra sao.
2. **Bảng ánh xạ dự án**: Lập bảng ánh xạ (Mapping) cho 10 công việc thực tế tại cơ quan/trường học của bạn sang 7 nhóm tác vụ AI cốt lõi, chọn model tương ứng và lý do lựa chọn.

---

## 🧪 QUIZ KIỂM TRA SESSION 01
*Hãy chọn đáp án đúng nhất cho các câu hỏi sau:*

#### Câu 1: Theo mô hình Karpathy (2025-2026), cấu phần nào tương ứng với bộ nhớ RAM của hệ thống AI?
* A. Bản thân mô hình LLM.
* B. Người kỹ sư thiết kế hệ thống.
* C. Cửa sổ ngữ cảnh (Context Window).
* D. Ổ cứng lưu trữ Vector Database.
* * **Đáp án đúng**: **C**
  * *Giải thích*: LLM đóng vai trò CPU xử lý tính toán, Context Window đóng vai trò là thanh RAM chứa toàn bộ thông tin làm việc tạm thời được nạp vào, còn Engineer đóng vai trò OS quản lý việc nạp/xóa RAM.

#### Câu 2: Ưu thế lớn nhất của mô hình Gemini 3.5 Flash trong năm 2026 là gì?
* A. Tốc độ suy luận chậm nhưng rất sâu sắc.
* B. Kích thước Context Window cực lớn (1M+ tokens) với chi phí tối ưu.
* C. Khả năng viết văn thơ sáng tạo tốt nhất.
* D. Tự động sửa code mà không cần công cụ hỗ trợ.
* * **Đáp án đúng**: **B**
  * *Giải thích*: Gemini 3.5 Flash nổi tiếng với context window siêu khủng lên tới hơn 1 triệu tokens, giúp xử lý các tập tin tài liệu khổng lồ với chi phí API cực thấp.

#### Câu 3: Khi làm việc với các dòng Reasoning Models như GPT-5 Pro hay Gemini 3.5 Pro, viết câu lệnh `"Hãy suy nghĩ từng bước"` có tác động thế nào?
* A. Luôn luôn bắt buộc để mô hình đưa ra câu trả lời đúng.
* B. Có thể gây ra hiện tượng Double-Reasoning, làm tăng thời gian phản hồi (Latency) không cần thiết.
* C. Giúp mô hình tiết kiệm token đầu ra hơn.
* D. Làm mô hình bị lỗi hệ thống không phản hồi.
* * **Đáp án đúng**: **B**
  * *Giải thích*: Các mô hình Reasoning đã tích hợp sẵn cơ chế suy luận ngầm bên trong. Việc ép mô hình hiển thị tiếp chuỗi suy nghĩ ở đầu ra sẽ tạo ra hiện tượng suy luận trùng lặp, gây lãng phí thời gian và tiền bạc.

#### Câu 4: Model Context Protocol (MCP) giải quyết vấn đề cốt lõi nào của AI Agent?
* A. Giúp mô hình dịch thuật nhanh hơn.
* B. Chuẩn hóa giao thức kết nối bảo mật giữa AI Model và các nguồn dữ liệu/công cụ bên ngoài.
* C. Giúp tăng dung lượng Context Window lên vô hạn.
* D. Thay thế hoàn toàn cho các thư viện lập trình như Python và JavaScript.
* * **Đáp án đúng**: **B**
  * *Giải thích*: MCP hoạt động như một cổng kết nối chuẩn hóa ("USB-C"), giúp AI tương tác trực tiếp và an toàn với hệ thống tệp tin, cơ sở dữ liệu và các API nội bộ mà không cần viết lại mã nguồn tích hợp cho từng mô hình.

#### Câu 5: Lỗi hệ thống của AI Agent (Agent Failures) trong thực tế phần lớn xuất phát từ:
* A. Do câu lệnh Prompt ban đầu viết chưa đủ hoa mỹ.
* B. Do lỗi từ hệ quản trị cơ sở dữ liệu bị sập.
* C. Do quản lý ngữ cảnh bị thất bại (Context Failures - mất thông tin, tràn bộ nhớ, gọi sai công cụ).
* D. Do mô hình AI bị lỗi phần cứng trong trung tâm dữ liệu.
* * **Đáp án đúng**: **C**
  * *Giải thích*: Theo nghiên cứu thực tế và khẳng định của Karpathy, phần lớn các thất bại của Agent tự vận hành đến từ lỗi quản lý ngữ cảnh (Context Engineering bị lỗi) chứ không phải do câu lệnh Prompt chính.

---

## ⚡ BỘ PROMPTS MẪU CHO SLIDE & VIDEO (NOTEBOOKLM)

Để giúp Giảng viên/Học viên dễ dàng chuyển đổi nội dung Session 01 thành các định dạng thuyết trình và sản xuất video bài giảng tự động, dưới đây là bộ Prompts mẫu được tinh chỉnh chuyên biệt.

### 1. Prompts tạo slide bài giảng (Dành cho Gamma.app / Marp / ChatGPT)

#### 🔹 Slide Prompt 1: Tổng quan & Lesson 1.1 (LLM Hoạt Động Thế Nào?)
> Copy đoạn prompt bên dưới nạp vào ChatGPT hoặc Gamma.app để phác thảo slide:
```markdown
Role: Bạn là một chuyên gia thiết kế bài giảng (Instructional Designer) chuyên nghiệp trong lĩnh vực trí tuệ nhân tạo.
Nhiệm vụ: Hãy tạo mã nguồn Markdown theo chuẩn Marp (Marp presentation format) để trình bày nội dung Slide cho Lesson 1.1: "LLM hoạt động như thế nào và sự tiến hóa của Context Window trong năm 2026".

Yêu cầu chi tiết về cấu trúc các Slide:
- Slide 1: Tiêu đề lớn (Session 01 - Lesson 1.1), tên bài học, mục tiêu chính của bài học.
- Slide 2: Khái niệm Tokenization (sử dụng ví dụ thực tế cách chia từ "Xin chào" và "AI").
- Slide 3: Giải thích 2 cơ chế: Attention Mechanism và Next-Token Prediction bằng sơ đồ văn bản đơn giản.
- Slide 4: Bảng so sánh các tham số ảnh hưởng: Temperature (0 vs 1) và Top-p.
- Slide 5: Sự tiến hóa của Context Window qua các năm (sử dụng dòng thời gian từ 4K năm 2022 đến 1M+ tokens năm 2026).
- Slide 6: Bảng so sánh 3 mô hình tiêu biểu của năm 2026: Claude Fable 5, GPT-5.5, Gemini 3.5 Flash.
- Slide 7: Tóm tắt bài học & Bài tập thực hành tại lớp.

Style thiết kế Slide: Sử dụng cấu trúc tối giản, có icon minh họa cho từng đề mục, phân chia màu sắc tương phản cao (Dark Mode style: nền tối, chữ sáng, màu nhấn là Cyan và Gold). Không viết các đoạn văn dài, chỉ sử dụng Bullet Points ngắn gọn và súc tích.
```

#### 🔹 Slide Prompt 2: Lesson 1.2 & 1.3 (3 Trụ Cột & Mental Model Karpathy)
```markdown
Role: Chuyên gia thiết kế Slide bài giảng công nghệ cao.
Nhiệm vụ: Tạo nội dung chi tiết dạng Bullet Points cho các slide thuyết trình về "Sự chuyển dịch từ Prompt sang Context Engineering & Mô hình tư duy Karpathy".

Cấu trúc Slide cần tạo:
- Slide 1: Tiêu đề "3 Trụ Cột Của AI Engineering: Prompt - Context - Harness".
- Slide 2: Định nghĩa và phân biệt chi tiết 3 khái niệm (sử dụng hình ảnh so sánh: viết thư -> chuẩn bị tài liệu -> quy trình phòng ban).
- Slide 3: Khái niệm Paradigm Shift 2025-2026: Tại sao Prompt Engineering không còn là vua? Trích dẫn câu nói của Andrej Karpathy.
- Slide 4: Khung tư duy Karpathy: Ánh xạ hệ thống AI (Kỹ sư = OS, Context Window = RAM, LLM = CPU).
- Slide 5: Steerability - Giải thích và ví dụ cụ thể về Prompt có độ Steerability thấp vs cao.
- Slide 6: Lưu ý 2026 - Tại sao không nên dùng "think step by step" đối với Reasoning Models (Hiện tượng Double-Reasoning).
- Slide 7: Câu hỏi thảo luận nhóm và bài tập thực hành.

Yêu cầu định dạng: Viết dưới dạng kịch bản slide gồm: Tiêu đề slide, Nội dung hiển thị dạng bullet-points (tối đa 4 ý/slide), và Ghi chú dành cho giảng viên (Speaker Notes) ở dưới mỗi slide để hướng dẫn cách giảng.
```

---

### 2. Prompts cấu hình Audio Overview / Video Podcast bằng NotebookLM

Google NotebookLM có tính năng cực kỳ mạnh mẽ là **Audio Overview** (tạo file podcast thảo luận giữa 2 MC ảo). Bạn có thể cấu hình sâu cho 2 MC này bằng cách nhập các prompt định hướng dưới đây trước khi bấm Generate.

#### 🔹 NotebookLM Custom Prompt 1: Thảo luận tổng quan Session 01 (Lối nói chuyên sâu, học thuật nhưng cuốn hút)
> Sao chép đoạn này và dán vào phần **"Customize"** trong mục Audio Overview của NotebookLM:
```markdown
Hãy tạo một buổi thảo luận Podcast giữa hai người dẫn chương trình (một nam, một nữ) bàn về nội dung của Session 01: "Nền tảng và Bối cảnh AI 2026".

Các chỉ dẫn cụ thể cho cuộc hội thoại:
1. Tông giọng và Phong cách: Chuyên nghiệp, tràn đầy năng lượng, giống như hai chuyên gia công nghệ đang chia sẻ những phát hiện thú vị chứ không đơn thuần là đọc tài liệu. Ngôn ngữ tự nhiên, có những câu đệm thể hiện sự ngạc nhiên ("Wow", "Chính xác", "Thật không thể tin nổi").
2. Nội dung trọng tâm cần làm rõ:
   - Giải thích một cách trực quan nhất thế nào là cơ chế dự đoán từ tiếp theo (Next-Token Prediction). Dùng hình tượng "máy chơi chữ tự động".
   - Làm nổi bật sự tiến hóa kinh ngạc của Context Window lên mức 1 triệu tokens của Gemini 3.5 Flash.
   - Tập trung sâu vào mô hình tư duy của Andrej Karpathy: LLM là CPU, Context là RAM, và Kỹ sư đóng vai trò OS. Đây phải là điểm nhấn chính của Podcast.
   - Thảo luận về việc tại sao kỹ năng "Prompt Engineering" đang dần bị thay thế bởi "Context Engineering".
3. Lưu ý kỹ thuật: MC Nam sẽ đóng vai trò giải thích kỹ thuật chuyên sâu, MC Nữ đóng vai trò liên hệ thực tế, đặt câu hỏi phản biện và đưa ra các phép so sánh (analogy) dễ hiểu cho người nghe.
4. Ngôn ngữ: Sử dụng Tiếng Việt tự nhiên, các thuật ngữ công nghệ tiếng Anh thông dụng (như CPU, RAM, OS, Token, Context Window, Prompt) giữ nguyên không dịch thô bạo.
```

#### 🔹 NotebookLM Custom Prompt 2: Kịch bản Video ngắn/Tiktok giới thiệu bài học (Phong cách giật gân, khơi gợi tò mò)
> Nhập prompt này vào NotebookLM để mô hình trích xuất ra nội dung kịch bản cho video ngắn 60 giây:
```markdown
Dựa trên tài liệu Session 01, hãy viết một kịch bản chi tiết cho một Video ngắn (thời lượng 60 giây) để đăng tải trên Youtube Shorts hoặc TikTok nhằm giới thiệu bài học này.

Cấu trúc kịch bản yêu cầu:
- 0 - 5 giây (Hook giật gân): Đánh thẳng vào nỗi sợ hoặc sự tò mò của người xem. Ví dụ: "Dừng lại! Bạn vẫn đang viết 'hãy suy nghĩ từng bước step-by-step' cho AI? Bạn đang lãng phí tiền và làm AI chạy chậm đi đấy!"
- 5 - 20 giây (Giải thích vấn đề): Giải thích nhanh về Reasoning Models (như GPT-5 Pro) đã tự suy nghĩ ngầm rồi, viết thêm chỉ tổ bị Double-Reasoning.
- 20 - 40 giây (Giải pháp/Kiến thức mới): Giới thiệu mô hình Karpathy. Nhấn mạnh: "AI là CPU, Context mới là RAM. Bạn không thể bắt CPU chạy tốt nếu RAM trống rỗng hoặc chứa đầy rác."
- 40 - 55 giây (Call-to-action): Giới thiệu khóa học Prompt, Context & Harness Engineering 2026 để làm chủ kỹ năng Context Engineering thay vì đi học viết prompt dạo.
- 55 - 60 giây (Outro): Hình ảnh kêu gọi Like, Subscribe.

Kịch bản đầu ra phải ghi rõ: Phân cảnh (Visual), Lời thoại chi tiết (Voiceover) của người nói, và Hiệu ứng âm thanh/chữ chạy trên màn hình (SFX/Text Overlay).
```
