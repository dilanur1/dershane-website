function Programs() {
  const programs = [
    {
      title: "Matematik",
      desc: "Temelden ileri seviyeye tüm konular",
      icon: "📘"
    },
    {
      title: "Geometri",
      desc: "Analitik ve klasik geometri eğitimi",
      icon: "📐"
    },
    {
      title: "Gelişim Programı",
      desc: "Öğrencinin seviyesine özel gelişim planı",
      icon: "📊"
    },
    {
      title: "Ustalık Programı",
      desc: "Zor soru çözme ve üst seviye teknikler",
      icon: "🧠"
    },
    {
      title: "Sınav Hazırlık",
      desc: "TYT / AYT / LGS yoğun hazırlık sistemi",
      icon: "🎯"
    },
    {
      title: "Birebir Özel Ders",
      desc: "Tam kişiye özel birebir eğitim sistemi",
      icon: "👨‍🏫"
    }
  ];

  return (
    <section className="programs">

      <h2>Programlarımız</h2>
      <p className="sub">
        Her öğrenciye özel eğitim modeli
      </p>

      <div className="program-grid">
        {programs.map((p, i) => (
          <div className="program-card" key={i}>
            <div className="icon">{p.icon}</div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>

    </section>
  );
}

export default Programs;