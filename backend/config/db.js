import mongoose from 'mongoose';

const conectarDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`✅ MongoDB Conectado en: ${connection.connection.host}`);
  } catch (error) {
    console.error(`❌ Error al conectar la DB: ${error.message}`);
    process.exit(1); 
  }
};

export default conectarDB;