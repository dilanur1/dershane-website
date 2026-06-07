import React from "react";

const features = [
  {
    icon: "🎯",
    title: "Hedef Odaklı Eğitim",
    desc: "Her öğrencinin kendi zirvesine ulaşması için özel planlar."
  },
  {
    icon: "📊",
    title: "Seviye Analizi",
    desc: "Kapsamlı test ve analizlerle öğrenciyi yakından takip ediyoruz."
  },
  {
    icon: "👩‍🏫",
    title: "Deneyimli Eğitmenler",
    desc: "Alanında uzman eğitmenlerle birebir destek."
  },
  {
    icon: "🚀",
    title: "Başarıya Giden Yol",
    desc: "Kişisel eğitim planı ve düzenli takip sistemi."
  }
];

function WhyUs() {
  return (
    <section className="whyus-section">
      <h2>Neden Geozirve Akademi?</h2>
      <div className="whyus-cards">
        {features.map((f, i) => (
          <div className="card" key={i}>
            <div className="icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyUs;