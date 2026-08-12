import nodemailer from "nodemailer";

const smtpPort = Number(
  process.env.SMTP_PORT || 465
);

const transporter =
  nodemailer.createTransport({
    host:
      process.env.SMTP_HOST ||
      "smtp.mail.yahoo.com",

    port: smtpPort,

    secure: smtpPort === 465,

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

export const verificarMailer = async () => {
  try {
    console.log(
      "📧 Verificando configuración de correo..."
    );

    console.log("SMTP:", {
      host:
        process.env.SMTP_HOST,
      port:
        process.env.SMTP_PORT,
      user:
        process.env.SMTP_USER,
      passwordConfigurada:
        Boolean(
          process.env.SMTP_PASS
        ),
      contacto:
        process.env.CONTACT_EMAIL,
    });

    await transporter.verify();

    console.log(
      "✅ Servidor de correo Yahoo conectado correctamente"
    );
  } catch (error) {
    console.error(
      "❌ Error configurando servidor de correo Yahoo:",
      error.message
    );
  }
};

export default transporter;