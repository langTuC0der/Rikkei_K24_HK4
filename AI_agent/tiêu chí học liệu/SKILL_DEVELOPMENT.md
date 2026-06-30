# SESSION 6 — BÀI THỰC HÀNH: VIẾT ANTIGRAVITY SKILL TỰ ĐỘNG HÓA XÂY DỰNG GIÁO TRÌNH

> Tài liệu này thuộc bộ tiêu chí học liệu dự án AI Integrated in Action.
> Chủ đề: Tích hợp & Capstone — Xây dựng AI Agent biên soạn giáo trình bằng Antigravity IDE Skill System.

---

# Lesson 1 — Suy luận và Lập kế hoạch (Reasoning & Planning)

## 1. Mục tiêu học tập

Sau khi hoàn thành Lesson này, người học có thể:

* Hiểu được vai trò của hệ thống Skill trong kiến trúc Antigravity IDE và cách Agent đọc, kích hoạt Skill.
* Phân tích được cấu trúc tệp SKILL.md (YAML frontmatter + Markdown body) và mối liên hệ giữa các thư mục phụ trợ (`references/`, `scripts/`, `examples/`).
* Thiết kế được pipeline xử lý 4 bước (Reasoning → Generation → QA → Assembly) trên giấy trước khi viết code.
* Áp dụng được kỹ thuật phân rã bài toán (Task Decomposition) để chia một nhiệm vụ phức tạp thành các bước Agent có thể thực thi tuần tự.

---

## 2. Đặt vấn đề thực tế

Một trung tâm đào tạo CNTT cần xây dựng giáo trình cho 15 buổi học, mỗi buổi gồm 4-5 bài đọc (Lesson), mỗi bài đọc có cấu trúc bắt buộc 7 phần (Mục tiêu, Đặt vấn đề, Kiến thức cốt lõi, Phân tích tình huống, Demo, Tổng kết, Câu hỏi đánh giá). Tổng cộng cần biên soạn hơn 60 bài đọc.

Nếu viết thủ công, mỗi bài đọc mất trung bình 3-5 giờ → toàn bộ giáo trình tiêu tốn 180-300 giờ lao động. Đây là chi phí không khả thi khi đội ngũ biên soạn chỉ gồm 1-2 giảng viên.

Giải pháp: Xây dựng một **AI Agent chuyên biệt** dưới dạng Antigravity Skill. Agent này nhận đầu vào là chủ đề bài học, tự động tham chiếu các tiêu chí viết bài đã được chuẩn hóa, rồi sinh ra bản nháp giáo trình đúng cấu trúc. Giảng viên chỉ cần review và tinh chỉnh thay vì viết từ đầu — giảm thời gian xuống còn 30-60 phút mỗi bài.

---

## 3. Kiến thức cốt lõi

### 3.1. Antigravity Skill là gì?

Skill là một đơn vị mở rộng năng lực (Capability Extension Unit) của AI Agent trong Antigravity IDE. Mỗi Skill nằm trong một thư mục riêng và chứa tối thiểu một tệp `SKILL.md` — đây chính là "bộ não chuyên biệt" mà Agent đọc khi được kích hoạt.

Cấu trúc thư mục một Skill hoàn chỉnh:

```
skills/
└── curriculum-builder/
    ├── SKILL.md              ← Bắt buộc: Hướng dẫn chính (YAML + Markdown)
    ├── references/           ← Tài liệu tham chiếu Agent đọc khi cần
    │   ├── CONTENT_DEVELOPMENT.md
    │   ├── QUIZ_FORMAT.md
    │   └── HOMEWORK_GUIDELINE.md
    ├── scripts/              ← Script phụ trợ (validate structure, lint,...)
    │   └── validate_lesson.py
    └── examples/             ← Mẫu output để Agent học theo
        └── sample_lesson.md
```

### 3.2. Cấu trúc tệp SKILL.md

Tệp SKILL.md gồm hai phần bắt buộc:

**Phần 1 — YAML Frontmatter** (metadata để hệ thống tự động phát hiện và kích hoạt Skill):

```yaml
---
name: curriculum-builder
description: >
  Xây dựng tài liệu Lesson cho giáo trình đào tạo. Kích hoạt khi người dùng
  yêu cầu tạo bài đọc, viết giáo trình, biên soạn lesson, hoặc tạo học liệu
  cho một chủ đề cụ thể. Không sử dụng cho việc tạo quiz hoặc bài tập riêng lẻ.
---
```

| Trường | Bắt buộc | Vai trò |
| :--- | :--- | :--- |
| `name` | Co | Định danh duy nhất của Skill, viết dạng kebab-case |
| `description` | Co | Agent sử dụng trường này để quyết định có kích hoạt Skill hay không. Phải mô tả rõ **khi nào dùng** và **khi nào không dùng** |

**Phần 2 — Markdown Body** (hướng dẫn chi tiết Agent phải tuân theo khi Skill được kích hoạt):

Phần này chính là **System Prompt chuyên biệt** — Agent đọc toàn bộ nội dung này trước khi thực thi nhiệm vụ. Độ dài khuyến nghị dưới 500 dòng. Nếu nội dung vượt quá, tách phần dư vào thư mục `references/`.

### 3.3. Cơ chế kích hoạt Skill (Trigger Matching)

Khi người dùng gửi yêu cầu vào Antigravity IDE, hệ thống thực hiện:

```
Yêu cầu người dùng
       │
       ▼
┌──────────────────────────┐
│ Quét toàn bộ SKILL.md    │
│ trong các Customization   │
│ Roots (Global + Project) │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ So khớp yêu cầu với      │
│ `name` + `description`   │
│ (chỉ YAML frontmatter)   │
└────────────┬─────────────┘
             │
        ┌────┴────┐
        ▼         ▼
   Khớp         Không khớp
    │               │
    ▼               ▼
 Đọc toàn bộ     Bỏ qua
 Markdown body    Skill
    │
    ▼
 Agent thực thi
 theo hướng dẫn
```

Điểm quan trọng: Chỉ có trường `name` và `description` trong YAML frontmatter được dùng để trigger-matching. Phần Markdown body chỉ được tải sau khi Skill đã khớp.

### 3.4. Vị trí lưu trữ Skill (Customization Roots)

| Phạm vi | Đường dẫn | Khi nào dùng |
| :--- | :--- | :--- |
| Global (mọi project) | `~/.gemini/config/skills/<tên_skill>/` | Skill dùng chung cho mọi dự án |
| Project (riêng dự án) | `.agents/skills/<tên_skill>/` | Skill chỉ áp dụng cho dự án hiện tại |

Đối với bài thực hành này, Skill `curriculum-builder` sẽ được đặt ở cấp **Project** vì nó chỉ phục vụ cho dự án xây dựng giáo trình cụ thể.

### 3.5. Pipeline xử lý 4 bước

Toàn bộ Skill `curriculum-builder` sẽ hướng dẫn Agent xử lý theo pipeline tuần tự:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  BƯỚC 1     │    │  BƯỚC 2     │    │  BƯỚC 3     │    │  BƯỚC 4     │
│  Reasoning  │───▶│  Generation │───▶│  QA Review  │───▶│  Assembly   │
│             │    │             │    │             │    │             │
│ Phân tích   │    │ Sinh nội    │    │ Tự kiểm tra │    │ Đóng gói    │
│ yêu cầu,   │    │ dung Lesson │    │ theo rubric,│    │ output      │
│ đọc tiêu    │    │ theo cấu    │    │ sửa lỗi,   │    │ thành tệp   │
│ chí, lập    │    │ trúc 7 phần │    │ bổ sung     │    │ hoàn chỉnh  │
│ dàn ý       │    │ bắt buộc    │    │ thiếu sót   │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

| Bước | Input | Output | Tham chiếu |
| :--- | :--- | :--- | :--- |
| 1. Reasoning | Chủ đề + Session ID | Dàn ý chi tiết (Outline) | PM.md |
| 2. Generation | Dàn ý + Tiêu chí | Bản nháp Lesson (Draft) | CONTENT_DEVELOPMENT.md |
| 3. QA Review | Bản nháp + Rubric | Bản đã sửa (Revised) | Checklist 7 phần |
| 4. Assembly | Bản đã sửa | Tệp .md hoàn chỉnh | Cấu trúc thư mục project |

---

## 4. Phân tích tình huống thực tế

### Tình huống 1: Trung tâm đào tạo Rikkei Academy

**Bối cảnh**: Rikkei Academy cần biên soạn giáo trình "AI Integrated in Action" gồm 15 Sessions, mỗi Session có 4-5 Lesson. Đội ngũ biên soạn gồm 1 giảng viên chính và 1 trợ giảng.

**Thách thức**: Giảng viên đã có bộ tiêu chí viết bài chuẩn hóa (CONTENT_DEVELOPMENT.md, QUIZ_FORMAT.md, HOMEWORK_GUIDELINE.md,...) nhưng việc viết từng bài thủ công mất quá nhiều thời gian. Mỗi khi thuê cộng tác viên ngoài, output luôn sai cấu trúc và phải chỉnh lại gần như viết lại từ đầu.

**Cách tiếp cận**: Đóng gói toàn bộ bộ tiêu chí thành một Antigravity Skill. Khi giảng viên gõ "Tạo học liệu Lesson 3 cho Session 07 về Vector Database", Agent tự động:
1. Đọc PM.md để xác định nội dung Session 07.
2. Đọc CONTENT_DEVELOPMENT.md để áp dụng cấu trúc 7 phần.
3. Sinh bản nháp hoàn chỉnh.
4. Tự kiểm tra bản nháp theo checklist rồi tự sửa trước khi trả kết quả.

