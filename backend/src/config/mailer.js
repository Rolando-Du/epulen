import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || 465);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mail.yahoo.com",
  port: smtpPort,
  secure: smtpPort === 465,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  // Solo aplica si en algún momento usamos puerto 587
  requireTLS: smtpPort === 587,
});

/**
 * Verifica la conexión con el servidor SMTP.
 * Se ejecuta cuando inicia el backend.
 */
export const verificarMailer = async () => {
  try {
    console.log("📧 Verificando configuración de correo...");

    console.log("SMTP:", {
      host: process.env.SMTP_HOST || "smtp.mail.yahoo.com",
      port: smtpPort,
      user: process.env.SMTP_USER,
      passwordConfigurada: Boolean(process.env.SMTP_PASS),
      contacto: process.env.CONTACT_EMAIL,
    });

    await transporter.verify();

    console.log(
      "✅ Servidor de correo Yahoo conectado correctamente"
    );

    return true;
  } catch (error) {
    console.error(
      "❌ Error configurando servidor de correo Yahoo:",
      error.message
    );

    return false;
  }
};

/**
 * Función genérica para enviar correos.
 *
 * destinatario:
 *   Dirección a la que se enviará el correo.
 *   Si no se especifica utiliza CONTACT_EMAIL.
 *
 * responderA:
 *   Dirección del usuario que completó el formulario.
 *   Permite responder directamente desde Yahoo.
 */
export const enviarCorreo = async ({
  destinatario,
  asunto,
  html,
  texto,
  responderA,
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"Epulen Seguridad Industrial" <${process.env.SMTP_USER}>`,

      to:
        destinatario ||
        process.env.CONTACT_EMAIL,

      subject: asunto,

      text: texto,

      html,

      ...(responderA && {
        replyTo: responderA,
      }),
    });

    console.log(
      "📨 Correo enviado correctamente:",
      info.messageId
    );

    return {
      ok: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(
      "❌ Error al enviar correo:",
      error.message
    );

    return {
      ok: false,
      error: error.message,
    };
  }
};

export default transporter;