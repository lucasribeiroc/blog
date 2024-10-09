import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Info from "./components/Info";
import QuemSomos from "./components/QuemSomos";
import Solucoes from "./components/Solucoes";
import Sistemas from "./components/Sistemas";
import Suporte from "./components/Suporte";
import Consultoria from "./components/Consultoria";
import Atuacao from "./components/Atuacao";
import Footer from "./components/Footer";
import Blog from "./components/Blog";
import Admin from "./components/Admin";
import "./index.css"; // Certifique-se de que o Tailwind CSS está configurado corretamente

function App() {
  return (
    <Router>
      <div className="App">
        <ConditionalHeader />{" "}
        {/* Adicione um padding-top para evitar sobreposição do conteúdo */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Info />
                <QuemSomos />
                <Solucoes />
                <Sistemas />
                <Suporte />
                <Consultoria />
                <Atuacao />
                <Footer />
              </>
            }
          />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

function ConditionalHeader() {
  const location = useLocation();
  return location.pathname !== "/admin" ? <Header /> : null;
}

export default App;
