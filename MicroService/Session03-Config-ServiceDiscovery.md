# 📚 SESSION 03: Configuration, Service Registration & Discovery

> **Mục tiêu Session:** Hiểu và triển khai được Centralized Configuration với Spring Cloud Config Server, đồng thời xây dựng Service Registration & Discovery với Eureka trong hệ thống Microservice.
>
> **Thời lượng:** ~4–5 giờ học  
> **Cấp độ:** Intermediate  
> **Yêu cầu tiên quyết:** Hoàn thành Session 02, biết cơ bản về Spring Boot, REST API

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

### 🎙️ Prompt Tổng quát – Toàn bộ Session 03 (15–20 phút)

```
========== STYLE PROMPT ==========
Phong cách hình ảnh: Whiteboard animation kết hợp technical diagram.
Màu sắc chủ đạo: Xanh lá (#16A34A) cho Config Server, Xanh tím (#7C3AED)
cho Eureka/Service Discovery, Xanh dương (#2563EB) cho Spring Cloud.
Font: Sans-serif, rõ ràng. Mỗi component mới xuất hiện với hiệu ứng
slide-in từ trái. Biểu đồ kiến trúc lấy từ các [Prompt: ...] trong tài liệu nguồn.

========== VIDEO FOCUS ==========
Tập trung vào hai trụ cột chính của Session 03:
PHẦN 1 – Config Management:
- Sơ đồ vấn đề: Config hardcoded trong nhiều service (chaos)
- Sơ đồ giải pháp: Centralized Config Server (Git backend)
- Luồng: Service → Config Server → Git Repository → Properties

PHẦN 2 – Service Discovery:
- Sơ đồ vấn đề: Service A không biết địa chỉ Service B
- Sơ đồ giải pháp: Eureka Server + Client-side discovery
- Luồng: Register → Heartbeat → Discover → Load Balance

========== NỘI DUNG AUDIO ==========
Ngôn ngữ: Tiếng Việt, đan xen thuật ngữ kỹ thuật tiếng Anh.
Hai host: Host A (giảng viên senior) + Host B (đặt câu hỏi như sinh viên).

Mở đầu: Host A đặt vấn đề – "Bạn có 10 microservice, mỗi cái chứa
database password trong file properties. Một ngày bạn phải đổi password
database – bạn sẽ làm gì? Sửa 10 file? Build lại 10 service? Deploy lại
10 lần?" → dẫn vào Config Server.

Nội dung chính (theo 4 lesson):
1. Spring Cloud tổng quan – bản đồ công cụ microservice
2. Centralized Configuration – Config Server với Git backend
3. Xây dựng Config Server – code thực tế, step by step
4. Service Registration & Discovery – Eureka Server và Client

So sánh bằng ẩn dụ xuyên suốt:
  Config Server = Phòng Nhân sự lưu hồ sơ tất cả nhân viên
  Service Registry = Danh bạ điện thoại công ty
  Service Discovery = Nhân viên lễ tân biết ai ngồi ở đâu

Kết thúc: 3 điểm cốt lõi cần nhớ + preview Session 04.
Thời lượng: 15–20 phút.
```

---

## 📖 Lesson 01 – Tổng quan về Spring Cloud trong Microservice

### 🎯 Mục tiêu bài học
- Hiểu Spring Cloud là gì và tại sao cần nó
- Nắm được bản đồ các module Spring Cloud
- Biết module nào giải quyết vấn đề gì
- Hiểu mối quan hệ giữa Spring Boot và Spring Cloud

---

### 1.1 Vấn đề trong hệ thống Microservice thực tế

Khi chuyển từ Monolithic sang Microservice, ta không chỉ chia nhỏ code – ta còn phải giải quyết hàng loạt **vấn đề phân tán (distributed systems problems)** mới xuất hiện:

[Prompt: An isometric illustration of microservices problem map.

A central microservices cluster is connected to 8 problem bubbles radiating outward. Each bubble has a clear icon and a bilingual label: "Hỗn loạn cấu hình (Configuration Chaos)" (gear with question marks), "Phát hiện dịch vụ (Service Discovery)" (magnifying glass with question marks), "Cân bằng tải (Load Balancing)" (scales icon), "Cổng API (API Gateway)" (door/gate icon), "Bộ ngắt mạch (Circuit Breaker)" (electrical switch icon), "Theo dấu phân tán (Distributed Tracing)" (chain links icon), "Ghi log tập trung (Centralized Logging)" (stack of papers icon), "Bảo mật (Security)" (padlock icon).

Corporate technology style,

clean line art,

neon blue and white accents,

soft holographic lighting,

ultra detailed,

8k resolution,

Light-colored background and oriented towards microservice technology, Java Spring boot.,

presentation slide illustration.

The language used in the images is Vietnamese, with only the technical terms retained in English.]

```
Các vấn đề cần giải quyết trong Microservice:

┌─────────────────────────────────────────────────────────────┐
│  Vấn đề                     │  Câu hỏi thực tế              │
├─────────────────────────────┼───────────────────────────────┤
│  Config Management          │  Ai giữ config cho 10 service?│
│  Service Discovery          │  Service A tìm B ở đâu?       │
│  Load Balancing             │  Phân phối request thế nào?   │
│  API Gateway                │  Client gọi vào điểm nào?     │
│  Circuit Breaker            │  B bị lỗi, A có sập không?    │
│  Distributed Tracing        │  Lỗi xảy ra ở service nào?    │
│  Centralized Logging        │  Log của 10 service ở đâu?    │
└─────────────────────────────┴───────────────────────────────┘
```

---

### 1.2 Spring Cloud là gì?

**Spring Cloud** là một tập hợp các **framework và thư viện** được xây dựng trên nền tảng Spring Boot, cung cấp các **pattern và tool** để giải quyết những vấn đề phổ biến trong kiến trúc Microservice phân tán.

> **Spring Cloud không phải là một thư viện đơn lẻ** – nó là một **umbrella project** bao gồm nhiều sub-project độc lập, mỗi cái giải quyết một vấn đề cụ thể.

[Prompt: An isometric illustration of Spring Cloud ecosystem map.

At the center is a "Spring Boot Application" represented as a 3D block. Around it, 8 Spring Cloud modules are arranged as hexagonal tiles: "Spring Cloud Config" (Cấu hình), "Spring Cloud Netflix Eureka" (Phát hiện dịch vụ), "Spring Cloud Gateway" (Cổng API), "Spring Cloud LoadBalancer" (Cân bằng tải), "Spring Cloud Circuit Breaker/Resilience4j" (Kháng lỗi), "Spring Cloud Sleuth/Zipkin" (Theo dấu cuộc gọi), "Spring Cloud Bus" (Truyền tin nhắn), and "Spring Cloud Security" (Bảo mật). Each tile has a clear icon and a short description in Vietnamese.

Corporate technology style,

clean line art,

neon blue and white accents,

soft holographic lighting,

ultra detailed,

8k resolution,

Light-colored background and oriented towards microservice technology, Java Spring boot.,

presentation slide illustration.

The language used in the images is Vietnamese, with only the technical terms retained in English.]

**Bản đồ Spring Cloud:**

| Module | Giải quyết vấn đề | Phiên bản phổ biến |
|---|---|---|
| **Spring Cloud Config** | Centralized Configuration | 4.x |
| **Spring Cloud Netflix Eureka** | Service Discovery & Registry | 4.x |
| **Spring Cloud Gateway** | API Gateway | 4.x |
| **Spring Cloud LoadBalancer** | Client-side Load Balancing | 4.x |
| **Spring Cloud Circuit Breaker** | Fault Tolerance (Resilience4j) | 3.x |
| **Spring Cloud Sleuth / Micrometer** | Distributed Tracing | 3.x |
| **Spring Cloud Bus** | Config Broadcast via Message Queue | 4.x |

---

### 1.3 Spring Boot vs Spring Cloud

| Tiêu chí | Spring Boot | Spring Cloud |
|---|---|---|
| **Mục đích** | Build một service duy nhất | Kết nối nhiều service với nhau |
| **Phạm vi** | Một ứng dụng | Hệ sinh thái microservice |
| **Dependency** | Độc lập | **Phụ thuộc vào Spring Boot** |
| **Configuration** | `application.properties` | `application.properties` + Config Server |
| **Ví dụ** | OrderService tự chạy | OrderService + Config + Discovery |

> **Mối quan hệ:** Spring Cloud luôn cần Spring Boot làm nền tảng. Không thể dùng Spring Cloud mà không có Spring Boot.

---

### 1.4 Version Compatibility – Điều bắt buộc phải nhớ!

> ⚠️ **Cảnh báo:** Spring Boot và Spring Cloud có **bảng tương thích phiên bản** riêng. Chọn sai version sẽ gây lỗi khó debug!

| Spring Boot | Spring Cloud | Release Train |
|---|---|---|
| 3.2.x | 2023.0.x (Leyton) | 2023.0 |
| 3.1.x | 2022.0.x (Kilburn) | 2022.0 |
| 3.0.x | 2022.0.x (Kilburn) | 2022.0 |
| 2.7.x | 2021.0.x (Jubilee) | 2021.0 |

**Cách khai báo đúng trong `build.gradle`:**

```groovy
// build.gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.5'
    id 'io.spring.dependency-management' version '1.1.4'
}

group = 'com.microservice'
version = '0.0.1-SNAPSHOT'

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

ext {
    set('springCloudVersion', "2023.0.1")
}

dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
    }
}
```

---

### 1.5 Roadmap học Spring Cloud theo thứ tự

```
[Móng nhà] Session 03-04: Cấu hình & Định danh dịch vụ (Config Server + Eureka Discovery)
     ↓
[Bổ sung] Session 04.1: Container hóa hạ tầng phát triển (Docker & Docker Compose)
     ↓
[Cổng vào] Session 05: Quản lý API Gateway & Load Balancing (Spring Cloud Gateway & LoadBalancer)
     ↓
[Giao tiếp] Session 06-07: Giao tiếp đồng bộ giữa các dịch vụ (FeignClient / RestTemplate)
     ↓
[Bảo mật] Session 07.1: Bảo mật hệ thống phân tán (Keycloak & Spring Security OAuth2/JWT)
     ↓
[Sự kiện] Session 10-11: Giao tiếp bất đồng bộ & Event-Driven (Spring WebFlux & Apache Kafka)
     ↓
[Kháng lỗi] Session 12-13: Chống lỗi dây chuyền & Kháng lỗi (Resilience4j Circuit Breaker)
     ↓
[Giao dịch] Session 14-15: Quản lý giao dịch phân tán (Saga Pattern - Choreography & Orchestrator)
     ↓
[Hiệu năng] Session 16-17: Tối ưu hiệu năng & Bộ nhớ đệm phân tán (Spring Cache + Redis)
```

---

### 🧪 Thực hành 1.1 – Phân tích vấn đề cần giải quyết

**Kịch bản:** Hệ thống e-commerce có 5 service:
- `user-service` (port 8081)
- `product-service` (port 8082)
- `order-service` (port 8083)
- `payment-service` (port 8084)
- `notification-service` (port 8085)

**Câu hỏi thảo luận:**
1. Mỗi service đang có `application.properties` riêng. Khi cần đổi database password, phải làm gì?
2. `order-service` cần gọi `payment-service`. Nếu payment service chuyển sang port 8086, order service có biết không?
3. Khi deploy 3 instance của `product-service` trên 3 server khác nhau, `order-service` gọi vào đâu?

---

### 🎬 NotebookLM – Prompt Video Lesson 01

```
========== STYLE PROMPT ==========
Phong cách hình ảnh: Mind map animation – các node xuất hiện và kết nối
dần dần. Spring Cloud ecosystem map hiển thị như một "galaxy" với
Spring Boot ở trung tâm, các module là các "hành tinh" xoay quanh.
Màu xanh lá Spring (#6DB33F) làm màu chủ đạo.
Lấy visual từ [Prompt] trong tài liệu:
- Sơ đồ 8 vấn đề trong Microservice (problem bubbles)
- Spring Cloud ecosystem map (hexagonal tiles xung quanh Spring Boot)

========== VIDEO FOCUS ==========
Render 2 hình ảnh chính:
1. Sơ đồ 8 vấn đề: problem bubbles màu đỏ/cam xung quanh microservice cluster
2. Spring Cloud ecosystem map: 8 module hexagonal tiles xung quanh Spring Boot
   Highlight lần lượt: Config (xanh lá) → Eureka (tím) → Gateway (xanh dương)
   vì đây là roadmap của session này.
Hiển thị bảng version compatibility khi nói đến cảnh báo.

========== NỘI DUNG AUDIO ==========
Thời lượng: 5–7 phút. Ngôn ngữ: Tiếng Việt.
Phong cách: Giảng viên giới thiệu bản đồ địa hình trước khi leo núi.

[00:00 – Hook vấn đề – 1 phút]
Host A: "Bạn vừa chia Monolithic thành 10 Microservice – xin chúc mừng bạn đã bước vào thế giới phân tán! Nhưng khoan đã, làm sao để cấu hình database cho cả 10 service này mà không bị rối?"
Host B: "Đúng vậy, mỗi lần đổi password database lại phải sửa 10 file properties rồi deploy lại thì thật là ác mộng!"
→ Visual: Sơ đồ 8 vấn đề trong Microservice.

[01:00 – Giới thiệu Spring Cloud – 1 phút]
Host A: "Đó là lý do Spring Cloud ra đời. Nó không phải là một framework đơn lẻ mà là một bộ công cụ, cung cấp giải pháp cho tất cả các vấn đề phân tán này."
→ Visual: Spring Cloud ecosystem map xuất hiện từng hexagon.

[02:00 – So sánh Spring Boot vs Spring Cloud – 1 phút]
Host A: "Spring Boot giúp bạn xây dựng từng service độc lập, còn Spring Cloud giúp kết nối chúng lại thành một hệ sinh thái hoạt động trơn tru."
Host B: "Giống như Spring Boot là đầu bếp giỏi tự làm một nhà hàng tốt, còn Spring Cloud là hệ thống quản lý chuỗi nhà hàng!"
→ Visual: Bảng so sánh Spring Boot vs Spring Cloud.

[03:00 – Cảnh báo tương thích phiên bản – 1.5 phút]
Host A: "Một lưu ý cực kỳ quan trọng: Spring Cloud và Spring Boot phải tương thích phiên bản. Đừng bao giờ chọn phiên bản bừa bãi!"
Host B: "Lỗi rookie phổ biến nhất là chọn sai phiên bản dẫn đến lỗi runtime."
→ Visual: Bảng tương thích phiên bản (Version Compatibility) và khai báo ext trong build.gradle.

[04:30 – Lộ trình học (Roadmap) – 0.5 phút]
Host A: "Hôm nay chúng ta sẽ đi qua 2 module nền tảng quan trọng nhất: Config Server và Service Discovery với Eureka Server."
Host B: "Đây là bước đầu tiên để xây dựng hệ thống Microservice hoàn chỉnh."
→ Visual: Roadmap timeline.
```

### 🖼️ Prompt Slide Chi Tiết – Lesson 01 (Google Slides)

> **Hướng dẫn sử dụng:**
> 1. **Sử dụng AI (Gemini Sidebar / MagicSlides / Plus AI)**: Copy đoạn text trong mục **"Prompt cho Google Slides AI"** và dán vào ô chat AI trong Google Slides để sinh bố cục thô.
> 2. **Thiết kế thủ công (Google Slides UI)**: Thực hiện theo các bước chi tiết trong mục **"Thiết kế thủ công (Google Slides UI)"** để tự tạo các element (TextBox, Shape, Color) một cách chuyên nghiệp nhất.

