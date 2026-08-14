import Message from "../models/Message.js";
import transporter from "../config/mailer.js";

// ==============================
// ESCAPAR HTML
// ==============================

const escaparHtml = (texto = "") => {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

// ==============================
// NUEVO MENSAJE
// ==============================

export const nuevoMensaje = async (req, res) => {
  try {
    const {
      nombre,
      email,
      telefono,
      mensaje,
    } = req.body;

    // ==============================
    // VALIDAR CAMPOS
    // ==============================

    if (
      !nombre ||
      !email ||
      !telefono ||
      !mensaje
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Todos los campos son obligatorios.",
      });
    }

    // ==============================
    // LIMPIAR DATOS
    // ==============================

    const nombreLimpio =
      String(nombre).trim();

    const emailLimpio =
      String(email).trim();

    const telefonoLimpio =
      String(telefono).trim();

    const mensajeLimpio =
      String(mensaje).trim();

    // ==============================
    // VALIDAR EMAIL
    // ==============================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailLimpio)) {
      return res.status(400).json({
        success: false,
        message:
          "Ingresá un email válido.",
      });
    }

    // ==============================
    // VALIDAR NOMBRE
    // ==============================

    if (nombreLimpio.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Ingresá un nombre válido.",
      });
    }

    // ==============================
    // VALIDAR MENSAJE
    // ==============================

    if (mensajeLimpio.length < 5) {
      return res.status(400).json({
        success: false,
        message:
          "La consulta es demasiado corta.",
      });
    }

    // ==============================
    // VALIDAR LONGITUDES
    // ==============================

    if (
      nombreLimpio.length > 100 ||
      emailLimpio.length > 150 ||
      telefonoLimpio.length > 50 ||
      mensajeLimpio.length > 3000
    ) {
      return res.status(400).json({
        success: false,
        message:
          "La información ingresada es demasiado extensa.",
      });
    }

    // ==============================
    // GUARDAR EN MONGODB
    // ==============================

    const nuevoRegistro =
      new Message({
        nombre: nombreLimpio,
        email: emailLimpio,
        telefono: telefonoLimpio,
        mensaje: mensajeLimpio,
      });

    const mensajeGuardado =
      await nuevoRegistro.save();

    console.log(
      `💾 Consulta de ${nombreLimpio} guardada en MongoDB`
    );

    // ==============================
    // PREPARAR DATOS PARA HTML
    // ==============================

    const nombreSeguro =
      escaparHtml(nombreLimpio);

    const emailSeguro =
      escaparHtml(emailLimpio);

    const telefonoSeguro =
      escaparHtml(telefonoLimpio);

    const mensajeSeguro =
      escaparHtml(mensajeLimpio)
        .replaceAll("\n", "<br>");

    // ==============================
    // ENVIAR EMAIL
    // ==============================

    try {
      console.log(
        `📨 Enviando consulta a ${process.env.CONTACT_EMAIL}...`
      );

      const info =
        await transporter.sendMail({
          // Mantener el remitente exactamente
          // como la cuenta autenticada de Yahoo
          from: process.env.SMTP_USER,

          to: process.env.CONTACT_EMAIL,

          // Por ahora NO usamos replyTo
          // porque Yahoo rechazaba el mensaje
          // durante el comando DATA.

          subject:
            "Nueva consulta web Epulen",

          // ==============================
          // TEXTO PLANO
          // ==============================

          text: `
Nueva consulta desde Epulen Seguridad Industrial

Nombre:
${nombreLimpio}

Email:
${emailLimpio}

Telefono:
${telefonoLimpio}

Consulta:
${mensajeLimpio}

----------------------------------------
Mensaje enviado desde el formulario web
de Epulen Seguridad Industrial.
          `.trim(),

          // ==============================
          // HTML SIMPLE
          // ==============================

          html: `
<!doctype html>
<html lang="es">
  <body style="margin:0;padding:20px;background:#f4f2ec;font-family:Arial,sans-serif;color:#243128;">

    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #d8ddd4;border-radius:12px;overflow:hidden;">

      <div style="background:#405a47;padding:24px;color:#ffffff;">
        <div style="font-size:20px;font-weight:bold;">
          Epulen Seguridad Industrial
        </div>

        <div style="margin-top:6px;font-size:13px;">
          Nueva consulta desde el sitio web
        </div>
      </div>

      <div style="padding:24px;">

        <p style="margin-top:0;color:#687168;font-size:14px;">
          Se recibio una nueva consulta desde el formulario de contacto.
        </p>

        <div style="margin-top:24px;">

          <p style="margin:0 0 6px;font-size:12px;color:#788873;font-weight:bold;">
            NOMBRE
          </p>

          <p style="margin:0 0 20px;font-size:16px;">
            ${nombreSeguro}
          </p>

          <p style="margin:0 0 6px;font-size:12px;color:#788873;font-weight:bold;">
            EMAIL
          </p>

          <p style="margin:0 0 20px;font-size:16px;">
            ${emailSeguro}
          </p>

          <p style="margin:0 0 6px;font-size:12px;color:#788873;font-weight:bold;">
            TELEFONO
          </p>

          <p style="margin:0 0 20px;font-size:16px;">
            ${telefonoSeguro}
          </p>

          <p style="margin:0 0 6px;font-size:12px;color:#788873;font-weight:bold;">
            CONSULTA
          </p>

          <div style="background:#f4f2ec;padding:16px;border-radius:8px;font-size:14px;line-height:1.6;">
            ${mensajeSeguro}
          </div>

        </div>
      </div>

      <div style="padding:16px 24px;border-top:1px solid #e0e4dd;font-size:11px;color:#8a938b;">
        Epulen Seguridad Industrial
      </div>

    </div>

  </body>
</html>
          `.trim(),
        });

      // ==============================
      // EMAIL ENVIADO
      // ==============================

      console.log(
        "✅ Correo enviado correctamente"
      );

      console.log(
        "📧 Message ID:",
        info.messageId
      );

      console.log(
        "📬 Accepted:",
        info.accepted
      );

      console.log(
        "🚫 Rejected:",
        info.rejected
      );

      // ==============================
      // RESPUESTA AL FRONTEND
      // ==============================

      return res.status(201).json({
        success: true,

        message:
          "Recibimos tu consulta. Nos pondremos en contacto a la brevedad.",

        emailEnviado: true,

        data: {
          id: mensajeGuardado._id,
        },
      });
    } catch (mailError) {
      // ==============================
      // ERROR SMTP
      // ==============================

      console.error("");

      console.error(
        "❌ El mensaje se guardó en MongoDB pero falló el envío del email"
      );

      console.error("SMTP ERROR:", {
        message:
          mailError.message,

        code:
          mailError.code,

        command:
          mailError.command,

        responseCode:
          mailError.responseCode,

        response:
          mailError.response,

        rejected:
          mailError.rejected,

        rejectedErrors:
          mailError.rejectedErrors,
      });

      console.error("");

      return res.status(502).json({
        success: false,

        message:
          "La consulta fue guardada, pero no pudimos enviar la notificación por correo.",

        emailEnviado: false,

        data: {
          id: mensajeGuardado._id,
        },
      });
    }
  } catch (error) {
    // ==============================
    // ERROR GENERAL
    // ==============================

    console.error(
      "❌ Error procesando contacto:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Hubo un error al procesar el mensaje.",
    });
  }
};