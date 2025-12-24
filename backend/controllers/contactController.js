import Message from '../models/Message.js';

// AGREGA "export" justo aquí al inicio de la función
export const nuevoMensaje = async (req, res) => {
  try {
    const mensaje = new Message(req.body);
    const mensajeGuardado = await mensaje.save();
    
    res.status(201).json({
      msg: "✅ Mensaje recibido correctamente. Nos pondremos en contacto pronto.",
      data: mensajeGuardado
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "❌ Hubo un error al enviar el mensaje." });
  }
};