---

#### Slide 1: Title Slide – Tổng quan về Spring Cloud trong Microservice
* **Mục tiêu**: Giới thiệu tiêu đề bài học thứ nhất, thể hiện các biểu tượng đại diện cho các dịch vụ phân tán.
* **Prompt cho Google Slides AI**:
  > "Create a dark minimalist title slide for a technical presentation about 'Tổng quan về Spring Cloud trong Microservice'. Subtitle: 'Giải pháp cho hệ thống phân tán'. Use deep navy (#0F172A) as background. Include small flat white icons representing gears, search, route, lock, and electricity at the bottom. Use bold sans-serif font for the main title and clean white text."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank** (Trống).
  - **Màu nền (Background)**: Đặt màu nền Solid hoặc Gradient sang màu Deep Navy `#0F172A` (nhấp chuột phải vào Slide > *Change background* > *Color* > Chọn *Custom* và nhập `#0F172A`).
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Thêm Text Box ở giữa slide, font **Google Sans** hoặc **Arial Bold**, kích thước **44pt**, màu chữ trắng (`#FFFFFF`). Nội dung: *"Tổng quan về Spring Cloud trong Microservice"*.
    - **Tiêu đề phụ**: Thêm Text Box bên dưới, font **Google Sans** hoặc **Arial**, kích thước **18pt**, màu chữ xám nhạt (`#94A3B8`). Nội dung: *"Session 03 · Lesson 01 · Giải pháp cho hệ thống phân tán"*.
    - **Hàng biểu tượng**: Thêm một hàng gồm 5 icon/emoji cách nhau đều đặn ở phía dưới: `⚙️` (Config), `🔍` (Discovery), `🔀` (Gateway), `🛡️` (Security), `⚡` (Resilience) kích thước khoảng **32pt**.
    - **Chân trang (Bottom Footer)**: Text Box nhỏ ở chân trang, kích thước **12pt**, màu `#64748B`: *"Spring Boot 3.x · Spring Cloud 2023.0"*.
  - **Hiệu ứng chuyển động (Animation)**:
    - Slide transition: *Dissolve* (Hòa tan).
    - Hàng biểu tượng: Đặt hiệu ứng *Fade in* (Xuất hiện dần) từng icon từ trái qua phải khi click chuột.

---

#### Slide 2: Vấn Đề: Distributed Systems Problems
* **Mục tiêu**: Làm nổi bật các khó khăn khi quản lý hệ thống phân tán để dẫn dắt tới giải pháp.
* **Prompt cho Google Slides AI**:
  > "Create a light background slide with a central diagram. In the center, there is a blue rounded box labeled 'Microservice Cluster'. Connected to this center hub, display 8 orange/red circular nodes pointing outward. Label them with: 'Config Management', 'Service Discovery', 'Load Balancing', 'API Gateway', 'Circuit Breaker', 'Distributed Tracing', 'Centralized Logging', and 'Security'. Add title: 'Vấn đề trong hệ thống phân tán'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu trắng sạch `#FFFFFF` hoặc xám rất nhạt `#F8FAFC`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Text Box ở góc trên bên trái, kích thước **28pt**, font **Google Sans Bold**, màu tối `#1E293B`. Nội dung: *"Hệ thống Microservice Phân Tán mang lại những thách thức gì?"*.
    - **Khối trung tâm**: Vẽ một hình chữ nhật bo góc (Rounded Rectangle) ở chính giữa slide, tô màu xanh dương nhạt `#EFF6FF` với viền xanh `#2563EB`, text bên trong: *"Microservices Cluster"* (font Bold, 16pt, màu xanh `#1E40AF`).
    - **Các khối vệ tinh**: Vẽ 8 hình tròn nhỏ xung quanh, tô màu cam nhạt `#FEF3E2` với viền cam `#EA580C`. Mỗi hình tròn chứa text đại diện cho một vấn đề (ví dụ: *"Config Chaos"*, *"Service Discovery"*, *"API Gateway"*, v.v.). Vẽ đường mũi tên (Line connector) nối từ khối trung tâm ra các khối vệ tinh này.
  - **Hiệu ứng chuyển động (Animation)**: Khối trung tâm xuất hiện trước, sau đó các khối vệ tinh tự động xuất hiện dần (*Fade in*) theo vòng tròn.

---

#### Slide 3: Bản đồ hệ sinh thái Spring Cloud
* **Mục tiêu**: Trình bày tổng quan về các module cốt lõi của Spring Cloud và khoanh vùng nội dung buổi học hôm nay.
* **Prompt cho Google Slides AI**:
  > "Design a grid layout slide on a light gray background (#F8FAFC). Center box is 'Spring Boot App'. Arrange 8 colorful hexagons/cards around it representing Spring Cloud modules. Green for 'Config Server', purple for 'Netflix Eureka', blue for 'API Gateway'. Highlight the Config Server and Netflix Eureka cards with a glowing border and a callout label 'Học Hôm Nay'. Slide Title: 'Bản đồ hệ sinh thái Spring Cloud'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu xám nhạt `#F8FAFC`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Text Box góc trên bên trái, cỡ chữ **28pt Bold**, màu `#1E293B`: *"Bản đồ Hệ Sinh Thái Spring Cloud"*.
    - **Khối Spring Boot**: Vẽ hình chữ nhật bo góc lớn ở tâm, màu xám `#E2E8F0`, text: *"Spring Boot Core Application"*.
    - **8 hexagon/card xung quanh**: Vẽ 8 ô vuông/bo góc nhỏ hơn xếp xung quanh khối tâm, tô các màu khác nhau tương ứng với mô tả:
      - Ô màu xanh lá cây (`#16A34A`): *"Spring Cloud Config Server"* (nổi bật, nét viền dày hơn).
      - Ô màu tím nhạt (`#7C3AED`): *"Spring Cloud Netflix Eureka"* (nổi bật, nét viền dày hơn).
      - Các ô khác (Gateway, LoadBalancer, Circuit Breaker, v.v.) tô màu xám nhạt `#F1F5F9` với chữ xám để tạo độ tương phản phụ.
    - **Mũi tên/Callout**: Vẽ một shape mũi tên cong chỉ vào ô Config Server và Eureka Server kèm text box chữ đỏ: *"Trọng tâm Session 03"* (14pt Bold).
  - **Hiệu ứng chuyển động (Animation)**: Khi trình chiếu, các ô phụ mờ hơn xuất hiện trước, sau đó ô xanh lá và ô tím (Config & Eureka) sẽ phóng to nhẹ hoặc có hiệu ứng bay vào (*Fly in*) cùng mũi tên để thu hút ánh nhìn.

---

#### Slide 4: Spring Boot vs Spring Cloud
* **Mục tiêu**: So sánh rõ ràng nhiệm vụ của 2 công nghệ để tránh hiểu lầm.
* **Prompt cho Google Slides AI**:
  > "Create a slide with a two-column comparison layout. Left column has a blue tint background and is titled 'Spring Boot', containing points: purpose (build single service), scope (one app), metaphor (cook operating a single restaurant). Right column has a green tint background and is titled 'Spring Cloud', containing points: purpose (connect services), scope (microservice ecosystem), metaphor (headquarters managing a chain). Title: 'Spring Boot vs Spring Cloud'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Title and two columns** (Tiêu đề và hai cột).
  - **Màu nền**: Màu trắng tinh `#FFFFFF`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu `#1E293B`: *"Phân biệt Spring Boot & Spring Cloud"*.
    - **Cột Trái (Spring Boot)**: Vẽ một hình chữ nhật lớn làm nền cột, tô màu xanh dương rất nhạt `#EFF6FF`, không viền.
      - Header cột: *"🟦 Spring Boot"* (20pt Bold, màu `#1E40AF`).
      - Nội dung: Dùng các gạch đầu dòng bullet point rõ ràng: *"Xây dựng một service đơn lẻ"*, *"Phạm vi trong 1 ứng dụng"*, *"Ví dụ: OrderService chạy độc lập"*, *"Ẩn dụ: 👨‍🍳 Đầu bếp giỏi tự vận hành 1 nhà hàng"*.
    - **Cột Phải (Spring Cloud)**: Vẽ một hình chữ nhật nền cột, tô màu xanh lá rất nhạt `#F0FDF4`, không viền.
      - Header cột: *"🟢 Spring Cloud"* (20pt Bold, màu `#15803D`).
      - Nội dung: *"Kết nối và quản lý các service"*, *"Phạm vi toàn hệ thống phân tán"*, *"Ví dụ: Kết nối OrderService với Config & Eureka"*, *"Ẩn dụ: 🏢 Hệ thống quản lý chuỗi nhà hàng"*.
  - **Hiệu ứng chuyển động (Animation)**: Cột trái trượt vào từ bên trái, sau đó cột phải trượt vào từ bên phải (*Fly in from left / right*).

---

#### Slide 5: Version Compatibility – Cảnh Báo Quan Trọng
* **Mục tiêu**: Cảnh báo lỗi thường gặp nhất khi tích hợp Spring Cloud do sai lệch phiên bản.
* **Prompt cho Google Slides AI**:
  > "Design a warning slide with a soft yellow/amber background (#FFFBEB). Place a prominent red warning sign with text 'LỖI ROOKIE PHỔ BIẾN NHẤT: Chọn sai phiên bản'. Display a table comparing Spring Boot versions (3.2.x, 3.1.x, 2.7.x) with corresponding Spring Cloud versions (2023.0.x Leyton, 2022.0.x Kilburn, 2021.0.x Jubilee). Include a small code block showing gradle variable 'springCloudVersion'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu vàng cam nhạt `#FFFBEB`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu đỏ gạch `#991B1B`: *"⚠️ Cảnh báo tương thích phiên bản (Version Compatibility)"*.
    - **Bảng so sánh (Table)**: Chèn bảng gồm 3 cột x 4 dòng:
      - Header: *Môi trường / Spring Boot / Spring Cloud (Release Train)* - Màu nền Header `#F59E0B`.
      - Dòng 1: *Hiện tại / 3.2.x / 2023.0.x (Leyton)* - highlight màu xanh lá nhạt cho dòng này.
      - Dòng 2: *Ổn định / 3.1.x / 2022.0.x (Kilburn)*.
      - Dòng 3: *Cũ / 2.7.x / 2021.0.x (Jubilee)* - chữ màu xám đỏ nhạt.
    - **Khối Code / Tip Box**: Vẽ một box nhỏ màu tối `#1E293B` bên cạnh bảng để minh họa khối `ext` trong `build.gradle` chứa `set('springCloudVersion', "2023.0.1")` với chữ màu xanh lá sáng (`#4ADE80`).
  - **Hiệu ứng chuyển động (Animation)**: Banner tiêu đề nhấp nháy hoặc xuất hiện trước, bảng và khối code xuất hiện đồng thời ngay sau đó.

---

#### Slide 6: Lộ trình học Spring Cloud (Roadmap)
* **Mục tiêu**: Giúp học viên định vị vị trí bài học hiện tại trong bức tranh tổng thể của microservices.
* **Prompt cho Google Slides AI**:
  > "Create a vertical timeline roadmap slide on a dark background (#0F172A). Show 6 steps from top to bottom. Highlight step 1 'Session 03: Config & Discovery' in bright green color and make it stand out with a glow effect. The other steps (Gateway, Service Communication, Circuit Breaker, Tracing, Security) are grayed out. Slide Title: 'Roadmap học Spring Cloud'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu tối `#0F172A`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu trắng `#FFFFFF`: *"Lộ trình học Spring Cloud trong chuỗi Microservices"*.
    - **Trục thời gian**: Vẽ một đường thẳng dọc ở giữa slide từ trên xuống dưới, màu xám nhạt.
    - **6 Điểm mốc (Nodes)**:
      - Mốc 1 (Hiện tại): *"Session 03: Config Server & Service Discovery"* - vẽ vòng tròn lớn màu xanh lá `#22C55E` với hiệu ứng viền bóng sáng, chữ to rõ nét.
      - Mốc 2-6 (Tương lai): Các vòng tròn nhỏ màu xám `#475569`, chữ xám nhạt: *"Session 04: API Gateway"*, *"Session 05: Service Communication"*, v.v.
    - **Hộp chú thích (Callout)**: Đặt một hộp chữ nhật nhỏ kế bên Session 03: *"Nền tảng quan trọng nhất của mọi Session sau!"* (màu nền đen xám `#1E293B`, chữ màu xanh lá `#86EFAC`).
  - **Hiệu ứng chuyển động (Animation)**: Đường thẳng dọc chạy từ trên xuống, tiếp theo các mốc lần lượt hiện ra, mốc Session 03 sẽ có hiệu ứng phóng to nhẹ kèm theo hộp chú thích xuất hiện sau cùng.

---




---
## 📖 Lesson 02 – Giới thiệu về Centralized Configuration

### 🎯 Mục tiêu bài học
- Hiểu vấn đề của việc quản lý config phân tán
- Biết Centralized Configuration là gì và lợi ích
- Nắm được kiến trúc của Spring Cloud Config
- Phân biệt Git backend vs Local backend


### 2.1 Vấn đề: Config Chaos trong Microservice

Hãy hình dung một hệ thống 10 microservice, mỗi service có file `application.properties` riêng:

[Prompt: An isometric illustration of configuration chaos in microservices.

Show 10 microservice blocks (User, Product, Order, Payment, Inventory, Notification, Search, Analytics, Gateway, Auth Service), each containing a small "application.properties" file icon. Red arrows indicate problems originating from a top-level event "Thay đổi mật khẩu Database (Database password changed)". This causes red warning icons to appear on all 10 services. A developer icon frantically runs between the services. Text overlays in Vietnamese: "Đổi 1 config = Cập nhật 10 file", "Deploy 10 lần", "Rủi ro: Bỏ sót service".

Corporate technology style,

clean line art,

neon blue and white accents,

soft holographic lighting,

ultra detailed,

8k resolution,

Light-colored background and oriented towards microservice technology, Java Spring boot.,

presentation slide illustration.

The language used in the images is Vietnamese, with only the technical terms retained in English.]

Tình huống thực tế – "Config Nightmare":

```
Hệ thống có 10 microservice, mỗi service có file properties:
┌─────────────────────────────────────────────────────────┐
│  user-service/application.properties                    │
│    spring.datasource.password=oldPassword123            │
├─────────────────────────────────────────────────────────┤
│  order-service/application.properties                   │
│    spring.datasource.password=oldPassword123            │
├─────────────────────────────────────────────────────────┤
│  payment-service/application.properties                 │
│    spring.datasource.password=oldPassword123            │
│  ... (7 service khác tương tự) ...                      │
└─────────────────────────────────────────────────────────┘

Kịch bản: DBA yêu cầu đổi database password vì lý do bảo mật.
→ Phải sửa 10 file
→ Build lại 10 service
→ Deploy lại 10 lần
→ Nguy cơ bỏ sót một service → service đó bị down!
```

**5 vấn đề của Config phân tán:**

| Vấn đề | Giải thích |
|---|---|
| **Config Drift** | Mỗi service có config khác nhau, không đồng nhất |
| **Security Risk** | Password lưu trong code → lộ khi push lên Git |
| **No Audit Trail** | Không biết ai đã đổi config gì, lúc nào |
| **Slow Propagation** | Đổi config phải restart từng service |
| **Environment Mess** | Dev/Staging/Prod có config riêng, dễ nhầm |

