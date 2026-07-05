import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";


export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

const login = async (e) => {
    e.preventDefault();

    try {
        const res = await api.post(
            "/admin/login",
            {
                username,
                password
            }
        );

        localStorage.setItem("adminToken", res.data.token);

        navigate("/dashboard");

    } catch (err) {
        alert(err.response?.data?.message || "Giriş başarısız");
    }
};

  return (
    <div className="login-container">

        <div className="login-card">

            <h2>Yönetici Girişi</h2>

            <form onSubmit={login}>

                <input
                    type="text"
                    placeholder="Kullanıcı Adı"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <button type="submit">
                    Giriş Yap
                </button>

            </form>

        </div>

    </div>
);

}