**Kết quả**: Thời gian biên soạn mỗi Lesson giảm từ 3-5 giờ xuống còn 30-60 phút (chỉ cần review và tinh chỉnh). Toàn bộ 60+ bài đọc hoàn thành trong 2 tuần thay vì 3 tháng.

### Tình huống 2: Startup EdTech xây dựng nền tảng khóa học online

**Bối cảnh**: Một startup EdTech muốn mở rộng catalogue khóa học từ 5 lên 50 khóa trong 6 tháng. Mỗi khóa có 20-30 bài học.

**Thách thức**: Đội content chỉ có 3 người. Nếu tuyển thêm, chi phí nhân sự tăng 5x nhưng chất lượng không đồng đều vì mỗi người viết theo phong cách khác nhau.

**Cách tiếp cận**: Xây dựng Skill riêng cho từng loại nội dung (Lesson, Quiz, Homework) với `references/` chứa style guide và template mẫu. Agent đảm bảo mọi output đều tuân thủ brand voice và cấu trúc chuẩn, bất kể ai là người ra lệnh.

**Kết quả**: Content team 3 người đạt output tương đương team 12 người. Tỷ lệ bài cần chỉnh sửa lớn giảm từ 70% xuống 15%.

---

## 5. Demo minh họa

### Mục tiêu demo

Viết bản thiết kế (Specification) hoàn chỉnh cho Skill `curriculum-builder`, bao gồm YAML frontmatter và phần dàn ý Markdown body.

### Điều kiện chuẩn bị

* Antigravity IDE đã cài đặt và hoạt động.
* Thư mục dự án đã có sẵn bộ tiêu chí học liệu (`tiêu chí học liệu/`).
* Hiểu cách tạo thư mục trong `.agents/skills/`.

### Các bước thực hiện

**Bước 1**: Tạo cấu trúc thư mục Skill

```
Mở terminal trong thư mục gốc dự án, chạy:

mkdir -p .agents/skills/curriculum-builder/references
mkdir -p .agents/skills/curriculum-builder/scripts
mkdir -p .agents/skills/curriculum-builder/examples
```

**Bước 2**: Viết YAML frontmatter cho SKILL.md

Tạo tệp `.agents/skills/curriculum-builder/SKILL.md` với phần header:

```yaml
---
name: curriculum-builder
description: >
  Xây dựng tài liệu Lesson hoàn chỉnh cho giáo trình đào tạo theo chuẩn
  7 phần bắt buộc. Kích hoạt khi người dùng yêu cầu tạo bài đọc, viết
  lesson, biên soạn giáo trình, hoặc tạo học liệu cho một chủ đề cụ thể.
  Không sử dụng cho việc tạo quiz trắc nghiệm (dùng skill quiz-builder),
  tạo bài tập về nhà (dùng skill homework-builder), hoặc chỉnh sửa
  cấu trúc chương trình (dùng PM.md trực tiếp).
---
```

**Bước 3**: Phác thảo dàn ý Markdown body

Viết phần hướng dẫn Agent ở mức dàn ý (chưa chi tiết, sẽ hoàn thiện ở Lesson 2):

```markdown
## Vai trò

Bạn là Chuyên gia thiết kế học liệu doanh nghiệp. Nhiệm vụ của bạn là
xây dựng tài liệu Lesson theo chuẩn 7 phần bắt buộc.

## Pipeline xử lý

Khi nhận yêu cầu tạo Lesson, thực hiện tuần tự 4 bước:

### Bước 1: Reasoning
- Đọc `references/PM.md` để xác định nội dung Session.
- Đọc `references/CONTENT_DEVELOPMENT.md` để nắm cấu trúc bắt buộc.
- Lập dàn ý chi tiết và trình bày cho người dùng duyệt trước khi viết.

### Bước 2: Generation
(Chi tiết ở Lesson 2)

### Bước 3: QA Review
(Chi tiết ở Lesson 3)

### Bước 4: Assembly
(Chi tiết ở Lesson 4)
```

**Bước 4**: Sao chép tài liệu tham chiếu vào `references/`

```
Sao chép các tệp tiêu chí hiện có vào thư mục references/ của Skill:

cp "tiêu chí học liệu/CONTENT_DEVELOPMENT.md" .agents/skills/curriculum-builder/references/
cp "tiêu chí học liệu/PM.md" .agents/skills/curriculum-builder/references/
cp "tiêu chí học liệu/QUIZ_FORMAT.md" .agents/skills/curriculum-builder/references/
```

### Kết quả mong đợi

Sau khi hoàn thành, cấu trúc thư mục sẽ là:

```
.agents/
└── skills/
    └── curriculum-builder/
        ├── SKILL.md                    ← Đã có frontmatter + dàn ý body
        ├── references/
        │   ├── CONTENT_DEVELOPMENT.md  ← Cấu trúc 7 phần bắt buộc
        │   ├── PM.md                   ← Khung chương trình 15 Sessions
        │   └── QUIZ_FORMAT.md          ← Quy chuẩn quiz (tham khảo)
        ├── scripts/                    ← Chưa có script (sẽ viết ở Lesson 4)
        └── examples/                   ← Chưa có mẫu (sẽ bổ sung ở Lesson 2)
```

### Lưu ý thực tế

* Trường `description` trong YAML frontmatter là yếu tố quyết định Agent có kích hoạt Skill hay không. Viết mô tả quá chung chung (ví dụ: "Tạo nội dung") sẽ khiến Skill bị kích hoạt sai ngữ cảnh. Viết quá hẹp (ví dụ: "Tạo Lesson cho Session 07 về Vector Database") sẽ khiến Skill không bao giờ khớp với yêu cầu khác.
* Luôn ghi rõ **khi nào không dùng** Skill trong `description` để tránh xung đột với các Skill khác.

---

## 6. Tổng kết

* Antigravity Skill là đơn vị mở rộng năng lực cho AI Agent, bao gồm tệp SKILL.md (YAML frontmatter + Markdown body) và các thư mục phụ trợ (`references/`, `scripts/`, `examples/`).
* YAML frontmatter (`name` + `description`) quyết định khi nào Skill được kích hoạt. Markdown body là System Prompt chuyên biệt Agent đọc sau khi kích hoạt.
* Pipeline 4 bước (Reasoning → Generation → QA → Assembly) giúp phân rã nhiệm vụ phức tạp thành các bước Agent có thể xử lý tuần tự, đảm bảo chất lượng output.
* Sai lầm thường gặp: Viết `description` quá chung hoặc quá hẹp, không tách riêng Quiz/Homework thành Skill riêng biệt, không đưa tài liệu tham chiếu vào `references/` mà nhúng trực tiếp vào body (vượt giới hạn 500 dòng).

---

## 7. Câu hỏi đánh giá

### Câu 1 — Ghi nhớ kiến thức

Hãy liệt kê 3 thành phần bắt buộc của YAML frontmatter trong tệp SKILL.md và giải thích vai trò của từng thành phần trong cơ chế kích hoạt Skill.

**Gợi ý đáp án**:

YAML frontmatter gồm 2 trường bắt buộc (không phải 3 — đây là câu hỏi kiểm tra độ chính xác):
1. `name`: Định danh duy nhất của Skill, viết dạng kebab-case (ví dụ: `curriculum-builder`). Hệ thống sử dụng trường này để phân biệt các Skill với nhau.
2. `description`: Mô tả mục đích và phạm vi sử dụng. Hệ thống so khớp yêu cầu của người dùng với nội dung trường này để quyết định kích hoạt Skill hay không. Đây là trường quan trọng nhất cho trigger-matching.

Lưu ý: Phần Markdown body không thuộc YAML frontmatter mà là phần hướng dẫn chi tiết được tải sau khi Skill đã khớp.

---

### Câu 2 — Phân tích tình huống

Một đồng nghiệp viết `description` cho Skill như sau:

```yaml
description: Tạo nội dung cho dự án
```

Hãy phân tích 3 vấn đề cụ thể của đoạn mô tả này và viết lại phiên bản cải thiện.

**Gợi ý đáp án**:

3 vấn đề:
1. **Quá chung chung**: "Tạo nội dung" có thể khớp với mọi yêu cầu liên quan đến nội dung (viết email, tạo báo cáo, soạn slide,...), dẫn đến Skill bị kích hoạt sai ngữ cảnh.
2. **Thiếu phạm vi loại trừ**: Không ghi rõ khi nào không dùng Skill, gây xung đột với các Skill khác (ví dụ: Skill tạo Quiz, Skill tạo Homework).
3. **Thiếu ngữ cảnh chuyên biệt**: Không đề cập loại nội dung cụ thể (Lesson, bài đọc, giáo trình), cấu trúc yêu cầu, hoặc domain áp dụng.

Phiên bản cải thiện:

```yaml
description: >
  Xây dựng tài liệu Lesson hoàn chỉnh cho giáo trình đào tạo kỹ thuật,
  theo chuẩn 7 phần bắt buộc (Mục tiêu, Đặt vấn đề, Kiến thức cốt lõi,
  Phân tích tình huống, Demo, Tổng kết, Câu hỏi đánh giá). Kích hoạt khi
  người dùng yêu cầu tạo bài đọc, viết lesson, hoặc biên soạn giáo trình.
  Không sử dụng cho việc tạo quiz trắc nghiệm hoặc bài tập về nhà riêng lẻ.
```

