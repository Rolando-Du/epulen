import Message from "../models/Message.js";
import transporter from "../config/mailer.js";

const escaparHtml = (texto = "") => {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

export const nuevoMensaje = async (req, res) => {
  try {
    const {
      nombre,
      email,
      telefono,
      mensaje,
    } = req.body;

    // ============================
    // VALIDACIONES
    // ============================

    if (!nombre || !email || !telefono || !mensaje) {
      return res.status(400).json({
        success: false,
        msg: "Todos los campos son obligatorios.",
      });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        msg: "Ingresá un email válido.",
      });
    }

    if (nombre.trim().length < 2) {
      return res.status(400).json({
        success: false,
        msg: "Ingresá un nombre válido.",
      });
    }

    if (mensaje.trim().length < 5) {
      return res.status(400).json({
        success: false,
        msg: "La consulta es demasiado corta.",
      });
    }

    if (
      nombre.length > 100 ||
      email.length > 150 ||
      telefono.length > 50 ||
      mensaje.length > 3000
    ) {
      return res.status(400).json({
        success: false,
        msg: "La información ingresada es demasiado extensa.",
      });
    }

    // ============================
    // GUARDAR EN MONGODB
    // ============================

    const nuevoRegistro = new Message({
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      mensaje: mensaje.trim(),
    });

    const mensajeGuardado = await nuevoRegistro.save();

    // ============================
    // PREPARAR EMAIL
    // ============================

    const nombreSeguro = escaparHtml(nombre.trim());
    const emailSeguro = escaparHtml(email.trim());
    const telefonoSeguro = escaparHtml(telefono.trim());

    const mensajeSeguro = escaparHtml(
      mensaje.trim()
    ).replaceAll("\n", "<br />");

    let emailEnviado = false;

    try {
      await transporter.sendMail({
        from: `"Web Epulén" <${process.env.SMTP_USER}>`,

        to: process.env.CONTACT_EMAIL,

        replyTo: email.trim(),

        subject: `Nueva consulta web - ${nombre.trim()}`,

        text: `
Nueva consulta desde Epulén Seguridad Industrial

Nombre:
${nombre.trim()}

Email:
${email.trim()}

Teléfono:
${telefono.trim()}

Consulta:
${mensaje.trim()}
        `,

        html: `
          <!DOCTYPE html>

          <html lang="es">

            <body
              style="
                margin:0;
                padding:30px;
                background:#F4F2EC;
                font-family:Arial,Helvetica,sans-serif;
                color:#243128;
              "
            >

              <div
                style="
                  max-width:620px;
                  margin:0 auto;
                  background:#FCFBF8;
                  border:1px solid #D8DDD4;
                  border-radius:18px;
                  overflow:hidden;
                "
              >

                <!-- HEADER -->

                <div
                  style="
                    background:#405A47;
                    padding:28px 32px;
                    color:white;
                  "
                >

                  <div
                    style="
                      font-size:21px;
                      font-weight:bold;
                    "
                  >
                    Epulén Seguridad Industrial
                  </div>

                  <div
                    style="
                      margin-top:7px;
                      color:#E4E9E1;
                      font-size:13px;
                    "
                  >
                    Nueva consulta desde el sitio web
                  </div>

                </div>

                <!-- CONTENIDO -->

                <div style="padding:32px;">

                  <p
                    style="
                      margin-top:0;
                      font-size:14px;
                      color:#687168;
                    "
                  >
                    Se recibió una nueva consulta desde
                    el formulario de contacto.
                  </p>

                  <div
                    style="
                      margin-top:25px;
                      border-top:1px solid #E0E4DD;
                      padding-top:22px;
                    "
                  >

                    <div style="margin-bottom:20px;">

                      <div
                        style="
                          color:#788873;
                          font-size:12px;
                          margin-bottom:5px;
                        "
                      >
                        Nombre
                      </div>

                      <div
                        style="
                          font-size:16px;
                          font-weight:600;
                        "
                      >
                        ${nombreSeguro}
                      </div>

                    </div>

                    <div style="margin-bottom:20px;">

                      <div
                        style="
                          color:#788873;
                          font-size:12px;
                          margin-bottom:5px;
                        "
                      >
                        Email
                      </div>

                      <div>
                        ${emailSeguro}
                      </div>

                    </div>

                    <div style="margin-bottom:20px;">

                      <div
                        style="
                          color:#788873;
                          font-size:12px;
                          margin-bottom:5px;
                        "
                      >
                        Teléfono
                      </div>

                      <div>
                        ${telefonoSeguro}
                      </div>

                    </div>

                    <div>

                      <div
                        style="
                          color:#788873;
                          font-size:12px;
                          margin-bottom:8px;
                        "
                      >
                        Consulta
                      </div>

                      <div
                        style="
                          background:#F4F2EC;
                          padding:18px;
                          border-radius:12px;
                          line-height:1.6;
                          font-size:14px;
                        "
                      >
                        ${mensajeSeguro}
                      </div>

                    </div>

                  </div>

                </div>

                <!-- FOOTER -->

                <div
                  style="
                    border-top:1px solid #E0E4DD;
                    padding:18px 32px;
                    color:#8A938B;
                    font-size:11px;
                  "
                >
                  Consulta recibida desde epulen.vercel.app
                </div>

              </div>

            </body>

          </html>
        `,
      });

      emailEnviado = true;

      console.log(
        `📧 Mail enviado por consulta de ${nombre.trim()}`
      );
    } catch (mailError) {
      console.error(
        "❌ El mensaje se guardó pero falló el envío del mail:",
        mailError
      );
    }

    // ============================
    // RESPUESTA
    // ============================

    return res.status(201).json({
      success: true,

      msg: emailEnviado
        ? "Mensaje recibido y notificación enviada."
        : "Mensaje recibido correctamente.",

      emailEnviado,

      data: mensajeGuardado,
    });
  } catch (error) {
    console.error(
      "❌ Error procesando contacto:",
      error
    );

    return res.status(500).json({
      success: false,
      msg: "Hubo un error al procesar el mensaje.",
    });
  }
};