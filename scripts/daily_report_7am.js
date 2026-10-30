/**
 * =========================================================================
 * BẢN TIN TỰ ĐỘNG 7H SÁNG – SUN WORLD BA NA HILLS
 * Dự án: Trainghienkhachhang.online
 * Chức năng: Tự động chạy lúc 7:00 AM mỗi ngày, tổng hợp Top 2 xuất sắc
 *            và Top 10 cần cải thiện, gửi email trực tiếp về Gmail Admin.
 * =========================================================================
 * 
 * HƯỚNG DẪN KÍCH HOẠT (Chỉ 1 phút):
 * 1. Truy cập: https://script.google.com
 * 2. Bấm "Dự án mới" (New project)
 * 3. Dán toàn bộ mã nguồn này vào
 * 4. Điền địa chỉ Gmail Admin của bạn vào biến ADMIN_GMAIL bên dưới
 * 5. Chọn hàm "setupDaily7AMTrigger" trên thanh công cụ -> Bấm "Chạy" (Run)
 *    -> Đồng ý cấp quyền gửi email.
 * => Xong! Đúng 7h sáng hàng ngày hệ thống sẽ tự gửi báo cáo về Gmail của bạn!
 */

// CẤU HÌNH DỰ ÁN
const ADMIN_GMAIL = "phongnhh@sunworld.vn"; // Thay bằng Gmail nhận báo cáo của bạn
const PROJECT_ID = "trainghiem-khachhang";
const API_KEY = "AIzaSyAhtNp-JTKMMNUVo4suOOdA4CrT9C3XIoU";
const APP_URL = "https://laotuung-beep.github.io/trainghienkhachhang-online/";

const CRITERIA_NAMES = {
  thaidovuive: "Thái độ vui vẻ",
  nucuoi: "Nụ cười",
  cuchivaytay: "Cử chỉ vẫy tay/chào",
  loichaodon: "Lời chào khi đón khách",
  loichaotien: "Lời chào khi tiễn khách",
  giongnoi: "Giọng nói",
  tinhchudong: "Tính chủ động",
  duytriondinh: "Duy trì ổn định"
};

/**
 * 1. Hàm cài đặt lịch tự động chạy lúc 7h sáng mỗi ngày
 */
function setupDaily7AMTrigger() {
  // Xóa các trigger cũ nếu có
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  // Tạo trigger mới: Chạy mỗi ngày vào khoảng 7h sáng
  ScriptApp.newTrigger("sendDaily7AMReport")
    .timeBased()
    .everyDays(1)
    .atHour(7)
    .create();

  Logger.log("✅ Đã thiết lập thành công lịch chạy 7h sáng hàng ngày!");
}

/**
 * 2. Hàm chính: Lấy dữ liệu Firestore, phân tích và gửi Gmail
 */