---

### Câu 3 — Vận dụng thực chiến

Giả sử bạn cần xây dựng Skill `quiz-builder` chuyên tạo câu hỏi trắc nghiệm theo chuẩn QUIZ_FORMAT.md. Hãy viết:
1. YAML frontmatter hoàn chỉnh (`name` + `description`).
2. Danh sách các tệp cần đặt trong thư mục `references/`.
3. Giải thích tại sao `quiz-builder` nên là Skill riêng biệt thay vì gộp vào `curriculum-builder`.

**Gợi ý đáp án**:

1. YAML frontmatter:

```yaml
---
name: quiz-builder
description: >
  Tạo bộ câu hỏi trắc nghiệm (Quiz) cho giáo trình đào tạo theo đúng
  quy chuẩn QUIZ_FORMAT. Kích hoạt khi người dùng yêu cầu tạo quiz đầu giờ,
  quiz cuối giờ, quiz lesson, hoặc quiz exam. Không sử dụng cho việc viết
  bài đọc Lesson (dùng skill curriculum-builder) hoặc bài tập về nhà
  (dùng skill homework-builder).
---
```

2. Tệp trong `references/`:
   - `QUIZ_FORMAT.md`: Quy chuẩn định dạng quiz chính.
   - `PM.md`: Để Agent biết nội dung từng Session và chọn chủ đề phù hợp.
   - `CONTENT_DEVELOPMENT.md`: Để Agent tham chiếu kiến thức cốt lõi của Lesson tương ứng khi ra đề.

3. Lý do tách riêng:
   - **Nguyên tắc Single Responsibility**: Mỗi Skill chỉ đảm nhận một loại output. Gộp Lesson + Quiz vào cùng một Skill khiến body quá dài (vượt 500 dòng) và logic xử lý phức tạp.
   - **Quy tắc dự án**: Theo CONTENT_DEVELOPMENT.md, "Tuyệt đối không tạo câu hỏi trắc nghiệm cùng với bài đọc" — Quiz phải lưu trong tệp riêng biệt, do đó cần Skill riêng để đảm bảo Agent tuân thủ quy tắc này.
   - **Tránh xung đột trigger**: Nếu gộp, khi người dùng chỉ muốn tạo Quiz, Agent vẫn tải toàn bộ hướng dẫn viết Lesson — lãng phí context window và có thể gây nhầm lẫn.

---
---

# Lesson 2 — Tạo học liệu (Content Generation)

## 1. Mục tiêu học tập

Sau khi hoàn thành Lesson này, người học có thể:

* Viết được phần Markdown body hoàn chỉnh cho SKILL.md, đóng vai trò System Prompt chuyên biệt hướng dẫn Agent sinh nội dung Lesson.
* Áp dụng được kỹ thuật Context Injection — nhúng nội dung từ tệp `references/` vào luồng xử lý của Agent.
* Thiết kế được bộ ràng buộc (Constraints) trong prompt để Agent bắt buộc tuân thủ cấu trúc 7 phần.
* Tạo được tệp `examples/sample_lesson.md` làm mẫu tham chiếu cho Agent.

---

## 2. Đặt vấn đề thực tế

Giảng viên đã hoàn thành Lesson 1: có cấu trúc thư mục Skill, có YAML frontmatter, có dàn ý pipeline. Tuy nhiên, khi thử chạy Skill với yêu cầu "Tạo Lesson về Vector Database", Agent trả về một bài viết dài nhưng:

* Thiếu phần "Đặt vấn đề thực tế" — nhảy thẳng vào lý thuyết.
* Demo minh họa viết bằng Python thay vì Java.
* Không có câu hỏi tự luận ở cuối bài.
* Tổng kết quá dài, liệt kê lại toàn bộ nội dung thay vì tóm tắt trọng tâm.

Nguyên nhân: Phần Markdown body trong SKILL.md chỉ có dàn ý sơ sài, không có ràng buộc cụ thể. Agent tự do sinh nội dung theo "hiểu biết chung" thay vì tuân thủ tiêu chí đã chuẩn hóa.

Giải pháp: Viết Markdown body chi tiết với các ràng buộc rõ ràng, đồng thời cung cấp tệp mẫu trong `examples/` để Agent có "anchor point" tham chiếu.

---

## 3. Kiến thức cốt lõi

### 3.1. Nguyên tắc viết Markdown body hiệu quả

Markdown body của SKILL.md là System Prompt chuyên biệt. Để Agent tuân thủ chính xác, áp dụng 4 nguyên tắc:

| Nguyên tắc | Mô tả | Ví dụ |
| :--- | :--- | :--- |
| **Explicit Constraints** | Liệt kê rõ ràng những gì Agent PHẢI làm và KHÔNG ĐƯỢC làm | "Bắt buộc viết code bằng Java. Tuyệt đối không dùng JavaScript." |
| **Structured Output** | Định nghĩa cấu trúc output chính xác | "Output phải có đúng 7 heading cấp 2 theo thứ tự: 1. Mục tiêu... 7. Câu hỏi" |
| **Reference Injection** | Chỉ dẫn Agent đọc tệp cụ thể trước khi viết | "Trước khi viết, đọc references/CONTENT_DEVELOPMENT.md để nắm cấu trúc" |
| **Example Anchoring** | Cung cấp mẫu output cụ thể | "Tham khảo examples/sample_lesson.md để hiểu tone, độ dài và cấu trúc" |

### 3.2. Context Injection qua thư mục `references/`

Khi SKILL.md hướng dẫn Agent đọc tệp trong `references/`, Agent sẽ sử dụng công cụ đọc file để tải nội dung tệp đó vào context window. Đây là cách inject kiến thức chuyên biệt mà không cần nhúng trực tiếp vào body (giữ body dưới 500 dòng).

Quy trình:

```
SKILL.md (body) ghi:
"Đọc references/CONTENT_DEVELOPMENT.md"
          │
          ▼
Agent gọi công cụ view_file
          │
          ▼
Nội dung CONTENT_DEVELOPMENT.md
được tải vào context window
          │
          ▼
Agent sử dụng nội dung này
để sinh Lesson đúng cấu trúc
```

### 3.3. Kỹ thuật Structured Output cho Lesson

Để đảm bảo Agent luôn sinh đúng 7 phần, sử dụng kỹ thuật **Output Template** trong body:

```markdown
## Cấu trúc output bắt buộc

Mọi Lesson sinh ra PHẢI tuân theo thứ tự sau, không được bỏ sót phần nào:

### Phần 1: Mục tiêu học tập
- Danh sách 4-6 gạch đầu dòng, mỗi dòng bắt đầu bằng động từ
  (Hiểu, Phân tích, Thiết kế, Áp dụng,...)

### Phần 2: Đặt vấn đề thực tế
- Bối cảnh doanh nghiệp/dự án cụ thể
- Khó khăn đang gặp phải
- KHÔNG dùng câu chuyện cá nhân hoặc đời thường

### Phần 3: Kiến thức cốt lõi
- Định nghĩa, vai trò, khi nào sử dụng
- Ưu tiên: bảng so sánh, bullet list, sơ đồ ASCII

### Phần 4: Phân tích tình huống (1-3 tình huống)
- Mỗi tình huống có: Bối cảnh → Thách thức → Cách tiếp cận → Kết quả

### Phần 5: Demo minh họa
- Code bắt buộc viết bằng Java (Spring Boot/Spring AI)
- Có: Mục tiêu demo, điều kiện chuẩn bị, các bước, kết quả mong đợi

### Phần 6: Tổng kết
- Tóm tắt ngắn gọn, không quá 10 dòng
- Sai lầm thường gặp, lưu ý thực tế

### Phần 7: Câu hỏi đánh giá
- Đúng 3 câu tự luận (KHÔNG trắc nghiệm)
- Câu 1: Ghi nhớ. Câu 2: Phân tích. Câu 3: Vận dụng
- BẮT BUỘC có gợi ý đáp án cho mỗi câu
```

---

## 4. Phân tích tình huống thực tế

### Tình huống: Agent sinh nội dung sai cấu trúc

**Bối cảnh**: Giảng viên kích hoạt Skill `curriculum-builder` bằng yêu cầu: "Tạo Lesson về Embeddings và Vector hóa dữ liệu text cho Session 07".

**Thách thức**: Agent trả về bài viết có 5 phần thay vì 7 (thiếu "Phân tích tình huống" và "Câu hỏi đánh giá"). Code demo viết bằng Python (dùng thư viện `sentence-transformers`) thay vì Java.

**Cách tiếp cận**: Bổ sung vào Markdown body các ràng buộc:
1. Thêm dòng kiểm tra: "Trước khi trả kết quả, đếm số heading cấp 2. Nếu không đủ 7 heading, bổ sung các phần còn thiếu."
2. Thêm constraint ngôn ngữ: "Mọi code block bắt buộc khai báo ngôn ngữ là `java`. Nếu phát hiện code Python/JavaScript trong output, xóa và viết lại bằng Java."
3. Thêm reference: "Đọc `references/CONTENT_DEVELOPMENT.md` phần 'Yêu cầu về lập trình' trước khi viết demo."

