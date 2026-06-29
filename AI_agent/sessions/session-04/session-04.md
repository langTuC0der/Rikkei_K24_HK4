# 📚 HỌC LIỆU CHI TIẾT: SESSION 04
## CONTEXT ENGINEERING (CONTEXT WINDOWS, RAG, MCP PROTOCOL & MEMORY SYSTEMS)

---

## 🗺️ TỔNG QUAN SESSION 04
* **Mục tiêu**: Làm chủ kỹ năng quản lý và tối ưu hóa bối cảnh đầu vào (Context Engineering) - kỹ năng cốt lõi nhất được đề xuất bởi Andrej Karpathy nhằm thay thế cho việc viết prompt thủ công truyền thống. Học viên sẽ nắm vững 4 lỗi bối cảnh (Failure Modes), cấu trúc kết nối Model Context Protocol (MCP), kiến trúc bộ nhớ đa cấp cho AI Agent (4 Pillars of Context), và các mô hình thiết kế Context Caching giúp tiết kiệm 50% - 90% chi phí vận hành trong môi trường sản xuất năm 2026.
* **Thời lượng học tập**: ~3 - 4 giờ (bao gồm lý thuyết, thực hành, bài tập và làm bài kiểm tra).
* **Cấu trúc**: 4 bài học chính (Lessons) và 1 phần kiểm tra (Quiz).

---

## 📖 BÀI HỌC CHI TIẾT

### 4.1. Lesson 4.1 — Context Window: Hiểu, Tối Ưu & 🆕 4 Failure Modes
* **Thời lượng**: ~45-60 phút
* **Mục tiêu**: Nắm rõ cách hoạt động của cửa sổ ngữ cảnh (Context Window), cơ chế phân bổ ngân sách Token (Token Budget Allocation) và làm chủ giải pháp khắc phục 4 lỗi bối cảnh cốt lõi theo Karpathy Framework.

#### 🔸 Lý thuyết: Cửa sổ ngữ cảnh & Phân bổ Token
Cửa sổ ngữ cảnh (Context Window) giống như bộ nhớ RAM của một hệ thống máy tính AI. Mặc dù các mô hình năm 2026 như Gemini 3.5 Flash đã hỗ trợ lên tới 1 triệu token trở lên, việc quản lý tài nguyên này vẫn đóng vai trò sống còn để tối ưu hóa độ trễ (Latency) và chi phí tài chính (API cost).

##### Cơ chế Lost in the Middle
Các nghiên cứu chỉ ra rằng LLM có xu hướng chú ý nhiều hơn đến phần thông tin xuất hiện ở đầu (Primacy Bias) và ở cuối (Recency Bias) của context window, trong khi bỏ qua hoặc xử lý kém hiệu quả phần thông tin ở giữa. Do đó, các thông tin cực kỳ quan trọng (như Core Instructions hoặc User Query) phải luôn được ưu tiên đặt ở đầu hoặc cuối bối cảnh.

##### Phân bổ ngân sách Token tiêu chuẩn (Token Budget Allocation)
```
┌─────────────────────────────────────────────┐
│              CONTEXT WINDOW                 │
│                                             │
│  [System Prompt]     ~5-10% tokens          │
│  [Tool Schemas]      ~5-10% tokens          │
│  [Retrieved Context] ~40-50% tokens         │
│  [Conversation History] ~15-25% tokens      │
│  [User Query]        ~5% tokens             │
│  [Reserved for Output] ~10-20% tokens       │
│                                             │
└─────────────────────────────────────────────┘
```

