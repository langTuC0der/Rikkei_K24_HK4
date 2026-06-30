# 📚 HỌC LIỆU CHI TIẾT: SESSION 06
## TÍCH HỢP & CAPSTONE PROJECT: XÂY DỰNG AI SECRETARY BIÊN SOẠN GIÁO TRÌNH TỰ ĐỘNG

---

## 🗺️ TỔNG QUAN SESSION 06
* **Mục tiêu**: Kết hợp toàn bộ kiến thức về Prompt, Context và Harness Engineering đã học để xây dựng một dự án thực tế hoàn chỉnh (Capstone Project). Học viên sẽ học cách thiết kế và triển khai một **Antigravity IDE Skill** chuyên dụng, đóng vai trò trợ lý AI tự động biên soạn giáo trình theo quy chuẩn doanh nghiệp. Dự án áp dụng quy trình xử lý 4 giai đoạn khép kín: Suy luận & Lập kế hoạch (Reasoning) → Tạo học liệu (Generation) → Review & Check lỗi (QA & Self-Reflection) → Đóng gói bản Final (Assembly & Deployment).
* **Thời lượng học tập**: ~4 - 5 giờ (bao gồm lý thuyết, thực hành, thiết kế sơ đồ, làm quiz và hoàn thiện mã nguồn).
* **Cấu trúc**: 4 bài học chính (Lessons) bám sát 4 bước của pipeline và 1 phần Quiz đánh giá năng lực.

---

## 📖 BÀI HỌC CHI TIẾT

### 6.1. Lesson 6.1 — Giai đoạn 1: Suy luận & Thiết kế Đặc tả Skill (Reasoning & Specification)
* **Thời lượng**: ~60 phút
* **Mục tiêu**: Nắm vững phương pháp phân rã tác vụ (Task Decomposition), hiểu cấu trúc tệp đặc tả Skill (`SKILL.md`) của Antigravity, thiết lập YAML Frontmatter và cơ chế kích hoạt (Trigger Matching) để chuẩn bị cho luồng suy luận của Agent.

#### 🔸 Lý thuyết: Phân rã tác vụ phức tạp và Cơ chế kích hoạt Skill
Khi yêu cầu AI thực hiện một nhiệm vụ lớn như "soạn thảo một bài đọc giáo trình hoàn chỉnh", nếu chỉ viết một prompt đơn giản, AI sẽ sinh ra nội dung chung chung, thiếu chiều sâu và thường xuyên bỏ sót các tiêu chuẩn chất lượng. 

Phương pháp thiết kế hệ thống Agent hiện đại yêu cầu **Phân rã tác vụ (Task Decomposition)**: chia nhỏ quy trình thành các bước tuyến tính hoặc vòng lặp có kiểm soát. Trong Antigravity IDE, năng lực chuyên biệt này được đóng gói thành một **Skill**.

##### Cấu trúc thư mục của một Custom Skill:
```
.agents/skills/curriculum-builder/
├── SKILL.md              ← Tệp cấu hình chính (Bắt buộc)
├── references/           ← Chứa các tài liệu tiêu chí làm ngữ cảnh (Context)
│   ├── CONTENT_DEVELOPMENT.md
│   └── PM.md
└── examples/             ← Bài viết mẫu đạt chuẩn để Few-shot learning
    └── sample_lesson.md
```

##### Cấu trúc tệp cấu hình `SKILL.md`:
1.  **YAML Frontmatter**: Định nghĩa tên và mô tả điều kiện kích hoạt.
2.  **Markdown Body**: Đóng vai trò là System Prompt chỉ dẫn luồng tư duy của Agent sau khi được gọi.

```
Luồng kích hoạt và Suy luận ở Bước 1:
┌─────────────────┐       Trigger Match       ┌────────────────────────┐
│  User Request   │ ────────────────────────▶ │    YAML Frontmatter    │
│ "Tạo Lesson..." │                           │ (curriculum-builder)   │
└─────────────────┘                           └───────────┬────────────┘
                                                          │
                                                          ▼
                                              ┌────────────────────────┐
                                              │   Bước 1: Reasoning    │
                                              │  - Đọc PM.md & Spec    │
                                              │  - Lập dàn ý bài học   │
                                              │  - Chờ user duyệt      │
                                              └────────────────────────┘
```

