import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api";

const AdminDashboard = () => {
  const [applys, setApplys] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Kayıt modalı state'i
  const [showModal, setShowModal] = useState(false);
  const [selectedApply, setSelectedApply] = useState(null);
  const [form, setForm] = useState({ parent_name: '', parent_phone: '', fee: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
  });

  const fetchApplys = async () => {
    setLoading(true);
    try {
      // sadece bekleyen (henüz öğrenciye çevrilmemiş) başvurular
      const response = await api.get('/admin/applys?status=pending', {
        headers: authHeaders()
      });
      setApplys(response.data);
      setError('');
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 422)) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
        return;
      }
      setError(err.response?.data?.msg || 'Veriler getirilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const openConvertModal = (apply) => {
    setSelectedApply(apply);
    setForm({ parent_name: '', parent_phone: '', fee: '' });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApply(null);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConvertSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApply) return;

    setSubmitting(true);
    setFormError('');

    try {
      await api.post('/admin/students', {
        application_id: selectedApply.id,
        parent_name: form.parent_name || null,
        parent_phone: form.parent_phone || null,
        fee: form.fee ? parseFloat(form.fee) : null
      }, {
        headers: authHeaders()
      });

      // Listeden kaldır, öğrenciye çevrildi
      setApplys((prev) => prev.filter((a) => a.id !== selectedApply.id));
      closeModal();
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 422)) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
        return;
      }
      setFormError(err.response?.data?.msg || 'Öğrenci kaydı oluşturulamadı.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Admin Başvuru Paneli</h2>
        <div className="header-actions">
          <button onClick={() => navigate('/dashboard/students')} className="secondary-btn">
            Öğrenciler
          </button>
          <button onClick={handleLogout} className="logout-btn">Çıkış Yap</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : (
        <div className="table-responsive">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Adı</th>
                <th>Soyadı</th>
                <th>Telefon</th>
                <th>Sınıf / Kategori</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {applys.length > 0 ? (
                applys.map((apply) => (
                  <tr key={apply.id}>
                    <td>{apply.id}</td>
                    <td>{apply.name}</td>
                    <td>{apply.surname}</td>
                    <td>{apply.phone}</td>
                    <td><span className="class-badge">{apply.class}</span></td>
                    <td>
                      <button
                        className="convert-btn"
                        onClick={() => openConvertModal(apply)}
                      >
                        Kayıt Oluştur
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">Bekleyen başvuru bulunmuyor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedApply && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              {selectedApply.name} {selectedApply.surname} — Öğrenci Kaydı
            </h3>

            {formError && <div className="error-message">{formError}</div>}

            <form onSubmit={handleConvertSubmit}>
              <label>
                Veli Adı Soyadı
                <input
                  type="text"
                  name="parent_name"
                  value={form.parent_name}
                  onChange={handleFormChange}
                />
              </label>

              <label>
                Veli Telefonu
                <input
                  type="text"
                  name="parent_phone"
                  value={form.parent_phone}
                  onChange={handleFormChange}
                />
              </label>

              <label>
                Ücret (₺)
                <input
                  type="number"
                  step="0.01"
                  name="fee"
                  value={form.fee}
                  onChange={handleFormChange}
                />
              </label>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} disabled={submitting}>
                  Vazgeç
                </button>
                <button type="submit" disabled={submitting} className="convert-btn">
                  {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;