function sendDaily7AMReport() {
  try {
    const today = new Date();
    const todayStr = Utilities.formatDate(today, "Asia/Ho_Chi_Minh", "dd/MM/yyyy");

    // Lấy ngày đầu tuần (Thứ 2)
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    const weekStartStr = Utilities.formatDate(monday, "Asia/Ho_Chi_Minh", "yyyy-MM-dd");

    // Gọi Firestore REST API để lấy toàn bộ records
    const url = "https://firestore.googleapis.com/v1/projects/" + PROJECT_ID + "/databases/(default)/documents/records?key=" + API_KEY;
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    
    if (response.getResponseCode() !== 200) {
      throw new Error("Lỗi kết nối Firestore: " + response.getContentText());
    }

    const data = JSON.parse(response.getContentText());
    const documents = data.documents || [];

    // Phân tích dữ liệu checklist và briefing trong tuần
    const staffMap = {};
    let briefingCount = 0;
    let briefingAttendees = 0;

    documents.forEach(function(doc) {
      const f = doc.fields || {};
      const type = f.type ? f.type.stringValue : "";
      const date = f.date ? f.date.stringValue : "";

      // Chỉ lọc các báo cáo từ đầu tuần đến nay
      if (date < weekStartStr) return;

      if (type === "briefing") {
        briefingCount++;
        briefingAttendees += f.attendees ? Number(f.attendees.integerValue || f.attendees.doubleValue || 0) : 0;
      } else if (type === "checklist") {
        const emp = f.employee ? f.employee.stringValue : "Chưa rõ";
        const score = f.score ? Number(f.score.integerValue || f.score.doubleValue || 0) : 100;
        const area = f.area ? f.area.stringValue : "";
        
        // Lấy danh sách lỗi / tiêu chí điểm thấp
        const fails = [];
        if (f.fails && f.fails.arrayValue && f.fails.arrayValue.values) {
          f.fails.arrayValue.values.forEach(function(v) {
            fails.push(v.stringValue);
          });
        }

        if (!staffMap[emp]) {
          staffMap[emp] = { name: emp, count: 0, totalScore: 0, failsCount: 0, crit: {}, areas: {} };
        }
        staffMap[emp].count++;
        staffMap[emp].totalScore += score;
        staffMap[emp].failsCount += fails.length;
        staffMap[emp].areas[area] = true;

        fails.forEach(function(fid) {
          staffMap[emp].crit[fid] = (staffMap[emp].crit[fid] || 0) + 1;
        });
      }
    });

    const staffList = Object.keys(staffMap).map(function(k) {
      const s = staffMap[k];
      s.avg = Math.round(s.totalScore / s.count);
      return s;
    });

    // Top 2 xuất sắc nhất (Điểm TB cao nhất, ít lỗi nhất)
    const top2 = staffList.slice().sort(function(a, b) {
      return b.avg - a.avg || a.failsCount - b.failsCount || b.count - a.count;
    }).slice(0, 2);

    // Top 10 cần cải thiện (Nhiều lỗi nhất, điểm TB thấp nhất)
    const top10 = staffList.slice()
      .filter(function(s) { return s.failsCount > 0; })
      .sort(function(a, b) {
        return b.failsCount - a.failsCount || a.avg - b.avg;
      })
      .slice(0, 10);

    // Tạo nội dung HTML Email
    const htmlBody = buildHtmlEmail(todayStr, top2, top10, briefingCount, briefingAttendees);

    // Gửi email qua Gmail
    GmailApp.sendEmail(ADMIN_GMAIL, "[Sun World Ba Na Hills] Báo cáo 7h Sáng: Top 2 & Top 10 Dịch vụ Khách hàng (" + todayStr + ")", "", {
      htmlBody: htmlBody,
      name: "Trainghienkhachhang.online"
    });

    Logger.log("✅ Đã gửi báo cáo 7h sáng thành công đến: " + ADMIN_GMAIL);
  } catch (err) {
    Logger.log("❌ Lỗi gửi báo cáo: " + err.message);
  }
}

/**
 * 3. Tạo mẫu HTML Email chuyên nghiệp chuẩn nhận diện Sun World
 */
