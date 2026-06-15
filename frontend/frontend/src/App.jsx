import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/NavBar";

import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Success from "./pages/Success";
import Contact from "./pages/Contact";
import Apply from "./pages/Apply";

function App() {
  return (
    <BrowserRouter>

      {/* 🔥 NAVBAR HER SAYFADA */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hakkimizda" element={<About />} />
        <Route path="/programlar" element={<Programs />} />
        <Route path="/basarilar" element={<Success />} />
        <Route path="/iletisim" element={<Contact />} />
        <Route path="/basvuru" element={<Apply />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;