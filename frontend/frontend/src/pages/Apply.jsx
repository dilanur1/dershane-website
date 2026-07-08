import { useState } from "react";
import api from "../api";

const CLASS_OPTIONS = ["9", "10", "11", "12", "Mezun"];

// Kullanıcı yazarken telefonu "0555 555 55 55" formatına sokar
const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11); // sadece rakam, max 11 hane

  let result = digits;
  if (digits.length > 4) {
    result = `${digits.slice(0, 4)} ${digits.slice(4)}`;
  }
  if (digits.length > 7) {
    result = `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.length > 9) {
    result = `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  }
  return result;
};

// Geçerli bir Türkiye cep telefonu mu: 0 ile başlayan 11 haneli, ikinci hane 5
const isValidPhone = (value) => {
  const digits = value.replace(/\D/g, "");
  return /^05\d{9}$/.test(digits);
};

function Apply() {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    phone: "",
    class: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setForm({ ...form, phone: formatted });
    if (phoneError) setPhoneError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmpty = Object.values(form).some((v) => v.trim() === "");
    if (isEmpty) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    if (!isValidPhone(form.phone)) {
      setPhoneError("Geçerli bir telefon numarası girin (05XX XXX XX XX).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/apply", form);
      alert(res.data.message);

      setForm({ name: "", surname: "", phone: "", class: "" });
    } catch (err) {
      alert("Hata oluştu");
    } finally {
      setSubmitting(false);
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
          required
        />

        <input
          name="surname"
          placeholder="Soyad"
          value={form.surname}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          type="tel"
          placeholder="05XX XXX XX XX"
          value={form.phone}
          onChange={handlePhoneChange}
          maxLength={14}
          required
        />
        {phoneError && <span className="field-error">{phoneError}</span>}

        <select
          name="class"
          value={form.class}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Sınıf Seçiniz
          </option>
          {CLASS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "Mezun" ? "Mezun" : `${opt}. Sınıf`}
            </option>
          ))}
        </select>

        <button type="submit" disabled={submitting}>
          {submitting ? "Gönderiliyor..." : "Başvuru Yap"}
        </button>

      </form>
    </div>
  );
}

export default Apply;