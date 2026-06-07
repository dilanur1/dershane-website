import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FreeTrialModal from './FreeTrialModal';

function Hero({setOpen}) {

    const navigate = useNavigate();

    return (
        <section className="hero">

            <div className="hero-content">

                <h1>Matematikte Zirveye Giden Yol</h1>

                <p>

                  "Başarı tesadüf değil, doğru rehberliğin eseridir."
                </p>
                <p>

       Matematiği anlaşılır, sevilebilir ve başarılabilir hale getiriyoruz.
             Potansiyelini keşfet, hedeflerini büyüt, zirveye ulaş.                </p>

                <div className="hero-buttons">
                    <button className="primary" onClick={() => setOpen(true)}>Ücretsiz Deneme Dersi</button>
                    <button className="secondary" onClick={() => navigate('/programlar')}>Programları İncele</button>
                </div>

            </div>

        </section>
    );
}

export default Hero;