> [!NOTE]
> **Hình minh họa 6.1 — Luồng kích hoạt và suy luận lập dàn ý của Agent**
> * **Nội dung minh họa**: Sơ đồ thể hiện yêu cầu của người dùng đi qua bộ lọc trigger-matching của Antigravity, kích hoạt tệp SKILL.md, sau đó Agent đọc tài liệu tham chiếu trong references/ và xuất ra dàn ý chi tiết hiển thị trên màn hình để chờ người dùng duyệt.
> * **Prompt tạo ảnh**:
>   `A futuristic 3D flow diagram. An input card labeled "User Request: Create Lesson" passes through a neon glowing gate labeled "Antigravity Trigger". It activates a digital document glowing with green circuits labeled "SKILL.md". An agent character uses a magnifying glass to scan folders labeled "PM.md" and "CONTENT_DEVELOPMENT.md", outputting a holographic "Lesson Outline" preview. Dark mode tech aesthetic, 8k.`

#### 🛠️ Thực hành: Khởi tạo cấu trúc Skill và thiết lập YAML Frontmatter
Học viên tiến hành tạo các thư mục cấu trúc và viết tệp đặc tả ban đầu.

1.  Tạo các thư mục chứa Skill cục bộ trong thư mục dự án:
    ```bash
    mkdir -p .agents/skills/curriculum-builder/references
    mkdir -p .agents/skills/curriculum-builder/examples
    ```
2.  Tạo tệp `.agents/skills/curriculum-builder/SKILL.md` và thiết lập YAML Frontmatter cùng chỉ dẫn cho Bước 1 (Reasoning):
    ```markdown
    ---
    name: curriculum-builder
    description: >
      Dùng để tự động biên soạn và tạo học liệu bài đọc (Lesson) cho môn học
      theo đúng cấu trúc tiêu chuẩn 7 phần. Kích hoạt khi người dùng yêu cầu
      tạo bài đọc, viết lesson, biên soạn giáo trình hoặc soạn bài học.
      Không dùng để tạo quiz trắc nghiệm hoặc bài tập về nhà độc lập.
    ---

    ## VAI TRÒ
    Bạn là Chuyên gia thiết kế học liệu doanh nghiệp của Rikkei AI Academy. Nhiệm vụ của bạn là biên soạn nội dung bài đọc chuẩn hóa.

    ## BƯỚC 1: REASONING (SUY LUẬN & LẬP KẾ HOẠCH)
    1. Đọc tệp `references/PM.md` để xác định vị trí của Lesson trong khung chương trình và các bài học liên quan.
    2. Đọc tệp `references/CONTENT_DEVELOPMENT.md` để nắm vững cấu trúc 7 phần bắt buộc và tiêu chuẩn viết bài.
    3. Lập dàn ý (Outline) chi tiết cho bài đọc bao gồm: Tiêu đề, các đề mục chính, nội dung demo dự kiến và công nghệ sử dụng.
    4. Trình bày dàn ý này cho người dùng và yêu cầu phản hồi. BẮT BUỘC dừng lại và đợi người dùng gõ xác nhận "Duyệt" mới được chuyển sang Bước 2.
    ```

#### 📝 Bài tập Lesson 6.1
1. **Thiết kế mô tả trigger**: Viết lại trường `description` trong YAML frontmatter sao cho tối ưu, ngăn chặn việc Agent kích hoạt nhầm Skill này khi người dùng yêu cầu "tạo quiz ôn tập cuối khóa".

---

### 6.2. Lesson 6.2 — Giai đoạn 2: Tạo học liệu tự động (Generation & Context Injection)
* **Thời lượng**: ~60 phút
* **Mục tiêu**: Thiết lập luồng sinh nội dung chi tiết (Generation), áp dụng kỹ thuật tiêm ngữ cảnh (Context Injection) từ các tệp tiêu chuẩn và ràng buộc cấu trúc đầu ra (Structured Output) đúng 7 phần bắt buộc.

#### 🔸 Lý thuyết: Context Injection và Ràng buộc cấu trúc đầu ra
Để Agent tạo ra nội dung có độ chính xác cao và đúng định dạng, chúng ta không thể nhồi nhét toàn bộ tài liệu hướng dẫn dài hàng nghìn dòng vào prompt chính của Skill (tránh tràn ngữ cảnh và loãng chỉ thị). Thay vào đó, ta áp dụng kỹ thuật **Context Injection**:
*   Chỉ dẫn Agent chủ động đọc các tệp hướng dẫn tiêu chí đặt trong thư mục `references/` khi cần thiết.
*   Cung cấp tệp bài viết mẫu trong `examples/` để Agent học tập cấu trúc và phong cách viết (Few-shot learning).

