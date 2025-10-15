import axios from "axios"
// 1. Nhập thư viện 'axios' (HTTP client dựa trên Promise) để thực hiện các yêu cầu HTTP.

import { ACCESS_TOKEN } from "./constants"
// 2. Nhập biến hằng số (constants) ACCESS_TOKEN từ một file khác.
//    Biến này chứa khóa (key) dùng để lưu trữ và truy xuất token trong Local Storage.

const apiUrl = "/choreo-apis/django-react-first-projec/backend/v1"
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl
})

// --- Cấu hình Request Interceptor (Bộ chặn Yêu cầu) ---

api.interceptors.request.use(
// 6. Truy cập vào Bộ chặn (Interceptor) của 'api' instance.
// 7. Chọn 'request' (Bộ chặn Yêu cầu).
// 8. Gọi phương thức '.use()' để thêm hai hàm xử lý (handler) cho mọi yêu cầu đi.

    (config) =>{
// 9. Hàm xử lý thành công (fulfilled handler). Nó nhận đối tượng 'config' (cấu hình) của yêu cầu sắp gửi.

        const token = localStorage.getItem(ACCESS_TOKEN);
// 10. Truy xuất token xác thực (ví dụ: JWT) từ Local Storage của trình duyệt bằng khóa ACCESS_TOKEN.

        if(token){
            config.headers.Authorization = `Bearer ${token}`
// 12. Nếu có token, đính kèm nó vào Headers (tiêu đề) của yêu cầu.
//     - Cú pháp `Bearer ${token}`: Lược đồ Bearer (người mang) + giá trị token, đây là định dạng chuẩn cho API.
        }
        return config
    },

    (error)=>{
//Nếu có lỗi xảy ra trước khi gửi yêu cầu (ví dụ: lỗi cấu hình).
        return Promise.reject(error)
//Trả về một Promise bị từ chối ('Promise.reject(error)') để chuyển luồng lỗi xuống các lời gọi API.
    }
)