> [!NOTE]
> **Hình minh họa 4.1 — Phân bổ bối cảnh & Hiện tượng Lost in the Middle**
> * **Nội dung minh họa**: Sơ đồ một dải băng bối cảnh (Context tape) với ánh sáng rực rỡ ở hai đầu thể hiện độ chú ý cao (High Attention), và vùng tối mờ nhạt ở giữa thể hiện hiện tượng Lost in the Middle.
> * **Prompt tạo ảnh (Tiêu chuẩn công nghệ + 3D + 8K - Trực quan tiếng Việt)**:
>   `A futuristic 3D infographic illustrating "Lost in the Middle" problem in AI context windows. A long horizontal glowing glass bar representing the context window. The left end is labeled "ĐẦU (BEGINNING - HIGH ATTENTION)" glowing in cyan. The right end is labeled "CUỐI (END - HIGH ATTENTION)" glowing in purple. The middle section is dark and foggy, labeled "GIỮA (MIDDLE - LOST IN THE MIDDLE)" with dim orange outlines. Neon data nodes flow through the bar. Sleek dark mode tech background, 8k, highly detailed.`

#### 🔸 4 Failure Modes của Bối cảnh (Karpathy Framework)
Andrej Karpathy chỉ ra rằng hầu hết các lỗi hoạt động của AI Agent không xuất phát từ việc Prompt dở, mà đến từ việc **thiết lập bối cảnh sai lệch**. Có 4 chế độ lỗi chính:

| Failure Mode (Chế độ lỗi) | Mô tả bản chất | Ví dụ thực tế | Giải pháp khắc phục |
| :--- | :--- | :--- | :--- |
| **Context Poisoning**<br>(Nhiễm độc bối cảnh) | Một thông tin sai lệch được sinh ra ở vòng lặp trước, nạp lại vào bối cảnh và bị khuếch đại lên ở vòng lặp sau. | Agent viết sai tên biến ở bước 1 -> Đọc lại code lỗi đó -> Tự suy luận ra các hàm tiếp theo bị sai hàng loạt. | Thiết lập chốt chặn kiểm thử (Assertion) và làm sạch dữ liệu trước khi nạp lại vào Agent Loop. |
| **Context Distraction**<br>(Bối cảnh gây nhiễu) | Lịch sử cuộc trò chuyện quá dài hoặc chứa quá nhiều văn bản thừa khiến LLM mất tập trung vào mục tiêu chính. | Cuộc chat kéo dài 50 lượt khiến AI bắt đầu quên mất các ràng buộc bảo mật đặt ở System Prompt. | Tóm tắt lịch sử cuộc gọi (Summarization), áp dụng cửa sổ trượt (Sliding Window) hoặc cắt tỉa thông tin. |
| **Context Confusion**<br>(Hỗn loạn bối cảnh) | Nạp quá nhiều định nghĩa công cụ (Tool Schemas) hoặc tài liệu cùng lúc khiến LLM chọn sai hành động hoặc sai tool. | Đưa 50 công cụ khác nhau vào bối cảnh khiến AI bị loạn và liên tục gọi nhầm tool lấy thời tiết thay vì lấy lịch. | Phân nhóm công cụ, áp dụng cơ chế nạp công cụ động (Dynamic Tool Selection) dựa trên ý định. |
| **Context Clash**<br>(Mâu thuẫn bối cảnh) | Sự xung đột thông tin giữa các tài liệu được nạp vào bối cảnh. | Tài liệu A ghi "Bảo hành 12 tháng", tài liệu B ghi "Bảo hành 6 tháng" khiến AI trả lời không nhất quán. | Thiết lập phân tầng mức độ ưu tiên của nguồn (Source Authority) và giải quyết mâu thuẫn trước khi nạp. |

#### 🛠️ Thực hành: Khắc phục lỗi Context Distraction
1. Hãy quan sát một prompt bị lỗi Context Distraction do chứa quá nhiều lịch sử chat thừa thãi.
2. Viết lại prompt sử dụng cơ chế tóm tắt lịch sử (compaction) để giữ lại đúng ý định chính của người dùng và các thông tin quan trọng.

#### 📝 Bài tập Lesson 4.1
1. **Thiết kế Context Budget**: Xây dựng bảng cấu hình phân bổ token (System Prompt, History, RAG, Output) cho một chatbot tư vấn luật với giới hạn context window nghiêm ngặt là **32,000 tokens**.
2. **Phân tích Case Study**: Viết một báo cáo ngắn (200-300 từ) phân tích một sự cố AI Agent thực tế mà bạn từng gặp phải, phân loại lỗi đó thuộc về Failure Mode nào trong 4 loại trên và đề xuất giải pháp sửa đổi cụ thể.

