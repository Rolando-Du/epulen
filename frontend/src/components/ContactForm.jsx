import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

const ContactForm = () => {
  const form = useRef();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Enviando solicitud...' });

    const SERVICE_ID = 'TU_SERVICE_ID';
    const TEMPLATE_ID = 'TU_TEMPLATE_ID';
    const PUBLIC_KEY = 'TU_PUBLIC_KEY';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then(() => {
        setStatus({ type: 'success', msg: '✅ ¡Mensaje enviado! Te contactaremos pronto.' });
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
      }, (error) => {
        console.log(error.text);
        setStatus({ type: 'error', msg: '❌ Hubo un error. Intenta de nuevo más tarde.' });
      });
  };

  return (
    <section className="bg-[#020617] py-20 px-6 rounded-[40px] my-16 border border-slate-800/50 shadow-2xl relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#24A35A]/5 blur-[100px] -z-10"></div>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
            Solicitar <span className="text-[#24A35A]">Cotización</span>
          </h2>
          <div className="h-1 w-20 bg-[#E67E22] mx-auto mt-4 rounded-full"></div>
          <p className="text-slate-400 mt-6 text-lg">Déjanos tus datos y un asesor técnico se pondrá en contacto.</p>
        </div>

        <form ref={form} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text" name="nombre" placeholder="Nombre completo"
            className="p-4 bg-slate-900/50 border border-slate-800 rounded-[19px] text-white outline-none focus:border-[#24A35A] transition-all"
            onChange={handleChange} value={formData.nombre} required
          />
          <input
            type="email" name="email" placeholder="Correo electrónico"
            className="p-4 bg-slate-900/50 border border-slate-800 rounded-[19px] text-white outline-none focus:border-[#24A35A] transition-all"
            onChange={handleChange} value={formData.email} required
          />
          <input
            type="text" name="telefono" placeholder="Teléfono / WhatsApp"
            className="p-4 bg-slate-900/50 border border-slate-800 rounded-[19px] text-white outline-none focus:border-[#24A35A] transition-all"
            onChange={handleChange} value={formData.telefono}
          />
          
          <div className="md:col-span-2">
            <textarea
              name="mensaje" placeholder="¿Qué productos necesitas cotizar? (Ej: 20 cascos, 10 pares de botas...)"
              className="w-full p-4 bg-slate-900/50 border border-slate-800 rounded-[19px] text-white h-40 outline-none focus:border-[#24A35A] transition-all resize-none"
              onChange={handleChange} value={formData.mensaje} required
            />
          </div>

          <div className="md:col-span-2 text-center mt-4">
            <button
              type="submit"
              disabled={status.type === 'loading'}
              className="bg-[#24A35A] hover:bg-[#E67E22] text-white font-black py-5 px-12 rounded-[19px] transition-all shadow-xl shadow-[#24A35A]/20 uppercase tracking-[0.2em] text-xs active:scale-95 disabled:opacity-50"
            >
              {status.type === 'loading' ? 'Procesando...' : 'Enviar Requerimiento Técnico'}
            </button>
            
            {status.msg && (
              <div className={`mt-8 p-4 rounded-[19px] inline-block ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {status.msg}
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;