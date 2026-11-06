# Tâm An Lạc v1.0
Đi chùa online, giải trí
Đây là bản làm lại độc lập. Giải nén ZIP, sau đó mở HUONG_DAN.html để xem hướng dẫn dễ đọc.

1. Chuẩn bị Firebase (làm một lần)
Dự án Firebase đang khai báo sẵn là tamanlac-e924e, lấy từ file gốc bạn cung cấp. Không có mật khẩu hoặc khóa máy chủ trong gói.

1. Mở https://console.firebase.google.com/ và chọn dự án tamanlac-e924e.
2. Authentication > Sign-in method (hoặc Sign-in providers): bật Anonymous và Google. Với Google, chọn email hỗ trợ của bạn nếu được yêu cầu, rồi Save.
3. Build > Realtime Database > Create database. Chọn vị trí phù hợp và chế độ khóa (Locked mode). Bản mới dùng Realtime Database cho người chơi, chat và tiến trình tài khoản; không sử dụng các đường dẫn Firestore cũ.
4. Trong Realtime Database > Rules, nếu đây là database mới, chép toàn bộ nội dung firebase/database.rules.json rồi Publish. Nếu database đã phục vụ ứng dụng khác, sao lưu quy tắc hiện hữu và ghép nhánh tal_v1 vào bộ quy tắc đó; không thay toàn bộ bộ quy tắc cũ. Các quyền mở tại nhánh cha của database có thể làm vô hiệu mục đích bảo vệ các nhánh con, vì vậy nên dùng database riêng cho game nếu quy tắc cũ đang mở rộng.
5. Realtime Database > Data: sao chép URL chính xác của database, ví dụ dạng https://TEN-DATABASE.REGION.firebasedatabase.app hoặc https://TEN-DATABASE.firebaseio.com. Không tự đoán URL.
6. Mở site/config.js bằng VS Code hoặc Notepad. Dán URL giữa dấu nháy của databaseURL và lưu. Các trường còn lại đã khớp file Firebase cũ. Nếu bạn dùng dự án mới, thay toàn bộ cấu hình Web app bằng cấu hình dự án mới.

Ví dụ dòng cần chỉnh (URL chỉ minh họa, không sử dụng nguyên ví dụ):

databaseURL:'URL-BAN-SAO-CHEP-TU-FIREBASE'

2. Đưa lên Netlify
1. Truy cập https://app.netlify.com/ và đăng nhập.
2. Tạo site/project thử mới bằng Deploy manually (hoặc Netlify Drop).
3. Kéo thư mục site trong gói đã giải nén vào vùng tải lên. Thư mục này phải có index.html ngay bên trong, cùng app.js, cloud.js, core.js, scene.js, software-renderer.js, style.css, config.js, assets và vendor.
4. Đợi deploy thành công, mở địa chỉ HTTPS mà Netlify cấp. Không mở index.html bằng cách nhấp đúp file trên máy: game dùng JavaScript modules, cần máy chủ web.
5. Firebase > Authentication > Settings > Authorized domains > Add domain. Thêm đúng hostname Netlify, ví dụ ten-chua.netlify.app, không thêm https:// hay dấu / ở cuối. Nếu có domain riêng, thêm domain đó nữa.
6. Quay lại trang game, tải lại. Trên thanh trạng thái phải hiện người đang ở chùa. Nếu vẫn hiện “Đang chơi trên trình duyệt”, kiểm tra databaseURL trong config.js đã được lưu và đã deploy lại chưa.

Không cần hosting riêng, không cần cài Node.js để tải bản đã chuẩn bị lên Netlify. Khi dùng Git với Netlify, file netlify.toml ở thư mục gốc chỉ định thư mục publish là site.