---

### 4.2. Lesson 4.2 — RAG, 🆕 MCP Protocol & Dynamic Context
* **Thời lượng**: ~45-60 phút
* **Mục tiêu**: Nắm vững luồng RAG nâng cao và làm chủ giao thức Model Context Protocol (MCP) - chuẩn kết nối vạn năng giữa AI và các hệ thống ngoài năm 2026.

#### 🔸 Lý thuyết: RAG nâng cao & Sự ra đời của MCP
* **Retrieval-Augmented Generation (RAG)**: Thay vì lưu trữ mọi tri thức trong trọng số mô hình, RAG thực hiện tìm kiếm tài liệu liên quan từ cơ sở dữ liệu vector (Vector DB) dựa trên Embedding, xếp hạng lại (Reranking) và nhúng vào bối cảnh để AI trả lời chính xác.
* **🆕 Model Context Protocol (MCP)**: Được Anthropic công bố và trở thành tiêu chuẩn công nghiệp năm 2025-2026. MCP đóng vai trò như cổng **USB-C dành cho AI**. 
  - *Trước khi có MCP*: Mỗi khi muốn kết nối AI với một tool (như Jira, Slack, Database), lập trình viên phải tự viết mã tích hợp tùy biến cực kỳ phức tạp.
  - *Sau khi có MCP*: Bạn chỉ cần dựng một **MCP Server** chuẩn hóa. Bất kỳ **MCP Client** nào (như Claude Desktop, Cursor, LangGraph) đều có thể kết nối và tự động khám phá (Auto-discover) các tool, resource có sẵn để sử dụng.

> [!NOTE]
> **Hình minh họa 4.2 — Kiến trúc Model Context Protocol (MCP)**
> * **Nội dung minh họa**: Sơ đồ kiến trúc thể hiện AI Application đóng vai trò là MCP Client, giao tiếp thông qua giao thức chuẩn hóa MCP với nhiều MCP Servers khác nhau (Database, File System, Web API).
> * **Prompt tạo ảnh (Tiêu chuẩn công nghệ + 3D + 8K - Trực quan tiếng Việt)**:
>   `A futuristic 3D architectural diagram of Model Context Protocol (MCP). The central glowing node is the "MCP CLIENT (AI BRAIN)". Glowing digital cables represent the standardized protocol branching out to connect three glass-encased servers labeled in Vietnamese: "MCP SERVER: CƠ SỞ DỮ LIỆU", "MCP SERVER: HỆ THỐNG PHÁT TRIỂN", and "MCP SERVER: SLACK/EMAIL API". Highly detailed cybertech elements, neon purple and cyan styling, dark background, 8k.`

#### 🛠️ Thực hành: Xây dựng MCP Server đơn giản bằng Python
Dưới đây là một ví dụ xây dựng MCP Server sử dụng thư viện `FastMCP` để cung cấp công cụ đọc tệp tin cục bộ cho AI:
```python
# Cài đặt: pip install fastmcp
from fastmcp import FastMCP

# Khởi tạo MCP Server mang tên "file-inspector"
mcp = FastMCP("FileInspector")

@mcp.tool()
def read_local_log(file_path: str) -> str:
    """Đọc tệp tin log cục bộ. Chỉ dùng khi cần phân tích log hệ thống."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            # Chỉ đọc 50 dòng cuối để tránh làm tràn bối cảnh
            lines = f.readlines()
            return "".join(lines[-50:])
    except Exception as e:
        return f"Lỗi đọc file: {str(e)}"

if __name__ == "__main__":
    mcp.run()
```

#### 📝 Bài tập Lesson 4.2
1. **Thiết kế Kiến trúc RAG + MCP**: Vẽ sơ đồ khối mô tả cách một AI Agent trả lời câu hỏi về báo cáo tài chính của khách hàng. Sơ đồ phải thể hiện rõ: User -> MCP Client -> RAG Server (MCP Server) -> Vector DB -> Trả kết quả bối cảnh -> LLM sinh câu trả lời.

