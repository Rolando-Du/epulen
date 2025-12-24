import mongoose from 'mongoose'; // Importamos la librería para manejar MongoDB

const conectarDB = async () => {
  try {
    // Intentamos conectarnos usando la URI que guardaremos en el archivo .env
    // process.env.MONGO_URI es una variable de entorno para proteger tus credenciales
    const connection = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`✅ MongoDB Conectado en: ${connection.connection.host}`);
  } catch (error) {
    console.error(`❌ Error al conectar la DB: ${error.message}`);
    process.exit(1); // Si hay un error grave, detenemos la aplicación
  }
};

export default conectarDB;