---

### 2.2 Giải pháp: Centralized Configuration

**Centralized Configuration** là mô hình trong đó **tất cả config của tất cả service** được lưu trữ tập trung tại **một nơi duy nhất** (Config Server), và các service tự động lấy config từ đó khi khởi động.

[Prompt: An isometric illustration of centralized configuration architecture.

On the left, a Git Repository icon containing the folder structure: "config-repo/", "user-service.properties", "order-service.properties", "payment-service.properties", and "application.properties". In the center is a green "Spring Cloud Config Server" block with a lock icon. On the right, 4 microservice blocks (User Service, Order Service, Payment Service, Notification Service) connect to the Config Server with request arrows labeled "GET /user-service/default". Illustrate the refresh flow: developer pushes changes to Git -> Config Server pulls updates -> services refresh config.

Corporate technology style,

clean line art,

neon blue and white accents,

soft holographic lighting,

ultra detailed,

8k resolution,

Light-colored background and oriented towards microservice technology, Java Spring boot.,

presentation slide illustration.

The language used in the images is Vietnamese, with only the technical terms retained in English.]

**Luồng hoạt động:**

```
1. Developer viết config → push lên Git Repository
2. Config Server kết nối Git → đọc config file
3. Service khởi động → gọi HTTP đến Config Server
4. Config Server trả về config phù hợp
5. Service load config vào Spring Environment

GET http://config-server:8888/{service-name}/{profile}
→ Response: JSON chứa properties của service đó
```

---

### 2.3 Lợi ích của Centralized Config

[Prompt: An isometric illustration of benefits comparison infographic split into two columns.

Left column is labeled "Trước đây (Config Chaos)" in red: tệp tin rải rác, cập nhật thủ công, không có versioning, rủi ro bảo mật, thay đổi chậm chạp. Right column is labeled "Sau này (Config Server)" in green: nguồn thông tin duy nhất (single source of truth), cập nhật tự động, quản lý phiên bản qua Git, quản lý secret bảo mật, lan truyền tức thì. Each benefit has a clear icon.

Corporate technology style,

clean line art,

neon blue and white accents,

soft holographic lighting,

ultra detailed,

8k resolution,

Light-colored background and oriented towards microservice technology, Java Spring boot.,

presentation slide illustration.

The language used in the images is Vietnamese, with only the technical terms retained in English.]

| Lợi ích | Chi tiết |
|---|---|
| **Single Source of Truth** | Tất cả config ở một chỗ, dễ quản lý |
| **Version Control** | Config lưu trên Git → có lịch sử, rollback được |
| **Environment Profiles** | Dev/Staging/Prod tự động nhận đúng config |
| **Dynamic Refresh** | Có thể refresh config không cần restart service |
| **Security** | Tích hợp Vault để mã hóa secret |
| **Audit Trail** | Git commit history là log thay đổi config |

---

### 2.4 Git Backend vs Local Backend

Spring Cloud Config Server hỗ trợ nhiều **backend** (nơi lưu config):

#### Git Backend (Recommended cho Production)

```properties
# config-server/application.properties
spring.cloud.config.server.git.uri=https://github.com/your-org/microservice-config
spring.cloud.config.server.git.default-label=main
spring.cloud.config.server.git.search-paths={application}
spring.cloud.config.server.git.clone-on-start=true
# Nếu repo private:
spring.cloud.config.server.git.username=${GIT_USERNAME}
spring.cloud.config.server.git.password=${GIT_PASSWORD}
```

**Cấu trúc Git Repository:**

```
microservice-config/              ← Git Repository
├── application.properties               ← Config CHUNG cho tất cả service
├── user-service.properties              ← Config riêng cho user-service
├── user-service-dev.properties          ← Config user-service trong môi trường dev
├── user-service-prod.properties         ← Config user-service trong môi trường prod
├── order-service.properties
├── order-service-dev.properties
├── order-service-prod.properties
├── payment-service.properties
└── gateway-service.properties
```

#### Local/Native Backend (Dùng cho Development)

```properties
# config-server/application.properties (local backend)
spring.profiles.active=native
spring.cloud.config.server.native.search-locations=classpath:/config,file:///C:/config
```

**So sánh hai backend:**

| Tiêu chí | Git Backend | Local Backend |
|---|---|---|
| **Môi trường** | Staging / Production | Development / Testing |
| **Version Control** | ✅ Git history | ❌ Không có |
| **Collaboration** | ✅ Team cùng push/pull | ❌ Chỉ local |
| **Audit Trail** | ✅ Git commits | ❌ Không có |
| **Dynamic Refresh** | ✅ Dễ dàng | ⚠️ Cần restart thủ công |
| **Setup** | Cần Git repo | Đơn giản, ngay trong project |
| **Khuyến nghị** | Production | Dev, Demo, học |

---

### 2.5 Config Priority – Thứ tự ưu tiên config

Khi service tên `user-service` chạy với profile `dev`, Config Server tìm và merge theo thứ tự:

```
Thứ tự ưu tiên (cao → thấp):
1. user-service-dev.properties       (service-specific + profile-specific)
2. user-service.properties           (service-specific)
3. application-dev.yml        (shared + profile-specific)
4. application.properties            (shared cho tất cả service)

→ Property ở level cao hơn ghi đè level thấp hơn
```

**Ví dụ thực tế:**

```properties
# application.properties (shared)
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
logging.level.root=INFO

# user-service.properties (override shared)
spring.datasource.url=jdbc:mysql://user-db:3306/userdb
spring.datasource.username=user_svc

# user-service-dev.properties (override cả hai)
spring.datasource.url=jdbc:mysql://localhost:3306/userdb_dev
spring.datasource.password=dev_password_123
logging.level.com.user=DEBUG
```

---

### 🧪 Thực hành 2.1 – Thiết kế cấu trúc Config Repository

**Bài tập:** Thiết kế Git repository cho hệ thống gồm:
- `api-gateway`, `user-service`, `product-service`, `order-service`, `payment-service`
- 3 môi trường: `dev`, `staging`, `prod`

**Yêu cầu:**
1. Vẽ cấu trúc thư mục của config repository
2. Liệt kê những config nào nên đặt vào `application.properties` (shared)
3. Liệt kê những config nào nên đặt vào file riêng từng service
4. Những thông tin nhạy cảm nào **KHÔNG** được đưa vào Git?

---

### 🎬 NotebookLM – Prompt Video Lesson 02

```
========== STYLE PROMPT ==========
Phong cách hình ảnh: Problem → Solution visualization.
Giai đoạn 1 (vấn đề): màu đỏ/cam, layout hỗn loạn, developer
đang chạy loạn giữa các service.
Giai đoạn 2 (giải pháp): màu xanh lá, layout ngăn nắp, mũi tên
rõ ràng từ Config Server ra các service.
Lấy visual từ [Prompt] trong tài liệu:
- Sơ đồ Config Chaos (10 services, red warning signs)
- Sơ đồ Centralized Config (Git → Config Server → Services)
- Infographic Before/After so sánh 2 column

========== VIDEO FOCUS ==========
Render 3 hình ảnh chính theo thứ tự:
1. [00:30] CONFIG CHAOS: 10 service boxes mỗi cái có file .properties,
   developer chạy loạn, red warning icons khi "DB password changed"
2. [02:00] CENTRALIZED CONFIG: Git repo → Config Server → 4 services
   Mũi tên "GET /user-service/default" labeled rõ ràng
3. [04:00] BEFORE/AFTER infographic: hai column so sánh lợi ích
Hiển thị code block cấu trúc Git repo khi nói đến Git Backend.

========== NỘI DUNG AUDIO ==========
Thời lượng: 5–7 phút. Phong cách: Storytelling với tình huống thực tế.
Host A: Kỹ sư đã từng đau khổ vì config chaos.
Host B: Developer mới tiếp cận microservice.

[00:00 – Câu chuyện "đêm trước launch" – 1 phút]
Host A: "Kể bạn nghe một câu chuyện thật. Ngày hôm qua hệ thống sắp launch,
DBA phát hiện database password bị leak. Anh ta yêu cầu đổi ngay.
Chúng tôi có 12 microservice. Mất 2 tiếng để sửa đủ 12 file,
build lại, deploy lại. Và vẫn bị miss 1 service. Nó bị down lúc 2 giờ sáng."
→ Visual: Config Chaos diagram xuất hiện.

[01:00 – Phân tích 5 vấn đề – 1,5 phút]
Host B: "Đó là 5 vấn đề của config phân tán. Giải pháp là gì?"
→ Visual: Bảng 5 vấn đề xuất hiện từng dòng.

[02:30 – Giới thiệu Config Server – 2 phút]
Host A: "Hãy tưởng tượng Config Server như phòng Nhân sự lưu hồ sơ
tất cả nhân viên. Khi nhân viên (service) cần thông tin gì, họ đến
phòng Nhân sự hỏi. Nhân sự (Config Server) sẽ tra Git repository và
trả về đúng thông tin cho đúng người."
→ Visual: Centralized Config diagram xuất hiện dần.

[04:30 – Git Backend vs Local Backend – 1 phút]
So sánh nhanh hai backend. Nhấn mạnh:
"Dev dùng local cho tiện. Production PHẢI dùng Git."
→ Visual: Bảng so sánh hai backend.

[05:30 – Config Priority – 30s]
"Ai ghi đè ai? service-dev > service > application-dev > application."
→ Visual: Stack diagram thứ tự ưu tiên.
```

---

### 🖼️ Prompt Slide Chi Tiết – Lesson 02 (Google Slides)

> **Hướng dẫn sử dụng:**
> 1. **Sử dụng AI (Gemini Sidebar / MagicSlides / Plus AI)**: Copy đoạn text trong mục **"Prompt cho Google Slides AI"** và dán vào ô chat AI trong Google Slides để sinh bố cục thô.
> 2. **Thiết kế thủ công (Google Slides UI)**: Thực hiện theo các bước chi tiết trong mục **"Thiết kế thủ công (Google Slides UI)"** để tự tạo các element (TextBox, Shape, Color) một cách chuyên nghiệp nhất.

---

#### Slide 1: Title Slide – Giới thiệu về Centralized Configuration
* **Mục tiêu**: Giới thiệu tiêu đề bài học thứ hai, làm nổi bật hai mảng màu biểu trưng cho "Vấn đề" và "Giải pháp".
* **Prompt cho Google Slides AI**:
  > "Design a split title slide. Left side is dark red (#7F1D1D) with a large icon of messy folders and a question mark. Right side is white with title text: 'Centralized Configuration'. Subtitle: 'Giới thiệu & Kiến trúc quản lý cấu hình tập trung'. Use clean typography, and include hashtags '#ConfigServer #SpringCloud #GitBackend' at the bottom right."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Bố cục & Đối tượng**:
    - **Nền chia đôi (Split Background)**: Vẽ một hình chữ nhật lớn che phủ nửa bên trái của slide, tô màu đỏ đô `#7F1D1D`. Nửa bên phải giữ nguyên nền trắng `#FFFFFF`.
    - **Phần bên trái (Đỏ)**: Chèn một icon lớn hoặc biểu tượng các tệp tin xếp lộn xộn `📂❓` màu trắng ở giữa (cỡ chữ khoảng **72pt**).
    - **Phần bên phải (Trắng)**:
      - Tiêu đề chính: Text Box cỡ chữ **36pt Bold**, font **Google Sans**, màu tối `#1E293B`. Nội dung: *"Centralized Configuration"*.
      - Tiêu đề phụ: Text Box cỡ chữ **18pt**, màu xám `#64748B`. Nội dung: *"Giới thiệu & Kiến trúc quản lý cấu hình tập trung"*.
      - Chân trang: Text Box chứa hashtag `#ConfigServer  #SpringCloud  #GitBackend` (14pt, màu đỏ gạch `#B91C1C`).
  - **Hiệu ứng chuyển động (Animation)**: Nửa màu đỏ trượt vào từ bên trái, sau đó các hộp chữ bên phải lần lượt hiện ra từ trên xuống dưới.

---

#### Slide 2: Cơn Ác Mộng Cấu Hình (Config Nightmare Scenario)
* **Mục tiêu**: Vẽ ra bức tranh hỗn loạn thực tế khi microservice tăng lên và không có Config Server.
* **Prompt cho Google Slides AI**:
  > "Create a chaotic, light red (#FEF2F2) background slide titled 'Cơn ác mộng cấu hình'. Scatter 10 small gray rectangles representing microservices (User, Product, Order, etc.), each containing a file icon 'application.properties' and a red warning badge. Place three red banners with text: 'Sửa 10 file cùng lúc', 'Deploy 10 times', 'Nguy cơ quên và sập hệ thống'. Show a scared developer icon in the center."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu đỏ hồng nhạt `#FEF2F2`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu đỏ đậm `#991B1B`: *"Cơn ác mộng cấu hình thực tế (Config Nightmare)"*.
    - **10 Khối Dịch vụ (Microservices)**: Vẽ 10 hình chữ nhật bo góc nhỏ, tô màu xám nhạt `#E2E8F0` viền xám đậm. Đặt tên lần lượt: *User, Product, Order, Payment, Inventory, Notification, Search, Analytics, Gateway, Auth*. Hãy xếp chúng lộn xộn, hơi nghiêng góc để tạo cảm giác hỗn loạn. Trên mỗi khối vẽ một vòng tròn nhỏ màu đỏ (`#EF4444`) chứa dấu chấm than trắng làm cảnh báo.
    - **3 Banner cảnh báo**: Vẽ 3 hình chữ nhật dài màu đỏ đậm `#DC2626` chứa chữ trắng Bold 14pt đặt ở chân slide:
      - Banner 1: *"❌ Sửa 10 file khi đổi Database Password"*
      - Banner 2: *"❌ Build & Deploy lại 10 lần"*
      - Banner 3: *"❌ Nguy cơ bỏ sót → Sập hệ thống lúc nửa đêm"*
  - **Hiệu ứng chuyển động (Animation)**: Các khối dịch vụ xuất hiện ngẫu nhiên bằng hiệu ứng *Appear*, sau đó các banner màu đỏ trượt nhanh lên từ dưới đáy slide.

---

#### Slide 3: 5 Vấn Đề của Config Phân Tán
* **Mục tiêu**: Hệ thống hóa 5 thách thức kỹ thuật lớn nhất để thuyết phục người học về tầm quan trọng của bài học.
* **Prompt cho Google Slides AI**:
  > "Design a clean white slide with a red left accent border. Title: '5 Vấn Đề của Config Phân Tán'. Create a vertical stack of 5 numbered rectangular cards. Each card has a clean icon and subtitle: 1. Config Drift, 2. Security Risk, 3. No Audit Trail, 4. Slow Propagation, 5. Environment Mess. Keep typography clean and readable."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu trắng `#FFFFFF`. Vẽ một đường sọc đứng màu đỏ rộng 0.5cm sát mép trái slide làm điểm nhấn.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu tối `#1E293B`: *"5 Vấn đề nghiêm trọng của Config phân tán"*.
    - **5 Thẻ nội dung (Cards)**: Vẽ 5 hình chữ nhật dẹt nằm ngang xếp chồng từ trên xuống dưới, màu nền `#F8FAFC`, viền nhạt.
      - **Thẻ 1**: `🌊` **Config Drift** – *Config giữa các môi trường bị sai lệch, không đồng bộ.*
      - **Thẻ 2**: `🔓` **Security Risk** – *Lộ thông tin nhạy cảm (password, key) khi push lên Git.*
      - **Thẻ 3**: `👻` **No Audit Trail** – *Không lưu vết được ai đã sửa config gì và sửa lúc nào.*
      - **Thẻ 4**: `🐢` **Slow Propagation** – *Mỗi lần cập nhật config đều phải restart ứng dụng.*
      - **Thẻ 5**: `🌀` **Environment Mess** – *Dev/Staging/Prod dễ dùng nhầm config.*
  - **Hiệu ứng chuyển động (Animation)**: Các thẻ lần lượt trượt vào từ bên phải (*Fly in from right*), cách nhau 0.15 giây.