---

### 4.3. Lesson 4.3 — Conversation Memory, State Management & 🆕 4 Pillars of Context Engineering
* **Thời lượng**: ~45-60 phút
* **Mục tiêu**: Thiết kế hệ thống bộ nhớ đa tầng cho AI Agent và áp dụng thành thạo **4 Trụ Cột của Context Engineering** để cô lập bối cảnh.

#### 🔸 Lý thuyết: Hệ thống bộ nhớ Agent & 4 Trụ Cột
Để hoạt động dài hạn (Long-running agents), AI cần một kiến trúc bộ nhớ phức tạp hơn là một danh sách chat đơn thuần:
1. **Working Memory (Cửa sổ ngữ cảnh)**: Chứa thông tin cực kỳ ngắn hạn đang xử lý tại chỗ.
2. **Episodic Memory (Bộ nhớ sự kiện)**: Ghi lại lịch sử các hành động và lỗi đã thực hiện ở các vòng lặp trước (Rất quan trọng cho Reflexion).
3. **Semantic Memory (Bộ nhớ ngữ nghĩa)**: Kho kiến thức chung được truy vấn thông qua RAG hoặc Vector Store.

> [!NOTE]
> **Hình minh họa 4.3 — Kiến trúc bộ nhớ đa cấp của AI Agent**
> * **Nội dung minh họa**: Sơ đồ 3 cấp độ bộ nhớ của AI: Khối Working Memory (RAM) sáng rực ở trên cùng, kết nối xuống khối Episodic Memory (nhật ký sự kiện) ở giữa, và khối Semantic Memory (Vector Database) đồ sộ ở dưới cùng.
> * **Prompt tạo ảnh (Tiêu chuẩn công nghệ + 3D + 8K - Trực quan tiếng Việt)**:
>   `A 3D visualization of an AI Agent Memory System. Three stacked glowing holographic layers. Top layer is small and bright labeled "WORKING MEMORY (RAM / CONTEXT)". Middle layer is a rolling digital film strip labeled "EPISODIC MEMORY (NHẬT KÝ SỰ KIỆN)". Bottom layer is a massive glowing matrix database labeled "SEMANTIC MEMORY (VECTOR DATABASE)". Cyberpunk dark tech theme, neon blue and gold light beams connect the layers, 8k.`

##### 🆕 4 Trụ cột của Context Engineering (Framework 2026)
Để quản lý bối cảnh bền vững và tránh các lỗi nhiễu thông tin, kỹ sư AI áp dụng quy chuẩn 4 trụ cột:

| Trụ cột | Hành động kỹ thuật | Mục tiêu | Ví dụ cụ thể |
| :--- | :--- | :--- | :--- |
| **1. Write (Ghi ngoại vi)** | Đẩy thông tin ra bộ nhớ ngoài (Database) thay vì giữ trong bối cảnh. | Tiết kiệm token của cửa sổ ngữ cảnh, giảm nhiễu. | Khi người dùng nói sở thích, lưu vào CSDL khách hàng thay vì giữ mãi trong chat history. |
| **2. Select (Lọc đưa vào)** | Chỉ truy vấn và nạp đúng thông tin cần thiết vào đúng thời điểm. | Tránh hiện tượng Lost in the Middle và Context Distraction. | Dùng RAG để chỉ lấy ra 3 bài viết FAQ phù hợp nhất với câu hỏi hiện tại. |
| **3. Compress (Nén thông tin)** | Thực hiện tóm tắt các đoạn hội thoại cũ hoặc gom các thực thể quan trọng. | Tăng mật độ thông tin hữu ích (Signal Density) trong bối cảnh. | Gom 20 câu chat cũ thành một đoạn tóm tắt: "Người dùng muốn hoàn tiền do lỗi giao hàng". |
| **4. Isolate (Cô lập môi trường)** | Phân chia nhiệm vụ cho các sub-agents với bối cảnh riêng biệt. | Tránh xung đột chỉ dẫn (Context Clash) và hỗn loạn công cụ. | Agent viết code không được nạp các tool gửi email hoặc thông tin tài chính của khách hàng. |

