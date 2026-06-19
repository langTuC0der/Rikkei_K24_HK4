# 📚 SESSION 02: Từ Monolithic đến Microservice

> **Mục tiêu Session:** Hiểu được hành trình tiến hóa kiến trúc phần mềm từ Monolithic → SOA → Microservice, và biết cách thiết kế database phù hợp với mô hình Microservice.
>
> **Thời lượng:** ~4–5 giờ học  
> **Cấp độ:** Intermediate  
> **Yêu cầu tiên quyết:** Biết cơ bản về REST API, HTTP, SQL/NoSQL

---

## 🎬 NotebookLM – Prompt Tạo Video Giảng Dạy Toàn Session

> **Hướng dẫn sử dụng:**
> 1. Truy cập [notebooklm.google.com](https://notebooklm.google.com)
> 2. Tạo Notebook mới → Upload file markdown này làm **nguồn (Source)**
> 3. Vào **Audio Overview** → Click **Customize** → Dán prompt bên dưới
> 4. Nhấn **Generate** → Tải về file audio để dùng trong video
>
> **Lưu ý về hình ảnh:**  
> Tài liệu nguồn đã chứa sẵn các đoạn `[Prompt: ...]` mô tả hình ảnh chi tiết.  
> NotebookLM Video sẽ **tự động đọc và render** các mô tả đó thành visual.  
> Dùng `style_prompt` và `video_focus` bên dưới để định hướng phong cách.

---

### 🎙️ Prompt Tổng quát – Toàn bộ Session 02 (15–20 phút)

```
========== STYLE PROMPT ==========
Phong cách hình ảnh: Whiteboard animation kết hợp technical diagram.
Màu sắc chủ đạo: Xanh navy (#1E3A5F) cho Monolithic, Xanh lam (#2563EB)
cho SOA, Xanh tím (#7C3AED) cho Microservice.
Font: Sans-serif, rõ ràng. Mỗi khái niệm mới xuất hiện với hiệu ứng
draw-on (vẽ từng nét). Biểu đồ kiến trúc lấy từ các [Prompt: ...]
trong tài liệu nguồn.

========== VIDEO FOCUS ==========
Tập trung vào hành trình tiến hóa kiến trúc: Monolithic → SOA → Microservice.
Ưu tiên render các sơ đồ kiến trúc được mô tả trong tài liệu nguồn:
- Sơ đồ Monolithic Application (3 layer + database)
- Sơ đồ SOA với Enterprise Service Bus ở trung tâm
- Sơ đồ Microservice với API Gateway và nhiều service độc lập
- Sơ đồ Database per Service (mỗi service một database)
- Timeline evolution diagram (Monolithic → SOA → Microservice)

========== NỘI DUNG AUDIO ==========
Ngôn ngữ: Tiếng Việt, đan xen thuật ngữ kỹ thuật tiếng Anh.
Hai host: Host A (giảng viên senior) + Host B (đặt câu hỏi như sinh viên).

Mở đầu: Host A kể chuyện Netflix 2008 – deploy mất 3 giờ, một bug nhỏ
làm sập toàn bộ hệ thống. Host B hỏi "Tại sao lại như vậy?" → dẫn vào
bài học về Monolithic.

Nội dung chính (theo 4 lesson):
1. Monolithic – đơn giản nhưng cứng nhắc (dùng ảnh: single large cube)
2. SOA – bước tiến nhưng ESB là điểm nghẽn (dùng ảnh: ESB hub diagram)
3. Microservice – linh hoạt, độc lập (dùng ảnh: e-commerce microservice map)
4. Database per Service – mỗi service sở hữu data của mình

So sánh bằng ẩn dụ xuyên suốt:
  Monolithic = nhà hàng 1 đầu bếp làm tất cả
  SOA = nhà hàng có quản lý (ESB) điều phối mọi đơn
  Microservice = mỗi bếp trưởng chuyên 1 món, tự quyết định nguyên liệu

Kết thúc: 3 điểm cốt lõi cần nhớ + preview Session 03.
Thời lượng: 15–20 phút.
```

---

## 📖 Lesson 01 – Giới thiệu Monolithic Architecture (MLA)

### 🎯 Mục tiêu bài học
- Định nghĩa được Monolithic Architecture là gì
- Mô tả được cấu trúc bên trong của một ứng dụng Monolithic
- Phân tích ưu điểm và nhược điểm
- Nhận biết khi nào Monolithic phù hợp

---

### 1.1 Monolithic Architecture là gì?

**Monolithic Architecture (Kiến trúc Nguyên khối)** là mô hình thiết kế phần mềm trong đó **toàn bộ ứng dụng được xây dựng và triển khai như một đơn vị duy nhất**.

Toàn bộ các thành phần: UI, Business Logic, Data Access Layer đều nằm trong một codebase duy nhất và được đóng gói thành **một file artifact** duy nhất (ví dụ: file `.jar`, `.war`, `.exe`).

[Prompt: A software architecture diagram showing a single large cube labeled "Monolithic Application" containing three horizontal layers: "Presentation Layer (UI)" at the top in blue, "Business Logic Layer" in the middle in green, and "Data Access Layer" at the bottom in orange. All layers connect to a single "Database" cylinder below. The diagram uses clean flat design with arrows showing data flow between layers. Background is white with subtle grid lines.]

---

### 1.2 Cấu trúc điển hình của Monolithic App

Một ứng dụng thương mại điện tử Monolithic điển hình có thể trông như sau:

```
ecommerce-app/
├── src/
│   ├── controllers/
│   │   ├── UserController.java
│   │   ├── ProductController.java
│   │   ├── OrderController.java
│   │   └── PaymentController.java
│   ├── services/
│   │   ├── UserService.java
│   │   ├── ProductService.java
│   │   ├── OrderService.java
│   │   └── PaymentService.java
│   ├── repositories/
│   │   └── ... (tất cả repository)
│   └── models/
│       └── ... (tất cả entity)
├── resources/
│   └── application.properties
└── pom.xml
```

> **Đặc điểm cốt lõi:** Tất cả module (User, Product, Order, Payment) dùng chung một database và được build/deploy cùng nhau.

---

### 1.3 Ưu điểm của Monolithic Architecture

| Ưu điểm | Giải thích |
|---|---|
| **Đơn giản để phát triển ban đầu** | Chỉ cần một IDE, một codebase, một lệnh build |
| **Dễ debug & test** | Dễ trace lỗi vì tất cả chạy trong cùng một process |
| **Hiệu năng nội bộ cao** | Các module gọi nhau qua function call, không qua mạng |
| **Triển khai đơn giản** | Deploy một file duy nhất |
| **Phù hợp team nhỏ** | Ít overhead về giao tiếp, ít phức tạp về infrastructure |

---

### 1.4 Nhược điểm của Monolithic Architecture

[Prompt: An infographic showing a large monolithic block being weighed down by problem icons: a snail for "slow deployment", a bomb for "single point of failure", a confused developer for "code complexity", a locked box for "technology lock-in", and a traffic jam for "scaling bottleneck". The block is cracking under the pressure. Dark red and gray color scheme, modern flat design.]

| Nhược điểm | Giải thích |
|---|---|
| **Khó scale theo chiều ngang** | Phải scale toàn bộ app dù chỉ một module bận |
| **Single Point of Failure** | Một lỗi có thể làm sập toàn bộ hệ thống |
| **Codebase phình to theo thời gian** | Càng nhiều tính năng → càng khó maintain |
| **Deployment chậm và rủi ro** | Mỗi lần release phải deploy lại toàn bộ |
| **Khóa công nghệ** | Toàn bộ phải dùng cùng ngôn ngữ/framework |
| **Khó onboard developer mới** | Codebase lớn → khó hiểu toàn bộ hệ thống |

---

### 1.5 Khi nào nên dùng Monolithic?

✅ **Nên dùng Monolithic khi:**
- Dự án mới, nhỏ, team ≤ 5–10 người
- Chưa rõ domain business (cần thử nghiệm nhanh)
- MVP (Minimum Viable Product)
- Deadline ngắn, cần ra sản phẩm nhanh

❌ **Không nên dùng Monolithic khi:**
- Hệ thống cần scale lên hàng triệu người dùng
- Team lớn, nhiều nhóm làm song song
- Yêu cầu uptime cao (99.99%)
- Cần linh hoạt về công nghệ từng phần

---

### 💡 Ví dụ thực tế

> **Netflix (2008):** Bắt đầu bằng một ứng dụng Monolithic khổng lồ. Khi lượng người dùng tăng mạnh, họ gặp vấn đề nghiêm trọng:
> - Database thường xuyên bị quá tải
> - Deploy mất nhiều giờ
> - Một lỗi nhỏ có thể làm sập toàn bộ dịch vụ
>
> → Năm 2009, Netflix bắt đầu hành trình chuyển sang Microservices.

---

### 🧪 Thực hành 1.1 – Phân tích một Monolithic App

**Bài tập:** Quan sát cấu trúc project Spring Boot sau và trả lời câu hỏi:

```java
// OrderService.java - Trong một Monolithic App
@Service
public class OrderService {

    @Autowired
    private UserRepository userRepository;  // Truy cập trực tiếp UserDB

    @Autowired
    private ProductRepository productRepository;  // Truy cập trực tiếp ProductDB

    @Autowired
    private PaymentService paymentService;  // Gọi trực tiếp qua method

    @Autowired
    private EmailService emailService;  // Gọi trực tiếp qua method

    public Order createOrder(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        if (product.getStock() < quantity) {
            throw new InsufficientStockException();
        }

        Order order = new Order(user, product, quantity);
        orderRepository.save(order);

        paymentService.processPayment(order);
        emailService.sendConfirmation(user.getEmail(), order);

        return order;
    }
}
```

**Câu hỏi thảo luận:**
1. `OrderService` đang phụ thuộc vào những thành phần nào?
2. Nếu `EmailService` bị lỗi, điều gì xảy ra với toàn bộ luồng tạo đơn hàng?
3. Nếu chỉ muốn scale `PaymentService` vì lượng giao dịch tăng cao, có làm được không? Tại sao?

---

### 🎬 NotebookLM – Prompt Video Lesson 01

```
========== STYLE PROMPT ==========
Phong cách hình ảnh: Whiteboard animation – vẽ tay trên nền trắng.
Khi giải thích Monolithic, vẽ từng lớp của kiến trúc (Presentation →
Business Logic → Data Access) như đang vẽ phấn lên bảng.
Khi nói đến vấn đề scaling, dùng hiệu ứng "crack" (nứt vỡ) trên khối.
Màu chủ đạo: Xanh navy + Cam cảnh báo khi nói đến nhược điểm.
Lấy visual từ [Prompt] trong tài liệu: sơ đồ "single large cube" 3 layer
và infographic "monolithic block bị đè nặng bởi các vấn đề".

========== VIDEO FOCUS ==========
Tập trung render 2 hình ảnh chính từ tài liệu nguồn:
1. Sơ đồ Monolithic Application: khối vuông lớn chứa 3 layer
   (Presentation/Business Logic/Data Access) + database bên dưới
2. Infographic nhược điểm: khối monolithic nứt vỡ dưới sức nặng của
   slow deployment, single point of failure, code complexity,
   technology lock-in, scaling bottleneck
Hiển thị cấu trúc thư mục Spring Boot project (code block) khi nói
đến cấu trúc Monolithic thực tế.

========== NỘI DUNG AUDIO ==========
Thời lượng: 5–7 phút. Ngôn ngữ: Tiếng Việt.
Phong cách: Mentor senior giải thích cho junior developer.

[00:00 – Mở đầu Hook – 30s]
Host hỏi: "Bạn đã từng sửa một bug nhỏ mà phải deploy lại toàn bộ
ứng dụng chưa? Hoặc sửa một chỗ thì vỡ 3 chỗ khác? Đó chính là
'hội chứng Monolithic' đang xảy ra!"
→ Visual: Khối monolithic xuất hiện, vẽ dần từng lớp.

[00:30 – Định nghĩa – 1 phút]
"Monolithic = toàn bộ ứng dụng trong một file .jar duy nhất"
Dùng ví dụ: app ngân hàng Vietcombank thời kỳ đầu – một .war file
chứa login, chuyển khoản, báo cáo, admin – tất cả trong một.
→ Visual: Cấu trúc thư mục Spring Boot hiện ra với controllers,
services, repositories, models tất cả trong một project.

[01:30 – Ưu điểm – 1 phút]
"Monolithic KHÔNG phải xấu! Nó hoàn hảo cho giai đoạn đầu."
Bảng ưu điểm: đơn giản, dễ debug, hiệu năng nội bộ cao, deploy một file.
→ Visual: Bảng ưu điểm xuất hiện từng dòng với icon.

[02:30 – Nhược điểm – 2 phút]
"Nhưng khi team từ 5 người lên 50 người, từ 1.000 user lên 10 triệu..."
Dùng ví dụ code OrderService: method createOrder() phụ thuộc vào
UserRepository, ProductRepository, PaymentService, EmailService –
nếu Email bị lỗi → toàn bộ đơn hàng fail!
→ Visual: Khối monolithic bắt đầu nứt vỡ dưới sức nặng.
Hiển thị từng vấn đề: snail (slow deploy), bomb (SPOF), traffic jam (scale).

[04:30 – Case Study Netflix – 1,5 phút]
"Năm 2008, Netflix có 40 triệu subscribers và một ứng dụng Monolithic.
Một lỗi trong module recommendation làm sập toàn bộ streaming.
Năm 2009, họ quyết định: phải thay đổi."
→ Visual: Timeline Netflix 2008 → 2009 → quyết định chuyển đổi.

[06:00 – Kết – 30s]
3 từ khóa: ĐƠNGIẢN → DỄBẮTĐẦU → KHÓSCALE
Gợi mở: "Bài tiếp theo: SOA ra đời để giải quyết vấn đề này.
Nhưng nó có thực sự làm được không?"
```

---

## 📖 Lesson 02 – Giới thiệu Service-Oriented Architecture (SOA)

### 🎯 Mục tiêu bài học
- Định nghĩa được SOA và hiểu triết lý thiết kế
- Phân biệt SOA với Monolithic
- Hiểu vai trò của Enterprise Service Bus (ESB)
- So sánh SOA và Microservices (preview)

---

### 2.1 SOA là gì?

**Service-Oriented Architecture (SOA)** là một mô hình kiến trúc phần mềm trong đó ứng dụng được xây dựng từ các **service (dịch vụ) độc lập**, có thể tái sử dụng, và giao tiếp với nhau thông qua một **Enterprise Service Bus (ESB)** hoặc một giao thức chuẩn.

> **Triết lý cốt lõi của SOA:** *"Tái sử dụng service, chuẩn hóa giao tiếp, tích hợp hệ thống doanh nghiệp"*

SOA ra đời vào những năm 2000, được các doanh nghiệp lớn áp dụng để **tích hợp nhiều hệ thống cũ (legacy systems)** với nhau.

---

### 2.2 Thành phần trong SOA

[Prompt: A detailed SOA architecture diagram showing multiple business services (Customer Service, Order Service, Inventory Service, Payment Service) as separate boxes connected to a central "Enterprise Service Bus (ESB)" depicted as a horizontal pipeline/highway. The ESB contains sub-components: Message Routing, Protocol Transformation, Service Registry, and Orchestration. External systems connect on the left side, consumer applications on the right. Professional enterprise blue and gray color scheme, clean technical diagram style.]

**Các thành phần chính:**

| Thành phần | Vai trò |
|---|---|
| **Service Provider** | Cung cấp service, publish lên Service Registry |
| **Service Consumer** | Tìm kiếm và sử dụng service |
| **Service Registry** | Danh bạ lưu trữ thông tin các service (UDDI) |
| **ESB (Enterprise Service Bus)** | Trung gian điều phối, transform message, routing |
| **Service Contract** | WSDL – mô tả interface của service |

---

### 2.3 Nguyên tắc thiết kế SOA

SOA tuân theo **8 nguyên tắc thiết kế service** (SOA Principles):

1. **Standardized Service Contract** – Service có contract/interface chuẩn hóa
2. **Service Loose Coupling** – Ít phụ thuộc nhau nhất có thể
3. **Service Abstraction** – Ẩn chi tiết implementation
4. **Service Reusability** – Thiết kế để tái sử dụng ở nhiều context
5. **Service Autonomy** – Mỗi service kiểm soát logic của mình
6. **Service Statelessness** – Không lưu trạng thái giữa các request
7. **Service Discoverability** – Có thể tìm kiếm qua registry
8. **Service Composability** – Có thể kết hợp các service thành workflow phức tạp

---

### 2.4 Công nghệ điển hình trong SOA

```
SOA Tech Stack:
├── Giao thức giao tiếp: SOAP (Simple Object Access Protocol)
├── Định dạng message: XML
├── Service definition: WSDL (Web Service Description Language)
├── Service discovery: UDDI (Universal Description, Discovery & Integration)
└── ESB tools: MuleSoft, IBM WebSphere MQ, Oracle Service Bus, Apache Camel
```

**Ví dụ SOAP Request:**

```xml
<!-- SOAP Request - phức tạp hơn REST -->
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
    <auth:Credentials xmlns:auth="http://example.com/auth">
      <auth:Username>user123</auth:Username>
      <auth:Password>secret</auth:Password>
    </auth:Credentials>
  </soap:Header>
  <soap:Body>
    <ord:GetOrder xmlns:ord="http://example.com/orders">
      <ord:OrderId>12345</ord:OrderId>
    </ord:GetOrder>
  </soap:Body>
</soap:Envelope>
```

---

### 2.5 Ưu & Nhược điểm của SOA

**Ưu điểm:**
- Tích hợp tốt các hệ thống doanh nghiệp khác nhau
- Tái sử dụng service cao
- Chuẩn hóa giao tiếp
- Phù hợp với hệ thống enterprise phức tạp

**Nhược điểm:**
- **ESB là Single Point of Failure** và bottleneck
- SOAP/XML nặng, chậm hơn REST/JSON
- Chi phí triển khai ESB rất cao
- Cấu hình phức tạp, cần chuyên gia
- Service thường vẫn share database
- Không linh hoạt bằng Microservices

---

### 2.6 So sánh SOA vs Microservices (Preview)

[Prompt: A side-by-side comparison diagram. Left side shows SOA: multiple large service blocks connected through a central ESB hub, services share a common database. Right side shows Microservices: many small independent service blocks communicating directly or through lightweight API gateway, each service has its own small database. Use green for Microservices side and blue for SOA side. Clean modern infographic style with clear labels.]

| Tiêu chí | SOA | Microservices |
|---|---|---|
| **Kích thước service** | Lớn hơn, coarse-grained | Nhỏ, fine-grained |
| **Giao tiếp** | ESB (SOAP/XML) | REST/gRPC/Message Queue |
| **Database** | Thường share database | Mỗi service có DB riêng |
| **Phạm vi** | Enterprise integration | Một ứng dụng cụ thể |
| **Deploy** | Thường deploy cùng nhau | Deploy độc lập |
| **Team** | Tập trung | Autonomous team |

> **Tóm lại:** SOA là bước tiến từ Monolithic nhưng vẫn có nhiều hạn chế. Microservices kế thừa triết lý của SOA nhưng đơn giản hóa và linh hoạt hơn.

---

### 🧪 Thực hành 2.1 – Nhận diện SOA pattern

**Kịch bản:** Một ngân hàng có các hệ thống cũ:
- Core Banking System (IBM AS/400)
- CRM System (Oracle)
- Internet Banking App (Java)
- Mobile Banking App (React Native)

**Câu hỏi:**
1. Vẽ sơ đồ tích hợp các hệ thống trên theo kiến trúc SOA (có ESB)
2. ESB sẽ cần xử lý những vấn đề transform nào giữa các hệ thống?
3. Điều gì xảy ra nếu ESB bị down?

---

### 🎬 NotebookLM – Prompt Video Lesson 02

```
========== STYLE PROMPT ==========
Phong cách hình ảnh: Enterprise technical diagram – nền xám nhạt,
đường nét rõ ràng, icon công nghệ (server, database, gear).
Khi giới thiệu ESB, render sơ đồ hub-and-spoke: ESB ở trung tâm như
một đường cao tốc ngang, các service kết nối vào như các nhánh đường.
Dùng màu xanh navy cho enterprise services, màu vàng cảnh báo cho
các điểm yếu (SPOF, bottleneck).
Lấy visual từ [Prompt] trong tài liệu:
- Sơ đồ SOA với ESB là "horizontal pipeline/highway" ở trung tâm
- Sơ đồ so sánh SOA vs Microservices side-by-side

========== VIDEO FOCUS ==========
Render 3 hình ảnh chính theo thứ tự:
1. Sơ đồ SOA Architecture: Customer/Order/Inventory/Payment Service
   → tất cả kết nối vào ESB ở trung tâm (Message Routing, Protocol
   Transformation, Service Registry, Orchestration bên trong ESB)
2. Kịch bản ngân hàng: 5 hệ thống legacy (AS/400, Oracle CRM,
   Java Web, Mobile) → tất cả qua ESB để giao tiếp
3. Sơ đồ so sánh SOA (trái, xanh) vs Microservices (phải, xanh lá)
   để preview bài tiếp theo
Highlight màu đỏ vào ESB khi nói đến Single Point of Failure.

========== NỘI DUNG AUDIO ==========
Thời lượng: 5–7 phút. Phong cách: Debate giữa 2 host.
Host A: Kỹ sư đã dùng SOA ở doanh nghiệp lớn (ủng hộ SOA).
Host B: Developer hiện đại (đặt câu hỏi và chỉ ra nhược điểm).

[00:00 – Recap + Hook – 30s]
Host B: "Bài trước chúng ta thấy Monolithic khó scale. SOA giải quyết
được không?"
Host A: "SOA là cứu tinh của các enterprise những năm 2000-2010.
Hãy xem nó làm được gì!"
→ Visual: Timeline xuất hiện – highlight giai đoạn SOA (2005-2015).

[00:30 – SOA là gì – 1,5 phút]
Host A giải thích: ESB như tổng đài viên – mọi cuộc gọi giữa phòng
ban đều qua tổng đài, tổng đài biết nên chuyển đến ai.
Giới thiệu SOAP, WSDL, UDDI bằng ví dụ thực:
"WSDL là tờ menu của service – mô tả có thể làm gì, nhận tham số gì."
→ Visual: Sơ đồ ESB hub xuất hiện, các service kết nối vào từng nút.

[02:00 – Case Study Ngân hàng – 2 phút]
Host A: "Ngân hàng Vietinbank có Core Banking (IBM AS/400), CRM
(Oracle), Internet Banking (Java), Mobile App (React Native).
SOA giúp chúng nói chuyện với nhau qua ESB."
Host B: "Tuyệt! ESB làm được transform từ XML sang JSON không?"
Host A: "Đúng! Protocol transformation là một tính năng cốt lõi."
→ Visual: Sơ đồ 5 hệ thống legacy kết nối qua ESB, mũi tên transform.

[04:00 – Điểm yếu chết người – 1,5 phút]
Host B: "Nếu ESB bị crash thì sao?"
Host A (ngập ngừng): "Thì... toàn bộ hệ thống tê liệt."
Host B: "Đó gọi là Single Point of Failure! Và ESB MuleSoft tốn
hàng triệu đô/năm license phí..."
→ Visual: Màu đỏ cảnh báo bao quanh ESB, icon bomb xuất hiện.

[05:30 – Kết – 30s]
So sánh nhanh SOA vs Microservices qua bảng.
"SOA giải quyết integration nhưng tạo bottleneck mới.
Lesson 03: Microservices học từ sai lầm này như thế nào?"
→ Visual: Side-by-side diagram SOA vs Microservices để gợi mở.
```

---

## 📖 Lesson 03 – Giới thiệu Microservice Architecture (MSA)

### 🎯 Mục tiêu bài học
- Định nghĩa và hiểu triết lý Microservice
- Nắm được các đặc điểm nhận dạng của Microservice
- Hiểu các lợi ích và thách thức
- Phân biệt rõ Microservice với Monolithic và SOA

---

### 3.1 Microservice Architecture là gì?

**Microservice Architecture (MSA)** là phong cách kiến trúc phần mềm trong đó ứng dụng được xây dựng từ một tập hợp các **service nhỏ, độc lập**, mỗi service:
- Chạy trong **process riêng**
- Có **database riêng**
- Giao tiếp qua **lightweight mechanism** (thường là HTTP/REST hoặc Message Queue)
- Được **deploy độc lập**
- Xoay quanh **một business capability** cụ thể

> **Định nghĩa của Martin Fowler:**
> *"Microservice architectural style is an approach to developing a single application as a suite of small services, each running in its own process and communicating with lightweight mechanisms."*
> — Martin Fowler, 2014

---

### 3.2 Kiến trúc tổng quan Microservice

[Prompt: A comprehensive microservices architecture diagram for an e-commerce application. Show: Client (Web/Mobile) → API Gateway → multiple microservices arranged in a grid: User Service, Product Service, Order Service, Payment Service, Notification Service, Inventory Service. Each microservice has its own database icon underneath. Show Message Queue (RabbitMQ/Kafka) connecting some services. Include a Service Discovery component. Use modern tech diagram style, vibrant colors with each service a different color, clean white background with subtle shadows.]

**Giải thích luồng hoạt động:**

```
Client Request: "Đặt hàng sản phẩm X"

1. Client → API Gateway (entry point duy nhất)
2. API Gateway → Order Service (xử lý yêu cầu đặt hàng)
3. Order Service → Product Service (kiểm tra tồn kho qua REST API)
4. Order Service → Payment Service (xử lý thanh toán)
5. Order Service → Message Queue (publish event "OrderCreated")
6. Notification Service ← Message Queue (subscribe, gửi email/SMS)
7. Inventory Service ← Message Queue (subscribe, cập nhật kho)
```

---

### 3.3 Đặc điểm nhận dạng của Microservice

#### ① Componentization via Services
Thay vì chia theo library, chia theo **deployable service**.

#### ② Organized around Business Capabilities
Mỗi service phản ánh một business function cụ thể.

```
KHÔNG nên chia theo kỹ thuật:
- Database Team → Database Service
- UI Team → Frontend Service
- Backend Team → Backend Service

Nên chia theo business capability:
- Order Team → Order Service (toàn bộ stack: DB + logic + API)
- Payment Team → Payment Service
- User Team → User Service
```

#### ③ Smart Endpoints and Dumb Pipes
- **SOA:** Logic xử lý nằm trong ESB (dumb service, smart pipes)
- **MSA:** Logic nằm trong service (smart endpoints), kênh giao tiếp đơn giản (dumb pipes)

#### ④ Decentralized Governance
Mỗi team tự chọn công nghệ phù hợp:

```
User Service     → Java (Spring Boot) + PostgreSQL
Product Service  → Node.js (Express)  + MongoDB
Recommendation   → Python (FastAPI)   + Redis
Analytics        → Go (Gin)           + ClickHouse
```

#### ⑤ Decentralized Data Management
Mỗi service sở hữu và quản lý data của mình → **Database per Service** pattern.

#### ⑥ Infrastructure Automation
CI/CD pipeline riêng cho mỗi service, deploy độc lập.

#### ⑦ Design for Failure
Mỗi service phải xử lý được tình huống service khác bị lỗi (Circuit Breaker, Retry, Fallback).

#### ⑧ Evolutionary Design
Dễ dàng thêm, xóa, sửa một service mà không ảnh hưởng toàn hệ thống.

---

### 3.4 Ưu điểm của Microservice

[Prompt: An infographic with 6 benefit cards arranged in a 2x3 grid. Each card has an icon and text: 1) Rocket icon - "Independent Deployment"; 2) Scale icon - "Flexible Scaling"; 3) Shield icon - "Fault Isolation"; 4) Code icon - "Technology Freedom"; 5) Team icon - "Team Autonomy"; 6) Refresh icon - "Fast Innovation". Use gradient cards in purple and teal color scheme, modern flat design with subtle shadows.]

