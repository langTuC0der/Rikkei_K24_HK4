#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
validate_lesson.py — Kiểm tra chất lượng và cấu trúc tệp Markdown bài giảng.
Sử dụng: python validate_lesson.py <đường_dẫn_tệp_markdown>
"""
import sys
import re
import io

# Cấu hình mã hóa UTF-8 cho console Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def validate_markdown(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"❌ KHÔNG TÌM THẤY TỆP: {file_path}")
        return False
    except Exception as e:
        print(f"❌ LỖI KHI ĐỌC TỆP: {e}")
        return False

    errors = []

    # 1. Kiểm tra cấu trúc 7 phần tiêu chuẩn (## N. Tiêu đề)
    headings = re.findall(r'^## \d+\.\s', content, re.MULTILINE)
    if len(headings) != 7:
        errors.append(f"Cấu trúc không hợp lệ: Có {len(headings)}/7 phần tiêu đề cấp 2 bắt buộc.")
    
    # 2. Kiểm tra cấm sử dụng ngôn ngữ Python/JS trong các khối code demo
    code_langs = re.findall(r'```(\w+)', content)
    banned_langs = {'python', 'javascript', 'js', 'py'}
    for lang in code_langs:
        if lang.lower() in banned_langs:
            errors.append(f"Mã nguồn cấm: Phát hiện khối code ngôn ngữ '{lang}' (chỉ cho phép Java/cấu hình).")

    # 3. Kiểm tra cấm trắc nghiệm (phải dùng tự luận)
    if re.search(r'^[A-D]\.\s', content, re.MULTILINE):
        errors.append("Câu hỏi cấm: Phát hiện câu hỏi trắc nghiệm dạng A/B/C/D (chỉ cho phép tự luận).")

    # 4. Kiểm tra số lượng câu hỏi tự luận ở phần 7 (## 7. Câu hỏi đánh giá)
    questions = re.findall(r'^### Câu \d+', content, re.MULTILINE)
    if len(questions) != 3:
        errors.append(f"Câu hỏi không đạt: Có {len(questions)}/3 câu hỏi tự luận ở phần 7.")

    # 5. Kiểm tra gợi ý đáp án kèm theo
    answers = re.findall(r'Gợi ý đáp án', content)
    if len(answers) < 3:
        errors.append(f"Đáp án không đạt: Chỉ tìm thấy {len(answers)}/3 phần 'Gợi ý đáp án'.")

    # Hiển thị kết quả kiểm định
    if errors:
        print(f"❌ KIỂM ĐỊNH THẤT BẠI cho tệp: {file_path}")
        for err in errors:
            print(f"  - {err}")
        return False
    else:
        print(f"✅ KIỂM ĐỊNH THÀNH CÔNG: Tệp {file_path} đạt chuẩn 100%!")
        return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Sử dụng: python validate_lesson.py <path_to_markdown_file>")
        sys.exit(1)
    
    success = validate_markdown(sys.argv[1])
    sys.exit(0 if success else 1)