3. Kiểm tra trước khi chia sẻ
- Mở cùng địa chỉ trên hai thiết bị (hoặc một cửa sổ thường và một cửa sổ ẩn danh). Đặt hai tên khác nhau. Di chuyển, niệm Phật, ngồi thiền và thay áo; thiết bị kia phải thấy nhân vật và trạng thái tương ứng.
- Gửi một tin nhắn từ mỗi thiết bị. Tin xuất hiện trong chat chung; có thể ẩn/hiện chat. Không đặt giới hạn độ dài hoặc khoảng chờ tin nhắn trong giao diện; dịch vụ nền vẫn có giới hạn kỹ thuật của Firebase. Mỗi lần mở chỉ tải 60 tin gần nhất để tránh tải toàn bộ lịch sử.
- Đóng một cửa sổ. Firebase tự xóa hiện diện khi phát hiện ngắt kết nối; mạng đứt đột ngột có thể cần thời gian nhận biết, không nhất thiết biến mất ngay lập tức.
- Dâng hương lần đầu được 3 điểm; lặp lại trong ngày không tăng điểm. Lễ Phật tối đa 3 lần cộng điểm; 10 câu niệm được 1 điểm; ngồi thiền đủ 5 phút được 2 điểm. Ngồi thiền chỉ tính thời gian khi trang đang hiển thị. Đi bộ sẽ kết thúc hoạt động đang thực hiện.
- Đổi tên trong hồ sơ, tải lại trang, kiểm tra tên và điểm còn nguyên. Đăng nhập Google khi muốn giữ hành trình trên tài khoản. Khi tài khoản đã có tiến trình, lựa chọn giữa tiến trình trên máy và trên tài khoản được hiển thị rõ; bản còn lại được sao lưu trên trình duyệt.
- Đăng nhập cùng Google trên thiết bị khác để kiểm tra tiến trình tài khoản. Nếu hai thiết bị cùng thay đổi dữ liệu, bản cũ sẽ không tự ghi đè; game yêu cầu chọn hành trình tiếp tục.
- Mở Cảnh & nhạc, thử ngày/hoàng hôn/đêm, nhạc, âm lượng và chế độ nhẹ. Trên điện thoại dùng cần điều khiển, hoặc chạm nền để đi, kéo nền để xoay.

4. Quy tắc đã chốt
14 danh hiệu × 7 bậc = 98 cấp. Gieo Duyên, Sơ Tâm, An Tâm, Tĩnh Tâm, Tinh Tấn, Chánh Niệm, Hạnh Sen, An Lạc, Tâm Sáng, An Nhiên, Trí Tuệ, Tịnh Tâm, Tự Tại, Viên Dung.

Mỗi lần lên cấp tốn 3 điểm ở Gieo Duyên, 4 điểm ở Sơ Tâm, 5 ở An Tâm, tăng 1 điểm theo mỗi danh hiệu. Cấp cuối là Viên Dung 7. Mốc tổng tích lũy: Sơ Tâm 1 = 21; An Tâm 1 = 49; An Lạc 1 = 294; Viên Dung 7 = 915. Tối đa 23 điểm/ngày, tức nhanh nhất khoảng 40 ngày. Không bị trừ điểm khi nghỉ. Ngày làm mới theo múi giờ Việt Nam.

Hoạt động và điểm: dâng hương 3 × 1; lễ Phật 2 × 3; niệm Phật 1 × 5 (mỗi 10 câu); thiền 2 × 3 (mỗi 5 phút); chuông 1 × 1; chào đạo hữu 1 × 2.

Bốn màu áo được chọn tự do, không tác động công đức. Không dùng cửa hàng hoặc nhiệm vụ thưởng lớn của bản cũ.

5. Nội dung hình ảnh, âm thanh
Tượng A Di Đà: ảnh minh họa tạo riêng theo hình dáng tượng thờ thực tế, đặt trong không gian chùa 3D. Đây là hình ảnh mặt trước trên một mặt phẳng có alpha, không phải mô hình tượng có thể xem 360 độ. Toàn bộ khuôn viên, nhân vật và điều khiển vẫn dựng bằng hình học 3D. Máy hỗ trợ WebGL dùng GPU; máy không hỗ trợ dùng bộ dựng hình phần mềm cùng cảnh, chất lượng/tốc độ thấp hơn.

