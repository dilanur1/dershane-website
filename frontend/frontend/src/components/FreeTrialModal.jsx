import { useState } from "react";

function FreeTrialModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    phone: "",
    grade: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/free-trial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    alert("Başvurunuz alındı!");
    onClose();

    setForm({
      name: "",
      surname: "",
      phone: "",
      grade: ""
    });
  };

  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="modal">

        <h2>Ücretsiz Tanışma Dersi</h2>

        <form onSubmit={handleSubmit}>
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
            placeholder="Telefon"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <input
            name="grade"
            placeholder="Sınıf"
            value={form.grade}
            onChange={handleChange}
            required
          />

          <div className="buttons">
            <button type="submit" className="submit-btn">
              Gönder
            </button>

            <button
              type="button"
              className="close-btn"
              onClick={onClose}
            >
              Kapat
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default FreeTrialModal;