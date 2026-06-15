import { useState } from "react";
import api from "../api";

function Apply() {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    phone: "",
    class: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/apply", form);
      alert(res.data.message);

      setForm({ name: "", surname: "", phone: "", class: "" });
    } catch (err) {
      alert("Hata oluştu");
    }
  };

  return (
    <div className="apply-container">
      <h1>Başvuru Formu</h1>

      <form onSubmit={handleSubmit} className="form">

        <input
          name="name"
          placeholder="Ad"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="surname"
          placeholder="Soyad"
          value={form.surname}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Telefon"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          name="class"
          placeholder="Sınıf (9,10,11,12)"
          value={form.class}
          onChange={handleChange}
        />

        <button type="submit">Başvuru Yap</button>

      </form>
    </div>
  );
}

export default Apply;