import Message from "../models/Message.js";
import transporter from "../config/mailer.js";

// ESCAPAR HTML

const escaparHtml = (texto = "") => {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

// NUEVO MENSAJE

export const nuevoMensaje = async (req, res) => {
  try {
    const {
      nombre,
      email,
      telefono,
      mensaje,
    } = req.body;

  
    // VALIDACIONES
  

    if (!nombre || !email || !telefono || !mensaje) {
      return res.status(400).json({
        success: false,
        msg: "Todos los campos son obligatorios.",
      });
    }

    const nombreLimpio = nombre.trim();
    const emailLimpio = email.trim();
    const telefonoLimpio = telefono.trim();
    const mensajeLimpio = mensaje.trim();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailLimpio)) {
      return res.status(400).json({
        success: false,
        msg: "Ingresá un email válido.",
      });
    }

    if (nombreLimpio.length < 2) {
      return res.status(400).json({
        success: false,
        msg: "Ingresá un nombre válido.",
      });
    }

    if (mensajeLimpio.length < 5) {
      return res.status(400).json({
        success: false,
        msg: "La consulta es demasiado corta.",
      });
    }

    if (
      nombreLimpio.length > 100 ||
      emailLimpio.length > 150 ||
      telefonoLimpio.length > 50 ||
      mensajeLimpio.length > 3000
    ) {
      return res.status(400).json({
        success: false,
        msg: "La información ingresada es demasiado extensa.",
      });
    }

  
    // GUARDAR EN MONGODB
  

    const nuevoRegistro = new Message({
      nombre: nombreLimpio,
      email: emailLimpio,
      telefono: telefonoLimpio,
      mensaje: mensajeLimpio,
    });

    const mensajeGuardado =
      await nuevoRegistro.save();

  
    // PREPARAR DATOS SEGUROS
    // PARA EL EMAIL HTML
  

    const nombreSeguro =
      escaparHtml(nombreLimpio);

    const emailSeguro =
      escaparHtml(emailLimpio);

    const telefonoSeguro =
      escaparHtml(telefonoLimpio);

    const mensajeSeguro =
      escaparHtml(mensajeLimpio)
        .replaceAll("\n", "<br />");

  
    // ENVIAR EMAIL
  

    let emailEnviado = false;

    try {
      await transporter.sendMail({
        // Yahoo envía el correo desde la
        // cuenta autenticada.
        from: `"Web Epulén" <${process.env.SMTP_USER}>`,

        // La consulta llega al correo
        // comercial de Epulén.
        to: process.env.CONTACT_EMAIL,

        // Cuando Epulén presione "Responder",
        // responderá directamente al cliente.
        replyTo: emailLimpio,

        subject: `Nueva consulta web - ${nombreLimpio}`,

      
        // VERSIÓN TEXTO
      

        text: `
Nueva consulta desde Epulén Seguridad Industrial

Nombre:
${nombreLimpio}

Email:
${emailLimpio}

Teléfono:
${telefonoLimpio}

Consulta:
${mensajeLimpio}
        `,

      
        // VERSIÓN HTML
      

        html: `
          <!DOCTYPE html>

          <html lang="es">

            <head>
              <meta charset="UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />

              <title>
                Nueva consulta - Epulén Seguridad Industrial
              </title>
            </head>

            <body
              style="
                margin:0;
                padding:30px 15px;
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
                  box-shadow:
                    0 15px 40px rgba(36,49,40,0.08);
                "
              >

                <!-- ====================== -->
                <!-- HEADER -->
                <!-- ====================== -->

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

                <!-- ====================== -->
                <!-- CONTENIDO -->
                <!-- ====================== -->

                <div style="padding:32px;">

                  <p
                    style="
                      margin-top:0;
                      font-size:14px;
                      line-height:1.6;
                      color:#687168;
                    "
                  >
                    Se recibió una nueva consulta
                    desde el formulario de contacto
                    de Epulén Seguridad Industrial.
                  </p>

                  <div
                    style="
                      margin-top:25px;
                      border-top:1px solid #E0E4DD;
                      padding-top:22px;
                    "
                  >

                    <!-- NOMBRE -->

                    <div style="margin-bottom:20px;">

                      <div
                        style="
                          color:#788873;
                          font-size:12px;
                          font-weight:600;
                          margin-bottom:5px;
                          text-transform:uppercase;
                          letter-spacing:0.05em;
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

                    <!-- EMAIL -->

                    <div style="margin-bottom:20px;">

                      <div
                        style="
                          color:#788873;
                          font-size:12px;
                          font-weight:600;
                          margin-bottom:5px;
                          text-transform:uppercase;
                          letter-spacing:0.05em;
                        "
                      >
                        Email
                      </div>

                      <div>
                        <a
                          href="mailto:${emailSeguro}"
                          style="
                            color:#405A47;
                            text-decoration:none;
                          "
                        >
                          ${emailSeguro}
                        </a>
                      </div>

                    </div>

                    <!-- TELÉFONO -->

                    <div style="margin-bottom:20px;">

                      <div
                        style="
                          color:#788873;
                          font-size:12px;
                          font-weight:600;
                          margin-bottom:5px;
                          text-transform:uppercase;
                          letter-spacing:0.05em;
                        "
                      >
                        Teléfono
                      </div>

                      <div>
                        ${telefonoSeguro}
                      </div>

                    </div>

                    <!-- CONSULTA -->

                    <div>

                      <div
                        style="
                          color:#788873;
                          font-size:12px;
                          font-weight:600;
                          margin-bottom:8px;
                          text-transform:uppercase;
                          letter-spacing:0.05em;
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
                          color:#3E4A40;
                        "
                      >
                        ${mensajeSeguro}
                      </div>

                    </div>

                  </div>

                  <!-- ====================== -->
                  <!-- RESPONDER -->
                  <!-- ====================== -->

                  <div
                    style="
                      margin-top:28px;
                    "
                  >

                    <a
                      href="mailto:${emailSeguro}"
                      style="
                        display:inline-block;
                        background:#405A47;
                        color:#FFFFFF;
                        text-decoration:none;
                        padding:12px 22px;
                        border-radius:30px;
                        font-size:13px;
                        font-weight:600;
                      "
                    >
                      Responder consulta
                    </a>

                  </div>

                </div>

                <!-- ====================== -->
                <!-- FOOTER -->
                <!-- ====================== -->

                <div
                  style="
                    border-top:1px solid #E0E4DD;
                    padding:18px 32px;
                    color:#8A938B;
                    font-size:11px;
                    line-height:1.5;
                  "
                >
                  Consulta recibida desde
                  epulen.vercel.app

                  <br />

                  Epulén Seguridad Industrial
                </div>

              </div>

            </body>

          </html>
        `,
      });

      emailEnviado = true;

      console.log(
        `📧 Consulta de ${nombreLimpio} enviada a ${process.env.CONTACT_EMAIL}`
      );
    } catch (mailError) {
      console.error(
        "❌ El mensaje se guardó en MongoDB pero falló el envío del email:",
        mailError.message
      );
    }

  
    // RESPUESTA
  

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