import Hero from "../components/Hero";
import Founder from "../components/Founder";
import WhyUs from "../components/WhyUs";
import { useState } from "react";
import FreeTrialModal from "../components/FreeTrialModal";
import Footer from "../components/Footer";

function Home() {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Hero setOpen={setOpen} />
            <Founder />
            <WhyUs />
            <FreeTrialModal
                isOpen={open}
                onClose={() => setOpen(false)}
            />
            <Footer />
        </div>
    );
}

export default Home;