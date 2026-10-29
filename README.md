# Trainghienkhachhang.online – Sun World Ba Na Hills

Ứng dụng web tối ưu cho thiết bị di động phục vụ công tác nâng cao trải nghiệm khách hàng tại Sun World Ba Na Hills:
1. **Đào tạo & Briefing đầu ca**: Báo cáo kèm hình ảnh, danh sách người chủ trì, số lượng nhân sự tham gia, khu vực (Máng trượt 1, 2, 3, FEC).
2. **Checklist kiểm tra, đánh giá nhân sự**: Đánh giá 4 tiêu chí cốt lõi (Hình ảnh, Tác phong, Dịch vụ: Đón khách, Dịch vụ: Tiễn khách) kèm hình ảnh & video minh chứng.
3. **Dashboard tuần**:
   - 🏆 Top 2 nhân sự xuất sắc nhất tuần
   - ⚠️ Top 10 nhân sự cần cải thiện (chi tiết từng lỗi vi phạm)
   - 🎓 Bảng tổng hợp Briefing theo người chủ trì

---

## Triển khai (Deploy) miễn phí trên GitHub Pages

1. Đẩy mã nguồn lên GitHub repository.
2. Vào **Settings** -> **Pages** trên repository.
3. Tại phần **Source**, chọn nhánh `main` (hoặc `master`), thư mục chọn `/webapp` (hoặc `/root` nếu chuyển file ra ngoài).
4. Nhấn **Save**. Sau 1-2 phút, bạn sẽ có link chạy trực tiếp miễn phí: `https://<ten-user>.github.io/<ten-repo>/`

---

## Cấu hình Firebase (Lưu trữ tập trung đa thiết bị)

1. Tạo dự án tại [Firebase Console](https://console.firebase.google.com).
2. Kích hoạt **Cloud Firestore** và **Firebase Storage**.
3. Copy đoạn mã cấu hình `firebaseConfig` và dán vào file `webapp/firebase-config.js` hoặc nhập trực tiếp trong mục **Menu / Cài đặt** của ứng dụng.
4. Mọi thiết bị điện thoại khi mở Web App sẽ tự động đồng bộ dữ liệu báo cáo và hình ảnh/video về máy chủ Firebase.
