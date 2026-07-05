import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api";


const AdminDashboard = () => {
  const [applys, setApplys] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplys = async () => {
      const token = localStorage.getItem('adminToken');
      
      try {
        const response = await api.get('/admin/applys', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401 || response.status === 403) {
          // Token geçersizse veya süresi dolmuşsa temizle ve yönlendir
          localStorage.removeItem('adminToken');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Veriler getirilirken bir hata oluştu.');
        }

        const data = await response.json();
        setApplys(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplys();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Admin Başvuru Paneli</h2>
        <button onClick={handleLogout} className="logout-btn">Çıkış Yap</button>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">Henüz başvuru bulunmuyor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;