---

#### Slide 4: Giải Pháp: Centralized Configuration
* **Mục tiêu**: Giải thích kiến trúc và luồng dữ liệu của Config Server một cách trực quan.
* **Prompt cho Google Slides AI**:
  > "Create a green-themed technical architecture diagram slide. On the left: a Git Repository folder icon containing configuration files. In the center: a green box representing 'Spring Cloud Config Server (:8888)'. On the right: 4 blue boxes representing microservices (User, Order, Payment, Notification). Draw arrows with labels show the request flow from right to left, and files read from left to center. Title: 'Giải Pháp: Centralized Configuration'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu trắng tinh `#FFFFFF`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu `#15803D`: *"Kiến trúc Centralized Configuration"*
    - **Phía bên trái**: Vẽ hình folder lớn màu vàng nhạt đại diện cho **Git Repository**, bên trong vẽ danh sách file giả lập: `application.properties`, `user-service.properties`, v.v.
    - **Chính giữa**: Vẽ một hình chữ nhật lớn màu xanh lá `#22C55E`, chữ trắng Bold: *"Spring Cloud Config Server (Port 8888)"*. Vẽ mũi tên hai chiều nét đứt nối với Git Repo.
    - **Phía bên phải**: Vẽ 4 hình chữ nhật nhỏ màu xanh dương `#3B82F6` xếp dọc đại diện cho 4 Client Microservices (*User Service, Order Service, v.v.*). Vẽ các đường mũi tên một chiều chỉ từ Client về Config Server, ghi nhãn trên mũi tên: *"GET /user-service/dev"*.
  - **Hiệu ứng chuyển động (Animation)**: Vẽ sơ đồ tĩnh xuất hiện trước, sau đó các đường mũi tên luồng dữ liệu nhấp nháy hoặc trượt chạy từ phải qua trái.

---

#### Slide 5: Lợi Ích: Trước và Sau khi dùng Config Server
* **Mục tiêu**: So sánh trực quan lợi thế tuyệt đối khi chuyển sang mô hình quản lý tập trung.
* **Prompt cho Google Slides AI**:
  > "Design a split comparison slide. Left column has a red background (#FEF2F2) titled 'Trước (Config Chaos)' with red X marks. Right column has a green background (#F0FDF4) titled 'Sau (Config Server)' with green checkmarks. Use clean tables/lists to compare elements like version control, security, and update speed. Title: 'Lợi ích của Centralized Config'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Title and two columns**.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu tối `#1E293B`: *"Trước vs Sau khi áp dụng Config Server"*.
    - **Cột Trái (Đỏ - Trước)**: Hộp nền màu đỏ nhạt `#FEF2F2`.
      - Tiêu đề phụ: *"❌ TRƯỚC (Config Chaos)"* (màu đỏ `#B91C1C`).
      - Nội dung: Bullet points kèm dấu X đỏ: *"File rải rác"*, *"Cập nhật thủ công"*, *"Không có lịch sử"*, *"Lộ password trên Git"*, *"Phải restart khi đổi config"*.
    - **Cột Phải (Xanh lá - Sau)**: Hộp nền màu xanh lá nhạt `#F0FDF4`.
      - Tiêu đề phụ: *"✅ SAU (Config Server)"* (màu xanh lá `#15803D`).
      - Nội dung: Bullet points kèm dấu check xanh: *"Một nơi lưu trữ duy nhất"*, *"Tự động cập nhật không cần restart"*, *"Quản lý lịch sử qua Git"*, *"Mã hóa mật khẩu bảo mật"*, *"Phân chia môi trường rõ ràng"*.
  - **Hiệu ứng chuyển động (Animation)**: Cột trái xuất hiện trước, sau đó cột phải trượt kế bên với hiệu ứng nổi bật hơn.

---

#### Slide 6: So sánh Git Backend vs Local Backend
* **Mục tiêu**: Giúp học viên lựa chọn Backend lưu trữ cấu hình phù hợp cho từng môi trường (Dev vs Prod).
* **Prompt cho Google Slides AI**:
  > "Design a clean tabular slide on light gray background. Title: 'Chọn Backend phù hợp: Git vs Local'. Show a comparison table with columns: Criteria, Git Backend, Local/Native Backend. Highlight the row comparing environments showing Git is for Production and Local is for Development. Include a note card at the bottom with text 'Dev -> Local, Prod -> Git'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu xám nhạt `#F8FAFC`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu tối `#1E293B`: *"Git Backend vs Local/Native Backend"*.
    - **Bảng so sánh (Table)**: Tạo bảng 3 cột x 6 dòng:
      - Header: *Tiêu chí / Git Backend / Local/Native Backend* - Nền header màu xám đậm `#334155`, chữ trắng.
      - Dòng 1: *Môi trường / Production ✅ / Development ⚠️*.
      - Dòng 2: *Lịch sử thay đổi / Có (Git commits) ✅ / Không ❌*.
      - Dòng 3: *Làm việc nhóm / Tốt (Push/Pull) ✅ / Không (Local file) ❌*.
      - Dòng 4: *Cấu hình / Phức tạp hơn / Rất đơn giản ✅*.
    - **Hộp ghi chú (Rule Box)**: Vẽ một hình chữ nhật nhỏ màu vàng nhạt `#FEF3C7` ở đáy slide, text: *"💡 Khuyến nghị: Dùng Local Backend khi học và chạy thử máy cá nhân (Dev); Bắt buộc dùng Git Backend cho môi trường thực tế (Production)."*
  - **Hiệu ứng chuyển động (Animation)**: Bảng xuất hiện trước, hộp ghi chú xuất hiện sau cùng với hiệu ứng nhấp nháy hoặc phóng to nhẹ.

---

#### Slide 7: Thứ Tự Ưu Tiên Cấu Hỏi / Thuộc Tính (Config Priority)
* **Mục tiêu**: Giải thích quy tắc ghi đè cấu hình khi merge file từ nhiều nguồn khác nhau.
* **Prompt cho Google Slides AI**:
  > "Create a slide explaining config priority. Draw a pyramid or stacked block layers with 4 levels. Top layer (highest priority, deepest color) is 'user-service-dev.properties'. Level 2 is 'user-service.properties'. Level 3 is 'application-dev.yml'. Bottom layer (lowest priority, lightest color) is 'application.properties'. Add a side arrow indicating 'Increasing Priority'. Title: 'Thứ tự ưu tiên đè Config'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu trắng tinh `#FFFFFF`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu tối `#1E293B`: *"Thứ tự ưu tiên nạp cấu hình (Config Priority)"*.
    - **Khối Kim Tự Tháp/Xếp Chồng**: Vẽ 4 hình thang/chữ nhật xếp chồng từ dưới lên trên:
      - Tầng 1 (Đáy - Màu xanh lá nhạt `#DCFCE7`): *"4. application.properties (Chung cho tất cả service)"* - Ưu tiên thấp nhất.
      - Tầng 2 (Màu xanh lá `#86EFAC`): *"3. application-dev.yml (Chung theo môi trường)"*.
      - Tầng 3 (Màu xanh lá `#4ADE80`): *"2. user-service.properties (Riêng theo tên service)"*.
      - Tầng 4 (Đỉnh - Màu xanh lá đậm `#16A34A`): *"1. user-service-dev.properties (Riêng theo service và môi trường)"* - Ưu tiên cao nhất.
    - **Mũi tên chỉ dẫn**: Vẽ một mũi tên đỏ lớn bên phải hướng từ dưới lên trên kèm text: *"Mức độ ưu tiên tăng dần (Ghi đè thuộc tính trùng tên)"*.
    - **Hộp ví dụ (Callout)**: Thêm một Text Box nhỏ ở góc phải giải thích ví dụ: *"Ví dụ: Thuộc tính logging ở file user-service-dev.properties sẽ ghi đè thuộc tính logging ở file application.properties."*
  - **Hiệu ứng chuyển động (Animation)**: Các tầng xếp chồng xuất hiện lần lượt từ dưới lên trên kèm hiệu ứng nhẹ.

---

## 📖 Lesson 03 – Xây dựng Config Server trong Microservice

### 🎯 Mục tiêu bài học
- Tạo được Spring Cloud Config Server từ đầu
- Cấu hình Git/Local backend
- Tạo config repository với đúng cấu trúc
- Kết nối service client vào Config Server
- Kiểm tra dynamic refresh với `@RefreshScope`

---

### 3.1 Tạo Config Server Project

#### Bước 1: Khởi tạo project (Spring Initializr)

```
Project: Gradle - Groovy
Language: Java 17
Spring Boot: 3.2.5
Group: com.microservice
Artifact: config-server
Dependencies:
  ✅ Config Server (spring-cloud-config-server)
  ✅ Actuator (spring-boot-actuator)
```

**Hoặc thêm dependency thủ công vào `build.gradle`:**

```groovy
// build.gradle
dependencies {
    // Config Server – thành phần chính
    implementation 'org.springframework.cloud:spring-cloud-config-server'

    // Actuator – để expose /actuator/health và /actuator/refresh
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
}

dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:2023.0.1"
    }
}
```

---

#### Bước 2: Kích hoạt Config Server

```java
// ConfigServerApplication.java
package com.microservice.configserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer  // ← Annotation quan trọng nhất! Kích hoạt Config Server
public class ConfigServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
```

> **`@EnableConfigServer`** là annotation duy nhất cần thêm. Spring Boot tự cấu hình phần còn lại dựa trên `application.properties`.

---

#### Bước 3: Cấu hình Config Server (Git Backend)

```properties
# config-server/src/main/resources/application.properties
server.port=8888

spring.application.name=config-server
spring.cloud.config.server.git.uri=https://github.com/your-username/microservice-configs
spring.cloud.config.server.git.default-label=main
spring.cloud.config.server.git.search-paths={application}
# Nếu repo private, thêm credentials:
# spring.cloud.config.server.git.username=${GIT_USERNAME}
# spring.cloud.config.server.git.password=${GIT_TOKEN}
spring.cloud.config.server.git.clone-on-start=true
spring.cloud.config.server.git.force-pull=true

management.endpoints.web.exposure.include=health,info,refresh,busrefresh
management.endpoint.health.show-details=always
```

---

#### Bước 4: Cấu hình Config Server (Local Backend cho Dev)

```properties
# config-server/src/main/resources/application.properties (local)
server.port=8888
spring.application.name=config-server
spring.profiles.active=native
spring.cloud.config.server.native.search-locations=classpath:/configs
```

**Tạo thư mục và file config:**

```
config-server/
└── src/
    └── main/
        └── resources/
            ├── application.properties          ← Config của chính Config Server
            └── configs/                 ← Thư mục chứa config các service
                ├── application.properties      ← Shared config
                ├── user-service.properties
                ├── user-service-dev.properties
                ├── order-service.properties
                └── payment-service.properties
```

---

#### Bước 5: Tạo file config cho các service

```properties
# configs/application.properties – Config CHUNG cho tất cả service
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.show-sql=false
spring.jpa.hibernate.ddl-auto=none

logging.level.root=INFO
logging.level.org.springframework=WARN

eureka.client.service-url.defaultZone=http://eureka-server:8761/eureka/
```

```properties
# configs/user-service.properties – Config riêng cho user-service
server.port=8081
spring.application.name=user-service
spring.datasource.url=jdbc:mysql://user-db:3306/userdb?useSSL=false
spring.datasource.username=user_svc
spring.datasource.password=${DB_PASSWORD:defaultDevPassword}
spring.jpa.hibernate.ddl-auto=validate
```

```properties
# configs/user-service-dev.properties – Override khi chạy dev profile
spring.datasource.url=jdbc:mysql://localhost:3306/userdb_dev
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=create-drop
logging.level.com.user=DEBUG
```

---

### 3.2 Kết nối Service Client vào Config Server

#### Bước 1: Thêm dependency Config Client

```xml
// build.gradle của user-service (client)
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'

    // Config Client – để kết nối vào Config Server
    implementation 'org.springframework.cloud:spring-cloud-starter-config'

    // Actuator – cần cho /refresh endpoint
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
}
```

---

#### Bước 2: Cấu hình trỏ đến Config Server

```properties
# user-service/src/main/resources/application.properties
spring.application.name=user-service
spring.config.import=optional:configserver:http://localhost:8888
spring.profiles.active=dev
```

> **Lưu ý Spring Boot 3.x:** Dùng `spring.config.import` thay vì `spring.cloud.config.uri` (cách cũ của Spring Boot 2.x).

---

#### Bước 3: Sử dụng config trong code

```java
// UserController.java
package com.user.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RefreshScope  // ← Cho phép refresh config không cần restart
public class UserController {

    // Inject trực tiếp từ Config Server
    @Value("${app.welcome-message:Hello}")
    private String welcomeMessage;

    @Value("${app.max-login-attempts:5}")
    private int maxLoginAttempts;

    @GetMapping("/config-demo")
    public String getConfig() {
        return String.format(
            "Welcome: %s | Max Attempts: %d",
            welcomeMessage,
            maxLoginAttempts
        );
    }
}
```

```java
// Cách tốt hơn – Dùng @ConfigurationProperties
package com.user.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
@RefreshScope
public class AppProperties {

    private String welcomeMessage = "Hello";
    private int maxLoginAttempts = 5;
    private String featureFlag = "disabled";

    // Getters & Setters
    public String getWelcomeMessage() { return welcomeMessage; }
    public void setWelcomeMessage(String welcomeMessage) {
        this.welcomeMessage = welcomeMessage;
    }

    public int getMaxLoginAttempts() { return maxLoginAttempts; }
    public void setMaxLoginAttempts(int maxLoginAttempts) {
        this.maxLoginAttempts = maxLoginAttempts;
    }

    public String getFeatureFlag() { return featureFlag; }
    public void setFeatureFlag(String featureFlag) {
        this.featureFlag = featureFlag;
    }
}
```

---

### 3.3 Dynamic Refresh với @RefreshScope

**`@RefreshScope`** là annotation cho phép bean **tải lại config mới mà không cần restart service**.

```
Quy trình Dynamic Refresh:

1. Developer thay đổi config trong Git
2. Push commit lên Git repository
3. Gửi HTTP POST request đến service:
   POST http://user-service:8081/actuator/refresh
4. Service reload config từ Config Server
5. @RefreshScope beans được tái tạo với config mới
```

**Cấu hình expose refresh endpoint:**

```properties
# user-service/application.properties
management.endpoints.web.exposure.include=health,info,refresh
```

**Trigger refresh thủ công:**

```bash
# Refresh một service
curl -X POST http://localhost:8081/actuator/refresh

# Response:
# ["app.welcome-message", "app.max-login-attempts"]
# → Danh sách các property đã thay đổi
```

---

### 3.4 Test Config Server

Sau khi Config Server chạy, kiểm tra qua browser hoặc curl:

