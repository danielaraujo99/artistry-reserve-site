export const STUDIO_WHATSAPP = "5528999753008";
export const STUDIO_NAME = "Estúdio Elaine Hahn";

export function buildBookingWhatsAppLink(p: {
  date: string;
  time: string;
  service: string;
  professional: string;
  clientName?: string;
}) {
  const lines = [
    `Olá, acabei de fazer um agendamento no ${STUDIO_NAME}`,
    "",
    p.clientName ? `Nome: ${p.clientName}` : null,
    `Dia: ${p.date}`,
    `Hora: ${p.time}`,
    `Serviço: ${p.service}`,
    `Profissional: ${p.professional}`,
    "",
    "Aguardo confirmação.",
  ].filter(Boolean);
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${STUDIO_WHATSAPP}?text=${text}`;
}

export function whatsappContactLink(message = "Olá! Gostaria de mais informações.") {
  return `https://wa.me/${STUDIO_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