##### Cấu trúc 7 phần bắt buộc của bài đọc (theo tiêu chí CONTENT_DEVELOPMENT.md):
1.  **Mục tiêu học tập**: Định nghĩa rõ ràng bằng các động từ hành động (Hiểu, Thiết kế, Áp dụng).
2.  **Đặt vấn đề thực tế**: Đưa ra tình huống khó khăn trong doanh nghiệp, tránh ví dụ đời thường.
3.  **Kiến thức cốt lõi**: Khái niệm và nguyên lý, sử dụng bảng biểu và sơ đồ ASCII.
4.  **Phân tích tình huống**: Case study thực tế (Bối cảnh → Thách thức → Cách tiếp cận → Kết quả).
5.  **Demo minh họa**: Hướng dẫn chi tiết, mã nguồn chạy được (bắt buộc viết bằng Java/Python tùy môn học), giải thích mã nguồn.
6.  **Tổng kết**: Bài học rút ra và các sai lầm thường gặp (không quá 10 dòng).
7.  **Câu hỏi đánh giá**: Đúng 3 câu hỏi tự luận kiểm tra 3 cấp độ nhận thức kèm Gợi ý đáp án.

```
Luồng sinh nội dung ở Bước 2:
┌────────────────────────┐       Inject Context       ┌────────────────────────┐
│  Dàn ý đã được duyệt   │ ─────────────────────────▶ │  Đọc file tiêu chí và  │
│      (từ Bước 1)       │                            │  bài viết mẫu chuẩn    │
└────────────────────────┘                            └───────────┬────────────┘
                                                                  │
                                                                  ▼
                                                      ┌────────────────────────┐
                                                      │   Bước 2: Generation   │
                                                      │  - Sinh bản thảo thô   │
                                                      │  - Ép cấu trúc 7 phần  │
                                                      │  - Ràng buộc code Java │
                                                      └────────────────────────┘
```

> [!NOTE]
> **Hình minh họa 6.2 — Luồng sinh tài liệu và tiêm bối cảnh từ thư viện mẫu**
> * **Nội dung minh họa**: Agent kết hợp dàn ý đã duyệt với các luồng dữ liệu truyền từ tệp tiêu chuẩn `CONTENT_DEVELOPMENT.md` và `sample_lesson.md` để lắp ghép và sinh ra bản thảo bài học 7 phần hoàn chỉnh.
> * **Prompt tạo ảnh**:
>   `A futuristic 3D visualization. A central document skeleton with 7 glowing sections represents the "Draft". Glowing datastreams labeled "CONTENT_DEVELOPMENT.md" and "sample_lesson.md" flow from the side, merging into the skeleton. An AI agent hand compiles and polishes the glowing text. Sleek dark mode tech environment, 8k.`

#### 🛠️ Thực hành: Thiết lập chỉ dẫn sinh nội dung và cung cấp dữ liệu Few-shot
1.  Sao chép tệp hướng dẫn viết bài và tệp bài đọc mẫu vào thư mục `references/` và `examples/` của Skill:
    *   Đặt tệp `CONTENT_DEVELOPMENT.md` vào thư mục `.agents/skills/curriculum-builder/references/`.
    *   Đặt một bài viết mẫu chuẩn đã có vào `.agents/skills/curriculum-builder/examples/sample_lesson.md`.
2.  Bổ sung chỉ thị Bước 2 (Generation) vào tệp `SKILL.md`:
    ```markdown
    ## BƯỚC 2: GENERATION (SINH NỘI DUNG CHI TIẾT)
    Dựa trên dàn ý đã được phê duyệt ở Bước 1, tiến hành viết nội dung chi tiết cho bài đọc. Bạn phải tuân thủ các quy tắc nghiêm ngặt sau:
    1. Đọc tệp `examples/sample_lesson.md` để tham chiếu về văn phong và độ dài thực tế của từng phần.
    2. Bài viết PHẢI có đúng 7 đề mục cấp 2 tương ứng với 7 phần bắt buộc trong `references/CONTENT_DEVELOPMENT.md`. Không được tự ý gộp hoặc bỏ bớt phần nào.
    3. Mã nguồn demo trong bài viết bắt buộc phải sử dụng ngôn ngữ Java (Spring Boot & Spring AI). Tuyệt đối không dùng Python hoặc JavaScript cho phần code demo chính của học viên.
    4. Không sử dụng các câu chuyện đời thường hoặc trải nghiệm cá nhân trong phần đặt vấn đề. Sử dụng bối cảnh doanh nghiệp chuyên nghiệp.
    5. Phần câu hỏi đánh giá ở cuối bài phải có đúng 3 câu tự luận (Câu 1: Nhớ, Câu 2: Hiểu/Phân tích, Câu 3: Vận dụng) và BẮT BUỘC có gợi ý đáp án chi tiết cho từng câu. Không tạo câu hỏi trắc nghiệm A/B/C/D.
    ```