function buildHtmlEmail(todayStr, top2, top10, briefingCount, briefingAttendees) {
  let top2Html = "";
  if (top2.length === 0) {
    top2Html = "<p style='color:#64748b;font-style:italic;'>Chưa có dữ liệu đánh giá tuần này.</p>";
  } else {
    top2.forEach(function(s, idx) {
      const medal = idx === 0 ? "🥇" : "🥈";
      top2Html += `
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:12px 16px;margin-bottom:10px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <b style="font-size:16px;color:#92400e;">${medal} ${s.name}</b>
            <span style="background:#d97706;color:#fff;padding:3px 10px;border-radius:12px;font-weight:bold;font-size:13px;">${s.avg} điểm</span>
          </div>
          <div style="font-size:12px;color:#78350f;margin-top:6px;">
            Số lượt kiểm tra: <b>${s.count}</b> lượt | Lỗi vi phạm: <b>${s.failsCount}</b> lỗi
          </div>
        </div>`;
    });
  }

  let top10Html = "";
  if (top10.length === 0) {
    top10Html = "<p style='color:#15803d;font-weight:bold;'>🎉 Tuyệt vời! Tuần này chưa có nhân sự nào bị ghi nhận vi phạm tiêu chuẩn.</p>";
  } else {
    top10Html = `
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:8px;">
        <thead>
          <tr style="background:#f1f5f9;color:#475569;text-align:left;">
            <th style="padding:8px 10px;border-bottom:2px solid #cbd5e1;">STT</th>
            <th style="padding:8px 10px;border-bottom:2px solid #cbd5e1;">Nhân sự</th>
            <th style="padding:8px 10px;border-bottom:2px solid #cbd5e1;text-align:center;">Điểm TB</th>
            <th style="padding:8px 10px;border-bottom:2px solid #cbd5e1;text-align:center;">Số lỗi</th>
            <th style="padding:8px 10px;border-bottom:2px solid #cbd5e1;">Tiêu chí cần cải thiện</th>
          </tr>
        </thead>
        <tbody>`;
    top10.forEach(function(s, idx) {
      const critList = Object.keys(s.crit).map(function(cid) {
        return (CRITERIA_NAMES[cid] || cid) + " (" + s.crit[cid] + " lần)";
      }).join(", ");

      top10Html += `
        <tr style="border-bottom:1px solid #e2e8f0;background:${idx % 2 === 0 ? '#fff' : '#f8fafc'};">
          <td style="padding:8px 10px;font-weight:bold;color:#64748b;">#${idx + 1}</td>
          <td style="padding:8px 10px;font-weight:bold;color:#0f172a;">${s.name}</td>
          <td style="padding:8px 10px;text-align:center;font-weight:bold;color:#ea580c;">${s.avg}đ</td>
          <td style="padding:8px 10px;text-align:center;font-weight:bold;color:#dc2626;">${s.failsCount}</td>
          <td style="padding:8px 10px;color:#b91c1c;font-size:12px;">${critList || 'Điểm thấp'}</td>
        </tr>`;
    });
    top10Html += `</tbody></table>`;
  }

  return `
    <div style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;">
      <!-- Header Banner -->
      <div style="background:linear-gradient(135deg, #0e4e46, #1e3a5f);color:#ffffff;padding:24px 20px;text-align:center;">
        <h1 style="margin:0;font-size:22px;letter-spacing:-0.3px;">SUN WORLD BA NA HILLS</h1>
        <p style="margin:6px 0 0;font-size:14px;color:#fde68a;font-weight:600;">Trainghienkhachhang.online – Vận hành trò chơi</p>
        <div style="display:inline-block;margin-top:12px;background:rgba(255,255,255,0.15);padding:4px 14px;border-radius:20px;font-size:12px;font-weight:bold;">
          📅 Báo cáo ngày: ${todayStr} (7:00 AM)
        </div>
      </div>

      <!-- Body Content -->
      <div style="padding:24px 20px;">
        <!-- Top 2 -->
        <div style="margin-bottom:24px;">
          <h2 style="font-size:16px;color:#b45309;margin:0 0 10px;display:flex;align-items:center;gap:6px;">
            🏆 1. TOP 2 NHÂN SỰ XUẤT SẮC NHẤT TUẦN
          </h2>
          ${top2Html}
        </div>

        <!-- Top 10 -->
        <div style="margin-bottom:24px;">
          <h2 style="font-size:16px;color:#dc2626;margin:0 0 4px;display:flex;align-items:center;gap:6px;">
            ⚠️ 2. TOP 10 NHÂN SỰ CẦN CẢI THIỆN TIÊU CHUẨN
          </h2>
          <p style="font-size:12px;color:#64748b;margin:0 0 10px;">Xếp theo số tiêu chí bị chấm điểm thấp (1 - 2 sao) trong tuần</p>
          ${top10Html}
        </div>

        <!-- Briefing Summary -->
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:14px 16px;margin-bottom:24px;">
          <h3 style="font-size:14px;color:#15803d;margin:0 0 8px;">🎓 TÌNH HÌNH BRIEFING ĐẦU CA TUẦN NÀY</h3>
          <div style="font-size:13px;color:#166534;">
            • Số buổi briefing đã tổ chức: <b>${briefingCount}</b> buổi<br />
            • Tổng số lượt nhân sự tham gia: <b>${briefingAttendees}</b> lượt
          </div>
        </div>

        <!-- CTA Button -->
        <div style="text-align:center;margin-top:28px;">
          <a href="${APP_URL}" style="display:inline-block;background:linear-gradient(135deg, #0e4e46, #0284c7);color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 28px;border-radius:12px;box-shadow:0 4px 12px rgba(14,78,70,0.3);">
            📱 Mở Web App Trainghienkhachhang.online
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f8fafc;padding:14px 20px;text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;">
        Email này được gửi tự động lúc 7h sáng hàng ngày từ hệ thống Trainghienkhachhang.online.<br />
        Sun World Ba Na Hills © 2026 – Elevate The Experience
      </div>
    </div>
  `;
}