#### 🛠️ Thực hành: Cơ chế cô lập bối cảnh (Isolate Pattern)
Hãy giả lập thiết lập cấu trúc cho hai sub-agents hoạt động độc lập để xử lý một yêu cầu hỗ trợ kỹ thuật:
- **Agent A (Phân tích log lỗi)**: Chỉ có quyền đọc log tệp tin, không biết thông tin thanh toán của khách hàng.
- **Agent B (Chăm sóc khách hàng)**: Biết tên khách hàng và gói cước, nhưng không trực tiếp đọc log lỗi mà chỉ nhận tóm tắt từ Agent A.

#### 📝 Bài tập Lesson 4.3
1. **Thiết kế hệ thống AI Tutor**: Áp dụng 4 trụ cột của Context Engineering để viết tài liệu thiết kế hệ thống bối cảnh cho một trợ lý AI dạy tiếng Anh. Xác định rõ: Dữ liệu nào cần **Write**, tài liệu nào cần **Select**, khi nào cần **Compress** lịch sử học tập, và các sub-agent nào cần được **Isolate**.

---

### 4.4. Lesson 4.4 — Context Design Patterns & 🆕 Production Architecture
* **Thời lượng**: ~45-60 phút
* **Mục tiêu**: Làm chủ tính năng **Context Caching** để cắt giảm chi phí API và xây dựng sơ đồ kiến trúc bối cảnh hoàn chỉnh cho dự án thực tế.

#### 🔸 Lý thuyết: Các mẫu thiết kế bối cảnh & Context Caching
* **Layered Context (Bối cảnh đa tầng)**: Tổ chức bối cảnh theo độ ưu tiên giảm dần: Instructions -> Dynamic Context (RAG) -> Chat History -> User Query.
* **Context Routing (Điều hướng bối cảnh)**: Phân tích câu hỏi của người dùng bằng một bộ phân loại cực nhanh để quyết định nạp bối cảnh từ cơ sở dữ liệu nào (ví dụ hỏi về giá thì route sang DB giá, hỏi về kỹ thuật thì route sang tài liệu kỹ thuật).
* **🆕 Context Caching (Mẫu thiết kế đột phá của năm 2026)**:
  - Các nhà cung cấp lớn (Anthropic Prompt Caching, Google Gemini Context Caching) cho phép lưu trữ trạng thái bối cảnh đã xử lý (System Prompt, tài liệu luật lớn, toàn bộ codebase) trực tiếp trên máy chủ của họ.
  - Khi người dùng gửi câu hỏi tiếp theo, mô hình chỉ cần đọc bối cảnh từ bộ nhớ cache thay vì tính toán lại từ đầu.
  - **Lợi ích**: Giảm từ **50% đến 90% chi phí API** và tăng tốc độ xử lý (giảm latency) tới 2-3 lần đối với các tài liệu siêu lớn.

> [!NOTE]
> **Hình minh họa 4.4 — Sơ đồ tối ưu hóa của Context Caching**
> * **Nội dung minh họa**: Sơ đồ so sánh 2 luồng gọi API: Luồng thông thường (phải gửi và tính toán lại toàn bộ bối cảnh khổng lồ ở mỗi lượt) và luồng Caching (chỉ gửi câu hỏi mới, bối cảnh lớn được tái sử dụng trực tiếp từ Cache của server).
> * **Prompt tạo ảnh (Tiêu chuẩn công nghệ + 3D + 8K - Trực quan tiếng Việt)**:
>   `A futuristic 3D diagram comparing Standard API call vs Context Caching API call. On the left side (Standard), a massive data stream (representing system prompt + documents) is sent repeatedly for each query. On the right side (Caching), the massive data block is anchored in a glowing server slot labeled "CONTEXT CACHE (90% COST SAVED)" in neon green, and only the tiny query nodes are sent. Sleek technology dark mode, 8k.`

