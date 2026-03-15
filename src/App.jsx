import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Buy from "./pages/Buy";
import Rent from "./pages/Rent";
import FindAgent from "./pages/FindAgent";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comprar" element={<Buy />} />
        <Route path="/alugar" element={<Rent />} />
        <Route path="/corretores" element={<FindAgent />} />
        <Route
          path="*"
          element={
            <div className="not-found">
              <h1>404</h1>
              <p>Página não encontrada.</p>
              <a href="/">Voltar ao início</a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