**Kết quả**: Sau khi cập nhật body, Agent sinh Lesson đúng 7 phần với 100% code viết bằng Java.

---

## 5. Demo minh họa

### Mục tiêu demo

Viết phần Markdown body hoàn chỉnh cho SKILL.md và tạo tệp mẫu `examples/sample_lesson.md`.

### Các bước thực hiện

**Bước 1**: Viết Markdown body cho Bước 1 (Reasoning) trong pipeline

Mở tệp `.agents/skills/curriculum-builder/SKILL.md`, bổ sung phía dưới YAML frontmatter:

```markdown
## Vai trò

Bạn là Chuyên gia thiết kế học liệu doanh nghiệp chuyên xây dựng tài liệu
Lesson cho giáo trình đào tạo kỹ thuật. Mọi output bạn tạo ra phải tuân thủ
nghiêm ngặt các tiêu chí trong thư mục references/.

## Nguyên tắc bất biến

1. Ngôn ngữ viết: Tiếng Việt. Phong cách: chuyên nghiệp, học thuật vừa phải,
   hướng doanh nghiệp.
2. Ngôn ngữ code: Bắt buộc Java (Spring Boot / Spring AI). Tuyệt đối không
   sử dụng JavaScript, Python hoặc ngôn ngữ khác trong code demo.
3. Không tạo câu hỏi trắc nghiệm trong Lesson. Quiz được tạo bởi Skill
   riêng (quiz-builder).
4. Không sử dụng emoji trong nội dung bài đọc.

## Pipeline xử lý

Khi nhận yêu cầu tạo Lesson, thực hiện tuần tự 4 bước sau. Không được
bỏ qua bước nào.

### Bước 1: Reasoning (Suy luận)

1. Đọc tệp `references/PM.md` để xác định:
   - Session mà Lesson thuộc về.
   - Nội dung chi tiết và các Lesson liên quan trong Session đó.

2. Đọc tệp `references/CONTENT_DEVELOPMENT.md` để nắm:
   - Cấu trúc 7 phần bắt buộc.
   - Quy tắc viết từng phần.

3. Lập dàn ý (Outline) gồm:
   - Tiêu đề Lesson
   - 4-6 mục tiêu học tập (dạng động từ)
   - Tóm tắt 1 câu cho mỗi phần trong 7 phần
   - Danh sách công nghệ/thư viện Java sẽ demo

4. Trình bày dàn ý cho người dùng và hỏi: "Dàn ý này đã phù hợp chưa?
   Có cần điều chỉnh gì không?" Chỉ tiếp tục Bước 2 khi người dùng
   xác nhận.
```

**Bước 2**: Viết phần Bước 2 (Generation) trong pipeline

```markdown
### Bước 2: Generation (Sinh nội dung)

Dựa trên dàn ý đã được duyệt, viết Lesson hoàn chỉnh với đúng 7 phần
theo thứ tự:

1. **Mục tiêu học tập**: 4-6 gạch đầu dòng, mỗi dòng bắt đầu bằng
   "Hiểu được", "Phân tích được", "Thiết kế được", hoặc "Áp dụng được".

2. **Đặt vấn đề thực tế**: Mô tả khó khăn của một doanh nghiệp/dự án
   cụ thể. Không dùng câu chuyện cá nhân. Kết thúc bằng giải pháp
   mà Lesson sẽ giải quyết.

3. **Kiến thức cốt lõi**: Trình bày khái niệm, nguyên lý. Ưu tiên
   bảng so sánh, danh sách bullet, sơ đồ ASCII. Mỗi khái niệm gồm:
   Định nghĩa, Vai trò, Khi nào sử dụng, Ví dụ nghiệp vụ.

4. **Phân tích tình huống**: 1-3 tình huống, mỗi tình huống có:
   Bối cảnh → Thách thức → Cách tiếp cận → Kết quả.

5. **Demo minh họa**: Bắt buộc có code Java.
   - Cấu hình môi trường
   - Các bước thực hiện chi tiết
   - Code block khai báo ngôn ngữ ```java
   - Giải thích từng đoạn code
   - Kết quả đầu ra mong đợi
   - Sơ đồ ASCII minh họa kiến trúc + Prompt DALL-E bằng tiếng Anh

6. **Tổng kết**: Tối đa 10 dòng. Gồm: kiến thức quan trọng nhất,
   sai lầm thường gặp, lưu ý thực tế.

7. **Câu hỏi đánh giá**: Đúng 3 câu tự luận (KHÔNG trắc nghiệm).
   - Câu 1: Kiểm tra ghi nhớ
   - Câu 2: Kiểm tra phân tích (tình huống hoặc đoạn code)
   - Câu 3: Vận dụng thực chiến
   - BẮT BUỘC cung cấp Gợi ý đáp án cho mỗi câu.
```

**Bước 3**: Tạo tệp mẫu `examples/sample_lesson.md`

Sao chép một Lesson đã hoàn thiện (ví dụ: một Lesson từ Session 05 về Tool Calling hoặc Guardrails) vào thư mục `examples/` để Agent có mẫu tham chiếu thực tế:

```
cp sessions/session-05/session-05.md .agents/skills/curriculum-builder/examples/sample_lesson.md
```

### Kết quả mong đợi

Tệp SKILL.md giờ có:
* YAML frontmatter đầy đủ
* Markdown body chi tiết cho Bước 1 (Reasoning) và Bước 2 (Generation)
* Các ràng buộc rõ ràng về ngôn ngữ, cấu trúc, phong cách

### Lưu ý thực tế

* Kỹ thuật "Gate-keeping" (hỏi xác nhận trước khi tiếp tục) ở cuối Bước 1 rất quan trọng: nó cho phép người dùng điều chỉnh hướng đi trước khi Agent đầu tư công sức sinh toàn bộ nội dung.
* Việc cung cấp tệp mẫu trong `examples/` hiệu quả hơn việc mô tả bằng văn bản trong body, vì Agent có thể "nhìn thấy" output thực tế thay vì phải tự suy luận từ mô tả trừu tượng.

---

## 6. Tổng kết

* Markdown body của SKILL.md là System Prompt chuyên biệt — viết càng chi tiết và có cấu trúc, Agent càng tuân thủ chính xác.
* 4 nguyên tắc viết body hiệu quả: Explicit Constraints, Structured Output, Reference Injection, Example Anchoring.
* Context Injection qua `references/` giúp giữ body dưới 500 dòng trong khi vẫn cung cấp đủ kiến thức chuyên biệt cho Agent.
* Sai lầm thường gặp: Viết body quá sơ sài dẫn đến Agent tự do sáng tạo, nhúng toàn bộ tiêu chí vào body thay vì tách ra `references/`, không cung cấp output mẫu trong `examples/`.

---

## 7. Câu hỏi đánh giá

### Câu 1 — Ghi nhớ kiến thức

Liệt kê 4 nguyên tắc viết Markdown body hiệu quả cho SKILL.md và giải thích ngắn gọn từng nguyên tắc.

**Gợi ý đáp án**:

1. **Explicit Constraints**: Liệt kê rõ ràng những gì Agent PHẢI làm và KHÔNG ĐƯỢC làm (ví dụ: "Code bằng Java, không Python").
2. **Structured Output**: Định nghĩa cấu trúc output chính xác bằng template (ví dụ: "7 heading cấp 2 theo thứ tự cố định").
3. **Reference Injection**: Chỉ dẫn Agent đọc tệp cụ thể trong `references/` thay vì nhúng nội dung trực tiếp vào body.
4. **Example Anchoring**: Cung cấp output mẫu trong `examples/` để Agent có anchor point tham chiếu khi sinh nội dung.

---

### Câu 2 — Phân tích

Xem xét đoạn body sau trong SKILL.md:

```markdown
## Hướng dẫn
Hãy viết một bài Lesson hay và chi tiết về chủ đề được yêu cầu.
Bài viết cần có phần mở đầu, nội dung chính và kết luận.
```

Hãy phân tích 3 vấn đề cụ thể khiến Agent sẽ sinh output không đạt yêu cầu, và viết lại phiên bản cải thiện (không cần viết đầy đủ, chỉ cần thể hiện nguyên tắc).

**Gợi ý đáp án**:

3 vấn đề:
1. **Thiếu Explicit Constraints**: Không quy định ngôn ngữ code (Java), không cấm trắc nghiệm, không giới hạn phong cách viết → Agent có thể dùng Python, tạo quiz, viết văn phong quảng cáo.
2. **Thiếu Structured Output**: "Mở đầu, nội dung chính, kết luận" là cấu trúc quá chung — không khớp với yêu cầu 7 phần bắt buộc của giáo trình.
3. **Thiếu Reference Injection**: Không chỉ dẫn Agent đọc tệp tiêu chí nào → Agent dựa vào kiến thức chung, không tuân thủ chuẩn riêng của dự án.

Phiên bản cải thiện (tóm tắt):
```markdown
## Hướng dẫn
Đọc references/CONTENT_DEVELOPMENT.md trước khi viết.
Output bắt buộc 7 heading cấp 2: Mục tiêu, Đặt vấn đề, Kiến thức cốt lõi,
Phân tích tình huống, Demo, Tổng kết, Câu hỏi đánh giá.
Code demo viết bằng Java (Spring Boot). Không dùng Python/JS.
Tham khảo examples/sample_lesson.md về tone và độ dài.
```

---

### Câu 3 — Vận dụng thực chiến

Bạn nhận nhiệm vụ xây dựng Skill `homework-builder` chuyên tạo bài tập về nhà cho các buổi thực hành. Dựa trên kiến thức đã học:
1. Viết phần "Nguyên tắc bất biến" trong Markdown body (tối thiểu 4 nguyên tắc).
2. Liệt kê các tệp cần đặt trong `references/` và giải thích vai trò từng tệp.
3. Mô tả cách sử dụng kỹ thuật Gate-keeping để đảm bảo chất lượng output.

**Gợi ý đáp án**:

1. Nguyên tắc bất biến:
   - Ngôn ngữ code: Bắt buộc Java. Mọi bài tập yêu cầu sinh code phải dùng Java (Spring Boot).
   - Cấu trúc: Hệ thống 5 bài (Bài 1-4: Thực hành tổng hợp, Bài 5: Sáng tạo nâng cao) theo PRACTICE_HOMEWORK_GUIDELINE.md.
   - Đề bài xuyên suốt: Các bài 1-4 phải thuộc cùng một bối cảnh dự án (Seamless Case Study), không rời rạc.
   - Nộp bài: Sinh viên nộp 1 file .md duy nhất, bắt buộc có text log hội thoại AI, không dùng screenshot.

2. Tệp trong `references/`:
   - `PRACTICE_HOMEWORK_GUIDELINE.md`: Quy chuẩn thiết kế 5 bài tập, rubric chấm điểm.
   - `PM.md`: Khung chương trình để Agent biết kiến thức nào tương ứng Session nào.
   - `CONTENT_DEVELOPMENT.md`: Tham chiếu kiến thức cốt lõi của Lesson liên quan.

3. Gate-keeping: Sau khi lập dàn ý 5 bài tập (đề bài + công nghệ + mức độ khó), Agent trình bày dàn ý và hỏi xác nhận: "Hệ thống 5 bài tập này đã phù hợp với mục tiêu Session chưa?" Chỉ sinh chi tiết đề bài khi người dùng duyệt.

---
---

# Lesson 3 — Review và Check lỗi (QA & Validation)

## 1. Mục tiêu học tập

Sau khi hoàn thành Lesson này, người học có thể:

* Thiết kế được checklist kiểm tra tự động cho output của Agent dựa trên tiêu chí đã chuẩn hóa.
* Áp dụng được kỹ thuật Self-Reflection để Agent tự review và sửa lỗi output trước khi trả cho người dùng.
* Phân loại và xử lý được các lỗi phổ biến khi Agent sinh nội dung giáo trình (thiếu phần, sai ngôn ngữ code, thiếu đáp án,...).
* Viết được phần Bước 3 (QA Review) trong pipeline SKILL.md.

---

## 2. Đặt vấn đề thực tế

Giảng viên đã hoàn thiện Skill `curriculum-builder` với Bước 1 (Reasoning) và Bước 2 (Generation). Khi chạy thử, Agent sinh ra Lesson trông có vẻ hoàn chỉnh, nhưng khi giảng viên kiểm tra kỹ:

* 2 trong 5 Lesson thiếu phần "Câu hỏi đánh giá" (Phần 7).
* 1 Lesson có câu hỏi đánh giá nhưng thiếu Gợi ý đáp án.
* 1 Lesson có đoạn code demo viết bằng Python (import numpy) lẫn giữa các đoạn Java.
* Phần "Tổng kết" ở 3 Lesson dài hơn 20 dòng, gần như lặp lại toàn bộ nội dung phần "Kiến thức cốt lõi".

Vấn đề gốc rễ: Agent không có bước tự kiểm tra. Nó sinh xong nội dung rồi trả về ngay mà không đối chiếu output với tiêu chí.

Giải pháp: Thêm Bước 3 (QA Review) vào pipeline — Agent tự đóng vai người chấm bài, kiểm tra output của chính mình theo checklist, rồi sửa trước khi trả kết quả.

---

## 3. Kiến thức cốt lõi

### 3.1. Self-Reflection trong AI Agent

Self-Reflection là kỹ thuật cho phép Agent đánh giá output của chính mình trước khi trả cho người dùng. Thay vì sinh rồi trả (Generate → Return), pipeline trở thành sinh rồi kiểm rồi sửa rồi mới trả (Generate → Review → Fix → Return).

```
Không có Self-Reflection:
┌──────────┐    ┌──────────┐
│ Generate │───▶│  Return  │
└──────────┘    └──────────┘

