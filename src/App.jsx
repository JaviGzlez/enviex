import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import LegalModal from "./components/LegalModal.jsx";
import CookieBanner from "./components/CookieBanner.jsx";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "./components/SocialIcons.jsx";

const WHATSAPP_NUMBER = "34604895001";
const PHONE_DISPLAY = "604 89 50 01";
const PHONE_LINK = "604895001";
const EMAIL_DISPLAY = "operativa@enviex.es";

const INSTAGRAM_URL = "https://www.instagram.com/enviexmensajeria/";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61590068886608";
const LINKEDIN_URL = "https://www.linkedin.com/company/enviex/?viewAsMember=true";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [legalModal, setLegalModal] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    pickup: "",
    delivery: "",
    packageType: "Paquete pequeño",
    service: "Normal",
    notes: "",
    acceptPrivacy: false,
  });

  useEffect(() => {
    if (menuOpen || legalModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen, legalModal]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({
      name: "",
      phone: "",
      email: "",
      pickup: "",
      delivery: "",
      packageType: "Paquete pequeño",
      service: "Normal",
      notes: "",
      acceptPrivacy: false,
    });
  };

  const whatsappMessage =
    `NUEVA SOLICITUD ENVIEX\n\n` +
    `CLIENTE\n${form.name || "No indicado"}\n\n` +
    `TELEFONO\n${form.phone || "No indicado"}\n\n` +
    `EMAIL\n${form.email || "No indicado"}\n\n` +
    `RECOGIDA\n${form.pickup || "No indicada"}\n\n` +
    `ENTREGA\n${form.delivery || "No indicada"}\n\n` +
    `TIPO DE ENVIO\n${form.packageType}\n\n` +
    `SERVICIO\n${form.service}\n\n` +
    `OBSERVACIONES\n${form.notes || "Sin observaciones"}`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.acceptPrivacy) return;
    setSending(true);

    const emailData = {
      _subject: "Nueva solicitud de envío - Enviex",
      _captcha: "false",
      _template: "table",
      Nombre: form.name,
      Telefono: form.phone,
      Email: form.email,
      Recogida: form.pickup,
      Entrega: form.delivery,
      Tipo_de_envio: form.packageType,
      Servicio: form.service,
      Observaciones: form.notes || "Sin observaciones",
    };

    try {
      await fetch("https://formsubmit.co/ajax/operativa@enviex.es", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(emailData),
      });
    } catch (error) {
      console.error("Error enviando la solicitud:", error);
    } finally {
      setSending(false);
      setSubmitted(true);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8fb] text-[#092640]">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#inicio" className="flex items-center gap-3">
            <img src="/logo-enviex.png" alt="Enviex" className="h-12 w-auto object-contain" />
            <span className="hidden text-xs font-black uppercase tracking-[0.22em] text-slate-400 lg:block">
              Más tiempo para ti
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-bold text-slate-600 md:flex">
            <a className="transition hover:text-[#e50914]" href="#funciona">Cómo funciona</a>
            <a className="transition hover:text-[#e50914]" href="#empresas">Empresas</a>
            <a className="transition hover:text-[#e50914]" href="#contacto">Contacto</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a href={`tel:${PHONE_LINK}`} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-[#092640]">
              <Phone size={16} /> {PHONE_DISPLAY}
            </a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#092640] px-5 py-3 text-sm font-black text-white shadow-xl shadow-slate-300 transition hover:-translate-y-0.5">
              <MessageCircle size={17} /> WhatsApp
            </a>
          </div>

          <button onClick={() => setMenuOpen(true)} className="rounded-2xl bg-slate-100 p-3 md:hidden">
            <Menu size={22} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#092640] p-6 text-white md:hidden">
          <div className="flex items-center justify-between">
            <img src="/logo-enviex.png" alt="Enviex" className="h-14 rounded-xl bg-white p-2" />
            <button onClick={() => setMenuOpen(false)} className="rounded-full bg-white/10 p-3">
              <X />
            </button>
          </div>
          <div className="mt-12 flex flex-col gap-6 text-2xl font-black">
            <a onClick={() => setMenuOpen(false)} href="#funciona">Cómo funciona</a>
            <a onClick={() => setMenuOpen(false)} href="#empresas">Empresas</a>
            <a onClick={() => setMenuOpen(false)} href="#contacto">Contacto</a>
            <a onClick={() => setMenuOpen(false)} href="#solicitar" className="mt-4 rounded-2xl bg-[#e50914] px-6 py-4 text-center text-base">Solicitar envío</a>
          </div>
        </div>
      )}

      <section id="inicio" className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-32 lg:grid-cols-[1fr_440px] lg:pb-24 lg:pt-40 xl:grid-cols-[1fr_520px]">
        <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-red-100/60 blur-3xl" />
        <div className="absolute -left-32 top-60 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl" />

        <div className="relative flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-sm font-black text-[#e50914] shadow-sm">
            <Clock size={16} /> Mensajería local para quien no tiene tiempo que perder
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-tight text-[#092640] md:text-6xl xl:text-7xl">
            Tu tiempo vale más que un reparto.
          </h1>

          <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-600">
            Recogemos donde estés. Entregamos donde necesites. Sin desplazamientos,
            sin interrupciones y sin perder una mañana entera.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#solicitar" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#e50914] px-7 py-4 text-base font-black text-white shadow-xl shadow-red-200 transition hover:-translate-y-0.5">
              Solicitar envío <ArrowRight size={19} />
            </a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-black text-[#092640] shadow-sm transition hover:-translate-y-0.5">
              Contactar por WhatsApp <MessageCircle size={19} />
            </a>
          </div>

          <div className="mt-12 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              [Truck, "Recogida", "Vamos a por ello"],
              [ShieldCheck, "Seguridad", "Servicio profesional"],
              [MapPin, "Cercanía", "Conocemos la zona"],
              [Send, "Rapidez", "Sin complicaciones"],
            ].map(([Icon, title, text]) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
                <Icon className="mb-4 text-[#e50914]" size={28} />
                <h3 className="font-black">{title}</h3>
                <p className="mt-1 text-sm text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <section id="solicitar" className="relative rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200 md:p-7">
          <div className="mb-6 rounded-3xl bg-[#092640] p-5 text-white">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-red-200">Solicitud rápida</p>
            <h2 className="mt-2 text-3xl font-black">Solicita tu envío en menos de un minuto</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Rellena el formulario y recibiremos tu solicitud en nuestro correo operativo.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-3xl border border-green-100 bg-green-50 p-6">
              <CheckCircle2 className="mb-4 text-green-600" size={38} />

              <h3 className="text-2xl font-black text-green-900">
                Solicitud enviada correctamente
              </h3>

              <p className="mt-2 leading-7 text-green-800">
                Hemos recibido tu solicitud en nuestro correo operativo. Ahora puedes confirmar el servicio por WhatsApp.
              </p>

              <div className="mt-5 grid gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 font-black text-white transition hover:opacity-90"
                >
                  Abrir WhatsApp <MessageCircle size={18} />
                </a>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-green-200 bg-white px-5 py-4 font-black text-green-900 transition hover:bg-green-50"
                >
                  Crear otra solicitud
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Nombre *" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#e50914] focus:bg-white" />
                <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Teléfono *" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#e50914] focus:bg-white" />
              </div>

              <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Correo electrónico *" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#e50914] focus:bg-white" />

              <div>
                <label className="mb-2 block text-sm font-black">Dirección de recogida *</label>
                <input required value={form.pickup} onChange={(e) => update("pickup", e.target.value)} placeholder="Calle, número, localidad..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#e50914] focus:bg-white" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">Dirección de entrega *</label>
                <input required value={form.delivery} onChange={(e) => update("delivery", e.target.value)} placeholder="Calle, número, localidad..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#e50914] focus:bg-white" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-black">Tipo de envío</label>
                  <select value={form.packageType} onChange={(e) => update("packageType", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#e50914] focus:bg-white">
                    <option>Documento</option>
                    <option>Paquete pequeño</option>
                    <option>Paquete mediano</option>
                    <option>Paquete grande</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-black">Servicio</label>
                  <select value={form.service} onChange={(e) => update("service", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#e50914] focus:bg-white">
                    <option>Normal</option>
                    <option>Urgente</option>
                    <option>Programado</option>
                  </select>
                </div>
              </div>

              <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Observaciones: horario, frágil, llamar antes..." rows={3} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#e50914] focus:bg-white" />

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  required
                  checked={form.acceptPrivacy}
                  onChange={(e) => update("acceptPrivacy", e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#e50914]"
                />
                <span>
                  He leído y acepto la{" "}
                  <button
                    type="button"
                    onClick={() => setLegalModal("privacidad")}
                    className="font-black text-[#092640] underline underline-offset-2 hover:text-[#e50914]"
                  >
                    política de privacidad
                  </button>
                  . *
                </span>
              </label>

              <button type="submit" disabled={sending || !form.acceptPrivacy} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e50914] px-6 py-4 text-base font-black text-white shadow-xl shadow-red-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">
                {sending ? "Enviando solicitud..." : "Enviar solicitud"} <Send size={18} />
              </button>

              <p className="text-center text-xs font-semibold leading-5 text-slate-400">
                Sin pago online por ahora. Confirmaremos disponibilidad y condiciones antes de realizar el envío.
              </p>
            </form>
          )}
        </section>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="rounded-[2.5rem] bg-white p-8 shadow-sm md:p-12">
          <h2 className="max-w-4xl text-4xl font-black tracking-tight md:text-5xl">
            Hay cosas más importantes que cruzar la ciudad para entregar un paquete.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Mientras tú atiendes clientes, gestionas pedidos o haces crecer tu negocio,
            Enviex se encarga de tus recogidas y entregas.
          </p>
        </div>
      </section>

      <section id="funciona" className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-black uppercase tracking-[0.18em] text-[#e50914]">Cómo funciona</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">Simple, rápido y directo.</h2>
          </div>
          <p className="max-w-md text-slate-600">Un proceso pensado para que no tengas que perder tiempo llamando, explicando y esperando.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["01", "Solicita", "Indica recogida, entrega y tipo de envío."],
            ["02", "Confirmamos", "Revisamos tu solicitud y te contactamos."],
            ["03", "Recogemos", "Pasamos por el paquete o documento."],
            ["04", "Entregamos", "Te avisamos cuando esté completado."],
          ].map(([num, title, text]) => (
            <div key={num} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-8 text-4xl font-black text-red-100">{num}</div>
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="empresas" className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-8 rounded-[2.5rem] bg-[#092640] p-8 text-white md:p-12 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="font-black uppercase tracking-[0.18em] text-red-200">Para empresas</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
              Pensado para negocios que valoran su tiempo.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Clínicas, laboratorios, gestorías, talleres, comercios y oficinas pueden apoyarse en Enviex para sus envíos habituales.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 text-[#092640]">
            {[
              "Atención prioritaria",
              "Recogidas habituales",
              "Tarifas adaptadas",
              "Comunicación directa por WhatsApp",
            ].map((item) => (
              <div key={item} className="mb-4 flex items-center gap-3 font-black">
                <CheckCircle2 className="text-[#e50914]" size={20} /> {item}
              </div>
            ))}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Enviex, quiero información para una cuenta de empresa.")}`} target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-[#e50914] px-5 py-4 font-black text-white">
              Solicitar cuenta empresa <Building2 size={18} />
            </a>
          </div>
        </div>
      </section>

      <section id="contacto" className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          <a href={`tel:${PHONE_LINK}`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5">
            <Phone className="mb-4 text-[#e50914]" />
            <h3 className="font-black">Teléfono</h3>
            <p className="mt-2 text-slate-600">{PHONE_DISPLAY}</p>
          </a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5">
            <MessageCircle className="mb-4 text-[#e50914]" />
            <h3 className="font-black">WhatsApp</h3>
            <p className="mt-2 text-slate-600">Respuesta rápida</p>
          </a>
          <a href={`mailto:${EMAIL_DISPLAY}`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5">
            <Mail className="mb-4 text-[#e50914]" />
            <h3 className="font-black">Email operativo</h3>
            <p className="mt-2 text-slate-600">{EMAIL_DISPLAY}</p>
          </a>
        </div>
      </section>

      <footer className="bg-[#06192d] px-5 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <img src="/logo-enviex.png" alt="Enviex" className="h-16 rounded-2xl bg-white p-2" />
            <p className="mt-3 text-sm font-bold text-slate-400">Más tiempo para ti.</p>
            <div className="mt-4 flex items-center gap-3">
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full bg-white/10 p-2 transition hover:bg-[#e50914]">
                <InstagramIcon size={18} />
              </a>
              <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 p-2 transition hover:bg-[#e50914]">
                <FacebookIcon size={18} />
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full bg-white/10 p-2 transition hover:bg-[#e50914]">
                <LinkedinIcon size={18} />
              </a>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span>{PHONE_DISPLAY}</span>
            <span>·</span>
            <span>{EMAIL_DISPLAY}</span>
            <span>·</span>
            <button type="button" onClick={() => setLegalModal("aviso")} className="underline underline-offset-2 hover:text-white">
              Aviso legal
            </button>
            <span>·</span>
            <button type="button" onClick={() => setLegalModal("privacidad")} className="underline underline-offset-2 hover:text-white">
              Privacidad
            </button>
            <span>·</span>
            <button type="button" onClick={() => setLegalModal("cookies")} className="underline underline-offset-2 hover:text-white">
              Cookies
            </button>
          </div>
        </div>
      </footer>

      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
      <CookieBanner onOpenPolicy={() => setLegalModal("cookies")} />
    </main>
  );
}