#### 🛠️ Thực hành: Cấu hình Prompt Caching (Anthropic Style)
Tìm hiểu cách đánh dấu cache cho bối cảnh tĩnh bằng cách sử dụng breakpoint trong API call:
```python
# Giả lập cấu hình gọi API Claude với Prompt Caching
messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": "[Đây là cuốn tài liệu hướng dẫn kỹ thuật dài 50.000 từ...]",
                # Thiết lập điểm lưu cache tại đây (breakpoint)
                "cache_control": {"type": "ephemeral"}
            },
            {
                "type": "text",
                "text": "Dựa trên tài liệu trên, hãy giải thích lỗi E102 là gì."
            }
        ]
    }
]
```

#### 📝 Bài tập Lesson 4.4
1. **Viết Tài Liệu Kiến Trúc Bối Cảnh (Context Architecture Document)**: Hãy chọn một dự án thực tế (ví dụ: AI trợ giúp pháp lý hoặc AI hỗ trợ lập trình cho công ty). Viết tài liệu mô tả chi tiết cách thiết lập bối cảnh cho hệ thống đó, tích hợp: RAG tìm kiếm điều luật, MCP kết nối hệ thống dữ liệu, bộ nhớ lưu lịch sử tư vấn, và thiết lập điểm lưu Context Caching để tiết kiệm chi phí.

---

## 🧪 QUIZ KIỂM TRA SESSION 04
*Hãy chọn đáp án đúng nhất cho các câu hỏi sau:*

#### Câu 1: Hiện tượng "Lost in the Middle" mô tả hành vi nào của mô hình ngôn ngữ lớn khi xử lý bối cảnh?
* A. Mô hình bị crash cú pháp khi thông tin quan trọng nằm ở dòng thứ 50.
* B. Mô hình có xu hướng xử lý thông tin kém hiệu quả hơn khi thông tin đó nằm ở giữa cửa sổ ngữ cảnh, so với khi nằm ở đầu hoặc cuối.
* C. Mô hình tự động cắt tỉa phần văn bản ở giữa để tiết kiệm token.
* D. Mô hình không thể gọi được các tool nằm ở giữa danh sách định nghĩa.
* * **Đáp án đúng**: **B**
  * *Giải thích*: Lost in the Middle là điểm yếu kinh điển của cơ chế Attention, mô hình chú ý nhiều nhất đến phần đầu (Primacy) và phần cuối (Recency) của chuỗi token đầu vào, khiến thông tin ở giữa dễ bị bỏ qua.

#### Câu 2: Trong 4 Failure Modes của bối cảnh theo Andrej Karpathy, lỗi "Context Poisoning" xảy ra khi nào?
* A. Hacker tấn công chèn mã độc vào cơ sở dữ liệu Vector.
* B. Agent tự sinh ra một kết quả sai lệch ở vòng lặp trước, nạp lại kết quả sai đó vào bối cảnh ở vòng lặp sau và tiếp tục lập luận sai dây chuyền.
* C. Cửa sổ ngữ cảnh bị tràn token dẫn đến mô hình bị mất trí nhớ tạm thời.
* D. Có quá nhiều tài liệu mâu thuẫn được nạp vào bối cảnh.
* * **Đáp án đúng**: **B**
  * *Giải thích*: Context Poisoning là hiện tượng "tự đầu độc". Trong một chuỗi agent tự động, nếu một bước trung gian đưa ra thông tin ảo tưởng (hallucination) mà không có kiểm chứng, thông tin sai đó sẽ nằm lại trong bối cảnh và dẫn dắt các bước suy luận sau sai hoàn toàn.

