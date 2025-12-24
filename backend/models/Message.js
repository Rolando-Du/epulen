import mongoose from 'mongoose';

// Definimos el "plano" de cómo debe ser un mensaje de contacto
const messageSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true, // El nombre es obligatorio
    trim: true      // Limpia espacios en blanco vacíos
  },
  empresa: {
    type: String,
    trim: true
  },
  interes: {
    type: String, // Ejemplo: "Cascos", "Calzado de seguridad"
    required: true
  },
  mensaje: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now() // Se guarda la fecha actual automáticamente
  }
});

// Creamos el modelo basado en el esquema
const Message = mongoose.model('Message', messageSchema);

export default Message;