import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

export default function Contact() {
  const form = useRef();
  const [emailValue, setEmailValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_z8ai7yx",
        "template_8cm3n38",
        form.current,
        "CfL6LtUbVPVr6-g_d"
      )
      .then(
        (result) => {
          console.log(result.text);
          setShowSuccessModal(true);
          if (form.current) {
            form.current.reset();
          }
          setEmailValue("");
          setNameValue("");
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <h2>Precisa de mais informação?</h2>
        <p>Preencha o formulário abaixo que entraremos em contato com você</p>

        <form className="contact-form" ref={form} onSubmit={sendEmail}>
          <input type="hidden" name="subject" value="Novo contato - Zolv" />
          <input type="hidden" name="from_name" value={nameValue} />
          <input type="hidden" name="reply_to" value={emailValue} />
          <input type="hidden" name="cc" value="contato@pdvseven.com.br" />
          <input type="hidden" name="bcc" value="milton@pdvseven.com.br" />

          <input type="text" name="Estabelecimento" placeholder="Estabelecimento" />

          <input
            type="email"
            name="Email"
            placeholder="E-mail*"
            required
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          />

          <input
            type="text"
            name="Nome"
            placeholder="Nome*"
            required
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
          />

          <input
            type="tel"
            name="Celular"
            placeholder="Celular - apenas números"
          />

          <button type="submit">QUERO CONHECER</button>
        </form>
      </div>

      {showSuccessModal && (
        <div className="contact-modal-overlay">
          <div className="contact-modal">
            <p>E-mail enviado com sucesso!</p>
            <button type="button" onClick={() => setShowSuccessModal(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