#### Câu 3: Vai trò chính của Model Context Protocol (MCP) công bố bởi Anthropic là gì?
* A. Dịch các prompt từ tiếng Việt sang tiếng Anh tự động.
* B. Cung cấp chuẩn kết nối mở vạn năng (giống USB-C) giúp các ứng dụng AI dễ dàng khám phá và gọi các công cụ, cơ sở dữ liệu và API bên ngoài.
* C. Lưu trữ các file vector database tốc độ cao.
* D. Nén dung lượng token của tài liệu văn bản.
* * **Đáp án đúng**: **B**
  * *Giải thích*: MCP là giao thức chuẩn hóa mở, giúp tách biệt phần xử lý logic của AI (MCP Client) và phần thực thi công cụ bên ngoài (MCP Server). Nhờ đó, lập trình viên chỉ cần viết MCP server một lần là có thể kết nối với mọi mô hình AI tương thích.

#### Câu 4: Khi áp dụng Trụ cột thứ 4 "Isolate (Cô lập)" của Context Engineering, chúng ta thực hiện hành động gì?
* A. Đóng băng hoàn toàn mô hình AI không cho cập nhật trọng số.
* B. Chia nhỏ hệ thống thành các sub-agent hoạt động độc lập và chỉ nạp cho mỗi agent phần bối cảnh tối thiểu cần thiết để hoàn thành nhiệm vụ của nó.
* C. Ngắt kết nối internet của chatbot để đảm bảo an toàn bảo mật.
* D. Chỉ cho phép mô hình giao tiếp với 1 người dùng duy nhất.
* * **Đáp án đúng**: **B**
  * *Giải thích*: Isolate giúp ngăn chặn hiện tượng "Context Confusion" và "Context Clash". Bằng cách chia nhỏ các tác vụ và cung cấp cho mỗi sub-agent một bối cảnh tối giản biệt lập, chúng ta ngăn chặn được việc AI bị rối loạn hoặc xung đột các chỉ dẫn khác nhau.

#### Câu 5: Lợi ích lớn nhất của tính năng Context Caching (Prompt Caching) trên các API thế hệ mới năm 2026 là gì?
* A. Giúp mô hình AI trả lời thông minh và sáng tạo hơn.
* B. Cắt giảm đáng kể chi phí API (lên đến 90%) và giảm thời gian phản hồi (latency) đối với các tác vụ tái sử dụng bối cảnh lớn nhiều lần.
* C. Loại bỏ hoàn toàn các lỗi Prompt Injection từ người dùng.
* D. Tự động hóa việc chia nhỏ tài liệu văn bản.
* * **Đáp án đúng**: **B**
  * *Giải thích*: Context Caching cho phép máy chủ của nhà cung cấp API lưu lại trạng thái bối cảnh khổng lồ đã parse. Khi chạy các lượt chat tiếp theo trên cùng tài liệu đó, hệ thống không cần tính toán lại từ đầu, giúp tiết kiệm phần lớn chi phí và tăng tốc độ xử lý cực kỳ nhanh chóng.

---

## ⚡ BỘ PROMPTS MẪU CHO SLIDE & VIDEO (SESSION 04)

### 1. Prompts tạo slide bài giảng (Dành cho Gamma.app / Marp)

#### 🔹 Slide Prompt 1: Cửa sổ ngữ cảnh & 4 Failure Modes (Lesson 4.1 & 4.2)
```markdown
Role: Chuyên gia biên soạn nội dung đào tạo AI doanh nghiệp.
Nhiệm vụ: Soạn thảo mã nguồn Markdown chuẩn Marp thuyết trình về chủ đề "Cửa sổ ngữ cảnh nâng cao và 4 Failure Modes của bối cảnh".

Cấu trúc Slide yêu cầu:
- Slide 1: Tiêu đề lớn "Quản trị bối cảnh nâng cao và Các lỗi vận hành AI Agent".
- Slide 2: Bản chất của Context Window và hiện tượng Lost in the Middle trong Attention Mechanism.
- Slide 3: Phân bổ ngân sách Token tối ưu (Token Budget Allocation) cho hệ thống thực tế.
- Slide 4: Giới thiệu 4 Failure Modes theo Karpathy Framework: Poisoning, Distraction, Confusion, Clash.
- Slide 5: Phân tích sâu lỗi Context Poisoning và cách thiết lập chốt chặn để tự phát hiện.
- Slide 6: Bài tập tình huống phân tích lỗi bối cảnh của một chatbot hỗ trợ bán hàng.

Thiết kế slide: Sử dụng tông màu tối, các biểu bảng so sánh rõ ràng, tinh gọn chữ tối đa.
```