#### 📝 Bài tập Lesson 6.2
1. **Thiết kế mẫu Few-shot**: Viết một đoạn bài đọc mẫu cực ngắn khoảng 200 từ cho phần "Đặt vấn đề thực tế" mô tả lỗi sập hệ thống do tràn bộ nhớ cache của một công ty thương mại điện tử, dùng làm ví dụ chuẩn cho Agent học tập.

---

### 6.3. Lesson 6.3 — Giai đoạn 3: Quy trình Review & Check lỗi tự động (QA & Self-Reflection)
* **Thời lượng**: ~60 phút
* **Mục tiêu**: Xây dựng cơ chế tự kiểm duyệt (Self-Reflection) bên trong Agent, thiết lập checklist kiểm soát chất lượng và viết script Python phụ trợ để tự động quét lỗi tĩnh trên tệp Markdown.

#### 🔸 Lý thuyết: Cơ chế Self-Reflection và Thiết lập rào cản kiểm định chất lượng
Một trong những điểm yếu lớn nhất của các mô hình sinh ngôn ngữ là lỗi ảo tưởng hoặc bỏ sót chỉ dẫn khi xử lý văn bản dài. Để khắc phục, hệ thống Agent cần có một **vòng lặp phản hồi tự thân (Self-Reflection Loop)** ở Bước 3.
*   Agent sau khi sinh xong nội dung không được phép trả về ngay cho người dùng.
*   Nó phải đóng vai trò là một "Kiểm định viên chất lượng độc lập", rà soát bản thảo của chính mình dựa trên một Checklist nghiêm ngặt.
*   Nếu phát hiện lỗi (ví dụ: thiếu phần, code sai ngôn ngữ, có câu hỏi trắc nghiệm), Agent tự động chỉnh sửa bản thảo và chạy lại checklist cho đến khi đạt yêu cầu (tối đa 2-3 vòng lặp để tránh lặp vô hạn).

```
Vòng lặp Self-Reflection ở Bước 3:
┌────────────────────────┐
│  Bản thảo thô (Draft)   │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Checklist 12 Điểm    │ ◀────────────────────────┐
│   (QA Review Agent)    │                          │
└───────────┬────────────┘                          │
            │                                       │ Sửa lỗi
      Đạt tất cả? ──▶ Không ──▶ [Tự động sửa lỗi] ──┘
            │
           Có
            ▼
┌────────────────────────┐
│  Bản thảo sạch (Clean)  │
└────────────────────────┘
```

> [!NOTE]
> **Hình minh họa 6.3 — Quy trình tự kiểm duyệt chất lượng Self-Reflection của Agent**
> * **Nội dung minh họa**: Robot Agent đang đứng trước một màn hình checklist ảo hiển thị các dấu tích xanh lá cây cho các phần đạt chuẩn, và một dấu nhân đỏ ở phần code block. Robot đang dùng bút ánh sáng sửa lại phần code lỗi để hoàn thiện danh sách.
> * **Prompt tạo ảnh**:
>   `A futuristic 3D scene representing AI Self-Reflection. An AI robot inspecting a floating transparent checklist. Nine items show green checkmarks, one item ("Code Language Check") shows a red cross. The robot edits the document code with a stylus, turning the red cross into a green checkmark. Tech lab background, neon colors, 8k.`

#### 🛠️ Thực hành: Viết chỉ dẫn QA cho Agent và xây dựng script kiểm định tĩnh
1.  Bổ sung chỉ thị Bước 3 (QA Review) vào tệp `SKILL.md`:
    ```markdown
    ## BƯỚC 3: QA REVIEW (TỰ ĐÁNH GIÁ & SỬA LỖI)
    Trước khi xuất bản tệp tin, bạn phải tự chạy bộ lọc kiểm định chất lượng sau:
    1. Đếm số lượng tiêu đề cấp 2 (##). Yêu cầu bắt buộc là đúng 7 tiêu đề tương ứng với 7 phần tiêu chuẩn.
    2. Quét toàn bộ các khối mã (code blocks). Đảm bảo không tồn tại bất kỳ đoạn code Python hoặc JavaScript nào trong phần demo.
    3. Đếm số lượng câu hỏi ở phần 7. Đảm bảo có đúng 3 câu tự luận và đầy đủ phần "Gợi ý đáp án". Nếu phát hiện câu hỏi trắc nghiệm dạng A, B, C, D, hãy xóa bỏ và viết lại thành tự luận.
    4. Đánh giá độ dài của phần Tổng kết. Nếu vượt quá 10 dòng, hãy viết gọn lại.
    5. Nếu phát hiện bất kỳ lỗi nào, hãy tự động sửa đổi trực tiếp vào văn bản. Ghi rõ log sửa đổi: "QA phát hiện lỗi [tên lỗi] và đã tự động khắc phục". Lặp lại quy trình kiểm tra tối đa 2 lần.
    ```