```
# Lấy config của user-service, profile default
GET http://localhost:8888/user-service/default

# Lấy config của user-service, profile dev
GET http://localhost:8888/user-service/dev

# Lấy config của order-service, profile prod, branch main
GET http://localhost:8888/order-service/prod/main

# Lấy raw file config
GET http://localhost:8888/user-service-dev.properties
```

**Response mẫu:**

```json
{
  "name": "user-service",
  "profiles": ["dev"],
  "label": "main",
  "version": "a3f9b2c",
  "state": null,
  "propertySources": [
    {
      "name": "https://github.com/.../user-service-dev.properties",
      "source": {
        "spring.datasource.url": "jdbc:mysql://localhost:3306/userdb_dev",
        "logging.level.com.user": "DEBUG"
      }
    },
    {
      "name": "https://github.com/.../user-service.properties",
      "source": {
        "server.port": "8081",
        "spring.datasource.username": "user_svc"
      }
    },
    {
      "name": "https://github.com/.../application.properties",
      "source": {
        "logging.level.root": "INFO",
        "eureka.client.service-url.defaultZone": "http://eureka-server:8761/eureka/"
      }
    }
  ]
}
```

---

### 🧪 Thực hành 3.1 – Lab: Build Config Server

**Mục tiêu:** Xây dựng Config Server với Local backend và kết nối một service client.

**Bước thực hiện:**

```
Step 1: Tạo project config-server
  → Spring Initializr: add Config Server + Actuator
  → @EnableConfigServer annotation
  → Cấu hình application.properties với native backend
  → Tạo file configs/application.properties và configs/user-service.properties

Step 2: Tạo project user-service
  → Spring Initializr: add Web + Config Client + Actuator
  → Cấu hình application.properties trỏ đến Config Server
  → Tạo UserController inject @Value từ config
  → @RefreshScope annotation

Step 3: Chạy và kiểm tra
  → Start config-server (port 8888)
  → Verify: GET http://localhost:8888/user-service/default
  → Start user-service
  → Verify: GET http://localhost:8081/config-demo

Step 4: Test Dynamic Refresh
  → Sửa config trong configs/user-service.properties
  → POST http://localhost:8081/actuator/refresh
  → GET http://localhost:8081/config-demo (giá trị đã thay đổi!)
```

**Checklist kết quả:**
```
[ ] Config Server start thành công trên port 8888
[ ] GET /user-service/default trả về đúng properties
[ ] user-service start và đọc được config từ Config Server
[ ] @Value inject đúng giá trị từ Config Server
[ ] Sau refresh, giá trị thay đổi không cần restart
```

---

### 🎬 NotebookLM – Prompt Video Lesson 03

```
========== STYLE PROMPT ==========
Phong cách hình ảnh: Live coding tutorial style + architecture diagram.
Hiệu ứng: code block xuất hiện từng dòng như đang gõ thật.
Khi nói đến @EnableConfigServer: highlight annotation với màu vàng/gold.
Khi nói đến @RefreshScope: animation "refresh" (vòng tròn quay).
Màu: Config Server box màu xanh lá, service boxes màu xanh dương.
Lấy visual từ [Prompt] trong tài liệu:
- Sơ đồ Centralized Config (Git → Config Server → Services)

========== VIDEO FOCUS ==========
Render theo thứ tự step-by-step:
1. [00:30] Project structure: thư mục config-server, file layout
2. [01:30] Annotation @EnableConfigServer highlight vàng
   + Text: "Chỉ cần 1 annotation này!"
3. [03:00] application.properties Config Server: từng property xuất hiện
   với giải thích từng dòng
4. [05:00] Client configuration: spring.config.import URL
5. [07:00] @RefreshScope animation: diagram luồng refresh
   (Git push → POST /refresh → bean reload)
6. [09:00] API test: browser request → JSON response hiển thị

========== NỘI DUNG AUDIO ==========
Thời lượng: 8–10 phút. Phong cách: Live coding tutorial.
Host A code, Host B quan sát và đặt câu hỏi.

[00:00 – Setup – 30s]
"Hôm nay chúng ta build Config Server từ zero.
Cuối bài, bạn sẽ có một Config Server chạy thật và
một service client đọc config từ nó."

[00:30 – Tạo project + @EnableConfigServer – 2 phút]
Code live từng bước. Nhấn mạnh:
"@EnableConfigServer – đây là annotation duy nhất cần thêm.
Spring Boot tự cấu hình toàn bộ phần còn lại."

[02:30 – Cấu hình application.properties – 2 phút]
Giải thích từng property: port, git.uri, search-paths, clone-on-start.
"search-paths: '{application}' → Config Server sẽ tìm
file tên = tên application của service gọi vào."

[04:30 – Tạo config files cho service – 2 phút]
Tạo application.properties (shared) và user-service.properties.
"Lưu ý: file application.properties được load cho TẤT CẢ service.
user-service.properties chỉ load khi service tên user-service gọi vào."

[06:30 – Kết nối client + @RefreshScope – 2 phút]
"spring.config.import – thay thế bootstrap.properties trong Spring Boot 3.
@RefreshScope – annotation cho phép bean 'sống lại' với config mới
mà không cần restart JVM."

[08:30 – Test và Verify – 1 phút]
"GET /user-service/default – đây là API của Config Server.
Nhìn vào propertySources – thấy config được merge theo thứ tự ưu tiên."
```

---

### 🖼️ Prompt Slide Chi Tiết – Lesson 03 (Google Slides)

> **Hướng dẫn sử dụng:**
> 1. **Sử dụng AI (Gemini Sidebar / MagicSlides / Plus AI)**: Copy đoạn text trong mục **"Prompt cho Google Slides AI"** và dán vào ô chat AI trong Google Slides để sinh bố cục thô.
> 2. **Thiết kế thủ công (Google Slides UI)**: Thực hiện theo các bước chi tiết trong mục **"Thiết kế thủ công (Google Slides UI)"** để tự tạo các element (TextBox, Shape, Color) một cách chuyên nghiệp nhất.

---

#### Slide 1: Title Slide – Xây dựng Config Server trong Microservice
* **Mục tiêu**: Giới thiệu tiêu đề bài thực hành Lab, sử dụng giao diện mang tính chất lập trình chuyên nghiệp.
* **Prompt cho Google Slides AI**:
  > "Design a code editor themed title slide with a dark slate background (#1E1E1E). Show mock Java code lines on the left like '@SpringBootApplication', '@EnableConfigServer', 'public class ConfigServerApp'. Highlight the annotation '@EnableConfigServer' in yellow. On the right, add the title text: 'Lesson 03: Xây dựng Config Server' and subtitle 'Hướng dẫn thực hành từng bước'. Bottom bar has details: 'Java 17 · Spring Boot 3.x'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu xám tối đậm `#1E1E1E` (Giao diện Code Editor).
  - **Bố cục & Đối tượng**:
    - **Mô phỏng Trình soạn thảo Code (Bên trái)**: Vẽ một hình chữ nhật màu đen `#121212` bo góc nhẹ chiếm 40% diện tích bên trái slide. Chèn chữ mô phỏng code Java (font **Courier New** hoặc **Consolas**, màu trắng/xám):
      ```java
      // Lesson 03 Lab
      @SpringBootApplication
      @EnableConfigServer   // <-- Tô màu vàng nhạt #FDE047
      public class ConfigServerApp {
          public static void main(...) { }
      }
      ```
    - **Thông tin bài học (Bên phải)**:
      - Tiêu đề chính: Text Box cỡ chữ **32pt Bold**, font **Google Sans**, màu trắng `#FFFFFF`: *"Xây dựng Config Server từ con số 0"*.
      - Tiêu đề phụ: Text Box cỡ chữ **16pt**, màu xám nhạt `#A1A1AA`: *"Lab thực hành: Khởi tạo, cấu hình Git repo và kết nối Client"*.
    - **Thanh trạng thái dưới cùng**: Text Box nhỏ chạy dài ở đáy slide, nền màu `#0F172A`, chữ màu xanh lá `#4ADE80` (12pt): *"Spring Boot 3.2.5 · Config Server Starter · Port 8888"*.
  - **Hiệu ứng chuyển động (Animation)**: Đoạn code mô phỏng xuất hiện trước với hiệu ứng gõ chữ từng ký tự, sau đó dòng chữ `@EnableConfigServer` phát sáng màu vàng.

---

#### Slide 2: Bước 1: Khởi tạo Project & Dependency
* **Mục tiêu**: Hướng dẫn học viên chọn đúng cấu hình trên Spring Initializr.
* **Prompt cho Google Slides AI**:
  > "Create a clean step-by-step checklist slide on a light green (#F0FDF4) background. Title: 'Bước 1: Khởi tạo Project'. Display a checklist card with items: Project: Gradle - Groovy, Language: Java 17, Spring Boot: 3.2.5, Artifact: config-server. On the right side, show a green box for 'Dependencies' with two items: 'Config Server' and 'Actuator'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu xanh lá cây cực nhạt `#F0FDF4`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu `#16A34A`: *"Bước 1: Khởi tạo trên start.spring.io"*.
    - **Khối Thông số Project (Bên trái)**: Vẽ một bảng hoặc danh sách bullet point lớn, font Arial, 18pt:
      - `[ ]` **Project**: *Gradle - Groovy Project*
      - `[ ]` **Language**: *Java 17 (hoặc 21)*
      - `[ ]` **Spring Boot**: *3.2.x*
      - `[ ]` **Artifact**: *config-server*
    - **Khối Dependency (Bên phải)**: Vẽ một hình chữ nhật lớn bo góc màu xanh lá nhạt `#DCFCE7` viền màu `#16A34A`, text bên trong:
      - **Dependencies cần chọn:**
      - `🟢 Config Server` *(spring-cloud-config-server)*
      - `🟢 Actuator` *(spring-boot-starter-actuator)*
  - **Hiệu ứng chuyển động (Animation)**: Các thông số bên trái lần lượt xuất hiện kèm theo dấu check xanh lá `✅` tự động bật lên.

---

#### Slide 3: Bước 2: Kích hoạt @EnableConfigServer trong Code
* **Mục tiêu**: Hướng dẫn thêm annotation kích hoạt Config Server vào mã nguồn Java.
* **Prompt cho Google Slides AI**:
  > "Design a code spotlight slide on dark blue background (#0F172A). Place a clear Java class code block in the center of the slide with class name 'ConfigServerApplication'. Highlight the annotation '@EnableConfigServer' with a pulsing yellow glow and a callout speech bubble pointing to it saying 'Chỉ cần một Annotation này để biến ứng dụng thành Config Server'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu xanh đen đậm `#0F172A`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu trắng: *"Bước 2: Cấu hình mã nguồn Java"*.
    - **Khối Code trung tâm**: Vẽ hộp code lớn màu tối `#1E293B` ở giữa, font chữ Monospace (cỡ 18pt):
      ```java
      @SpringBootApplication
      @EnableConfigServer    // <-- Đặt viền đỏ hoặc tô nền vàng nổi bật
      public class ConfigServerApplication {
          public static void main(String[] args) {
              SpringApplication.run(ConfigServerApplication.class, args);
          }
      }
      ```
    - **Bong bóng chú thích (Callout Bubble)**: Vẽ một hình shape bong bóng chat hướng mũi nhọn vào `@EnableConfigServer`, nền màu trắng `#FFFFFF`, chữ màu đen (14pt): *"💡 Chỉ cần 1 annotation này! Spring Boot sẽ tự động cấu hình toàn bộ bộ lọc và endpoint HTTP."*
  - **Hiệu ứng chuyển động (Animation)**: Code xuất hiện trước, sau đó bong bóng chú thích phóng to dần và chỉ vào dòng annotation.

---

#### Slide 4: Cấu hình Git Backend trong file properties/YAML
* **Mục tiêu**: Giải thích ý nghĩa của các dòng cấu hình kết nối Git Repo.
* **Prompt cho Google Slides AI**:
  > "Design a dark code theme slide (#1E1E1E) split into two columns. Left column displays YAML properties for Spring Cloud Config server including git.uri, default-label, search-paths, and clone-on-start. Right column shows labeled explanation cards corresponding to each YAML configuration line. Title: 'Bước 3: Cấu hình Git Backend'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu xám đen `#1E1E1E`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu xanh lá nhạt `#86EFAC`: *"Cấu hình Git Backend trong application.properties"*.
    - **Cột Trái (Code YAML)**: Box chữ nhật màu đen `#121212`, chèn code YAML:
      ```yaml
      spring:
        cloud:
          config:
            server:
              git:
                uri: https://github.com/org/config-repo
                default-label: main
                search-paths: '{application}'
                clone-on-start: true
      ```
    - **Cột Phải (Giải thích)**: Chèn các text box giải nghĩa tương ứng với mã số đánh dấu cạnh dòng code:
      - `1.` **uri**: *Đường dẫn đến Git repository chứa cấu hình.*
      - `2.` **default-label**: *Nhánh Git mặc định cần đọc (main/master).*
      - `3.` **search-paths**: *Đường dẫn tìm kiếm thư mục con (tìm theo tên service).*
      - `4.` **clone-on-start**: *Tải cấu hình về máy chủ ngay khi startup để tránh độ trễ.*
  - **Hiệu ứng chuyển động (Animation)**: Khi click chuột, từng dòng code YAML ở cột trái sáng lên đồng thời dòng giải thích ở cột phải xuất hiện.

---

#### Slide 5: Thiết kế Cấu trúc Config Repository
* **Mục tiêu**: Giúp học viên nắm rõ quy tắc đặt tên file cấu hình trên Git.
* **Prompt cho Google Slides AI**:
  > "Create a light background slide (#F8FAFC) showing a folder structure tree diagram. The root folder is named 'microservice-config' (a Git Repository). Inside, show files: 'application.properties' (color green), 'user-service.properties' (color blue), 'user-service-dev.properties' (color orange), 'user-service-prod.properties' (color red). Add explanation labels for shared config vs service config vs env config. Title: 'Cấu trúc thư mục Git Repository'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu xám nhạt `#F8FAFC`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu tối `#1E293B`: *"Cách đặt tên file trong Config Repository"*.
    - **Sơ đồ cấu trúc cây thư mục**: Vẽ hình cây thư mục trực quan bằng các TextBox và đường kẻ nối:
      - `📁 microservice-config/` (Thư mục gốc của Git Repository)
        - `├── 📄 application.properties` *(🟢 Config dùng chung cho TẤT CẢ service)*
        - `├── 📄 user-service.properties` *(🔵 Config riêng cho user-service)*
        - `├── 📄 user-service-dev.properties` *(🟠 Config user-service môi trường DEV)*
        - `├── 📄 user-service-prod.properties` *(🔴 Config user-service môi trường PROD)*
    - **Bảng chú thích (Legend)**: Đặt ở góc phải slide, giải thích quy tắc đặt tên: `{tên-service}-{môi-trường}.yml`.
  - **Hiệu ứng chuyển động (Animation)**: Cây thư mục xuất hiện lần lượt từng cấp từ trên xuống dưới.

---

