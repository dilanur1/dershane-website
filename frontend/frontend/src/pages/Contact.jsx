function Contact() {
  return (
    <div className="contact-container">

      <h1>İletişim</h1>

      <div className="contact-grid">

        <div className="card">
          <h3>📍 Adres</h3>
          <p>Geozirve Akademi</p>
          <p>İstanbul / Türkiye</p>
        </div>

        <div className="card">
          <h3>📞 Telefon</h3>
          <p>0555 555 55 55</p>
        </div>

        <div className="card">
          <h3>💬 WhatsApp</h3>
          <p>0555 555 55 55</p>
        </div>

        <div className="card">
          <h3>📧 E-posta</h3>
          <p>info@geozirveakademi.com</p>
        </div>

      </div>

      {/* Google Maps */}
      <div className="map">
        <h3>Konum</h3>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12034.257523451402!2d28.9877938!3d41.056654449999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab712084fd725%3A0x17a1b29c6df06cb5!2sOsmanbey!5e0!3m2!1str!2str!4v1780855415896!5m2!1str!2str"
          width="100%"
          height="300"
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      </div>

      {/* Sosyal Medya */}
      <div className="social">
        <h3>Sosyal Medya</h3>

        <div className="social-links">
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>
          <a href="#">TikTok</a>
        </div>
      </div>

    </div>
  );
}

export default Contact;