import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div>
        <h2 className="logo">GEOZİRVE AKADEMİ</h2>
        <p className="slogan">Matematikte zirveye giden yol...</p>
      </div>

      <ul className="menu">
        <li><Link to="/">Ana Sayfa</Link></li>
        <li><Link to="/hakkimizda">Hakkımızda</Link></li>
        <li><Link to="/programlar">Programlar</Link></li>
        <li><Link to="/basarilar">Başarılarımız</Link></li>
        <li><Link to="/iletisim">İletişim</Link></li>
        <li><Link to="/basvuru" className="btn">Başvuru</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;