#### Slide 6: Kết nối Client Service vào Config Server
* **Mục tiêu**: Cấu hình phía Client (user-service) để nạp cấu hình từ Config Server khi khởi chạy.
* **Prompt cho Google Slides AI**:
  > "Create a side-by-side architecture slide showing Client connecting to Config Server. Left side shows 'Config Server (:8888)' in a green box. Right side shows 'user-service client' in a blue box. In the center, draw a connection arrow labeled with 'spring.config.import=optional:configserver:http://localhost:8888'. Include a warning sign at the bottom stating bootstrap.xml is deprecated in Spring Boot 3.x. Title: 'Kết nối Client Service'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu tối `#1E293B`: *"Cấu hình Client kết nối Config Server"*.
    - **Khối Config Server (Bên trái)**: Vẽ hình chữ nhật bo góc màu xanh lá `#22C55E`, chữ trắng: *"Config Server (Port 8888)"*.
    - **Khối Client Service (Bên phải)**: Vẽ hình chữ nhật bo góc màu xanh dương `#3B82F6`, chữ trắng: *"user-service (Client)"*.
    - **Mũi tên & Dòng Code kết nối (Ở giữa)**: Vẽ đường mũi tên dày nối giữa 2 khối, trên mũi tên ghi dòng cấu hình quan trọng nhất:
      `spring.config.import: optional:configserver:http://localhost:8888`
    - **Cảnh báo (Chân slide)**: Vẽ một dải màu đỏ nhạt `#FEE2E2` ghi chữ đỏ: *"⚠️ Cảnh báo: Kể từ Spring Boot 3.x, mặc định KHÔNG dùng bootstrap.properties nữa, mà khai báo trực tiếp trong application.properties thông qua spring.config.import."*
  - **Hiệu ứng chuyển động (Animation)**: Hai khối Client và Server xuất hiện trước, sau đó mũi tên kết nối cùng dòng chữ `spring.config.import` hiện lên ở giữa.

---

#### Slide 7: Cơ chế Cập Nhật Động (Dynamic Refresh với @RefreshScope)
* **Mục tiêu**: Trực quan hóa luồng cập nhật cấu hình mà không cần khởi động lại máy chủ ảo (JVM).
* **Prompt cho Google Slides AI**:
  > "Create an step-by-step flow diagram slide with 5 numbered circles explaining Dynamic Refresh. Step 1: developer commits config to Git. Step 2: Config Server pulls change. Step 3: Developer calls POST /actuator/refresh. Step 4: Client service pulls new values. Step 5: Beans marked with @RefreshScope are recreated. Display a small Java code snippet showing @RefreshScope annotation. Title: 'Cơ chế Dynamic Refresh'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu trắng `#FFFFFF`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu tối `#1E293B`: *"Cơ chế Dynamic Refresh không restart Service"*.
    - **5 Bước quy trình (Flowchart)**: Vẽ 5 vòng tròn được đánh số từ 1 đến 5 nằm ngang hoặc tạo thành luồng uốn lượn kèm mũi tên nối tiếp:
      1. *Sửa config trên Git & Commit* `💻`
      2. *Config Server cập nhật tự động* `🔄`
      3. *Gọi API POST `/actuator/refresh` của Client* `📮`
      4. *Client kéo cấu hình mới từ Config Server* `📥`
      5. *Các Component có `@RefreshScope` tải lại dữ liệu mới* `✅`
    - **Hộp Code ví dụ**: Vẽ một ô nhỏ màu xanh lá nhạt ở bên dưới, chứa đoạn code Java minh họa annotation:
      ```java
      @RefreshScope // <-- Giúp bean reload config mới tự động
      @RestController
      public class UserController { ... }
      ```
  - **Hiệu ứng chuyển động (Animation)**: 5 vòng tròn của quy trình xuất hiện tuần tự khi click chuột, sau đó hộp code ví dụ sáng lên.

---

#### Slide 8: Kiểm thử API của Config Server
* **Mục tiêu**: Hướng dẫn học viên cách gọi REST API để kiểm tra kết quả merge cấu hình trên Config Server.
* **Prompt cho Google Slides AI**:
  > "Design a slide representing an API testing client mockup on a dark background (#0F172A). Title: 'Kiểm thử REST API của Config Server'. Show three mockup URLs: GET /user-service/default, GET /user-service/dev, GET /user-service-dev.properties. Below this, display a simplified JSON response showing propertySources mapping application.properties, user-service.properties and user-service-dev.properties."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu tối `#0F172A`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu trắng: *"Kiểm tra hoạt động REST API"*.
    - **Danh sách URL kiểm thử (Bên trái)**: Text Box chứa chữ màu xanh sáng `#38BDF8` (font Monospace, 16pt):
      - `GET http://localhost:8888/user-service/default`
      - `GET http://localhost:8888/user-service/dev`
      - `GET http://localhost:8888/user-service-dev.properties`
    - **Dữ liệu JSON phản hồi (Bên phải)**: Vẽ một box màu xám tối `#1E293B`, hiển thị cấu trúc JSON phản hồi thu gọn:
      ```json
      {
        "name": "user-service",
        "profiles": ["dev"],
        "propertySources": [
          { "name": "user-service-dev.properties", "source": {...} },
          { "name": "user-service.properties", "source": {...} }
        ]
      }
      ```
  - **Hiệu ứng chuyển động (Animation)**: URL bên trái hiện ra trước, sau đó dữ liệu JSON phản hồi tương ứng xuất hiện ở bên phải.

---

## 📖 Lesson 04 – Service Registration & Discovery trong Microservice

### 🎯 Mục tiêu bài học
- Hiểu vấn đề Service Discovery trong hệ thống Microservice
- Phân biệt Server-side và Client-side Discovery
- Cài đặt Eureka Server (Service Registry)
- Đăng ký service với Eureka (Eureka Client)
- Thực hiện Service Discovery với Load Balancing

---

### 4.1 Vấn đề: Service Discovery trong Microservice

Trong Monolithic app, các module gọi nhau qua **function call** – không cần biết địa chỉ. Trong Microservice, mọi giao tiếp đều qua **mạng** và mỗi service cần biết **địa chỉ** (host + port) của service khác.

[Prompt: An isometric illustration of service discovery problems.

The left side shows the "Cấu hình tĩnh (Static Configuration)" problem where OrderService has a hardcoded properties file with "payment-service.url=http://192.168.1.50:8084", crossed out with a red X. An arrow points to the questions: "Nếu payment-service đổi IP mới?" and "Nếu chạy 3 instance của payment-service?". The right side shows two question mark icons labeled "IP nào?" (Which IP?) and "Instance nào?" (Which instance?).

Corporate technology style,

clean line art,

neon blue and white accents,

soft holographic lighting,

ultra detailed,

8k resolution,

Light-colored background and oriented towards microservice technology, Java Spring boot.,

presentation slide illustration.

The language used in the images is Vietnamese, with only the technical terms retained in English.]

**Vấn đề với hardcoded URL:**

```java
// CÁCH XẤU – Hardcode URL trong code
@Service
public class OrderService {

    // ❌ Vấn đề 1: URL hardcoded → phải sửa code nếu service di chuyển
    private String paymentUrl = "http://192.168.1.50:8084";

    // ❌ Vấn đề 2: 3 instance Payment Service → gọi cái nào?
    // http://192.168.1.50:8084 ?
    // http://192.168.1.51:8084 ?
    // http://192.168.1.52:8084 ?

    public void processPayment(Order order) {
        restTemplate.postForObject(paymentUrl + "/payments", order, Response.class);
    }
}
```

**Tình huống thực tế:**

```
Vấn đề của Static URL:
❌ Deployment: Service thường xuyên thay đổi IP/port (containers, cloud)
❌ Scaling: 3 instances cùng tên → không biết gọi cái nào
❌ Failure: Instance bị down → cần tự động loại bỏ khỏi danh sách
❌ Health Check: Không biết instance nào đang healthy
```

---

### 4.2 Giải pháp: Service Registry & Discovery

**Service Registry** (hay Service Discovery) là một cơ chế trong đó:
1. **Service đăng ký** địa chỉ của mình vào một "danh bạ" trung tâm
2. **Service khác** tra danh bạ để tìm địa chỉ của service cần gọi
3. **Health check** tự động loại bỏ service bị down khỏi danh bạ

[Prompt: An isometric illustration of service registry and discovery architecture.

In the center is a purple "Eureka Server (Service Registry)" block containing a registry table with columns: ServiceName, Host, Port, Status (displaying user-service UP, order-service UP, and two instances of payment-service UP). On the left, show registration arrows from each service to Eureka labeled "1. Đăng ký khi khởi động (Register on startup)". On the right, show Order Service sending a query arrow to Eureka labeled "2. Tìm kiếm (Discover): payment-service ở đâu?" and receiving a response arrow "3. Trả về (Return): [8084, 8085]". At the bottom, Order Service calls Payment Service with a load balancing icon.

Corporate technology style,

clean line art,

neon blue and white accents,

soft holographic lighting,

ultra detailed,

8k resolution,

Light-colored background and oriented towards microservice technology, Java Spring boot.,

presentation slide illustration.

The language used in the images is Vietnamese, with only the technical terms retained in English.]

**Luồng hoạt động:**

```
1. REGISTER (khi service khởi động):
   payment-service → Eureka: "Tôi là payment-service, tôi đang ở host:port X"

2. HEARTBEAT (định kỳ, mặc định 30s):
   payment-service → Eureka: "Tôi vẫn còn sống!"
   Nếu không nhận heartbeat sau 90s → Eureka tự xóa service

3. DISCOVER (khi cần gọi service khác):
   order-service → Eureka: "Cho tôi danh sách instances của payment-service"
   Eureka → order-service: [host1:8084, host2:8084, host3:8084]
   order-service: chọn 1 trong 3 instances (Round Robin)

4. CALL (gọi trực tiếp, không qua Eureka):
   order-service → payment-service (instance được chọn)
```

---

### 4.3 Server-side vs Client-side Discovery

[Prompt: An isometric illustration comparing two service discovery patterns side-by-side.

The left side represents "Phát hiện phía Server (Server-side Discovery)": Client sends a request to a Load Balancer (AWS ELB icon), which queries the Service Registry and routes the request to the correct service instance. The right side represents "Phát hiện phía Client (Client-side Discovery)": Client queries the Service Registry (Eureka) directly, receives a list of instances, then uses a client-side load balancer (Spring Cloud LB) to choose an instance and call it directly. Diagrams show clear arrows representing request flow and include pros/cons text in Vietnamese.

Corporate technology style,

clean line art,

neon blue and white accents,

soft holographic lighting,

ultra detailed,

8k resolution,

Light-colored background and oriented towards microservice technology, Java Spring boot.,

presentation slide illustration.

The language used in the images is Vietnamese, with only the technical terms retained in English.]

| Tiêu chí | Server-side Discovery | Client-side Discovery |
|---|---|---|
| **Load Balancer** | Ở server (AWS ELB, NGINX) | Ở client (Spring Cloud LB) |
| **Client biết địa chỉ?** | ❌ Không (chỉ biết LB) | ✅ Có (biết trực tiếp) |
| **Ví dụ** | AWS ELB + Route53 | Netflix Eureka + Ribbon |
| **Phức tạp client** | Đơn giản (chỉ gọi 1 URL) | Phức tạp hơn (cần LB logic) |
| **Phức tạp infra** | Cần setup LB riêng | LB tích hợp trong client |
| **Latency** | +1 hop (qua LB) | Gọi thẳng (ít hop hơn) |
| **Spring Cloud** | Không phổ biến | **Eureka + LoadBalancer** ✅ |

---

### 4.4 Xây dựng Eureka Server

#### Bước 1: Tạo Eureka Server project

```xml
// build.gradle của eureka-server
dependencies {
    // Eureka Server – thành phần chính
    implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-server'

    // Actuator
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
}
```

#### Bước 2: Kích hoạt Eureka Server

```java
// EurekaServerApplication.java
package com.microservice.eurekaserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer  // ← Annotation kích hoạt Eureka Server
public class EurekaServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

#### Bước 3: Cấu hình Eureka Server

```properties
# eureka-server/src/main/resources/application.properties
server.port=8761

spring.application.name=eureka-server

eureka.instance.hostname=localhost
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
eureka.client.service-url.defaultZone=http://${eureka.instance.hostname}:${server.port}/eureka/

eureka.server.enable-self-preservation=false
eureka.server.eviction-interval-timer-in-ms=5000

management.endpoints.web.exposure.include=health,info
```

> **`enable-self-preservation: false`** chỉ dùng trong **development**. Trong production, để `true` để tránh xóa nhầm service khi mạng bị gián đoạn ngắn.

---

### 4.5 Đăng ký Service với Eureka (Eureka Client)

#### Bước 1: Thêm Eureka Client dependency

```xml
// build.gradle của user-service (và tất cả service cần đăng ký)
dependencies {
    // Eureka Client – để đăng ký dịch vụ lên Eureka Server
    implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'
}
```

#### Bước 2: Kích hoạt Eureka Client

Từ Spring Cloud 2020+ và Spring Boot 3.x, **Eureka Client tự động được kích hoạt** khi có dependency trong classpath. Không cần annotation thêm.

```java
// UserServiceApplication.java
package com.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
// Không cần @EnableEurekaClient – tự động kích hoạt!
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
```

#### Bước 3: Cấu hình Eureka Client

```properties
# user-service/src/main/resources/application.properties
server.port=8081

spring.application.name=user-service

eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.client.register-with-eureka=true
eureka.client.fetch-registry=true
eureka.client.registry-fetch-interval-seconds=5

eureka.instance.prefer-ip-address=true
eureka.instance.instance-id=${spring.application.name}:${server.port}
eureka.instance.lease-renewal-interval-in-seconds=5
eureka.instance.lease-expiration-duration-in-seconds=10
```

---

### 4.6 Service Discovery với Spring Cloud LoadBalancer

Khi đã có Eureka, service A gọi service B **bằng tên logic** thay vì hardcoded URL:

```java
// OrderService.java – Gọi payment-service bằng Service Discovery
package com.order.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OrderService {

    @Autowired
    private RestTemplate restTemplate;

    public PaymentResponse processPayment(PaymentRequest request) {
        // ✅ ĐÚNG: Dùng tên service thay vì hardcoded URL
        // Eureka + LoadBalancer tự tìm địa chỉ thật
        String url = "http://payment-service/api/payments";

        return restTemplate.postForObject(url, request, PaymentResponse.class);
    }
}
```

**Cấu hình RestTemplate với Load Balancing:**

```java
// OrderServiceApplication.java
package com.order;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class OrderServiceApplication {

    @Bean
    @LoadBalanced  // ← Annotation cho phép dùng tên service thay vì URL
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
```

**Cách hiện đại hơn – Dùng WebClient (Reactive):**

```java
// Config WebClient với Load Balancing
@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced  // ← Tương tự RestTemplate
    public WebClient.Builder loadBalancedWebClientBuilder() {
        return WebClient.builder();
    }
}

// Sử dụng trong service
@Service
public class OrderService {

    @Autowired
    private WebClient.Builder webClientBuilder;