#### 🔹 Slide Prompt 2: MCP Protocol & 4 Pillars of Context (Lesson 4.3 & 4.4)
```markdown
Role: Kiến trúc sư giải pháp AI.
Nhiệm vụ: Tạo kịch bản slide thuyết trình chi tiết về "Model Context Protocol (MCP) và 4 Trụ cột Context Engineering".

Cấu trúc Slide yêu cầu:
- Slide 1: Tiêu đề "Kết nối vạn năng qua MCP và Thiết kế bộ nhớ đa cấp cho Agent".
- Slide 2: Sự phức tạp của kết nối cũ vs Giải pháp cổng USB-C vạn năng của Model Context Protocol (MCP).
- Slide 3: Sơ đồ kiến trúc MCP: MCP Client, MCP Server và cơ chế tự khám phá công cụ.
- Slide 4: Giới thiệu 4 Trụ cột của Context Engineering: Write, Select, Compress, Isolate.
- Slide 5: Khái niệm Context Caching: Cơ chế tiết kiệm 90% chi phí API năm 2026.
- Slide 6: Thảo luận nhóm về thiết kế Context Architecture cho hệ thống AI trợ giúp pháp lý.

Yêu cầu: Mã nguồn Markdown sẵn sàng chạy trên Marp, kèm chỉ dẫn chi tiết phần lời thoại giảng viên.
```

---

### 2. Prompts cấu hình Audio Overview / Video Podcast bằng NotebookLM

#### 🔹 NotebookLM Custom Prompt: Thảo luận chuyên sâu về Session 04
> Sao chép toàn bộ nội dung dưới đây dán vào hộp thoại cấu hình NotebookLM:
```markdown
Hãy tạo một buổi thảo luận Podcast đối thoại cực kỳ sinh động giữa 2 chuyên gia công nghệ (một nam, một nữ) về chủ đề "Context Engineering: RAM của kỷ nguyên AI 2026".

Yêu cầu nội dung và phong cách hội thoại:
1. Giọng điệu và ngôn ngữ: Tự nhiên, hài hước, tranh luận cởi mở. Trao đổi bằng tiếng Việt công nghệ hiện đại, giữ nguyên các thuật ngữ tiếng Anh chuyên ngành (như Context Window, Lost in the Middle, Token Budget, Failure Modes, Context Poisoning, MCP, Vector DB, 4 Pillars, Context Caching).
2. Các điểm tranh luận cốt lõi:
   - Tại sao Andrej Karpathy nói thiết lập bối cảnh (Context Engineering) quan trọng hơn viết prompt? Hãy so sánh bối cảnh giống như bộ nhớ RAM của máy tính.
   - Thảo luận vui về lỗi "Context Poisoning" (AI tự ăn bánh vẽ của chính mình ở bước trước rồi bị ngộ độc thông tin). Làm sao để lập trình ngăn chặn lỗi này?
   - Làm rõ sự tiện lợi của Model Context Protocol (MCP): Giống như ngày xưa dùng hàng chục loại sạc pin điện thoại, giờ tất cả gom về cổng USB-C vạn năng.
   - Giải thích cơ chế Context Caching giúp các startup AI giảm hóa đơn API từ 10 triệu xuống còn 1 triệu đồng như thế nào.
3. Phân vai:
   - MC Nữ: Một lập trình viên thực chiến, ban đầu hoài nghi về việc quản lý bối cảnh, liên tục đặt các câu hỏi về cách tối ưu chi phí cho dự án nhỏ.
   - MC Nam: Chuyên gia kiến trúc hệ thống AI, giải thích cặn kẽ các cơ chế xử lý bộ nhớ đa tầng (Working, Episodic, Semantic Memory), giúp MC Nữ hiểu ra bối cảnh gọn gàng mới là chìa khóa giúp AI hoạt động ổn định.
```
