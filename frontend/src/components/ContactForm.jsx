import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Enviando solicitud...' });

    try {
      const response = await fetch('http://localhost:5000/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus({ type: 'success', msg: '✅ ¡Mensaje enviado! Te contactaremos pronto.' });
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
      } else {
        throw new Error();
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setStatus({ type: 'error', msg: '❌ Hubo un error. Intenta de nuevo más tarde.' });
    }
  };

  return (
    <section className="bg-slate-900 py-16 px-6 rounded-3xl my-16 shadow-2xl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white uppercase tracking-wider">
            Solicitar <span className="text-orange-500">Cotización</span>
          </h2>
          <p className="text-slate-400 mt-2">Déjanos tus datos y un asesor técnico te contactará.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text" name="nombre" placeholder="Nombre completo"
            className="p-4 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 transition-colors"
            onChange={handleChange} value={formData.nombre} required
          />
          <input
            type="email" name="email" placeholder="Correo electrónico"
            className="p-4 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 transition-colors"
            onChange={handleChange} value={formData.email} required
          />
          <input
            type="text" name="telefono" placeholder="Teléfono / WhatsApp"
            className="p-4 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 transition-colors"
            onChange={handleChange} value={formData.telefono}
          />
          <div className="md:col-span-2">
            <textarea
              name="mensaje" placeholder="¿Qué productos necesitas cotizar? (Ej: 20 cascos, 10 pares de botas...)"
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white h-32 outline-none focus:border-orange-500 transition-colors"
              onChange={handleChange} value={formData.mensaje} required
            />
          </div>

          <div className="md:col-span-2 text-center">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full transition-all shadow-lg uppercase tracking-widest active:scale-95"
            >
              Enviar Requerimiento
            </button>
            {status.msg && (
              <p className={`mt-4 font-medium ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {status.msg}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;