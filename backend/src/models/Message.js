import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  empresa: {
    type: String,
    trim: true,
  },
  interes: {
    type: String,
    required: true,
  },
  mensaje: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now(),
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;