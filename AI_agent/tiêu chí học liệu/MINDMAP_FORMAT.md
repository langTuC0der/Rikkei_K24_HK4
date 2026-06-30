# HƯỚNG DẪN XÂY DỰNG MINDMAP CHO CẢ SESSION (XMIND IMPORT)

Tài liệu này quy định tiêu chuẩn để tạo lập sơ đồ tư duy dưới dạng mã Markdown thuần túy, phục vụ cho việc nhập dữ liệu trực tiếp (import) vào các phần mềm sơ đồ tư duy như XMind.

## 1. Nguyên tắc thiết kế cốt lõi

* **Tính tổng hợp:** Mỗi Session có duy nhất một tệp tin Mindmap tổng hợp nội dung của tất cả các Lesson thuộc Session đó.
* **Bám sát cấu trúc:** Sơ đồ phải phản ánh chính xác các đầu mục chính và phụ của từng bài học, cùng các từ khóa kiến thức cốt lõi.
* **Không dùng số thứ tự đầu mục:** Loại bỏ toàn bộ tiền tố số như "1.", "2.", "A.", "B." khỏi tên tiêu đề để khi hiển thị trong XMind sơ đồ được sạch sẽ, trực quan.
* **Không dùng Mermaid:** Không sử dụng các khối code block của Mermaid hay các định dạng trang trí phụ. Tệp tin chỉ chứa cấu trúc tiêu đề và danh sách Markdown tiêu chuẩn.
* **Không dùng Emoji:** Giữ phong cách học thuật chuyên nghiệp, không sử dụng emoji.
* **Viết bằng tiếng Việt:** Sử dụng tiếng Việt chuẩn trên toàn sơ đồ.

## 2. Định dạng cấu trúc Markdown bắt buộc

Sử dụng phân cấp tiêu đề (`#`, `##`, `###`) và danh sách gạch đầu dòng (`-`) để tạo mối quan hệ cha-con (parent-child relationship):

* **Tiêu đề cấp 1 (#):** Tên của Session (Chủ đề trung tâm - Central Topic).
* **Tiêu đề cấp 2 (##):** Tên các Lesson trong Session (Nhánh chính - Main Topics).
* **Tiêu đề cấp 3 (###):** Các đầu mục lớn của Lesson như "Mục tiêu học tập", "Đặt vấn đề thực tế", "Kiến thức cốt lõi", "Phân tích tình huống thực tế", "Demo minh họa", "Tổng kết" (Nhánh phụ - Sub-topics).
* **Danh sách gạch đầu dòng (-):** Các từ khóa tóm tắt chi tiết, ví dụ hoặc bước thực hiện (Nút lá - Leaf nodes).

## 3. Quy tắc đặt tên tệp tin và lưu trữ

* **Thư mục lưu trữ:** Lưu trực tiếp trong thư mục của Session tương ứng (ví dụ: thư mục `ss1/`).
* **Tên tệp tin:** Sử dụng định dạng: `session_<số-thứ-tự-session>_mindmap.md` (ví dụ: `ss1/session_01_mindmap.md`).
