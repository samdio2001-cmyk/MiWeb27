const panel = document.querySelector("#chat-panel");
const toggle = document.querySelector(".chat-toggle");
const closeButton = document.querySelector(".chat-close");
const messages = document.querySelector("#chat-messages");
const form = document.querySelector(".chat-form");
const input = document.querySelector("#chat-input");
const suggestions = document.querySelector(".chat-suggestions");

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.className = `chat-message chat-message-${sender}`;
  message.textContent = text;
  messages.append(message);
  messages.scrollTop = messages.scrollHeight;
}

function normalize(text) {
  return text.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function isContactQuestion(question) {
  return /\b(contacto|contactar|contactarlos|hablar|correo|email|cotizacion|presupuesto|precio|costo)\b/.test(normalize(question));
}

function getAnswer(question) {
  const text = normalize(question);

  if (/\b(hola|buenas|buenos dias|buenas tardes|buenas noches|hey)\b/.test(text)) {
    return "¡Hola! ¿En qué puedo ayudarte? Puedo contarte sobre nuestros servicios o cómo contactarnos.";
  }
  if (/\b(software|desarrollo|aplicacion|aplicaciones|sistema|sistemas|programa|programacion)\b/.test(text)) {
    return "Desarrollamos aplicaciones y sistemas a medida, adaptados a tus procesos e integrados con tus herramientas.";
  }
  if (/\b(nube|infraestructura|servidor|servidores|red|redes|cloud)\b/.test(text)) {
    return "Ayudamos con la configuración y gestión de redes, servidores e infraestructura en la nube para mantener tu operación conectada.";
  }
  if (/\b(soporte|tecnico|tecnica|mantenimiento|incidencia|problema)\b/.test(text)) {
    return "Ofrecemos asistencia y mantenimiento informático para resolver incidencias y ayudar a tu equipo a seguir avanzando.";
  }
  if (/\b(servicio|servicios|ofrecen|hacen|ayudan)\b/.test(text)) {
    return "Ofrecemos desarrollo de software a medida, infraestructura y servicios en la nube, además de soporte técnico.";
  }
  if (isContactQuestion(question)) {
    return "Puedes contarnos sobre tu proyecto desde la sección de contacto. Te orientaremos sobre la solución y los siguientes pasos.";
  }
  if (/\b(gracias|muchas gracias)\b/.test(text)) {
    return "¡Con gusto! Si tienes otra pregunta, aquí estoy para ayudarte.";
  }

  return "Puedo ayudarte con información sobre desarrollo de software, infraestructura, servicios en la nube y soporte técnico. También puedes escribirnos desde la sección de contacto.";
}

function submitQuestion(question) {
  const text = question.trim();
  if (!text) return;

  suggestions?.remove();
  addMessage(text, "user");
  addMessage(getAnswer(text), "bot");
  if (isContactQuestion(text)) {
    const contactLink = document.createElement("a");
    contactLink.className = "chat-contact-link";
    contactLink.href = "#contacto";
    contactLink.textContent = "Ir a contacto ↗";
    messages.append(contactLink);
    messages.scrollTop = messages.scrollHeight;
  }
}

function setOpen(isOpen) {
  panel.hidden = !isOpen;
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Cerrar chat" : "Abrir chat");
  if (isOpen) input.focus();
  else toggle.focus();
}

toggle.addEventListener("click", () => setOpen(panel.hidden));
closeButton.addEventListener("click", () => setOpen(false));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuestion(input.value);
  input.value = "";
  input.focus();
});

suggestions.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  submitQuestion(button.textContent);
  input.focus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !panel.hidden) setOpen(false);
});
