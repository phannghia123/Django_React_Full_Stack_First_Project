import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import {api} from "../api"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import { useState, useEffect } from "react"

//Hàm bảo vệ tuyến đường truy cập (cổng)
function ProtectedRoute({children}){
    const [isAuthorized, setIsAuthorized] = useState(null)  //null: đang kiểm tra (chưa trạng thái)
    //Nếu không xác thực được thì setIsAuthorized(false)
    useEffect(() =>{
        auth().catch(() => setIsAuthorized(false))
    }, [])

    //Hàm làm mới Token
    const refreshToken = async () => {
        //Lấy Refresh Token
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            //Gửi yêu cầu POST đến server để làm mới Token
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            //Nếu thành công, lưu access Token mới vào localStorage
            if(res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            }
            //Nếu false
            else {
                setIsAuthorized(false)
            }
        }
        //Lỗi kết nối hoặc lỗi server 
        catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }

    //Hàm xác thực
    const auth = async () => {
        //Lấy access Token
        const token = localStorage.getItem(ACCESS_TOKEN)
        //  Nếu không có token -> người dùng chưa đăng nhập
        if(!token) {
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token) // giải mã token để đọc dữ liệu bên trong
        const tokenExpiration = decoded.exp // lấy thời gian hết hạn
        const now = Date.now() / 1000 // lấy thời gian hiện tại
        //Kiểm tra token hết hạn chưa?
        if(tokenExpiration < now)
        {
            await refreshToken()
        }
        else {
            setIsAuthorized(true)
        }
    }
    //Nếu đang xác thực
    if(isAuthorized == null){
        return <div>Loading..</div>
    }
    //Nếu xác thực thành công ? chuyển sang các trang children được bảo vệ : quay về cổng login 
    return isAuthorized ? children : <navigate to = "/login"/>
}
export default ProtectedRoute;