    public Mono<PaymentResponse> processPayment(PaymentRequest request) {
        return webClientBuilder.build()
            .post()
            .uri("http://payment-service/api/payments")  // Tên service logic
            .bodyValue(request)
            .retrieve()
            .bodyToMono(PaymentResponse.class);
    }
}
```

---

### 4.7 Eureka Dashboard

Sau khi Eureka Server và các service client khởi động, truy cập:

```
http://localhost:8761
```

[Prompt: An isometric illustration mockup of the Eureka Server Dashboard web interface.

The web interface features the title "Spring Eureka". The main area displays the table "Các instance đang đăng ký với Eureka (Instances currently registered with Eureka)" with columns: Application, AMIs, Availability Zones, Status. Rows show: USER-SERVICE (UP), ORDER-SERVICE (UP), and PAYMENT-SERVICE (UP, showing 2 instances: port 8084 and 8085). The "Trạng thái hệ thống (System Status)" section shows Environment: test, Data center: default. Green "UP" status badges are visible.

Corporate technology style,

clean line art,

neon blue and white accents,

soft holographic lighting,

ultra detailed,

8k resolution,

Light-colored background and oriented towards microservice technology, Java Spring boot.,

presentation slide illustration.

The language used in the images is Vietnamese, with only the technical terms retained in English.]

**Thông tin trên Dashboard:**
- **Application:** Tên service (từ `spring.application.name`)
- **Status:** UP / DOWN / STARTING
- **Instances:** Số instance đang chạy
- **Availability Zones:** Zone mà instance đăng ký

---

### 4.8 High Availability – Eureka Cluster (Production)

Trong production, **không bao giờ chạy một Eureka Server duy nhất** – đó là Single Point of Failure.

[Prompt: An isometric illustration of a high-availability Eureka cluster.

Shows 3 Eureka Server blocks (Eureka Server 1 on port 8761, Eureka Server 2 on port 8762, Eureka Server 3 on port 8763) arranged in a triangle, connected to each other with bidirectional arrows labeled "Sao chép ngang hàng (Peer Replication)". Multiple microservice blocks (User Service, Order Service, Payment Service) are connected to all 3 Eureka Servers with arrows labeled "Đăng ký tới tất cả server (Register to all peers)". A failover scenario is shown where Eureka Server 2 has an X (down), but services continue operating via Servers 1 and 3.

Corporate technology style,

clean line art,

neon blue and white accents,

soft holographic lighting,

ultra detailed,

8k resolution,

Light-colored background and oriented towards microservice technology, Java Spring boot.,

presentation slide illustration.

The language used in the images is Vietnamese, with only the technical terms retained in English.]

```properties
# eureka-server-1/application.properties
server.port=8761

spring.application.name=eureka-server

eureka.instance.hostname=eureka1
eureka.client.register-with-eureka=true
eureka.client.fetch-registry=true
eureka.client.service-url.defaultZone=http://eureka2:8762/eureka/,http://eureka3:8763/eureka/
```

---

### 🧪 Thực hành 4.1 – Lab: Build Service Discovery

**Mục tiêu:** Xây dựng Eureka Server và đăng ký 2 service, sau đó thực hiện service-to-service call bằng tên service.

**Bước thực hiện:**

```
Step 1: Tạo và chạy Eureka Server
  → New project: eureka-server (port 8761)
  → @EnableEurekaServer
  → Verify: http://localhost:8761 mở được Dashboard

Step 2: Cấu hình user-service làm Eureka Client
  → Thêm eureka-client dependency
  → Cấu hình application.properties: eureka.client.service-url.defaultZone
  → Start user-service
  → Verify: Thấy USER-SERVICE trên Eureka Dashboard

Step 3: Cấu hình order-service làm Eureka Client
  → Tương tự user-service
  → Thêm RestTemplate @LoadBalanced
  → Start order-service
  → Verify: Thấy ORDER-SERVICE trên Eureka Dashboard

Step 4: Service Discovery Call
  → Tạo endpoint trong order-service gọi đến user-service
     bằng URL: "http://user-service/api/users/{id}"
  → Verify: order-service tự tìm được địa chỉ user-service!

Step 5: Test High Availability
  → Start thêm 1 instance của user-service trên port 8082
  → Eureka Dashboard hiển thị 2 instances
  → Gọi order-service liên tục → quan sát Round Robin LB
```

**Checklist kết quả:**
```
[ ] Eureka Server chạy và Dashboard mở được
[ ] user-service xuất hiện trên Eureka Dashboard (status: UP)
[ ] order-service xuất hiện trên Eureka Dashboard (status: UP)
[ ] order-service gọi thành công user-service bằng tên "user-service"
[ ] Khi thêm instance thứ 2, Eureka hiển thị 2 instances
[ ] Load balancing chia đều request giữa 2 instances
```

---

### 🎬 NotebookLM – Prompt Video Lesson 04

```
========== STYLE PROMPT ==========
Phong cách hình ảnh: Problem/Solution animation + live demo style.
Giai đoạn vấn đề: hardcoded IP trong code, màu đỏ/orange.
Giai đoạn giải pháp: Eureka Dashboard màu tím/xanh dương.
Animation: service boxes "đăng ký" vào Eureka với hiệu ứng
"bắt tay" (handshake). Heartbeat được biểu diễn bằng
nhịp đập trái tim với interval 30s.
Lấy visual từ [Prompt] trong tài liệu:
- Sơ đồ vấn đề hardcoded URL
- Sơ đồ Eureka Server + Service Registry + Discovery
- Eureka Dashboard mockup
- Eureka Cluster (High Availability)

========== VIDEO FOCUS ==========
Render theo thứ tự:
1. [00:30] VẤNĐỀ: Code với hardcoded URL, 3 warning icons:
   "Service di chuyển", "Scale 3 instances", "Instance bị down"
2. [02:00] GIẢI PHÁP: Eureka diagram với 3 luồng:
   Register → Heartbeat → Discover → Call
3. [05:00] CODE: @EnableEurekaServer annotation highlight vàng
   application.properties Eureka Server properties
4. [07:00] EUREKA DASHBOARD: mockup UI với service table,
   status UP/DOWN, instance count
5. [09:00] SERVICE CALL: code @LoadBalanced RestTemplate,
   URL "http://payment-service/api/payments"
6. [11:00] HA CLUSTER: 3 Eureka servers triangle với peer replication

========== NỘI DUNG AUDIO ==========
Thời lượng: 8–10 phút. Phong cách: Detective story approach.
Host A dẫn dắt như giải một bài toán logic.

[00:00 – Bài toán – 1 phút]
"Hãy giải bài toán này: Service A cần gọi Service B.
Service B đang chạy ở http://192.168.1.50:8084.
Tuần tới, DevOps team deploy B lên Kubernetes.
IP mới là http://10.0.0.25:8084. Service A có biết không?
Còn nếu scale B lên 3 instances thì sao?"
→ Visual: Hardcoded URL diagram với 3 problem scenarios.

[01:00 – Khái niệm Service Discovery – 2 phút]
"Eureka là cuốn danh bạ điện thoại của các service.
Mỗi service khi 'đi làm' (khởi động) → đăng ký vào danh bạ.
Định kỳ 'báo cáo sếp' (heartbeat) → cho biết còn sống.
Khi cần gọi đồng nghiệp → tra danh bạ bằng tên."
→ Visual: Eureka diagram với 3 luồng: Register, Heartbeat, Discover.

[03:00 – Build Eureka Server – 3 phút]
Code step by step: dependency → @EnableEurekaServer → application.properties.
Host B: "register-with-eureka: false là gì?"
Host A: "Eureka Server không cần đăng ký vào chính nó –
nó LÀ danh bạ, không cần ghi tên mình vào danh bạ."
→ Visual: Dashboard xuất hiện – empty initially.

[06:00 – Register Service + Service Call – 2 phút]
"Bây giờ user-service đăng ký. Nhìn Dashboard – thấy USER-SERVICE!"
Demo @LoadBalanced RestTemplate.
"http://payment-service" – không có IP, không có port.
Spring Cloud LoadBalancer tra Eureka, lấy danh sách, chọn một."
→ Visual: URL "http://payment-service" → LoadBalancer → real IP.

[08:00 – Production: Eureka Cluster – 30s]
"Production: 3 Eureka Servers đồng bộ nhau.
Một server down → 2 cái còn lại vẫn phục vụ.
Đây là High Availability cơ bản."
→ Visual: HA Cluster diagram.

[08:30 – Kết – 30s]
"Hai trụ cột nền tảng: Config Server + Service Discovery.
Session 04: API Gateway – cổng vào duy nhất cho toàn hệ thống."
```

---

### 🖼️ Prompt Slide Chi Tiết – Lesson 04 (Google Slides)

> **Hướng dẫn sử dụng:**
> 1. **Sử dụng AI (Gemini Sidebar / MagicSlides / Plus AI)**: Copy đoạn text trong mục **"Prompt cho Google Slides AI"** và dán vào ô chat AI trong Google Slides để sinh bố cục thô.
> 2. **Thiết kế thủ công (Google Slides UI)**: Thực hiện theo các bước chi tiết trong mục **"Thiết kế thủ công (Google Slides UI)"** để tự tạo các element (TextBox, Shape, Color) một cách chuyên nghiệp nhất.

---

#### Slide 1: Title Slide – Service Registration & Discovery trong Microservice
* **Mục tiêu**: Giới thiệu tiêu đề bài học thứ tư với gam màu tím đặc trưng của Netflix Eureka.
* **Prompt cho Google Slides AI**:
  > "Design a title slide on a deep purple gradient background (#4C1D95 to #7C3AED). Title: 'Service Registration & Discovery'. Subtitle: 'Xây dựng giải pháp Eureka Server & Client'. Include a horizontal row of 4 small icons at the bottom: register list, heartbeat pulse, search discovery, and scales for load balancing. Use bold white sans-serif font for the main title."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Gradient màu tím sẫm từ `#4C1D95` chuyển sang màu tím `#7C3AED`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề chính**: Text Box lớn đặt chính giữa slide, font **Google Sans Bold**, cỡ chữ **38pt**, màu chữ trắng (`#FFFFFF`). Nội dung: *"Service Registration & Discovery"*
    - **Tiêu đề phụ**: Text Box bên dưới, cỡ chữ **16pt**, màu tím nhạt `#DDD6FE`. Nội dung: *"Netflix Eureka Server & Client trong hệ thống Microservices"*
    - **Hàng biểu tượng**: Vẽ hàng ngang gồm 4 icon đại diện cho 4 bước: `📋` (Đăng ký) → `💓` (Heartbeat) → `🔍` (Phát hiện) → `⚖️` (Cân bằng tải).
    - **Chân trang**: Text Box chữ xám nhạt `#C084FC`: *"Spring Cloud Netflix Eureka · Spring Cloud LoadBalancer"*.
  - **Hiệu ứng chuyển động (Animation)**: Slide mở đầu mượt mà, tiêu đề trượt nhẹ lên từ bên dưới và các icon nảy lên (*Zoom/Bounce*) lần lượt từ trái sang phải.

---

#### Slide 2: Vấn Đề: Hardcoded IP & Port trong mã nguồn
* **Mục tiêu**: Chỉ ra mặt hạn chế nghiêm trọng của việc cấu hình cứng địa chỉ IP của các dịch vụ.
* **Prompt cho Google Slides AI**:
  > "Create a light red (#FEF2F2) background slide explaining the hardcoded URL problem. Place a snippet of Java code in the center showing OrderService calling payment-service at a hardcoded IP address. Cross it out with a red line or X. Around the code block, display 3 red warning callout cards with questions: 'What if IP changes?', 'What if we scale to 3 instances?', 'What if an instance crashes?'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Đỏ nhạt `#FEF2F2`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu đỏ đậm `#991B1B`: *"Vấn đề: Liên kết cứng địa chỉ IP (Hardcoded URL)"*.
    - **Khối Code lỗi (Bên trái)**: Vẽ box code màu tối `#1E293B` chứa code Java:
      ```java
      // ❌ Gọi trực tiếp bằng IP cứng
      private String paymentUrl = "http://192.168.1.50:8084/pay";
      ```
      Vẽ một đường gạch chéo đỏ (`#EF4444`) lớn hoặc nét gạch dưới lượn sóng đỏ dưới dòng IP để báo lỗi.
    - **3 Hộp Cảnh Báo (Bên phải)**: Vẽ 3 hộp thoại màu trắng viền đỏ chứa text:
      - `1.` *Khi dịch vụ Payment chuyển sang Server/IP mới → Order Service bị lỗi kết nối!*
      - `2.` *Khi chạy 3 instance của Payment Service để chịu tải → Order Service gọi instance nào?*
      - `3.` *Instance bị sập bất thình lình → Làm sao để Order tự động tránh gọi vào instance đó?*
  - **Hiệu ứng chuyển động (Animation)**: Code xuất hiện trước, sau đó đường gạch chéo đỏ đè lên, rồi 3 câu hỏi cảnh báo trượt vào từng câu một.

---

#### Slide 3: Giải Pháp: Cơ chế Hoạt Động của Service Registry
* **Mục tiêu**: Giải thích mô hình Eureka đóng vai trò làm "Danh bạ điện thoại" chung của các service.
* **Prompt cho Google Slides AI**:
  > "Design a technical workflow slide for Service Discovery. In the center, place a large purple box 'Eureka Server (Service Registry)'. On the left, show two microservices registering and sending heartbeats. On the right, show 'order-service' querying Eureka for 'payment-service' address, receiving IP list, and making a direct call. Use numbered steps from 1 to 5. Title: 'Mô hình Service Registry'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu trắng tinh `#FFFFFF`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu tím `#6D28D9`: *"Giải pháp: Mô hình Service Registry & Discovery"*.
    - **Khối Eureka Server (Trung tâm)**: Vẽ hình chữ nhật lớn màu tím `#8B5CF6`, chữ trắng: *"Eureka Server (Danh bạ dịch vụ)"*. Bên trong vẽ một bảng danh mục nhỏ:
      `[payment-service -> 192.168.1.50:8084, 192.168.1.51:8085]`
    - **Các mũi tên luồng xử lý (Numbered Flow)**:
      - Vòng 1 (Trái → Giữa): Mũi tên từ Payment Service chỉ vào Eureka Server: *"1. Đăng ký khi startup"* & *"2. Gửi heartbeat mỗi 30 giây"*.
      - Vòng 2 (Phải → Giữa): Mũi tên từ Order Service chỉ vào Eureka Server: *"3. Hỏi địa chỉ payment-service"* và trả về: *"4. Nhận danh sách IP [8084, 8085]"*.
      - Vòng 3 (Phải → Trái): Mũi tên thẳng nối Order Service gọi Payment Service: *"5. Gọi trực tiếp (Cân bằng tải)"*.
  - **Hiệu ứng chuyển động (Animation)**: Eureka Server hiện trước, sau đó Payment Service đăng ký, tiếp đến Order Service hỏi và thực hiện cuộc gọi.

---

#### Slide 4: Phân biệt Server-side vs Client-side Discovery
* **Mục tiêu**: So sánh hai kiến trúc Service Discovery phổ biến nhất hiện nay.
* **Prompt cho Google Slides AI**:
  > "Design a split comparison slide. Left side is blue-tinted titled 'Server-side Discovery' (Client calls Load Balancer, Load Balancer queries Registry, e.g. AWS ELB). Right side is purple-tinted titled 'Client-side Discovery' (Client queries Registry, Load balances locally, e.g. Eureka + Spring Cloud LB). Highlight Client-side Discovery with a green border. Title: 'Server-side vs Client-side Discovery'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Title and two columns**.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu tối `#1E293B`: *"Server-side vs Client-side Discovery"*.
    - **Cột Trái (Server-side)**: Khối màu xanh dương nhạt `#EFF6FF`.
      - Tiêu đề phụ: *"🔵 Server-side Discovery (Ví dụ: AWS ELB)"* (màu xanh `#1E40AF`).
      - Nội dung: *"Client chỉ gọi một địa chỉ LB duy nhất"*, *"Máy chủ LB tự tra Registry và chuyển tiếp request"*, *"Ưu điểm: Client cực kỳ đơn giản"*, *"Nhược điểm: Thêm một network hop trung gian, tốn tài nguyên setup LB"*.
    - **Cột Phải (Client-side)**: Khối màu tím nhạt `#F5F3FF` (vẽ viền nét đứt màu xanh lá cây để đánh dấu sự lựa chọn của Spring Cloud).
      - Tiêu đề phụ: *"🟣 Client-side Discovery (Ví dụ: Eureka + Spring Cloud LB)"* (màu tím `#6D28D9`).
      - Nội dung: *"Client tự hỏi Registry để lấy danh sách IP"*, *"Client tự chọn 1 IP và gọi trực tiếp"*, *"Ưu điểm: Tối ưu mạng, không bị thắt cổ chai ở LB trung tâm"*, *"Nhược điểm: Client cần thêm thư viện SDK để tự load balance"*.
  - **Hiệu ứng chuyển động (Animation)**: Hai cột lần lượt xuất hiện từ hai phía, sau đó viền xanh lá ở cột Client-side sáng lên.