2.  Viết một script kiểm định tĩnh bằng Python `.agents/skills/curriculum-builder/scripts/validate_lesson.py` để chạy tự động ở máy local hoặc CI/CD:
    ```python
    import sys
    import re

    def validate_markdown(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        errors = []
        # Kiểm tra đủ 7 phần bằng regex đếm tiêu đề ##
        headings = re.findall(r'^## \d+\.\s', content, re.MULTILINE)
        if len(headings) != 7:
            errors.append(f"Lỗi cấu trúc: Tìm thấy {len(headings)}/7 phần bắt buộc.")
            
        # Kiểm tra cấm code block Python/JS
        code_langs = re.findall(r'```(\w+)', content)
        for lang in code_langs:
            if lang.lower() in ['python', 'javascript', 'js']:
                errors.append(f"Lỗi mã nguồn: Phát hiện code block ngôn ngữ cấm: {lang}")
                
        # Kiểm tra cấm trắc nghiệm
        if re.search(r'^[A-D]\.\s', content, re.MULTILINE):
            errors.append("Lỗi định dạng: Phát hiện câu hỏi trắc nghiệm dạng A/B/C/D.")

        if errors:
            print("❌ KIỂM ĐỊNH THẤT BẠI:")
            for err in errors:
                print(f" - {err}")
            return False
        
        print("✅ KIỂM ĐỊNH THÀNH CÔNG: Tài liệu đạt chuẩn 100%!")
        return True

    if __name__ == "__main__":
        if len(sys.argv) < 2:
            print("Sử dụng: python validate_lesson.py <path_to_markdown_file>")
            sys.exit(1)
        validate_markdown(sys.argv[1])
    ```

#### 📝 Bài tập Lesson 6.3
1. **Thiết lập Rule kiểm duyệt**: Bổ sung một hàm kiểm tra bằng regex vào script Python ở trên để đảm bảo mỗi câu hỏi tự luận ở phần 7 đều phải đi kèm với cụm từ khóa khóa `Gợi ý đáp án` nằm ở dòng tiếp theo.

---

### 6.4. Lesson 6.4 — Giai đoạn 4: Đóng gói & Triển khai Bản Final (Assembly & Deployment)
* **Thời lượng**: ~60 phút
* **Mục tiêu**: Xây dựng giai đoạn đóng gói (Assembly), tự động xác định vị trí lưu trữ tệp, tạo tệp vật lý trên ổ đĩa và thực hiện chạy kiểm thử tích hợp (End-to-End Test) toàn bộ hệ thống Agent.

#### 🔸 Lý thuyết: Quy trình Assembly và Triển khai tự động hóa học liệu
Giai đoạn cuối cùng của pipeline là **Assembly (Đóng gói)**. Ở bước này, Agent không chỉ xuất kết quả ra màn hình chat mà phải tương tác trực tiếp với môi trường hệ thống để tạo ra sản phẩm hoàn chỉnh:
*   **Xác định vị trí lưu trữ**: Dựa trên số Session người dùng yêu cầu, Agent tự động tính toán đường dẫn tương đối (ví dụ: `sessions/session-06/session-06.md`).
*   **Tạo cấu trúc thư mục tự động**: Tạo thư mục Session mới và thư mục con `images/` để chứa các hình ảnh/sơ đồ đi kèm.
*   **Ghi tệp tin vật lý**: Thực hiện ghi tệp Markdown và báo cáo đường dẫn chi tiết cho người dùng.
*   **Chạy script kiểm tra**: Kích hoạt script kiểm định tĩnh đã viết ở Lesson 6.3 để đảm bảo tệp tin vừa tạo không chứa lỗi.

```
Luồng đóng gói cuối cùng ở Bước 4:
┌────────────────────────┐       Tự động tính       ┌────────────────────────┐
│  Bản thảo sạch (QA OK) │ ────────────────────────▶ │   Lưu tệp vật lý vào   │
│      (từ Bước 3)       │                           │  sessions/session-XX/  │
└────────────────────────┘                           └───────────┬────────────┘
                                                                 │
                                                                 ▼
                                                     ┌────────────────────────┐
                                                     │    Chạy Python Script  │
                                                     │   validate_lesson.py   │
                                                     └───────────┬────────────┘
                                                                 │
                                                                 ▼
                                                     ┌────────────────────────┐
                                                     │   Hoàn tất & Deploy    │
                                                     │ (Giao diện hiển thị OK)│
                                                     └────────────────────────┘