Hai bản nhạc từ file bạn gửi đã đưa vào assets: Nhạc thiền tối đa 45 phút và Bát Nhã Tâm Kinh giữ nguyên khoảng 26 phút 36 giây, nén 80 kbps để giảm dung lượng tải. Ngoài ra có tiếng chuông tổng hợp không cần tải MP3. Âm thanh chỉ phát sau khi người dùng bấm. Quyền phát công khai của hai bản thu chưa được xác nhận độc lập; bạn cần có quyền sử dụng bản thu khi công khai website.

6. Trạng thái kiểm thử và giới hạn
- Đã kiểm tra quy tắc 98 cấp, 23 điểm/ngày, thời điểm đổi ngày Việt Nam, niệm Phật và thời gian thiền bằng test tự động.
- Đã kiểm tra quy tắc Firebase trên emulator: hai khách dùng chung dữ liệu, chat dài hơn giới hạn bản cũ, quyền đọc/ghi riêng tư, ngăn ghi vào nhân vật/tài khoản người khác, xử lý revision để tránh ghi đè tiến trình cũ.
- Đã kiểm tra giao diện trên màn hình thường và khung 390 px, cộng điểm, giữ điểm khi tải lại, niệm đủ mười câu và phát bản nhạc 45 phút. Trình duyệt thử không cung cấp WebGL, nên kiểm tra hình ảnh được thực hiện bằng bộ dựng hình tương thích; hiệu năng GPU trên thiết bị thực chưa được đo.
- Chưa đăng nhập Google trên tên miền Netlify thực tế hoặc thay cấu hình Firebase trên tài khoản của bạn. Phải hoàn tất bước 1–3 để xác nhận kết nối thật. Không có mã nào đã được tự động đưa lên trang Netlify hiện tại của bạn.
- Điểm được tính ở phía trình duyệt. Quy tắc database bảo vệ dữ liệu giữa các tài khoản, không xác minh độc lập việc thực hiện từng thao tác tu tập.
- Khách không lưu tiến trình cá nhân lên cloud; xóa dữ liệu trình duyệt hoặc dùng chế độ ẩn danh rồi đóng cửa sổ có thể mất tiến trình. Có chức năng xuất/khôi phục bản sao JSON trong hồ sơ.
- Chat dùng dữ liệu chung của phòng tal_v1. Firebase có hạn mức lưu lượng/kết nối của gói đang sử dụng; dữ liệu tin nhắn tích lũy đến khi người quản trị dọn bằng Firebase Console.

7. Khi có lỗi
“Chưa kết nối cộng đồng”: kiểm tra Internet, URL database và việc bật Anonymous.
“Permission denied”: kiểm tra đang dùng Rules của Realtime Database (không phải Firestore), rules đã Publish và database thuộc cùng dự án với Authentication.
“auth/unauthorized-domain”: thêm hostname Netlify vào Authorized domains.
Google bị đóng popup: mở trong Chrome/Safari/Edge chính, tránh trình duyệt nhúng của Facebook/Zalo; cho phép popup của trang rồi thử lại.
Không thấy ảnh/nhạc: kiểm tra đã tải đủ thư mục assets lên Netlify, đúng tên chữ thường và đường dẫn.
Không thấy người khác: mở hai trình duyệt độc lập, vào cùng địa chỉ và cùng ROOM trong config.js; kiểm tra Firebase > Realtime Database > Data > tal_v1 > rooms.
Chuyển thiết bị thấy điểm chưa cập nhật: chờ hồ sơ báo “Đã đồng bộ tài khoản”, sau đó tải lại thiết bị mới. Nếu có hai bản tiến trình, chọn đúng bản bạn muốn tiếp tục.

Nếu cần cập nhật bản mới: chỉnh file, kéo lại thư mục site vào phần Deploys của đúng dự án Netlify. Bản mới giữ đường dẫn dữ liệu tal_v1 và các khóa lưu tiến trình tal.v1 để không mất hành trình.