Có Self-Reflection:
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Generate │───▶│  Review  │───▶│   Fix    │───▶│  Return  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │                │
                     ▼                ▼
                Phát hiện lỗi    Sửa lỗi dựa
                theo checklist   trên rubric
```

### 3.2. Checklist kiểm tra Lesson

Dựa trên CONTENT_DEVELOPMENT.md, xây dựng checklist 12 điểm kiểm tra:

**Nhóm A — Cấu trúc (Structure)**:

| # | Tiêu chí | Mức độ |
| :--- | :--- | :--- |
| A1 | Có đúng 7 heading cấp 2 theo thứ tự quy định | Bắt buộc |
| A2 | Heading 1 (Mục tiêu) có 4-6 gạch đầu dòng bắt đầu bằng động từ | Bắt buộc |
| A3 | Heading 7 (Câu hỏi) có đúng 3 câu tự luận | Bắt buộc |
| A4 | Mỗi câu hỏi tự luận có Gợi ý đáp án kèm theo | Bắt buộc |

**Nhóm B — Nội dung (Content)**:

| # | Tiêu chí | Mức độ |
| :--- | :--- | :--- |
| B1 | Phần "Đặt vấn đề" dùng bối cảnh doanh nghiệp/dự án, không đời thường | Bắt buộc |
| B2 | Phần "Phân tích tình huống" có 1-3 tình huống, mỗi tình huống có 4 mục con | Bắt buộc |
| B3 | Phần "Tổng kết" không quá 10 dòng | Khuyến nghị |
| B4 | Không chứa câu hỏi trắc nghiệm (A/B/C/D) | Bắt buộc |

**Nhóm C — Code & Kỹ thuật (Technical)**:

| # | Tiêu chí | Mức độ |
| :--- | :--- | :--- |
| C1 | Mọi code block khai báo ngôn ngữ `java` | Bắt buộc |
| C2 | Không có code Python, JavaScript hoặc ngôn ngữ khác | Bắt buộc |
| C3 | Có sơ đồ ASCII minh họa kiến trúc/luồng xử lý | Khuyến nghị |
| C4 | Có Prompt DALL-E bằng tiếng Anh cho hình ảnh minh họa | Khuyến nghị |

### 3.3. Cách nhúng Self-Reflection vào SKILL.md

Viết phần Bước 3 trong Markdown body theo mẫu:

```markdown
### Bước 3: QA Review (Kiểm tra chất lượng)

Sau khi sinh xong bản nháp Lesson ở Bước 2, KHÔNG trả kết quả ngay.
Thực hiện tự kiểm tra theo checklist sau:

#### Checklist bắt buộc:
- [ ] Có đúng 7 heading cấp 2 theo thứ tự: Mục tiêu → Đặt vấn đề →
      Kiến thức cốt lõi → Phân tích tình huống → Demo → Tổng kết →
      Câu hỏi đánh giá
- [ ] Mục tiêu học tập có 4-6 gạch đầu dòng, bắt đầu bằng động từ
- [ ] Phần Đặt vấn đề dùng bối cảnh doanh nghiệp, không đời thường
- [ ] Phần Phân tích tình huống có 1-3 tình huống với 4 mục con
- [ ] Mọi code block khai báo ngôn ngữ java
- [ ] Không có code Python/JavaScript
- [ ] Câu hỏi đánh giá có đúng 3 câu tự luận
- [ ] Mỗi câu có Gợi ý đáp án
- [ ] Không chứa câu hỏi trắc nghiệm A/B/C/D
- [ ] Phần Tổng kết không quá 10 dòng

#### Nếu phát hiện lỗi:
1. Liệt kê các lỗi tìm thấy.
2. Sửa trực tiếp trên bản nháp.
3. Chạy lại checklist lần 2 sau khi sửa.
4. Chỉ chuyển sang Bước 4 khi tất cả các mục bắt buộc đều đạt.
```

---

## 4. Phân tích tình huống thực tế

### Tình huống 1: Agent quên phần Câu hỏi đánh giá

**Bối cảnh**: Giảng viên yêu cầu tạo Lesson về "Cosine Similarity trong tìm kiếm ngữ nghĩa". Agent sinh bài viết 6 phần, hoàn toàn bỏ sót phần "Câu hỏi đánh giá".

**Thách thức**: Đây là lỗi phổ biến nhất khi Agent sinh nội dung dài. Khi đạt đến cuối bài, context window đã chứa nhiều nội dung và Agent có xu hướng "cắt ngắn" bằng cách bỏ phần cuối.

**Cách tiếp cận**: Trong Bước 3 (QA Review), Agent đếm số heading cấp 2. Nếu đếm được 6 (thiếu 1), Agent xác định phần nào bị thiếu bằng cách so khớp tên heading với danh sách 7 phần chuẩn, rồi bổ sung phần còn thiếu.

**Kết quả**: Tỷ lệ Lesson đủ 7 phần tăng từ 60% lên 100% sau khi thêm Self-Reflection.

### Tình huống 2: Code demo lẫn ngôn ngữ

**Bối cảnh**: Lesson về "Embeddings" có phần demo chứa 2 đoạn code: một đoạn Java dùng Spring AI `EmbeddingModel`, nhưng xen kẽ một đoạn Python dùng `sentence-transformers` để "so sánh cách làm".

**Thách thức**: Agent coi việc so sánh đa ngôn ngữ là hữu ích cho người học, nhưng vi phạm quy tắc "Tuyệt đối không dùng JavaScript hoặc Python cho các phần code lõi".

**Cách tiếp cận**: Trong checklist C1-C2, Agent quét tất cả code block, kiểm tra tag ngôn ngữ. Nếu phát hiện tag không phải `java` (hoặc `xml`, `yaml`, `properties` cho cấu hình), Agent xóa đoạn code đó và thay thế bằng phiên bản Java tương đương.

**Kết quả**: Output 100% code Java, không còn lẫn ngôn ngữ khác.

---

## 5. Demo minh họa

### Mục tiêu demo

Viết phần Bước 3 (QA Review) hoàn chỉnh vào SKILL.md và mô phỏng quy trình Agent tự kiểm tra một bản nháp có lỗi.

### Các bước thực hiện

**Bước 1**: Bổ sung Bước 3 vào SKILL.md

Mở tệp `.agents/skills/curriculum-builder/SKILL.md`, thêm tiếp sau Bước 2:

```markdown
### Bước 3: QA Review (Kiểm tra chất lượng)