```

> [!NOTE]
> **Hình minh họa 6.4 — Quy trình đóng gói bản final và phân phối học liệu**
> * **Nội dung minh họa**: Agent đóng dấu "FINAL APPROVED" màu vàng gold lên tệp tài liệu, sau đó tệp tin được đưa vào một băng chuyền tự động chuyển vào đúng thư mục cấu trúc của hệ thống web học liệu.
> * **Prompt tạo ảnh**:
>   `A futuristic 3D concept of document publishing. A holographic file with a glowing gold stamp that says "FINAL APPROVED" is transported on a digital light conveyor belt, inserting itself into a folder rack labeled "sessions/session-06/". Bright blue and purple neon styling, clean tech background, 8k.`

#### 🛠️ Thực hành: Thiết lập chỉ thị Đóng gói và chạy thử nghiệm tích hợp toàn bộ hệ thống
1.  Bổ sung chỉ thị Bước 4 (Assembly) vào tệp `SKILL.md`:
    ```markdown
    ## BƯỚC 4: ASSEMBLY (ĐỒNG GÓI & TRIỂN KHAI)
    Sau khi bản thảo đã vượt qua khâu QA ở Bước 3, thực hiện đóng gói tệp tin lên hệ thống:
    1. Xác định Session ID từ yêu cầu của người dùng (ví dụ: Session 06).
    2. Tạo thư mục vật lý tại đường dẫn: `sessions/session-{XX}/` và thư mục con `sessions/session-{XX}/images/` nếu chúng chưa tồn tại.
    3. Ghi toàn bộ nội dung bài đọc vào tệp tin: `sessions/session-{XX}/session-{XX}.md` với định dạng mã hóa UTF-8.
    4. Báo cáo đường dẫn tệp tin vừa tạo cho người dùng kèm theo thông báo hoàn thành dự án.
    ```
2.  **Chạy thử nghiệm tích hợp**: Mở khung chat Antigravity IDE và gõ lệnh kích hoạt Skill:
    ```
    Hãy sử dụng skill curriculum-builder để tạo học liệu bài đọc cho Session 06 với chủ đề "Tích hợp & Capstone Project".
    ```
3.  Theo dõi Agent thực hiện lần lượt 4 bước: Lập dàn ý (Reasoning) → Chờ bạn gõ "Duyệt" → Sinh nội dung (Generation) → Tự quét lỗi (QA) → Ghi tệp tin vào thư mục `sessions/session-06/session-06.md` (Assembly).

#### 📝 Bài tập Lesson 6.4
1. **Viết kịch bản Deploy**: Thiết kế một lệnh Bash shell tự động chạy kiểm tra cấu trúc tệp tin vừa sinh ra bằng script Python, nếu thành công thì tự động thực hiện commit Git với thông điệp "feat: release session 06 content" và push lên repository từ xa.

---

## 🧪 QUIZ KIỂM TRA SESSION 06
*Hãy chọn đáp án đúng nhất cho các câu hỏi sau:*

#### Câu 1: Tại sao chúng ta cần áp dụng kỹ thuật Phân rã tác vụ (Task Decomposition) cho Agent khi viết Skill?
* A. Để Agent chạy song song nhiều mô hình ngôn ngữ lớn khác nhau giúp tiết kiệm thời gian.
* B. Để chia nhỏ một công việc phức tạp thành các bước tuần tự rõ ràng, giúp kiểm soát chất lượng từng giai đoạn và ngăn chặn việc Agent bỏ sót chỉ thị.
* C. Để chuyển đổi toàn bộ mã nguồn của Agent từ Python sang Java một cách tự động.
* D. Để Agent không cần đọc tài liệu hướng dẫn trong thư mục references/.
* * **Đáp án đúng**: **B**
  * *Giải thích*: Khi thực hiện tác vụ lớn và phức tạp như soạn thảo một giáo trình hoàn chỉnh, LLM rất dễ bị quá tải chỉ thị và sinh nội dung thiếu cấu trúc. Việc phân rã tác vụ giúp định hình rõ ràng luồng suy luận, sinh dữ liệu, kiểm tra chất lượng và đóng gói ở từng bước riêng biệt.

#### Câu 2: Trong Antigravity IDE, phần YAML Frontmatter của tệp `SKILL.md` đóng vai trò gì?
* A. Chứa toàn bộ nội dung lý thuyết và các bài tập thực hành của bài học.
* B. Dùng để cấu hình đường dẫn kết nối đến cơ sở dữ liệu PostgreSQL bên ngoài.
* C. Định nghĩa tên của Skill và mô tả chi tiết điều kiện để hệ thống tự động so khớp và kích hoạt Skill (Trigger Matching).
* D. Là nơi khai báo các hàm kiểm tra lỗi của script validate_lesson.py.
* * **Đáp án đúng**: **C**
  * *Giải thích*: YAML Frontmatter chứa siêu dữ liệu (metadata) bao gồm `name` và `description`. Khi người dùng nhập yêu cầu, hệ thống sẽ quét qua trường description của tất cả các Skill để tìm ra Skill phù hợp nhất để kích hoạt.

#### Câu 3: Kỹ thuật Context Injection (Tiêm ngữ cảnh) thông qua thư mục `references/` giải quyết vấn đề gì?
* A. Tăng tốc độ phản hồi của API bằng cách lưu bộ nhớ đệm (caching) các câu trả lời cũ.
* B. Ngăn chặn việc nhồi nhét tài liệu hướng dẫn quá dài vào prompt chính của Skill, giữ tệp cấu hình gọn gàng và cung cấp ngữ cảnh đúng lúc cho Agent truy vấn.
* C. Tự động mã hóa dữ liệu văn bản thô sang định dạng Vector số thực.
* D. Giúp Agent tự động sửa lỗi cú pháp lập trình Java.
* * **Đáp án đúng**: **B**
  * *Giải thích*: Việc đưa các tài liệu hướng dẫn tiêu chuẩn vào thư mục references/ giúp Agent chỉ truy cập và đọc chúng khi cần thiết thông qua các công cụ đọc file, giữ cho tệp cấu hình chính SKILL.md luôn ngắn gọn (dưới 500 dòng) và tối ưu hóa cửa sổ bối cảnh của mô hình.

#### Câu 4: Sự khác biệt chính giữa cơ chế tự kiểm duyệt (Self-Reflection) của Agent và việc chạy script validate_lesson.py bên ngoài là gì?
* A. Script Python chỉ chạy được trên hệ điều hành Windows còn Self-Reflection chạy trên mọi nền tảng.
* B. Self-Reflection giúp Agent hiểu ngữ nghĩa để tự sửa lỗi nội dung (như bối cảnh thực tế, logic giải thích), trong khi script tĩnh chỉ kiểm tra được cấu trúc bề mặt (đếm đề mục, tag ngôn ngữ code).
* C. Script Python chạy nhanh hơn và hoàn toàn không tốn chi phí token.
* D. Không có sự khác biệt, cả hai đều sử dụng chung một thuật toán so khớp chuỗi.
* * **Đáp án đúng**: **B**
  * *Giải thích*: Script validate tĩnh sử dụng các quy tắc cứng (regex) để phát hiện nhanh các lỗi định dạng hoặc tag ngôn ngữ. Tuy nhiên, chỉ có cơ chế Self-Reflection của Agent mới có khả năng đọc hiểu ngữ nghĩa để đánh giá xem bối cảnh bài viết có tính chuyên nghiệp hay không, hoặc code demo Java có thực sự chạy đúng nghiệp vụ yêu cầu hay không.

#### Câu 5: Giai đoạn Assembly (Đóng gói) trong pipeline của Skill đảm nhận nhiệm vụ gì?
* A. Chạy thử nghiệm các câu hỏi trắc nghiệm của học viên để chấm điểm tự động.
* B. Tự động tương tác với môi trường hệ thống để tạo cấu trúc thư mục, ghi tệp tin vật lý vào ổ đĩa và báo cáo đường dẫn sản phẩm cho người dùng.
* C. Gửi email thông báo kết quả học tập cho giảng viên chủ nhiệm.
* D. Kết nối Agent với các công cụ tìm kiếm trực tuyến để cập nhật kiến thức mới.
* * **Đáp án đúng**: **B**
  * *Giải thích*: Assembly là bước cuối cùng đưa sản phẩm từ bộ nhớ đệm của Agent ra ngoài thực tế. Bước này tự động hóa việc quản lý tệp tin, ghi nội dung thô thành file vật lý (.md) đúng vị trí quy ước trong cấu trúc thư mục của dự án mà không cần con người phải copy-paste thủ công.

---

## ⚡ BỘ PROMPTS MẪU CHO SLIDE & VIDEO (SESSION 06)

### 1. Prompts tạo slide bài giảng (Dành cho Gamma.app / Marp)
```markdown
Role: Chuyên gia thiết kế slide và giảng viên AI thực chiến.
Nhiệm vụ: Biên soạn mã nguồn Markdown chuẩn Marp để thuyết trình về chủ đề "Xây dựng AI Agent biên soạn giáo trình tự động qua kiến trúc Antigravity Skill".

