import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api";

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/students', {
        headers: authHeaders()
      });
      setStudents(response.data);
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
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu öğrenci kaydını silmek istediğine emin misin?')) return;

    try {
      await api.delete(`/admin/students/${id}`, { headers: authHeaders() });
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.response?.data?.msg || 'Öğrenci silinemedi.');
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    return d.toLocaleDateString('tr-TR');
  };

  const formatFee = (fee) => {
    if (fee === null || fee === undefined) return '-';
    return `${fee.toLocaleString('tr-TR')} ₺`;
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Kayıtlı Öğrenciler</h2>
        <div className="header-actions">
          <button onClick={() => navigate('/dashboard')} className="secondary-btn">
            Başvurular
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
                <th>Sınıf</th>
                <th>Veli Adı</th>
                <th>Veli Telefonu</th>
                <th>Ücret</th>
                <th>Kayıt Tarihi</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.surname}</td>
                    <td>{s.phone}</td>
                    <td><span className="class-badge">{s.class}</span></td>
                    <td>{s.parent_name || '-'}</td>
                    <td>{s.parent_phone || '-'}</td>
                    <td>{formatFee(s.fee)}</td>
                    <td>{formatDate(s.created_at)}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(s.id)}>
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-data">Henüz kayıtlı öğrenci bulunmuyor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentsList;