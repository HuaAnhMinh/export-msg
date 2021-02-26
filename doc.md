# Tài liệu hướng dẫn

## 1. Luồng xử lý

1. Tạo global object `resourcesInfo` để lưu thông tin các nội dung sẽ được tải trong quá trình export.
2. Tạo các thư mục container cần thiết để chứa các file resource như css, hình ảnh âm thanh, js,... (hàm `createRootExportPath` và `createExportDataDir` trong `index.js`)
3. Copy các file css, js từ trong thư mục `templates` vào thư mục xuất kết quả `output` (hàm `copyRequiredResourceToDest` trong `controller.js`).
4. Thu thập thông tin các file media trong đoạn chat (hàm `collectResourcesInfo`). Ứng với mỗi file media sẽ được lưu thành property là object bên trong `resourcesInfo` như sau:
  - Key: đường link tới file media đó.
  - Value:
  ```
  {
    msgType: number (mã của loại message đó),
    hasDownloaded: boolean (optional, đã download hay chưa),
    fileName: string (tên của file sau khi tải về),
    url: string (optional, với loại message là link thì key của object này là ảnh thumbnail của link còn property url này sẽ là link đó),
    size: number (optional, với message là upload file thì size này là size của file đó)
  }
  ```
5. Tạo các file html để chứa nội dung các đoạn chat (hàm `AppendContent` trong file `controller.js`).

    5.1. Cho duyệt qua mảng messages, cứ mỗi 10 message sẽ là 1 page riêng, check id của loại message để render file template ejs cho phù hợp.
6. Nếu trong đoạn chat có file media thì gọi `getAllResources` trong `resources.js` để tải nội dung dựa theo thông tin được lưu trong object `resourcesInfo`.

    6.1. Các file sẽ được tải song song. Hàm `downloadResource` trong `download.js` sẽ tải dựa theo url và cập nhập quá trình tải bằng cách gọi hàm `updateProgress` trong `progress.js`.

    6.2. Hàm `updateProgress` sẽ sử dụng cơ chế semaphore để đảm bảo tại 1 thời điểm thì chỉ được update progress 1 lần nhằm tránh lỗi do chia sẻ chung tài nguyên là object lưu tiến trình khi tải song song.

## 2. Hàm `collectResourcesInfo` trong `resources.js`

Mục đích: thu thập thông tin của các media được upload lên trong đoạn chat.

1. Cho duyệt qua cả đoạn chat (tham số `messages`).
2. Switch case với từng loại message và xử lý lưu các thông tin như bước 4 ở phần 2.
3. Đối với message là upload file thì sẽ sử dụng `JSON.parse` nhằm parse params trong message ra và lấy các thông tin như kích thước file, url của file, tên file và ảnh thumbnail của file (nếu file là dạng ảnh được upload lên) (dòng 77 - 85 trong file `resources.js`).
4. Nếu file không có ảnh thumbnail thì sẽ gọi hàm `determinateThumb` để xác định thumbnail cho file dựa vào ext trong tên file (dòng 97 - 107 trong file `resources.js`).
5. URL của thumbnail file cũng được xem như 1 resource cần download và sẽ lưu thành 1 object trong `resourcesInfo` với key là url của thumbnail và property `thumb` trong object thông tin của file sẽ lưu lại url của thumbnail file đó.

## 3. Hàm `AppendContent` trong `controller.js`

Mục đích: tạo các file html để chứa đoạn chat, mỗi 10 message sẽ tương ứng với 1 page html.

1. Gọi hàm `checkDownloadableContentExisted` để kiểm tra xem có tồn tại media nào cần phải tải không.
2. Cho duyệt qua danh sách messages.
3. Nếu thứ tự duyệt `i` hiện tại % 10 === 0 thì tạo thêm 1 file html mới.
4. Trích xuất thông tin `dName, sendDttm, fromUid, msgType` từ `messages[i]`.
5. Gọi hàm `htmlTemplate` và truyền vào `messages[i]` để map thông tin từ `messages[i]` vào chuỗi html.
6. Nếu người gửi tin nhắn trước đó và tin nhắn hiện tại đều là 1 người thì chỉ map thông tin về thời gian vào (dòng 60 - 65 file `controller.js`).
7. Nếu người gửi tin nhắn trước đó và hiện tại là 2 người khác nhau thì gọi hàm `determinateAvatar` để xác định ký tự trên avatar và map thông tin thời gian và avatar vào (dòng 67 - 74 file `controller.js`).
8. Nếu message hiện tại đã kết thúc page và không phải message cuối cùng trong đoạn chat thì render nút Next messages ở cuối page.

## 4. Hàm `htmlTemplate` trong `template.js`

Mục đích: render nội dung message vào chuỗi html dựa trên loại message. Hiện có cách loại message sau được hỗ trợ: 1, 2, 4, 6, 7, 17, 19, 20, -4, 25, -1909.

Nội dung sẽ được render dựa theo template các file ejs. Thông tin các media như tên file, kích thước,... sẽ được trích xuất từ `resourcesInfo` dựa theo url của media đó.

## 5. Hàm `getAllResources` trong `resources.js`

Mục đích: thực hiện gọi hàm `downloadResource` tải các media và lưu vào file với tên file được quản lý trong `resourcesInfo`.

## 6. Hàm `downloadResource` và `download` trong `download.js`

Mục đích: xử lý quá trình tải các media và tính toán % quá trình.

Có những công thức tính toán như sau:

* Tính toán trong quá trình đang tải dựa theo số byte đã tải được ở mỗi lần callback được gọi trong `response.on('data')` (dòng 17 file `download.js`):
  1. Tính % của khối data vừa tải được so với tổng dung lượng của file đang tải: dòng 21.
  2. Tính % của mỗi file (ví dụ có 5 file cần tải thì mỗi file là 20%): dòng 22.
  3. Tính % của khối data vừa tải được so với toàn bộ các file media và gọi hàm `updateProgress`: dòng 23. Note: hàm `updateProgress` sẽ cộng % này vào với tiến độ % hiện tại nên ở trong bước xử lý này ta không cần tính % đến thời điểm tải hiện tại mà chỉ cần tính riêng % cho cục data vừa download được.
* Tính toán nếu tải bị fail hoặc hàm callback trong `response.on('data')` không được gọi: ta sẽ mặc định là tải thành công và cộng % bằng cách gọi hàm `updateProgress`.

Note: nếu `response.headers.location` không rỗng (dòng 42) thì tức là link này là dạng link redirect nên sẽ phải gọi đệ quy hàm `download` 1 lần nữa để lấy link đích cần tải.

## 7. Hàm `updateProgress` trong `progress.js`

Mục đích: cập nhật tiến trình % bằng cách cộng vào tiến trình % hiện tại. Hàm có sử dụng cơ chế semaphore nhằm tránh việc lỗi xung đột miền găng khi truy cập vào biến `_percentage` quá nhiều do tải song song.