Cấu trúc các Slide yêu cầu:
- Slide 1: Tiêu đề lớn "Capstone Project: Tự động hóa biên soạn giáo trình bằng AI Agent".
- Slide 2: Phân rã tác vụ (Task Decomposition): Tại sao cần chia nhỏ quy trình thành 4 bước?
- Slide 3: Thiết lập Skill trong Antigravity: Thiết kế YAML Frontmatter và Trigger matching.
- Slide 4: Giai đoạn 1 & 2: Suy luận dàn ý (Reasoning) và Sinh nội dung chi tiết (Generation) kết hợp Context Injection.
- Slide 5: Giai đoạn 3: Rào cản kiểm định chất lượng (QA Review) với cơ chế Self-Reflection và viết script Python validate tĩnh.
- Slide 6: Giai đoạn 4: Đóng gói sản phẩm (Assembly) ghi tệp vật lý trực tiếp lên ổ đĩa dự án.
- Slide 7: Tổng kết dự án Capstone và các tiêu chí đánh giá sản phẩm nộp.

Thiết kế slide: Sử dụng bảng so sánh cấu trúc các bước, các hộp thông tin nổi bật (Note/Tip), tông màu tối neon chuyên nghiệp.
```

### 2. Prompts cấu hình Audio Overview / Video Podcast bằng NotebookLM
> Sao chép toàn bộ nội dung dưới đây dán vào hộp thoại cấu hình NotebookLM:
```markdown
Hãy tạo một buổi thảo luận Podcast đối thoại cực kỳ lôi cuốn giữa 2 chuyên gia (một nam, một nữ) bàn về dự án Capstone "Xây dựng trợ lý AI tự động soạn giáo trình bằng Antigravity Skill".