---

#### Slide 5: Xây dựng Eureka Server (3 bước cơ bản)
* **Mục tiêu**: Hướng dẫn 3 bước cài đặt Eureka Server phía Backend.
* **Prompt cho Google Slides AI**:
  > "Create a 3-step checklist layout slide on a light purple (#F5F3FF) background. Title: 'Cài đặt Eureka Server'. Step 1 card: Add 'eureka-server' dependency. Step 2 card: Add '@EnableEurekaServer' annotation. Step 3 card: Configure YAML properties (port 8761, register-with-eureka: false, fetch-registry: false). Add a tip callout explain why server does not register with itself."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu tím nhạt `#F5F3FF`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu tím đậm `#5B21B6`: *"Cài đặt Eureka Server từ đầu (3 bước)"*.
    - **3 Thẻ bước thực hiện**: Vẽ 3 khối chữ nhật nằm ngang xếp dọc:
      - `1.` **Thêm Dependency**: *spring-cloud-starter-netflix-eureka-server*
      - `2.` **Thêm Annotation**: *Đính kèm `@EnableEurekaServer` vào Application Class.*
      - `3.` **Cấu hình YAML (application.properties)**:
        `server.port: 8761`
        `eureka.client.register-with-eureka: false`
        `eureka.client.fetch-registry: false`
    - **Hộp giải thích (Tip Box)**: Vẽ một ô nhỏ màu trắng bên cạnh bước 3: *"💡 Tại sao set false? Vì Eureka Server chính là cuốn danh bạ, nó không cần tự đăng ký thông tin của chính nó."*
  - **Hiệu ứng chuyển động (Animation)**: Các bước trượt ra lần lượt 1 → 2 → 3, sau đó hộp giải thích nảy lên.

---

#### Slide 6: Đăng ký dịch vụ với Eureka Client
* **Mục tiêu**: Hướng dẫn cấu hình phía ứng dụng Client để tự báo cáo thông tin lên Eureka Server.
* **Prompt cho Google Slides AI**:
  > "Design a dark code theme slide (#1E1E1E) split into two columns. Left column displays client configurations in YAML: spring.application.name, eureka.client.service-url.defaultZone=http://localhost:8761/eureka/, prefer-ip-address: true. Right column shows labeled explanation cards for application name on dashboard, eureka zone url, and preferring IP over hostname. Title: 'Cấu hình Eureka Client'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu tối `#1E1E1E`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu chữ trắng: *"Cấu hình Eureka Client trong application.properties"*.
    - **Cột Trái (YAML Code)**: Hộp đen chứa các thuộc tính YAML:
      ```yaml
      spring:
        application:
          name: user-service
      eureka:
        client:
          service-url:
            defaultZone: http://localhost:8761/eureka/
        instance:
          prefer-ip-address: true
      ```
    - **Cột Phải (Giải thích)**:
      - `spring.application.name`: *Đặt tên dịch vụ để hiển thị trên Dashboard.*
      - `defaultZone`: *Địa chỉ kết nối đến Eureka Server.*
      - `prefer-ip-address`: *Bắt buộc Eureka sử dụng IP của Client thay vì Hostname (tránh lỗi phân giải domain).*
  - **Hiệu ứng chuyển động (Animation)**: Code YAML hiện lên trước, sau đó các thẻ chú giải cột phải trượt nhẹ sang trái tương ứng.

---

#### Slide 7: Cơ chế Cân Bằng Tải (@LoadBalanced RestTemplate)
* **Mục tiêu**: Hướng dẫn thay thế gọi API truyền thống bằng gọi qua tên dịch vụ logic.
* **Prompt cho Google Slides AI**:
  > "Create a comparison slide on dark background (#0F172A). Title: 'Gọi dịch vụ bằng Tên Logic'. Show 'Before' with red X code calling 'http://192.168.1.50:8084/api/payments'. Show 'After' with green check code calling 'http://payment-service/api/payments'. Add a Spring Java Configuration code snippet showing '@Bean' and '@LoadBalanced' annotations. Title: '@LoadBalanced RestTemplate'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu tối `#0F172A`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu trắng: *"Gọi API qua Tên Logic với @LoadBalanced"*.
    - **Khối So sánh code**:
      - Box Đỏ: *❌ KHÔNG NÊN: url = "http://192.168.1.50:8084"; restTemplate.getForObject(url, ...);*
      - Box Xanh: *✅ KHUYẾN NGHỊ: url = "http://payment-service"; restTemplate.getForObject(url, ...);*
    - **Khối cấu hình Java Bean**: Vẽ ô code màu xám sáng chứa đoạn code:
      ```java
      @Bean
      @LoadBalanced  // <-- Bắt buộc để dịch tên service thành IP thực tế
      public RestTemplate restTemplate() {
          return new RestTemplate();
      }
      ```
  - **Hiệu ứng chuyển động (Animation)**: Code lỗi mờ đi và bị gạch ngang, code tối ưu hiện sáng lên cùng chú thích của `@LoadBalanced`.

---

#### Slide 8: Giao diện quản trị Eureka Dashboard
* **Mục tiêu**: Giúp học viên làm quen và đọc hiểu các thông tin trên giao diện của Eureka.
* **Prompt cho Google Slides AI**:
  > "Design a mockup of a browser displaying Eureka Dashboard. URL bar shows 'http://localhost:8761'. The webpage title is 'Spring Eureka'. Under 'Instances registered with Eureka', show a table with columns 'Application', 'AMIs', 'Availability Zones', 'Status'. Include rows: 'USER-SERVICE' (UP), 'ORDER-SERVICE' (UP), 'PAYMENT-SERVICE' (UP, showing 2 instances like localhost:8084, localhost:8085). Add glowing labels pointing to the status and scale indicators."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu xám sáng `#F8FAFC`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu tối `#1E293B`: *"Trực quan hóa qua Eureka Dashboard"*.
    - **Mô phỏng trình duyệt Browser Chrome**: Vẽ khung chữ nhật lớn màu xám nhạt làm cửa sổ trình duyệt, thanh địa chỉ ghi: `🌐 http://localhost:8761`.
    - **Nội dung trang web**:
      - Tiêu đề trang: *🌿 Spring Eureka Dashboard*
      - Bảng Instances Registered:
        - *Application: USER-SERVICE | Status: UP (1) - localhost:8081*
        - *Application: PAYMENT-SERVICE | Status: UP (2) - 192.168.1.50:8084, 192.168.1.51:8085* (Highlight đỏ/cam dòng này).
      - Vẽ 2 mũi tên chỉ vào số *(2)* giải thích: *"Minh chứng hệ thống đã tự cân bằng tải trên 2 instance khác nhau!"*
  - **Hiệu ứng chuyển động (Animation)**: Khung trình duyệt tải như một trang web thật, bảng dữ liệu hiện từ từ và mũi tên chỉ dẫn nhảy ra sau cùng.

---

#### Slide 9: Độ Sẵn Sàng Cao: Eureka Cluster
* **Mục tiêu**: Giới thiệu giải pháp chạy cụm Eureka trong môi trường sản phẩm để tránh Single Point of Failure.
* **Prompt cho Google Slides AI**:
  > "Create a slide showing High Availability (HA) with a Eureka Cluster. Draw a triangle topology with 3 Eureka server nodes. Arrows between them indicate 'Peer Replication'. Below them, show microservices sending registration to all 3 nodes. Add a red X over Eureka 2 to show it goes down, but write a green check showing Eureka 1 and 3 still service requests normally. Title: 'Ha Cluster trong Production'."
* **Thiết kế thủ công (Google Slides UI)**:
  - **Layout**: Chọn Layout **Blank**.
  - **Màu nền**: Màu trắng tinh `#FFFFFF`.
  - **Bố cục & Đối tượng**:
    - **Tiêu đề**: Cỡ chữ **28pt Bold**, màu đỏ đậm `#991B1B`: *"Thiết kế Cluster chịu lỗi (High Availability)"*.
    - **Sơ đồ 3 Eureka Nodes**: Vẽ 3 hình tròn đại diện cho 3 Eureka Servers xếp thành hình tam giác.
      - Đường mũi tên hai chiều nét đứt giữa chúng: *"Peer Replication (Đồng bộ danh bạ chéo)"*.
    - **Kịch bản lỗi**: Vẽ một chữ **X đỏ** đè lên Eureka Node 2.
      - Callout bên cạnh: *"Node 2 DOWN"* (màu đỏ).
      - Callout khác chỉ vào Node 1 và 3: *"Vẫn sống và tiếp nhận cuộc gọi bình thường! Không có downtime hệ thống!"* (màu xanh lá).
  - **Hiệu ứng chuyển động (Animation)**: 3 node Eureka hiện ra và đồng bộ nhau, sau đó mô phỏng sự cố Node 2 bị sập (biến mất hoặc có dấu X đỏ nhấp nháy), hai node còn lại sáng rực lên để thể hiện tính chịu lỗi.

---

## 📝 Tổng kết Session 03

### Kiến trúc hoàn chỉnh sau Session 03

[Prompt: An isometric illustration of the complete microservice architecture built in Session 03.

Top layer shows "Git Repository (Config)" connected to "Spring Cloud Config Server (port 8888)" with the label "Tệp cấu hình (Config files)". Left side shows "Eureka Server (Service Registry, port 8761)" as a purple block. Center shows 4 microservice blocks (User Service 8081, Order Service 8083, Payment Service 8084, Notification Service 8085), each connected to Config Server with arrows labeled "1. Lấy cấu hình khi khởi động (Fetch Config on startup)" and connected to Eureka Server with arrows labeled "2. Đăng ký + Heartbeat (Register + Heartbeat)". Shows Order Service calling Payment Service with a dashed arrow labeled "3. Khám phá qua Eureka -> Gọi trực tiếp (Discover via Eureka -> Call directly)". Layered architecture style.

Corporate technology style,

clean line art,

neon blue and white accents,

soft holographic lighting,

ultra detailed,

8k resolution,

Light-colored background and oriented towards microservice technology, Java Spring boot.,

presentation slide illustration.

The language used in the images is Vietnamese, with only the technical terms retained in English.]

```
Luồng khởi động một Microservice sau Session 03:

1. Config Server khởi động → kết nối Git repository
2. Eureka Server khởi động → sẵn sàng nhận đăng ký
3. user-service khởi động:
   a. Gọi Config Server: "GET /user-service/dev"
   b. Load config (DB URL, port, etc.)
   c. Đăng ký vào Eureka: "Tôi là user-service, port 8081"
   d. Bắt đầu gửi heartbeat mỗi 30s
4. order-service khởi động (tương tự)
5. order-service gọi user-service:
   a. Tra Eureka: "Địa chỉ của user-service là gì?"
   b. Nhận: [localhost:8081]
   c. Gọi trực tiếp: HTTP GET localhost:8081/api/users/1
```

---

### So sánh – Trước và Sau Session 03

| Vấn đề | Trước Session 03 | Sau Session 03 |
|---|---|---|
| **Quản lý Config** | 10 file properties rời rạc | 1 Config Server tập trung |
| **Config thay đổi** | Sửa 10 file + deploy 10 lần | Sửa Git + POST /refresh |
| **Địa chỉ Service** | Hardcoded IP/port trong code | Tên logic + Eureka Discovery |
| **Scale service** | Phải update URL ở service gọi | Tự động load balance |
| **Service down** | Gọi vào địa chỉ chết | Eureka tự loại khỏi registry |
| **Environment** | Nhầm lẫn dev/prod config | Profile-based tự động |

---

### 🎯 Câu hỏi ôn tập Session 03

1. Spring Cloud là gì? Liệt kê 5 module Spring Cloud và vấn đề mỗi module giải quyết.
2. Tại sao cần Centralized Configuration thay vì mỗi service tự quản lý `application.properties`?
3. Giải thích thứ tự ưu tiên config khi Config Server merge: `user-service-dev.properties`, `user-service.properties`, `application-dev.yml`, `application.properties`.
4. `@RefreshScope` hoạt động như thế nào? Khi nào cần dùng nó?
5. Phân biệt Server-side Discovery và Client-side Discovery. Spring Cloud Eureka thuộc loại nào?
6. Khi `order-service` gọi `http://payment-service/api/payments`, điều gì xảy ra phía sau?
7. Tại sao Eureka Server cần cấu hình `register-with-eureka: false`?
8. Trong production, tại sao cần chạy Eureka Cluster thay vì một Eureka Server duy nhất?

---

### 🗺️ Sơ đồ tổng quan các component

```
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                      │
│                                                             │
│  ┌──────────────────┐      ┌──────────────────────────┐   │
│  │  Git Repository  │─────▶│  Config Server (:8888)   │   │
│  │  (Config files)  │      │  @EnableConfigServer     │   │
│  └──────────────────┘      └──────────────────────────┘   │
│                                        │                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      Eureka Server (:8761)                           │  │
│  │      @EnableEurekaServer                             │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ Registry: user-service:8081 | UP               │ │  │
│  │  │           order-service:8083 | UP              │ │  │
│  │  │           payment-service:8084 | UP            │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐  │
│  │ user-service│  │order-service│  │ payment-service  │  │
│  │   :8081     │  │   :8083     │  │    :8084         │  │
│  │             │  │             │  │                  │  │
│  │ [Fetch Conf]│  │ [Fetch Conf]│  │  [Fetch Config]  │  │
│  │ [Register]  │  │ [Register]  │  │  [Register]      │  │
│  │ [Heartbeat] │  │ [Heartbeat] │  │  [Heartbeat]     │  │
│  └─────────────┘  └──────┬──────┘  └──────────────────┘  │
│                           │ Discover & Call                 │
│                           └────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

---

### 📚 Tài liệu tham khảo

- **Spring Cloud Documentation** – spring.io/projects/spring-cloud
- **Spring Cloud Config Reference** – docs.spring.io/spring-cloud-config
- **Netflix Eureka Wiki** – github.com/Netflix/eureka/wiki
- **Building Microservices** – Sam Newman (O'Reilly, Chapter 11: Microservices at Scale)
- **Microservices Patterns** – Chris Richardson (Manning, Chapter 11: Developing production-ready services)
- **Spring Cloud in Action** – John Carnell (Manning)

---

> **Session tiếp theo:** Session 04 – API Gateway & Service Communication
> *Học về API Gateway với Spring Cloud Gateway: routing, filter, authentication, rate limiting và các pattern giao tiếp giữa Microservices (REST, gRPC, Message Queue).*