| Ưu điểm | Chi tiết |
|---|---|
| **Independent Deployment** | Deploy từng service mà không ảnh hưởng các service khác |
| **Flexible Scaling** | Scale riêng từng service theo demand |
| **Fault Isolation** | Lỗi ở một service không làm sập toàn bộ hệ thống |
| **Technology Diversity** | Mỗi service chọn tech stack tối ưu |
| **Team Autonomy** | Mỗi team tự quản lý service của mình (Conway's Law) |
| **Codebase nhỏ, dễ hiểu** | Mỗi service chỉ làm một việc → dễ maintain |

---

### 3.5 Thách thức của Microservice

> **Microservice không phải là silver bullet!** Nó giải quyết vấn đề của Monolithic nhưng sinh ra những thách thức mới.

| Thách thức | Giải thích |
|---|---|
| **Distributed System Complexity** | Debug, trace lỗi khó hơn nhiều |
| **Network Latency** | Gọi API qua mạng chậm hơn function call |
| **Data Consistency** | Không có ACID transaction xuyên service |
| **Service Discovery** | Cần cơ chế tìm kiếm địa chỉ service động |
| **Operational Overhead** | Cần nhiều tool: K8s, Prometheus, Jaeger, ... |
| **Testing Complexity** | Integration test phức tạp hơn |

---

### 3.6 Hành trình tiến hóa kiến trúc

[Prompt: A timeline evolution diagram showing three stages from left to right with connecting arrows. Stage 1 labeled "Monolithic (2000s)": one large cube with all layers, labeled "Simple but rigid". Stage 2 labeled "SOA (2005-2015)": multiple large services connected to ESB hub, labeled "Integrated but heavy". Stage 3 labeled "Microservices (2010-present)": many small colorful service boxes each with own DB, connected via API Gateway, labeled "Flexible and scalable". Horizontal timeline with year markers, modern design, blue to purple gradient progression.]

---

### 🧪 Thực hành 3.1 – Decompose Monolithic App

**Bài tập:** Cho một ứng dụng quản lý bệnh viện Monolithic với các chức năng:
- Quản lý bệnh nhân (đăng ký, hồ sơ bệnh án)
- Đặt lịch khám
- Quản lý bác sĩ / lịch làm việc
- Kê đơn thuốc
- Thanh toán viện phí
- Gửi thông báo (SMS/Email)
- Báo cáo thống kê

**Yêu cầu:**
1. Vẽ sơ đồ phân tách thành các Microservice
2. Xác định ranh giới (boundary) của từng service
3. Mô tả các điểm giao tiếp giữa các service
4. Chỉ ra service nào cần scale nhiều nhất và tại sao?

---

### 🎬 NotebookLM – Prompt Video Lesson 03

```
========== STYLE PROMPT ==========
Phong cách hình ảnh: Modern tech diagram + TED Talk presentation style.
Mỗi Microservice là một khối màu riêng biệt (User=xanh, Product=cam,
Order=xanh lá, Payment=tím, Notification=đỏ hồng).
Hiệu ứng: các service "nở ra" từ một khối monolithic bị vỡ ra.
Khi giải thích 8 đặc điểm, mỗi đặc điểm xuất hiện như một card
slide hiện đại. API Gateway render như một cổng vào duy nhất.
Lấy visual từ [Prompt] trong tài liệu:
- Sơ đồ e-commerce microservice với API Gateway, 6 services, Message Queue
- Infographic 6 benefit cards (Independent Deployment, Flexible Scaling...)
- Timeline evolution diagram (3 giai đoạn Monolithic → SOA → Microservices)

========== VIDEO FOCUS ==========
Render theo thứ tự timeline của audio:
1. [00:30] Định nghĩa Martin Fowler: text quote hiển thị lớn
   "each running in its own process, communicating with lightweight mechanisms"
2. [01:30] Ẩn dụ nhà hàng: icon kitchen/chef cho mỗi service
3. [03:00] Sơ đồ tổng quan e-commerce microservice (từ [Prompt] tài liệu):
   Client → API Gateway → [6 services riêng biệt] + Message Queue
   Mỗi service có database icon bên dưới
4. [05:00] Infographic 6 lợi ích (6 cards gradient tím-xanh)
5. [07:00] Timeline evolution 3 giai đoạn (từ [Prompt] tài liệu)
Khi nói đến cảnh báo, chuyển sang màu cam/vàng cảnh báo.

========== NỘI DUNG AUDIO ==========
Thời lượng: 7–10 phút. Phong cách: TED Talk – nhiệt tình, truyền cảm hứng.
Host A: Giảng viên senior đam mê kiến trúc phần mềm.
Host B: Sinh viên thông minh đặt câu hỏi sắc bén.

[00:00 – Hook kịch tính – 1 phút]
Host A: "Năm 2014, Martin Fowler – người được coi là 'giáo hoàng'
ngành software engineering – đăng một bài blog. Sau bài đó, cả ngành
phần mềm thay đổi cách nhìn về kiến trúc hệ thống. Bài blog đó là gì?"
→ Visual: Ảnh bìa blog microservices.io và ảnh Martin Fowler.
Host A đọc định nghĩa gốc, phân tích từng cụm từ:
"suite of SMALL services" → nhỏ, "OWN PROCESS" → độc lập,
"LIGHTWEIGHT mechanisms" → giao tiếp nhẹ nhàng.

[01:00 – Ẩn dụ nhà hàng – 2 phút]
Host B: "Giải thích cho tôi hiểu bằng ví dụ đời thường đi!"
Host A: "Bạn đến một nhà hàng Monolithic – 1 đầu bếp làm tất cả:
phở, sushi, pizza, bánh ngọt. Nếu anh ta ốm → đóng cửa toàn bộ!
Microservice: mỗi bếp trưởng chuyên 1 món. Bếp sushi bận → vẫn
có pizza. Bếp pizza muốn dùng bột mì Ý thay bột Mỹ → tự quyết!"
→ Visual: Animation nhà hàng → tách thành các bếp chuyên biệt.
Mỗi 'bếp' = 1 service box màu khác nhau, có 'thực đơn riêng' = API.

[03:00 – Kiến trúc tổng quan E-Commerce – 2 phút]
Host A: "Nhìn vào sơ đồ này – đây là hệ thống e-commerce Microservice."
→ Visual: Render đầy đủ sơ đồ từ tài liệu:
Client → API Gateway → [User/Product/Order/Payment/Notification/Inventory]
Mỗi service có database riêng bên dưới, Message Queue kết nối async.
Host A giải thích luồng đặt hàng qua 7 bước.

[05:00 – 8 đặc điểm nhận dạng – 2 phút]
Đi qua nhanh 8 đặc điểm, nhấn mạnh 2 đặc điểm quan trọng nhất:
① Organized around Business Capabilities → Conway's Law
⑤ Decentralized Data Management → Database per Service (preview L04)
→ Visual: 8 cards xuất hiện tuần tự, highlight ① và ⑤.

[07:00 – Lợi ích thực tế + Cảnh báo – 1,5 phút]
Thực tế: Amazon 1000 deploys/ngày, Netflix 700+ services.
Cảnh báo quan trọng – đổi giọng nghiêm túc:
"Sam Newman viết: 'Don't start with microservices.'
Nếu team bạn 3 người làm MVP, hãy dùng Monolithic.
Chỉ chuyển sang Microservice khi bạn THỰC SỰ cần."
→ Visual: Màu cam cảnh báo, icon stop sign.

[08:30 – Kết – 30s]
3 nguyên tắc vàng: SMALL + INDEPENDENT + BUSINESS-FOCUSED.
→ Visual: Timeline evolution hoàn chỉnh Monolithic→SOA→Microservices.
```

---

## 📖 Lesson 04 – Thiết kế Database cho Microservice

### 🎯 Mục tiêu bài học
- Hiểu vấn đề khi share database trong Microservice
- Nắm vững pattern **Database per Service**
- Biết cách chọn loại database phù hợp cho từng service
- Hiểu cách xử lý data consistency với Saga Pattern

---

### 4.1 Vấn đề: Shared Database trong Microservice

**Antipattern phổ biến nhất** khi mới chuyển sang Microservice: giữ nguyên một database chung cho tất cả service.

[Prompt: An antipattern diagram showing 4 microservices (User Service, Order Service, Product Service, Payment Service) as separate boxes but ALL pointing down with arrows to ONE large shared database cylinder. Show red warning signs and crack marks on the database. Add text labels showing problems: "Tight Coupling", "Single Point of Failure", "Schema Changes Break Everything", "Scaling Bottleneck". Red and orange warning color scheme, clear technical diagram style.]

**Tại sao Shared Database là antipattern?**

```
Scenario: Product Team muốn đổi tên column "price" → "unit_price"

Kết quả với Shared DB:
- Order Service đang SELECT price → bị lỗi ngay lập tức
- Payment Service đang JOIN với products → bị lỗi
- Phải coordinate với TẤT CẢ team trước khi thay đổi
- Downtime khi migration
- Mất đi sự độc lập của service!
```

---

### 4.2 Pattern: Database per Service

**Database per Service** là pattern trong đó mỗi Microservice có **database riêng**, chỉ service đó mới được phép truy cập trực tiếp database của mình.

> **Nguyên tắc vàng:** *"Nếu hai service cần cùng data, họ phải giao tiếp qua API, không bao giờ truy cập trực tiếp DB của nhau."*

[Prompt: A clean microservices database-per-service diagram. Show 4 microservices: "User Service" in blue with PostgreSQL logo and its own database below, "Order Service" in green with MySQL logo and its own database, "Product Service" in orange with MongoDB logo and its own database, "Payment Service" in purple with PostgreSQL logo and its own database. Each service-database pair is enclosed in a dashed border showing isolation. Services communicate horizontally via REST API arrows. White background, professional technical diagram, lock icons on each database.]

---

### 4.3 Các chiến lược triển khai Database per Service

#### Chiến lược 1: Private tables trong shared DB instance

```
Database Server (Shared)
├── schema_users/
│   ├── users
│   └── user_profiles
├── schema_orders/
│   ├── orders
│   └── order_items
└── schema_products/
    ├── products
    └── categories
```

> Phù hợp khi: Budget hạn chế, team nhỏ mới chuyển đổi
> Nhược điểm: Vẫn có nguy cơ cross-schema query

#### Chiến lược 2: Separate DB instances (Recommended)

```
Infrastructure:
├── user-service     → PostgreSQL (port 5432) [users, profiles]
├── order-service    → MySQL (port 3306) [orders, order_items]
├── product-service  → MongoDB (port 27017) [products, categories]
├── payment-service  → PostgreSQL (port 5433) [transactions]
└── session-service  → Redis (port 6379) [sessions, tokens]
```

#### Chiến lược 3: Polyglot Persistence

[Prompt: A colorful infographic showing different database types matched to microservice use cases. Show 6 pairs: User Service matched with PostgreSQL labeled "Relational, ACID"; Product Catalog with Elasticsearch labeled "Full-text search"; Shopping Cart with Redis labeled "Speed, TTL"; Order History with MongoDB labeled "Flexible documents"; Analytics with ClickHouse labeled "OLAP, aggregation"; Payment with PostgreSQL labeled "Strong consistency". Each pair connected with a "Best fit for" arrow. Modern flat design, vibrant distinct colors, database logos or icons.]

```
Service              Loại DB        Lý do
------------------   -----------    ----------------------------------------
User Service         PostgreSQL  →  ACID, relational, phức tạp query
Product Catalog      Elasticsearch→  Full-text search, filter nhanh
Shopping Cart        Redis       →  Tốc độ cao, TTL, không cần persist lâu
Order History        MongoDB     →  Document flexible, nested order items
Analytics            ClickHouse  →  OLAP, query aggregate nhanh
Payment              PostgreSQL  →  ACID transaction tuyệt đối cần thiết
Recommendation       Neo4j       →  Graph DB, user-product relationships
```

---

### 4.4 Thách thức: Data Consistency

Khi mỗi service có DB riêng, **ACID transaction xuyên service không còn khả thi**. Ta phải chấp nhận **Eventual Consistency**.

**Ví dụ vấn đề distributed transaction:**

```
Luồng: Đặt hàng

Step 1: Order Service → tạo order (status: PENDING)    ✅
Step 2: Inventory Service → trừ kho                    ✅
Step 3: Payment Service → charge thẻ                   ❌ FAILED!

Vấn đề: Order đã tạo, kho đã trừ, nhưng payment thất bại!
→ Cần rollback Order và Inventory → nhưng làm thế nào khi mỗi service có DB riêng?
```

---

### 4.5 Giải pháp: Saga Pattern

**Saga Pattern** giải quyết vấn đề distributed transaction bằng cách chia một transaction lớn thành **chuỗi local transaction nhỏ**, mỗi transaction trigger transaction tiếp theo qua event/message.

#### 4.5.1 Choreography-based Saga

[Prompt: A choreography saga pattern sequence diagram for an order placement flow. Show 3 services (Order Service, Inventory Service, Payment Service) as vertical swimlanes. Between them show message/event flows as horizontal arrows. Happy path in green: OrderCreated event goes to Inventory, StockReserved event goes to Payment, PaymentCompleted event confirms order. Compensation path in red (below): PaymentFailed event triggers Inventory to release stock with StockReleased event, then Order cancels. Clean technical diagram with clear event labels on arrows.]

```
Choreography Saga - "Tự biên tự diễn":

1. Order Service: CREATE order → publish "OrderCreated" event
2. Inventory Service: Nhận "OrderCreated" → reserve stock
                    → publish "StockReserved" event
3. Payment Service: Nhận "StockReserved" → charge payment
                  → publish "PaymentCompleted" event
4. Order Service: Nhận "PaymentCompleted" → confirm order

--- Khi lỗi (Compensating Transactions) ---
3'. Payment FAILED → publish "PaymentFailed" event
2'. Inventory: Nhận "PaymentFailed" → release stock
              → publish "StockReleased" event
1'. Order: Nhận "StockReleased" → cancel order
```

#### 4.5.2 Orchestration-based Saga

```
Orchestration Saga - "Có chỉ huy":

Order Saga Orchestrator:
  → Gọi Inventory Service: "Reserve stock"
  ← Response: Success/Fail
  → Gọi Payment Service: "Charge payment"
  ← Response: Success/Fail
  → Nếu tất cả OK: Confirm order
  → Nếu có lỗi: Gọi rollback theo thứ tự ngược lại
```

| So sánh | Choreography | Orchestration |
|---|---|---|
| **Điều phối** | Phân tán, service tự quyết | Tập trung, có orchestrator |
| **Coupling** | Loose coupling hơn | Tighter (với orchestrator) |
| **Debug** | Khó trace | Dễ trace hơn |
| **Phù hợp** | Luồng đơn giản | Luồng phức tạp, nhiều bước |

---

### 4.6 Thực hành: Thiết kế Database cho E-commerce

#### Cấu hình Docker Compose

```yaml
# docker-compose.yml

services:
  # === USER SERVICE ===
  user-service:
    image: user-service:latest
    environment:
      - DB_URL=jdbc:postgresql://user-db:5432/userdb

  user-db:
    image: postgres:15
    environment:
      POSTGRES_DB: userdb
      POSTGRES_USER: user_svc
      POSTGRES_PASSWORD: secret123

  # === PRODUCT SERVICE ===
  product-service:
    image: product-service:latest
    environment:
      - MONGO_URI=mongodb://product-db:27017/productdb

  product-db:
    image: mongo:6

  # === CART SERVICE ===
  cart-service:
    image: cart-service:latest
    environment:
      - REDIS_HOST=cart-db
      - REDIS_PORT=6379

  cart-db:
    image: redis:7-alpine

  # === ORDER SERVICE ===
  order-service:
    image: order-service:latest
    environment:
      - DB_URL=jdbc:mysql://order-db:3306/orderdb

  order-db:
    image: mysql:8

  # === PAYMENT SERVICE ===
  payment-service:
    image: payment-service:latest
    environment:
      - DB_URL=jdbc:postgresql://payment-db:5432/paymentdb

  payment-db:
    image: postgres:15
```

---

#### Schema Design: User Service (PostgreSQL)

```sql
-- user-service/src/main/resources/schema.sql

CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,  -- hashed
    status      VARCHAR(20) DEFAULT 'ACTIVE',
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_profiles (
    user_id     UUID PRIMARY KEY REFERENCES users(id),
    full_name   VARCHAR(255),
    phone       VARCHAR(20),
    avatar_url  TEXT,
    date_of_birth DATE
);

CREATE TABLE addresses (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id),
    street      TEXT,
    city        VARCHAR(100),
    is_default  BOOLEAN DEFAULT FALSE
);
```

#### Schema Design: Product Service (MongoDB)

```javascript
// product-service - MongoDB Document structure

{
  "_id": ObjectId("..."),
  "sku": "PROD-001",
  "name": "Laptop Dell XPS 15",
  "slug": "laptop-dell-xps-15",
  "price": 25000000,
  "category": {
    "id": "cat-electronics",
    "name": "Điện tử",
    "path": "/electronics/laptops"
  },
  "attributes": {
    "brand": "Dell",
    "cpu": "Intel Core i7",
    "ram": "16GB",
    "storage": "512GB SSD"
  },
  "images": [
    { "url": "...", "isPrimary": true }
  ],
  "status": "ACTIVE",
  "createdAt": ISODate("2024-01-15")
}
```

#### Schema Design: Order Service (MySQL)

```sql
-- order-service/src/main/resources/schema.sql

CREATE TABLE orders (
    id              VARCHAR(36) PRIMARY KEY,
    -- KHÔNG có FK thật đến users table!
    -- Chỉ lưu reference ID
    user_id         VARCHAR(36) NOT NULL,
    user_email      VARCHAR(255),  -- Snapshot tại thời điểm đặt hàng
    status          ENUM('PENDING','CONFIRMED','SHIPPING','DELIVERED','CANCELLED'),
    total_amount    DECIMAL(15,2) NOT NULL,
    shipping_address TEXT,         -- Snapshot địa chỉ, không FK
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id              VARCHAR(36) PRIMARY KEY,
    order_id        VARCHAR(36) NOT NULL REFERENCES orders(id),
    -- KHÔNG có FK thật đến products table!
    product_id      VARCHAR(36) NOT NULL,
    product_name    VARCHAR(255),  -- Snapshot tên sản phẩm
    unit_price      DECIMAL(15,2) NOT NULL,  -- Snapshot giá tại thời điểm mua
    quantity        INT NOT NULL
);
```

> **Lưu ý quan trọng:** Order Service **không có Foreign Key** đến bảng users hay products. Thay vào đó, nó lưu **snapshot** dữ liệu tại thời điểm đặt hàng. Đây là best practice để đảm bảo:
> - **Tính toàn vẹn lịch sử:** Đơn hàng cũ không bị ảnh hưởng khi user đổi email hoặc product đổi giá
> - **Loose coupling:** Order Service không phụ thuộc vào schema của User/Product Service

---

### 🧪 Thực hành 4.1 – Thiết kế Database cho Hệ thống Bệnh viện

**Bài tập lớn:** Quay lại bài tập ở Lesson 03 (hệ thống quản lý bệnh viện), thiết kế database cho mỗi service.

**Yêu cầu:**
1. Xác định loại database phù hợp cho từng service (SQL vs NoSQL vs Cache)
2. Thiết kế schema hoặc document structure cho từng service
3. Chỉ rõ những trường nào là "reference ID" (không phải FK thật)
4. Chỉ rõ những trường nào là "snapshot data"
5. Mô tả cách xử lý khi cần query cross-service

**Gợi ý câu 5 – Cross-service Query:**

```
Approach 1 - API Composition:
  → AppointmentService.getByPatientId(patientId)
  → DoctorService.getById(doctorId)   [gọi thêm API]
  → Combine ở tầng API Gateway hoặc BFF

Approach 2 - Snapshot (denormalization):
  → appointments table lưu thêm:
    doctor_name, doctor_specialty (snapshot)

Approach 3 - CQRS + Read Model:
  → Tạo service riêng tổng hợp data cho read queries
```

---

### 4.7 Checklist thiết kế Database per Service

```
Checklist Database Design cho Microservice:

[ ] Mỗi service có database riêng, không service nào truy cập DB của service khác
[ ] Chọn loại database phù hợp với đặc điểm data của service
[ ] Không có Foreign Key thật xuyên service boundaries
[ ] Lưu snapshot data quan trọng thay vì join xuyên service
[ ] Xác định rõ service nào là "source of truth" cho mỗi loại data
[ ] Có kế hoạch xử lý eventual consistency
[ ] Có kế hoạch cho distributed transaction (Saga pattern nếu cần)
[ ] Có chiến lược migration schema không gây downtime
[ ] Đã xem xét data backup & recovery cho từng service
```

---

### 🎬 NotebookLM – Prompt Video Lesson 04

```
========== STYLE PROMPT ==========
Phong cách hình ảnh: Technical diagram kết hợp scenario-based animation.
Khi nói về Shared Database antipattern: render 4 service boxes đều có
mũi tên đỏ trỏ xuống 1 database duy nhất, có crack marks và warning icons.
Khi nói về Database per Service: mỗi service-database pair được bao bởi
khung dashed riêng biệt (isolation boundary), lock icon trên mỗi database.
Khi Saga Pattern: render sequence diagram dạng swimlane với mũi tên xanh
(happy path) và mũi tên đỏ (compensation path).
Lấy visual từ [Prompt] trong tài liệu:
- Sơ đồ antipattern: 4 services → 1 shared database (warning/red scheme)
- Sơ đồ Database per Service: User(PostgreSQL) + Order(MySQL) +
  Product(MongoDB) + Payment(PostgreSQL) mỗi cái có DB riêng
- Polyglot Persistence infographic: 6 service-database pairs
- Choreography Saga sequence diagram: swimlanes + event arrows

========== VIDEO FOCUS ==========
Render 4 hình ảnh chính theo thứ tự:
1. [00:30] ANTIPATTERN diagram: 4 services → 1 shared DB
   Highlight màu đỏ, crack marks, warning signs.
   Label: "Tight Coupling", "Single Point of Failure", "Bottleneck"
2. [02:30] DATABASE PER SERVICE diagram: mỗi service có DB riêng
   Màu sắc: User=xanh/PostgreSQL, Order=xanh lá/MySQL,
   Product=cam/MongoDB, Payment=tím/PostgreSQL.
   Dashed isolation boundaries quanh từng pair.
3. [04:30] POLYGLOT PERSISTENCE infographic: 6 pairs service-database
   Mỗi pair có "Best fit for" label giải thích lý do chọn.
4. [07:00] SAGA PATTERN sequence diagram:
   Swimlanes: Order Service | Inventory Service | Payment Service
   Mũi tên xanh: happy path (OrderCreated→StockReserved→PaymentCompleted)
   Mũi tên đỏ: compensation (PaymentFailed→StockReleased→OrderCancelled)

========== NỘI DUNG AUDIO ==========
Thời lượng: 8–10 phút. Phong cách: Kiến trúc sư senior mentoring.
Giọng điệu: Nghiêm túc, kỹ thuật, nhưng dùng nhiều ví dụ thực tế.

[00:00 – Kịch bản gây shock – 1 phút]
"Hãy tưởng tượng: Team bạn mất 3 tháng để tách Monolithic thành
5 Microservice. Nhưng vẫn dùng chung 1 database.
Hôm nay, Product team cần đổi tên column 'price' → 'unit_price'.
Bạn nghĩ điều gì xảy ra?"
[Pause dramatic 2 giây]
"Order Service bị lỗi. Payment Service bị lỗi. Inventory Service bị lỗi.
Tất cả vì một thay đổi nhỏ. Đây là Shared Database Antipattern."
→ Visual: 4 service boxes, mũi tên đỏ → 1 database, crack marks xuất hiện.

[01:00 – Database per Service – 2 phút]
Nguyên tắc vàng (đọc chậm, rõ ràng):
"Nếu Service A muốn data của Service B → gọi API của B.
KHÔNG BAO GIỜ truy cập trực tiếp database của service khác."
3 chiến lược triển khai từ đơn giản đến hoàn chỉnh:
① Private schema trong shared DB instance (budget thấp)
② Separate DB instances (recommended cho production)
③ Polyglot: mỗi service chọn DB loại khác nhau
→ Visual: Database per Service diagram xuất hiện với lock icons.

[03:00 – Polyglot Persistence – 2 phút]
"Tại sao không dùng PostgreSQL cho tất cả?
Vì mỗi loại data có đặc thù riêng:"
- Shopping Cart → Redis: TTL tự xóa sau 30 phút, 10.000 ops/giây
- Product Catalog → MongoDB: schema linh hoạt cho TV, áo, điện thoại
- Full-text Search → Elasticsearch: tìm 'laptop dell' trong 0.1 giây
- Payment → PostgreSQL: ACID transaction – không được mất 1 đồng nào
"Chọn database như chọn công cụ. Không có công cụ tốt nhất,
chỉ có công cụ phù hợp nhất cho từng bài toán."
→ Visual: Polyglot infographic xuất hiện từng cặp service-database.

[05:00 – Vấn đề Distributed Transaction – 1,5 phút]
"Bây giờ câu hỏi khó: Khi mỗi service có DB riêng, làm sao
xử lý transaction xuyên service?"
Kịch bản đặt hàng:
Order created ✅ → Stock reserved ✅ → Payment FAILED ❌
"Lúc này bạn làm gì? Order đã tạo, kho đã trừ, nhưng tiền chưa trừ!
Không thể ROLLBACK qua 3 database khác nhau!"
→ Visual: Sequence diagram với step 3 màu đỏ, X mark.

[06:30 – Saga Pattern giải cứu – 2,5 phút]
"Đây là lúc Saga Pattern ra đời."
Choreography Saga – "Dàn nhạc không nhạc trưởng":
"Mỗi service lắng nghe event và tự biết làm gì tiếp theo.
Giống như dàn nhạc jazz – mỗi nhạc sĩ nghe nhau và ứng tấu."
→ Visual: Swimlane diagram mũi tên xanh (happy path).
"Khi Payment FAILED: Inventory nhận event → release stock.
Order nhận event → cancel order. Compensating Transaction!"
→ Visual: Mũi tên đỏ compensation path xuất hiện ngược lại.
Orchestration Saga – "Có nhạc trưởng":
"Một Orchestrator ra lệnh tuần tự: 'Reserve stock' → 'Charge payment'
→ nếu fail thì 'Rollback theo thứ tự ngược'. Dễ trace hơn nhưng
Orchestrator trở thành điểm tập trung."

[09:00 – Kết – 30s]
Checklist 3 điểm:
✅ Mỗi service có DB riêng
✅ Chọn loại DB phù hợp với đặc thù data
✅ Dùng Saga khi cần transaction xuyên service
"Session 03: API Gateway & Service Communication – gặp nhau ở buổi sau!"
→ Visual: Checklist xuất hiện từng dòng.
```

---

## 📝 Tổng kết Session 02

### So sánh 3 kiến trúc

| Tiêu chí | Monolithic | SOA | Microservice |
|---|---|---|---|
| **Đơn vị deploy** | Toàn bộ app | Service lớn | Service nhỏ |
| **Giao tiếp** | Method call | ESB (SOAP) | REST/gRPC/MQ |
| **Database** | Chung | Thường chung | Riêng mỗi service |
| **Team tổ chức** | Tập trung | Tập trung | Tự trị (autonomous) |
| **Technology** | Đồng nhất | Đồng nhất | Polyglot |
| **Scaling** | Scale all | Hạn chế | Granular |
| **Phức tạp vận hành** | Thấp | Trung bình | Cao |
| **Phù hợp với** | Startup/MVP | Enterprise | Scale-up company |

---

### 🎯 Câu hỏi ôn tập Session 02

1. Giải thích tại sao Monolithic architecture lại trở thành vấn đề khi hệ thống scale lên?
2. SOA giải quyết được vấn đề gì của Monolithic? Nó lại tạo ra vấn đề gì mới?
3. Microservice khác SOA ở những điểm nào quan trọng nhất?
4. Tại sao "Shared Database" được coi là antipattern trong Microservice?
5. Database per Service pattern yêu cầu ta xử lý vấn đề data consistency như thế nào?
6. Saga Pattern là gì? Phân biệt Choreography và Orchestration Saga.
7. Khi nào bạn nên dùng NoSQL thay vì SQL trong một Microservice cụ thể?

---

### 📚 Tài liệu tham khảo

- **Building Microservices** – Sam Newman (O'Reilly, 2nd Edition)
- **Microservices Patterns** – Chris Richardson (Manning)
- **microservices.io** – Chris Richardson's Pattern Catalog
- **Martin Fowler's Microservices Article** – martinfowler.com/articles/microservices.html
- **GOTO 2014 - Microservices** – Martin Fowler (YouTube)

---

> **Session tiếp theo:** Session 03 – API Gateway & Service Communication
> *Học về cách các Microservice giao tiếp với nhau: REST, gRPC, Message Queue, và vai trò của API Gateway.*