Yêu cầu về nội dung và phong cách:
1. Giọng điệu: Hào hứng, mang tính thực tế cao, đầy tính đúc kết sau một khóa học dài. Sử dụng hoàn toàn tiếng Việt công nghệ hiện đại, giữ nguyên các thuật ngữ chuyên môn (như Prompt/Context/Harness Engineering, Task Decomposition, YAML Frontmatter, Trigger Matching, SKILL.md, Context Injection, Few-shot learning, Structured Output, Self-Reflection Loop, validate_lesson.py, Assembly, End-to-End Test).
2. Các điểm tranh luận và thảo luận chính:
   - "Meta-learning": Tại sao việc bắt học viên dùng AI Agent để tự tạo ra chính học liệu bài đọc mà họ đang học lại là cách tốt nhất để tốt nghiệp khóa học này?
   - Phân tích chi tiết quy trình 4 bước: Suy luận dàn ý -> Đợi con người duyệt -> Sinh nội dung -> QA sửa lỗi -> Đóng gói ghi tệp. Nhấn mạnh việc tại sao bắt buộc phải bắt AI dừng lại đợi con người gõ chữ "Duyệt" ở Bước 1 mới được viết tiếp.
   - Thảo luận vui vẻ về việc AI "ăn bớt" hoặc sinh code Python thay vì Java nếu không có bước QA Self-Reflection và script validate tĩnh bảo vệ ở Bước 3.
   - Ý nghĩa của bước Assembly: Loại bỏ hoàn toàn thao tác copy-paste thủ công, AI tự tạo thư mục và ghi file trực tiếp.
3. Phân vai:
   - PM Nữ: Tập trung vào tính hiệu quả của dự án, làm sao để giáo trình sinh ra luôn đồng đều về chất lượng và không bị lỗi định dạng.
   - Dev Nam: Giải thích say sưa về cách cấu hình tệp SKILL.md, cách viết script kiểm tra regex và cơ chế tự sửa sai của robot Agent.
```
