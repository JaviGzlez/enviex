import React from "react";
import { X } from "lucide-react";

const RESPONSABLE = {
  nombre: "José Carlos Ortiz Cervera",
  nif: "32056045W",
  domicilio: "Calle Higueras, 3, 11402 Jerez de la Frontera, Cádiz",
  email: "operativa@enviex.es",
};

const CONTENT = {
  aviso: {
    title: "Aviso legal",
    body: (
      <>
        <h3>1. Datos identificativos</h3>
        <p>
          En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio,
          de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se informa a los
          usuarios de que el titular de este sitio web es:
        </p>
        <ul>
          <li><strong>Titular:</strong> {RESPONSABLE.nombre}</li>
          <li><strong>NIF:</strong> {RESPONSABLE.nif}</li>
          <li><strong>Domicilio:</strong> {RESPONSABLE.domicilio}</li>
          <li><strong>Correo electrónico:</strong> {RESPONSABLE.email}</li>
          <li><strong>Actividad:</strong> Servicios de mensajería y transporte urgente local (Enviex)</li>
        </ul>

        <h3>2. Objeto</h3>
        <p>
          El presente sitio web tiene por objeto informar sobre los servicios de mensajería prestados por Enviex
          y permitir a los usuarios solicitar dichos servicios a través del formulario de contacto habilitado
          al efecto.
        </p>

        <h3>3. Condiciones de uso</h3>
        <p>
          El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación plena de las
          condiciones incluidas en este Aviso Legal. El usuario se compromete a hacer un uso adecuado y lícito del
          sitio web, de conformidad con la legislación aplicable, la buena fe, el orden público y el presente
          Aviso Legal, absteniéndose de utilizarlo de forma que pueda impedir o dañar el normal funcionamiento del
          mismo, los bienes o derechos de Enviex, de sus proveedores, de otros usuarios o de terceros en general.
        </p>

        <h3>4. Propiedad intelectual e industrial</h3>
        <p>
          Todos los contenidos del sitio web (textos, imágenes, marcas, logotipos, combinaciones de colores,
          estructura y diseño) son titularidad de Enviex o de terceros que han autorizado su uso, estando
          protegidos por la normativa de propiedad intelectual e industrial. Queda prohibida su reproducción,
          distribución o comunicación pública total o parcial sin autorización expresa del titular.
        </p>

        <h3>5. Enlaces a terceros</h3>
        <p>
          Este sitio web puede contener enlaces a redes sociales u otros sitios de terceros (Instagram, Facebook,
          LinkedIn, WhatsApp). Enviex no se responsabiliza de los contenidos, políticas o prácticas de privacidad
          de dichos sitios, que se regirán por sus propias condiciones.
        </p>

        <h3>6. Exclusión de responsabilidad</h3>
        <p>
          Enviex no garantiza la disponibilidad y continuidad del funcionamiento del sitio web ni de sus
          contenidos, y no se hace responsable de los daños y perjuicios que pudieran derivarse de interrupciones,
          fallos técnicos o virus informáticos ajenos a su control.
        </p>

        <h3>7. Legislación aplicable y jurisdicción</h3>
        <p>
          Las presentes condiciones se rigen por la legislación española. Para cualquier controversia derivada del
          acceso o uso de este sitio web, las partes se someterán a los Juzgados y Tribunales que correspondan
          conforme a la normativa vigente en materia de consumidores y usuarios.
        </p>
      </>
    ),
  },
  privacidad: {
    title: "Política de privacidad",
    body: (
      <>
        <h3>1. Responsable del tratamiento</h3>
        <ul>
          <li><strong>Responsable:</strong> {RESPONSABLE.nombre}</li>
          <li><strong>NIF:</strong> {RESPONSABLE.nif}</li>
          <li><strong>Domicilio:</strong> {RESPONSABLE.domicilio}</li>
          <li><strong>Correo electrónico:</strong> {RESPONSABLE.email}</li>
        </ul>

        <h3>2. Finalidad del tratamiento</h3>
        <p>Los datos personales facilitados a través del formulario de solicitud de envío se tratan con las siguientes finalidades:</p>
        <ul>
          <li>Gestionar y tramitar las solicitudes de recogida y entrega de paquetería.</li>
          <li>Contactar con el usuario por teléfono, correo electrónico o WhatsApp para confirmar el servicio.</li>
          <li>Atender consultas o solicitudes de información sobre nuestros servicios.</li>
        </ul>

        <h3>3. Legitimación</h3>
        <p>
          La base legal para el tratamiento de los datos es la ejecución de un servicio solicitado por el propio
          usuario (relación precontractual/contractual) y el consentimiento expreso prestado al marcar la casilla
          de aceptación de esta política en el formulario.
        </p>

        <h3>4. Destinatarios y encargados del tratamiento</h3>
        <p>
          No se cederán datos a terceros salvo obligación legal. Para el envío del formulario se utiliza el
          servicio <strong>FormSubmit</strong>, que actúa como encargado del tratamiento remitiendo los datos al
          correo operativo {RESPONSABLE.email}. La confirmación del servicio puede continuar por
          <strong> WhatsApp</strong>, gestionado por Meta Platforms, Inc., conforme a su propia política de privacidad.
        </p>

        <h3>5. Conservación de los datos</h3>
        <p>
          Los datos se conservarán durante el tiempo necesario para gestionar el servicio solicitado y,
          posteriormente, durante los plazos legales exigidos para atender posibles responsabilidades derivadas
          del tratamiento.
        </p>

        <h3>6. Derechos de las personas interesadas</h3>
        <p>Cualquier usuario puede ejercer, en relación con sus datos personales, los siguientes derechos:</p>
        <ul>
          <li>Derecho de acceso, rectificación y supresión.</li>
          <li>Derecho a la limitación y oposición al tratamiento.</li>
          <li>Derecho a la portabilidad de los datos.</li>
        </ul>
        <p>
          Estos derechos pueden ejercerse dirigiéndose por escrito a {RESPONSABLE.email} o a la dirección postal
          indicada, adjuntando copia de un documento que acredite su identidad. Asimismo, el usuario tiene derecho
          a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) si considera
          que el tratamiento no se ajusta a la normativa vigente.
        </p>

        <h3>7. Normativa aplicable</h3>
        <p>
          El tratamiento de datos se realiza conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018,
          de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).
        </p>
      </>
    ),
  },
  cookies: {
    title: "Política de cookies",
    body: (
      <>
        <h3>1. ¿Qué son las cookies?</h3>
        <p>
          Las cookies son pequeños archivos que se almacenan en el navegador del usuario al visitar un sitio web,
          permitiendo recordar información sobre la visita, como el idioma o preferencias de navegación.
        </p>

        <h3>2. Cookies utilizadas en este sitio web</h3>
        <p>
          Este sitio web utiliza únicamente <strong>cookies técnicas propias</strong>, necesarias para el correcto
          funcionamiento de la página (por ejemplo, para recordar que ya has aceptado esta política de cookies).
          Actualmente no se utilizan cookies de análisis, publicidad o de terceros con fines estadísticos o
          publicitarios.
        </p>
        <p>
          Si en el futuro se incorporasen cookies analíticas o de terceros, esta política se actualizará y se
          solicitará de nuevo el consentimiento del usuario cuando así lo exija la normativa.
        </p>

        <h3>3. Gestión de cookies</h3>
        <p>
          El usuario puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la
          configuración de las opciones del navegador. A continuación, algunos enlaces de ayuda de los
          navegadores más habituales:
        </p>
        <ul>
          <li>Google Chrome</li>
          <li>Mozilla Firefox</li>
          <li>Safari</li>
          <li>Microsoft Edge</li>
        </ul>

        <h3>4. Más información</h3>
        <p>
          Para cualquier duda sobre esta política de cookies, puedes escribirnos a {RESPONSABLE.email}.
        </p>
      </>
    ),
  },
};

export default function LegalModal({ type, onClose }) {
  if (!type) return null;
  const content = CONTENT[type];
  if (!content) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl md:rounded-3xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#092640]">{content.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full bg-slate-100 p-2 transition hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="legal-content space-y-3 text-sm leading-6 text-slate-600 [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-black [&_h3]:text-[#092640] [&_li]:ml-5 [&_li]:list-disc [&_ul]:mt-2 [&_ul]:space-y-1">
          {content.body}
        </div>
      </div>
    </div>
  );
}