Sau khi hoàn thành bản nháp ở Bước 2, thực hiện tự kiểm tra nghiêm ngặt.
KHÔNG trả kết quả cho người dùng nếu chưa hoàn thành bước này.

#### 3.1. Kiểm tra cấu trúc
- Đếm số heading cấp 2 (##). Yêu cầu: đúng 7.
- Nếu thiếu, xác định phần nào bị bỏ sót và bổ sung.
- Kiểm tra thứ tự: Mục tiêu → Đặt vấn đề → Kiến thức cốt lõi →
  Phân tích tình huống → Demo → Tổng kết → Câu hỏi đánh giá.

#### 3.2. Kiểm tra nội dung
- Mục tiêu: Có 4-6 gạch đầu dòng? Mỗi dòng bắt đầu bằng động từ?
- Đặt vấn đề: Dùng bối cảnh doanh nghiệp/dự án? (Không đời thường?)
- Phân tích tình huống: 1-3 tình huống? Mỗi tình huống đủ 4 mục con
  (Bối cảnh, Thách thức, Cách tiếp cận, Kết quả)?
- Tổng kết: Không quá 10 dòng?
- Câu hỏi: Đúng 3 câu tự luận? Không trắc nghiệm? Có Gợi ý đáp án?

#### 3.3. Kiểm tra kỹ thuật
- Quét tất cả code block. Tag ngôn ngữ phải là java, xml, yaml,
  properties, sql, hoặc text (cho sơ đồ ASCII).
- Nếu phát hiện code Python/JavaScript: XÓA và viết lại bằng Java.
- Kiểm tra có sơ đồ ASCII minh họa kiến trúc không. Nếu thiếu, bổ sung.

#### 3.4. Xử lý khi phát hiện lỗi
1. Ghi chú nội bộ: "QA phát hiện N lỗi: [liệt kê]"
2. Sửa trực tiếp trên bản nháp.
3. Chạy lại checklist. Nếu vẫn còn lỗi bắt buộc, lặp lại (tối đa 2 vòng).
4. Khi tất cả mục bắt buộc đạt, chuyển sang Bước 4.
```

**Bước 2**: Mô phỏng quy trình QA

Giả sử Agent vừa sinh bản nháp Lesson với các lỗi sau:

```
Bản nháp gốc (có lỗi):
─────────────────────────
## 1. Mục tiêu học tập
- Vector hóa dữ liệu text
- Sử dụng Cosine Similarity         ← Thiếu động từ đầu dòng
- Spring AI Embedding API

## 2. Đặt vấn đề thực tế
Hôm qua mình tìm kiếm trên Google   ← Bối cảnh cá nhân
mà không ra kết quả chính xác...

## 3. Kiến thức cốt lõi
(Nội dung OK)

## 4. Phân tích tình huống
(Nội dung OK)

## 5. Demo minh họa
```python                             ← Sai ngôn ngữ
from sentence_transformers import...
```

## 6. Tổng kết
(Nội dung dài 25 dòng)               ← Vượt giới hạn 10 dòng

(THIẾU phần 7: Câu hỏi đánh giá)    ← Thiếu phần bắt buộc
```

Agent chạy QA Review:

```
QA Report:
──────────
[FAIL] A1: Chỉ có 6 heading cấp 2 (thiếu "Câu hỏi đánh giá")
[FAIL] A2: Mục tiêu thiếu động từ đầu dòng ở gạch 2 và 3
[FAIL] B1: Đặt vấn đề dùng bối cảnh cá nhân ("Hôm qua mình...")
[FAIL] B3: Tổng kết 25 dòng (giới hạn: 10)
[FAIL] C1: Code block dùng tag python thay vì java
[FAIL] C2: Chứa code Python (sentence_transformers)

→ Phát hiện 6 lỗi. Tiến hành sửa...
```

Agent sửa và chạy lại:

```
QA Report (lần 2):
──────────────────
[PASS] A1: 7 heading cấp 2 đúng thứ tự
[PASS] A2: Mục tiêu có 5 gạch đầu dòng, đều bắt đầu bằng động từ
[PASS] B1: Đặt vấn đề mô tả công ty logistics cần tìm kiếm ngữ nghĩa
[PASS] B3: Tổng kết 8 dòng
[PASS] C1: Tất cả code block dùng tag java
[PASS] C2: Không còn code Python/JavaScript

→ Tất cả tiêu chí bắt buộc đạt. Chuyển sang Bước 4.
```

### Lưu ý thực tế

* Giới hạn vòng lặp QA (tối đa 2 vòng) để tránh Agent rơi vào vòng lặp vô hạn khi gặp lỗi không thể tự sửa.
* Nếu sau 2 vòng QA vẫn còn lỗi bắt buộc, Agent nên báo cho người dùng: "QA phát hiện lỗi chưa sửa được: [liệt kê]. Cần hỗ trợ thủ công."

---

## 6. Tổng kết

* Self-Reflection biến Agent từ "viết xong là xong" thành "viết xong, kiểm tra, sửa, rồi mới trả" — cải thiện đáng kể chất lượng output.
* Checklist 12 điểm chia thành 3 nhóm (Cấu trúc, Nội dung, Kỹ thuật) bao phủ toàn bộ tiêu chí trong CONTENT_DEVELOPMENT.md.
* Giới hạn vòng lặp QA (tối đa 2 vòng) là cơ chế an toàn ngăn Agent rơi vào vòng lặp vô hạn.
* Sai lầm thường gặp: Không có bước QA (tin tưởng output lần đầu), viết checklist quá sơ sài (chỉ kiểm tra "có code không?" mà không kiểm tra ngôn ngữ code), không giới hạn số vòng lặp.

---

## 7. Câu hỏi đánh giá

### Câu 1 — Ghi nhớ kiến thức

Liệt kê 3 nhóm trong checklist kiểm tra Lesson và cho 2 ví dụ tiêu chí trong mỗi nhóm.

**Gợi ý đáp án**:

1. **Nhóm A — Cấu trúc**: (a) Có đúng 7 heading cấp 2 theo thứ tự, (b) Câu hỏi đánh giá có đúng 3 câu tự luận kèm đáp án.
2. **Nhóm B — Nội dung**: (a) Đặt vấn đề dùng bối cảnh doanh nghiệp không đời thường, (b) Tổng kết không quá 10 dòng.
3. **Nhóm C — Kỹ thuật**: (a) Mọi code block khai báo ngôn ngữ `java`, (b) Không chứa code Python/JavaScript.

---

### Câu 2 — Phân tích

Agent sinh một Lesson có phần "Câu hỏi đánh giá" như sau:

```markdown
## 7. Câu hỏi đánh giá

### Câu 1
A. Vector Database lưu trữ gì?
B. Embedding model hoạt động thế nào?
C. Cosine Similarity là gì?
D. Tất cả các đáp án trên

### Câu 2
Hãy giải thích cơ chế tìm kiếm ngữ nghĩa.

### Câu 3
Viết code Java sử dụng Spring AI EmbeddingModel.
```

Phân tích các lỗi vi phạm tiêu chí và viết lại phiên bản đúng.

**Gợi ý đáp án**:

Lỗi:
1. **Câu 1 là trắc nghiệm A/B/C/D** — vi phạm quy tắc "Tuyệt đối không tạo câu hỏi trắc nghiệm cùng với bài đọc" và "Đúng 3 câu tự luận".
2. **Câu 2 và Câu 3 thiếu Gợi ý đáp án** — vi phạm quy tắc "Bắt buộc cung cấp đáp án mẫu hoặc hướng dẫn trả lời chi tiết".
3. **Phân bổ sai mức độ**: Câu 2 là câu ghi nhớ (nên ở vị trí Câu 1), Câu 3 là câu thực hành (thiếu tình huống thực chiến).

Phiên bản sửa:
```markdown
### Câu 1 — Ghi nhớ
Vector Database khác gì so với Relational Database truyền thống
trong cách lưu trữ và truy vấn dữ liệu?

**Gợi ý đáp án**: Vector Database lưu trữ dữ liệu dưới dạng
vector số thực (embeddings) và truy vấn bằng tính khoảng cách
(cosine similarity, euclidean distance), trong khi RDBMS lưu
dữ liệu dạng bảng và truy vấn bằng SQL...

### Câu 2 — Phân tích
(Câu phân tích tình huống + đáp án)

### Câu 3 — Vận dụng thực chiến
(Câu vận dụng + đáp án)
```

---

### Câu 3 — Vận dụng thực chiến

Bạn phát hiện Agent sinh Lesson về "Function Calling" nhưng phần Demo có đoạn code Python (dùng `openai.chat.completions.create`). Hãy:
1. Mô tả quy trình Agent sẽ thực hiện trong Bước 3 (QA Review) khi gặp lỗi này.
2. Viết đoạn code Java thay thế sử dụng Spring AI để thực hiện Function Calling tương đương.

**Gợi ý đáp án**:

1. Quy trình QA:
   - Agent quét tất cả code block, phát hiện tag `python` tại phần Demo.
   - Ghi QA report: "[FAIL] C1: Code block dùng tag python. C2: Chứa code Python (openai library)."
   - Agent xóa đoạn code Python.
   - Viết lại bằng Java sử dụng Spring AI.
   - Chạy checklist lần 2, xác nhận [PASS] C1 và C2.

2. Code Java thay thế:

```java
@Bean
@Description("Lấy thông tin thời tiết theo thành phố")
public Function<WeatherRequest, WeatherResponse> getWeather() {
    return request -> {
        // Gọi API thời tiết bên ngoài
        return weatherService.getByCity(request.city());
    };
}

// Đăng ký Tool và gọi ChatModel
ChatResponse response = chatModel.call(
    new Prompt(
        "Thời tiết Hà Nội hôm nay thế nào?",
        OpenAiChatOptions.builder()
            .withFunction("getWeather")
            .build()
    )
);
```

---
---

# Lesson 4 — Bản Final và Triển khai (Assembly & Deployment)

## 1. Mục tiêu học tập

Sau khi hoàn thành Lesson này, người học có thể:

* Viết được phần Bước 4 (Assembly) hoàn chỉnh trong pipeline SKILL.md để Agent đóng gói output đúng cấu trúc thư mục dự án.
* Thiết kế được script phụ trợ đặt trong thư mục `scripts/` để tự động hóa các tác vụ kiểm tra cấu trúc.
* Tổng hợp và hoàn thiện được toàn bộ tệp SKILL.md với đầy đủ 4 bước pipeline.
* Áp dụng được quy trình kiểm thử Skill end-to-end: cài đặt → kích hoạt → kiểm tra output → tinh chỉnh.

---

## 2. Đặt vấn đề thực tế

Giảng viên đã hoàn thiện 3 bước đầu trong pipeline (Reasoning → Generation → QA). Agent giờ có thể sinh Lesson đúng cấu trúc, đúng ngôn ngữ code, và tự kiểm tra trước khi trả. Tuy nhiên, output cuối cùng chỉ là một khối Markdown hiển thị trực tiếp trong cửa sổ chat.

Vấn đề:
* Giảng viên phải tự tay copy output, tạo tệp, đặt đúng thư mục.
* Tên tệp không thống nhất (lúc `lesson_3.md`, lúc `Lesson-3.md`, lúc `bai_3.md`).
* Sơ đồ ASCII trong bản nháp không được chuyển thành tệp SVG riêng.
* Không có cơ chế đảm bảo output khớp với cấu trúc thư mục hiện tại của dự án (`sessions/session-XX/`).

Giải pháp: Thêm Bước 4 (Assembly) — Agent tự lưu output vào đúng vị trí trong cấu trúc dự án, đặt tên tệp theo quy ước, và tạo các tệp phụ trợ (nếu cần).

---

## 3. Kiến thức cốt lõi

### 3.1. Bước Assembly trong pipeline

Bước Assembly là bước cuối cùng, chịu trách nhiệm chuyển đổi output từ "bản nháp trong context" thành "tệp thực tế trên ổ đĩa" đúng cấu trúc dự án.

```
Bước 3 (QA Pass)
       │
       ▼
┌──────────────────────────────┐
│        Bước 4: Assembly       │
│                              │
│  1. Xác định vị trí lưu     │
│     (sessions/session-XX/)   │
│                              │
│  2. Đặt tên tệp theo quy   │
│     ước (session-XX.md)      │
│                              │
│  3. Tạo tệp Markdown        │
│                              │
│  4. Báo cáo kết quả         │
│     cho người dùng          │
└──────────────────────────────┘
       │
       ▼
  Tệp Lesson hoàn chỉnh
  trên ổ đĩa
```

### 3.2. Quy ước đặt tên và cấu trúc thư mục

Dựa trên cấu trúc dự án hiện tại:

```
sessions/
├── session-01/
│   ├── session-01.md          ← Tệp nội dung chính
│   ├── index.html             ← Giao diện web (nếu có)
│   ├── script.js              ← Logic tương tác (nếu có)
│   ├── style.css              ← Kiểu dáng (nếu có)
│   └── images/                ← Hình ảnh minh họa
│       ├── diagram-01.svg
│       └── illustration-01.png
├── session-02/
│   └── ...
└── ...
```

Quy ước:
* Thư mục: `session-XX` (XX là số thứ tự 2 chữ số, ví dụ: `session-07`).
* Tệp nội dung: `session-XX.md`.
* Hình ảnh: đặt trong thư mục con `images/`.

### 3.3. Script phụ trợ (Validate Structure)

Viết script đặt trong `scripts/` để Agent hoặc giảng viên chạy kiểm tra cấu trúc output:

```python
#!/usr/bin/env python3
"""
validate_lesson.py — Kiểm tra cấu trúc tệp Lesson Markdown.
Đặt tại: .agents/skills/curriculum-builder/scripts/validate_lesson.py
Chạy: python scripts/validate_lesson.py <đường_dẫn_tệp.md>
"""
import sys
import re

def validate(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    errors = []
    headings = re.findall(r'^## \d+\.\s+.+$', content, re.MULTILINE)

    # A1: Kiểm tra số lượng heading cấp 2
    if len(headings) != 7:
        errors.append(f"[FAIL] A1: Có {len(headings)} heading cấp 2 "
                       f"(yêu cầu: 7)")

    # C1-C2: Kiểm tra ngôn ngữ code block
    code_blocks = re.findall(r'```(\w+)', content)
    allowed = {'java', 'xml', 'yaml', 'properties', 'sql',
               'text', 'markdown', 'json', 'bash', 'shell'}
    for lang in code_blocks:
        if lang.lower() not in allowed:
            errors.append(f"[FAIL] C1: Code block dùng ngôn ngữ "
                           f"'{lang}' (không được phép)")

    # A3: Kiểm tra câu hỏi tự luận
    questions = re.findall(r'^### Câu \d+', content, re.MULTILINE)
    if len(questions) != 3:
        errors.append(f"[FAIL] A3: Có {len(questions)} câu hỏi "
                       f"(yêu cầu: 3)")

    # A4: Kiểm tra đáp án
    answers = re.findall(r'\*\*Gợi ý đáp án\*\*', content)
    if len(answers) < 3:
        errors.append(f"[FAIL] A4: Có {len(answers)} gợi ý đáp án "
                       f"(yêu cầu: 3)")

    # B4: Kiểm tra trắc nghiệm
    mc_pattern = re.findall(r'^[A-D]\.\s', content, re.MULTILINE)
    if mc_pattern:
        errors.append(f"[FAIL] B4: Phát hiện {len(mc_pattern)} dòng "
                       f"dạng trắc nghiệm A/B/C/D")

    if errors:
        print(f"VALIDATION FAILED ({len(errors)} errors):")
        for e in errors:
            print(f"  {e}")
        return False
    else:
        print("VALIDATION PASSED: Lesson đạt tất cả tiêu chí.")
        return True

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python validate_lesson.py <file.md>")
        sys.exit(1)
    success = validate(sys.argv[1])
    sys.exit(0 if success else 1)
```

Lưu ý: Script này viết bằng Python vì nó là công cụ phụ trợ cho giảng viên/hệ thống CI, không phải nội dung giảng dạy cho sinh viên. Các code demo trong Lesson vẫn bắt buộc viết bằng Java.

---

## 4. Phân tích tình huống thực tế

### Tình huống: Triển khai Skill và chạy end-to-end

**Bối cảnh**: Giảng viên đã hoàn thiện toàn bộ SKILL.md (4 bước pipeline), sao chép tài liệu tham chiếu vào `references/`, có script kiểm tra trong `scripts/`. Giờ cần chạy thử end-to-end.

**Thách thức**: Lần đầu chạy Skill, Agent không kích hoạt vì description không khớp với yêu cầu. Lần thứ 2 sau khi sửa description, Agent kích hoạt nhưng bỏ qua Bước 1 (không trình dàn ý) và nhảy thẳng vào sinh nội dung.

**Cách tiếp cận**:
1. Sửa `description` để bao phủ nhiều cách diễn đạt hơn: thêm "tạo bài đọc", "viết nội dung session", "biên soạn tài liệu giảng dạy".
2. Trong Markdown body, thêm câu nhấn mạnh ở Bước 1: "QUAN TRỌNG: LUÔN LUÔN trình dàn ý và chờ xác nhận trước khi chuyển sang Bước 2. Nếu người dùng không xác nhận, hỏi lại."
3. Chạy lại, Agent trình dàn ý → xác nhận → sinh bản nháp → tự QA → lưu file.

**Kết quả**: Pipeline hoạt động đúng 4 bước. Output là tệp Markdown hoàn chỉnh đặt đúng vị trí trong thư mục `sessions/`.

---

## 5. Demo minh họa

### Mục tiêu demo

Hoàn thiện SKILL.md với Bước 4 và chạy kiểm thử end-to-end.

### Các bước thực hiện

**Bước 1**: Bổ sung Bước 4 (Assembly) vào SKILL.md

```markdown
### Bước 4: Assembly (Đóng gói)

Sau khi bản nháp đã qua QA Review (Bước 3), thực hiện đóng gói:

1. **Xác định vị trí lưu**:
   - Hỏi người dùng: "Lesson này thuộc Session nào?"
   - Nếu người dùng đã cung cấp Session ID từ đầu, sử dụng luôn.
   - Đường dẫn: `sessions/session-{XX}/session-{XX}.md`

2. **Tạo tệp output**:
   - Tạo thư mục `sessions/session-{XX}/` nếu chưa tồn tại.
   - Tạo thư mục con `images/` nếu chưa tồn tại.
   - Lưu nội dung Lesson vào `session-{XX}.md`.

3. **Báo cáo cho người dùng**:
   - Thông báo đường dẫn tệp đã tạo.
   - Liệt kê tóm tắt 7 phần và số từ mỗi phần.
   - Gợi ý: "Chạy `python .agents/skills/curriculum-builder/scripts/
     validate_lesson.py sessions/session-{XX}/session-{XX}.md`
     để kiểm tra lần cuối."
```

**Bước 2**: Tổng hợp SKILL.md hoàn chỉnh

Tệp `.agents/skills/curriculum-builder/SKILL.md` cuối cùng sẽ có cấu trúc:

```
---
name: curriculum-builder
description: (mô tả đầy đủ)
---

## Vai trò
(Định nghĩa persona)

## Nguyên tắc bất biến
(4 quy tắc)

## Pipeline xử lý
### Bước 1: Reasoning
(Đọc PM.md, CONTENT_DEVELOPMENT.md, lập dàn ý, hỏi xác nhận)

### Bước 2: Generation
(Sinh 7 phần theo template)

### Bước 3: QA Review
(Checklist 12 điểm, Self-Reflection, tối đa 2 vòng)

### Bước 4: Assembly
(Xác định vị trí, tạo tệp, báo cáo)
```

**Bước 3**: Kiểm thử end-to-end

Trong Antigravity IDE, gõ yêu cầu kiểm thử:

```
Tạo Lesson 1 cho Session 07 về chủ đề "Vector hóa dữ liệu text (Embeddings)"
```

Kết quả mong đợi:
1. Agent trình dàn ý gồm 7 phần → Người dùng xác nhận.
2. Agent sinh bản nháp Lesson hoàn chỉnh.
3. Agent tự chạy QA, báo cáo: "QA PASSED — 0 lỗi."
4. Agent tạo tệp `sessions/session-07/session-07.md`.
5. Agent báo cáo: "Đã tạo Lesson tại sessions/session-07/session-07.md (2,450 từ, 7 phần đầy đủ)."

### Lưu ý thực tế

* Khi chạy Skill lần đầu, luôn kiểm tra xem Agent có đi đúng 4 bước hay không. Nếu Agent bỏ qua bước nào (thường là Bước 1 — không trình dàn ý), cần bổ sung câu nhấn mạnh trong body.
* Script `validate_lesson.py` là lớp bảo vệ cuối cùng — chạy sau khi Agent hoàn thành, đảm bảo output đáp ứng tiêu chí ngay cả khi Self-Reflection của Agent bỏ sót.

---

## 6. Tổng kết

* Bước Assembly chuyển đổi output từ "bản nháp trong context" thành "tệp thực tế trên ổ đĩa" đúng cấu trúc dự án.
* Script phụ trợ `validate_lesson.py` trong `scripts/` là lớp kiểm tra cuối cùng, bổ sung cho Self-Reflection của Agent.
* Quy trình kiểm thử end-to-end: Cài đặt Skill → Gõ yêu cầu → Xác nhận dàn ý → Nhận output → Chạy script validate → Tinh chỉnh nếu cần.
* Pipeline 4 bước hoàn chỉnh (Reasoning → Generation → QA → Assembly) biến Agent từ "chatbot trả lời câu hỏi" thành "cỗ máy biên soạn giáo trình có quy trình kiểm soát chất lượng".
* Sai lầm thường gặp: Không kiểm thử end-to-end trước khi dùng thực tế, không bổ sung câu nhấn mạnh khi Agent bỏ qua bước, dùng script validate như giải pháp duy nhất (không kết hợp Self-Reflection trong Agent).

---

## 7. Câu hỏi đánh giá

### Câu 1 — Ghi nhớ kiến thức

Liệt kê 4 bước trong pipeline của Skill `curriculum-builder` và mô tả ngắn gọn input/output của mỗi bước.

**Gợi ý đáp án**:

| Bước | Tên | Input | Output |
| :--- | :--- | :--- | :--- |
| 1 | Reasoning | Chủ đề + Session ID | Dàn ý chi tiết (Outline) |
| 2 | Generation | Dàn ý đã duyệt + Tiêu chí (references/) | Bản nháp Lesson 7 phần |
| 3 | QA Review | Bản nháp + Checklist 12 điểm | Bản đã sửa lỗi (Revised) |
| 4 | Assembly | Bản đã sửa + Cấu trúc thư mục | Tệp .md hoàn chỉnh trên ổ đĩa |

---

### Câu 2 — Phân tích

Đồng nghiệp thiết kế Skill `curriculum-builder` nhưng không có Bước 3 (QA Review). Pipeline chỉ gồm: Reasoning → Generation → Assembly. Hãy phân tích:
1. 3 loại lỗi cụ thể có thể xảy ra khi thiếu bước QA.
2. Tại sao script `validate_lesson.py` không thể thay thế hoàn toàn Self-Reflection?

**Gợi ý đáp án**:

1. 3 loại lỗi:
   - **Thiếu phần bắt buộc**: Agent có thể bỏ sót phần "Câu hỏi đánh giá" (thường xảy ra khi bài viết dài, Agent "cắt ngắn" ở cuối).
   - **Sai ngôn ngữ code**: Agent có thể lẫn code Python/JavaScript vào phần Demo vì trong knowledge base của LLM, Python là ngôn ngữ phổ biến nhất cho AI.
   - **Vi phạm quy tắc nội dung**: Đặt vấn đề dùng bối cảnh cá nhân/đời thường thay vì doanh nghiệp, hoặc Tổng kết quá dài lặp lại toàn bộ nội dung.

2. Script `validate_lesson.py` chỉ kiểm tra **cấu trúc** (đếm heading, đếm code block, tìm pattern trắc nghiệm) — nó không đánh giá được **chất lượng nội dung** (bối cảnh có phù hợp doanh nghiệp không, code Java có chạy đúng logic không, đáp án có chính xác không). Self-Reflection cho phép Agent dùng khả năng hiểu ngữ nghĩa để kiểm tra các tiêu chí mà regex không bao phủ được.

---

### Câu 3 — Vận dụng thực chiến

Bạn nhận nhiệm vụ mở rộng Skill `curriculum-builder` để hỗ trợ thêm việc tạo sơ đồ SVG tự động cho mỗi Lesson. Hãy:
1. Mô tả cách bổ sung tính năng này vào pipeline (thêm ở bước nào, làm gì).
2. Viết đoạn hướng dẫn bổ sung vào Markdown body của SKILL.md.
3. Mô tả tệp script cần thêm vào `scripts/` (tên, chức năng, input/output).

**Gợi ý đáp án**:

1. Bổ sung vào **Bước 4 (Assembly)**, sau khi tạo tệp Markdown:
   - Quét nội dung Lesson tìm các sơ đồ ASCII.
   - Với mỗi sơ đồ, tạo file SVG tương ứng trong thư mục `images/`.
   - Cập nhật Lesson Markdown: thay sơ đồ ASCII bằng thẻ hình ảnh trỏ đến file SVG.

2. Đoạn bổ sung vào body:
```markdown
#### 4.1. Tạo sơ đồ SVG (tùy chọn)
Sau khi lưu tệp Markdown, quét nội dung tìm các khối code dạng sơ đồ
ASCII (nằm trong code block có tag `text` và chứa ký tự ┌, │, └, ─, ▶).
Với mỗi sơ đồ tìm thấy:
1. Gọi script `scripts/ascii_to_svg.py` với nội dung sơ đồ làm input.
2. Lưu output SVG vào `sessions/session-{XX}/images/diagram-{NN}.svg`.
3. Thêm dòng ![Sơ đồ](images/diagram-{NN}.svg) vào Lesson ngay dưới
   sơ đồ ASCII gốc.
```

3. Script: `scripts/ascii_to_svg.py`
   - Chức năng: Nhận chuỗi sơ đồ ASCII từ stdin, chuyển đổi thành tệp SVG.
   - Input: Chuỗi text chứa sơ đồ ASCII (qua stdin hoặc đối số dòng lệnh).
   - Output: Tệp SVG tại đường dẫn chỉ định (qua đối số `--output`).
