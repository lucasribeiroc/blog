import "./Footer.css";

import logo from "../assets/images/logo_white.png";
import facebook from "../assets/images/facebook.png";
import instagram from "../assets/images/instagram.png";
import youtube from "../assets/images/youtube.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* COLUNA 1 */}
        <div className="footer-col">
          <a href="https://www.usezolv.com" target="_blank" rel="noopener noreferrer">
            <img src={logo} alt="Zolv Restaurante" className="footer-logo" />
          </a>

          <div className="footer-social">
            <a href="https://www.facebook.com/zolvrestaurantes"><img src={facebook} alt="Facebook" /></a>
            <a href="https://www.instagram.com/zolvrestaurantes"><img src={instagram} alt="Instagram" /></a>
            <a href="https://www.youtube.com/@PdvsevenBr"><img src={youtube} alt="YouTube" /></a>
          </div>
        </div>

        {/* COLUNA 3 */}
        <div className="footer-col">
          <h4>Fale conosco</h4>
          <p>+55 (11) 4210-0122</p>
          <p>São Bernardo do Campo – SP</p>

          <div className="footer-map">
            <iframe
              title="Mapa PDVSeven"
              src="https://www.google.com/maps?q=São%20Bernardo%20do%20Campo&output=embed"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* LINHA INFERIOR */}
      <div className="footer-bottom">
        © 2026 | Todos os direitos reservados
      </div>
    </footer>
  );
}
