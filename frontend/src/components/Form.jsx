import { useState } from "react";

import { api } from "../api";

import { useNavigate } from "react-router-dom";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
  const [username, setUserName] = useState("");

  const [password, setPassword] = useState("");

  const [Loading, setLoading] = useState("");

  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register"; // Biến này được dùng để đặt tiêu đề và tên button của form.

  const handleSubmit = async (e) => {
    setLoading(true); //Ngăn chặn hành vi mặc định của web -> chặn tải lại trang để gửi dữ liệu

    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      }
      else if (method === "register") {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      }
    } catch (error) {
        alert(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>{" "}
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Username"
      />{" "}
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />{" "}
      {Loading && <LoadingIndicator />}
      <button className="form-button" type="submit">
        {name}{" "}
      </button>{" "}
    </form>
  );
}

export default Form;
