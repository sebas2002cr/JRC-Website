import DocumentoLegal, { Seccion } from "../_legal/documentoLegal";
import { EMPRESA, PLAZOS, ACTUALIZADO } from "../_legal/datos";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Política de Privacidad",
  description:
    "Cómo JRC Consulting Group recolecta, usa y protege los datos personales de quienes usan su sitio web, conforme a la Ley 8968 de Costa Rica.",
  path: "/privacidad"
});

/**
 * Política de privacidad. Ver _legal/documentoLegal.js para el interruptor.
 *
 * Cubre TODO el sitio, no solo el boletín: el sitio también tiene formulario
 * de contacto, cotizaciones, inscripción de pymes, constitución de sociedades
 * y pagos, y cada uno de esos recolecta datos personales. Una política que
 * hablara solo del boletín dejaría fuera lo que más datos pide.
 *
 * Las secciones siguen el artículo 5 de la Ley 8968 (consentimiento
 * informado) y los derechos del artículo 7.
 *
 * Los datos de la empresa y los plazos vienen de _legal/datos.js, que los
 * comparte con los términos. Ya no queda nada por completar en esta página.
 */
export default function PrivacidadPage() {
  return (
    <DocumentoLegal titulo="Política de Privacidad" actualizado={ACTUALIZADO}>
      <Seccion titulo="1. Quiénes somos y qué cubre esta política">
        <p>
          La presente política describe el tratamiento que se da a los datos personales de
          quienes visitan y utilizan este sitio web, así como los mecanismos previstos para el
          ejercicio de los derechos que la normativa reconoce sobre ellos. Resulta aplicable a
          la totalidad del sitio: el formulario de contacto, las solicitudes de cotización, la
          inscripción de pymes, la constitución de sociedades, los pagos en línea y la
          suscripción al boletín.
        </p>
        <p>El responsable del tratamiento de dichos datos es:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Razón social: {EMPRESA.razonSocial}</li>
          <li>Nombre comercial: {EMPRESA.nombreComercial}</li>
          <li>Cédula jurídica: {EMPRESA.cedula}</li>
          <li>Domicilio: {EMPRESA.domicilio}</li>
          <li>
            Correo para asuntos de datos personales:{" "}
            <a href={`mailto:${EMPRESA.correo}`} className="underline">
              {EMPRESA.correo}
            </a>
          </li>
          <li>
            Teléfono:{" "}
            <a href={`tel:${EMPRESA.telefonoEnlace}`} className="underline">
              {EMPRESA.telefono}
            </a>
          </li>
        </ul>
        <p>
          El tratamiento se rige por la <strong>Ley N.° 8968, Ley de Protección de la Persona
          frente al Tratamiento de sus Datos Personales</strong>, su reglamento (Decreto
          Ejecutivo N.° 37554-JP) y demás normativa costarricense aplicable.
        </p>
      </Seccion>

      <Seccion titulo="2. Qué datos recolectamos y de dónde">
        <p>
          Se recolectan únicamente los datos estrictamente necesarios para cada finalidad, en
          aplicación del principio de minimización:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Boletín:</strong> su correo electrónico, que es el único dato
            indispensable. También puede indicarnos su nombre completo y su ocupación
            (profesional independiente, empresario, asalariado o estudiante), que usamos
            únicamente para dirigirnos a usted por su nombre y para orientar mejor los
            contenidos. Ambos campos son opcionales y su omisión no impide la suscripción. Se
            registran asimismo la fecha y la dirección IP desde la que se efectuó la
            solicitud, así como la fecha de confirmación, en calidad de prueba del
            consentimiento otorgado. En caso de cancelación posterior, se conservan la fecha
            de la baja y, si el usuario decidió indicarlo, su motivo.
          </li>
          <li>
            <strong>Formulario de contacto y solicitudes:</strong> los datos que usted mismo
            escribe, normalmente nombre, correo, teléfono y el detalle de su consulta.
          </li>
          <li>
            <strong>Cotizaciones, inscripción de pymes y constitución de sociedades:</strong>{" "}
            los datos que el trámite requiere, que pueden incluir identificación, datos de la
            empresa y documentación de respaldo.
          </li>
          <li>
            <strong>Pagos:</strong> los datos de la transacción. Los datos completos de su
            tarjeta los procesa directamente la pasarela de pago (ONVO Pay); nosotros no los
            recibimos ni los almacenamos.
          </li>
          <li>
            <strong>Datos técnicos de navegación:</strong> dirección IP, tipo de navegador y
            páginas visitadas, recolectados de forma automática con fines estadísticos y de
            seguridad.
          </li>
          <li>
            <strong>Prueba de consentimiento:</strong> cuando usted acepta esta política, se
            registra la fecha, la hora y la dirección IP desde la que lo hizo. La ley nos
            exige poder demostrar que el consentimiento existió.
          </li>
        </ul>
        <p>
          No recolectamos datos sensibles (origen étnico, opiniones políticas, convicciones
          religiosas, salud o vida sexual) ni le pedimos que nos los proporcione.
        </p>
      </Seccion>

      <Seccion titulo="3. Para qué usamos sus datos">
        <p>Cada dato se usa para el fin por el que lo entregó, y no para otro:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Responder sus consultas y darle seguimiento.</li>
          <li>Elaborar y enviarle cotizaciones.</li>
          <li>Prestarle los servicios que contrate y cumplir el contrato.</li>
          <li>Enviarle el boletín semanal, si se suscribió.</li>
          <li>Cumplir obligaciones legales, contables y tributarias que nos apliquen.</li>
          <li>Mantener la seguridad del sitio y prevenir usos abusivos.</li>
        </ul>
        <p>
          <strong>No vendemos, alquilamos ni cedemos sus datos personales</strong> a terceros
          con fines comerciales o publicitarios.
        </p>
      </Seccion>

      <Seccion titulo="4. Con qué fundamento los tratamos">
        <p>
          Con su <strong>consentimiento informado y expreso</strong>, que usted otorga al
          marcar la casilla correspondiente antes de enviar cualquier formulario. Esa casilla
          nunca viene marcada de antemano.
        </p>
        <p>
          En el caso del boletín, además le enviamos un correo de confirmación: su suscripción
          solo queda activa si usted confirma desde ese correo. Así nadie puede suscribir a
          otra persona.
        </p>
        <p>
          También tratamos datos cuando resulta necesario para ejecutar un contrato que usted
          celebró con nosotros, o para cumplir una obligación legal.
        </p>
        <p>
          <strong>Puede retirar su consentimiento en cualquier momento</strong>, sin expresar
          motivo. Retirarlo no afecta la validez del tratamiento realizado antes.
        </p>
      </Seccion>

      <Seccion titulo="5. Cuánto tiempo los conservamos">
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>Boletín:</strong> mientras siga suscrito. Al darse de baja dejamos de
            escribirle de inmediato, pero conservamos el registro de esa baja (su correo y
            la fecha). Lo hacemos por dos razones: para poder demostrar que respetamos su
            decisión, y para que su dirección no vuelva a entrar a la lista por error. Si
            prefiere que borremos ese registro por completo, puede pedírnoslo.
          </li>
          <li>
            <strong>Consultas que no derivan en contratación:</strong> {PLAZOS.consultasSinContratar}{" "}
            desde el último contacto. Cumplido ese plazo se eliminan. Es un plazo más corto
            que el habitual del mercado, y es deliberado: conservar los datos de alguien que
            nunca llegó a contratarnos más tiempo del que hace falta para darle seguimiento
            comercial no se justifica frente a esa persona.
          </li>
          <li>
            <strong>Clientes:</strong> durante toda la relación y {PLAZOS.clientes} después
            de terminada, por las obligaciones legales, contables y tributarias que nos
            alcanzan. El plazo de prescripción tributaria en Costa Rica es de cuatro años;
            conservamos un año más como margen.
          </li>
        </ul>
        <p>Cumplido el plazo, los datos se eliminan o se anonimizan.</p>
      </Seccion>

      <Seccion titulo="6. Con quién los compartimos">
        <p>
          Solo con los proveedores necesarios para que el servicio funcione, y únicamente para
          eso. Todos están obligados a proteger la información:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Alojamiento del sitio web:</strong> Vercel Inc. (Estados Unidos), que
            además nos brinda estadísticas de visitas de forma anónima.
          </li>
          <li>
            <strong>Base de datos:</strong> Google Cloud Firestore, de Google LLC (Estados
            Unidos), donde se almacena la información de clientes y solicitudes.
          </li>
          <li>
            <strong>Correo electrónico:</strong> Google LLC (Estados Unidos), que es el
            servicio con el que le enviamos y recibimos correos.
          </li>
          <li>
            <strong>Pasarela de pagos:</strong> ONVO Pay, empresa costarricense. Los datos
            completos de su tarjeta viajan directamente a ellos y nosotros no los recibimos
            ni los almacenamos en ningún momento.
          </li>
          <li>
            <strong>Traducción del sitio:</strong> GlobalSEO, que permite mostrar el sitio en
            otros idiomas.
          </li>
        </ul>
        <p>
          Salvo la pasarela de pagos, que es costarricense, estos proveedores están fuera de
          Costa Rica, por lo que sus datos pueden almacenarse en el exterior. Al aceptar esta
          política usted consiente esa transferencia, que se realiza con proveedores que
          ofrecen niveles adecuados de protección.
        </p>
        <p>
          También podemos entregar información cuando una autoridad competente lo requiera por
          resolución fundada.
        </p>
      </Seccion>

      <Seccion titulo="7. Sus derechos">
        <p>
          La Ley 8968 le reconoce cuatro derechos sobre sus datos, y puede ejercerlos en
          cualquier momento y sin costo:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Acceso:</strong> saber qué datos suyos tenemos, de dónde salieron y para qué los usamos.</li>
          <li><strong>Rectificación:</strong> corregirlos si están incompletos, inexactos o desactualizados.</li>
          <li><strong>Cancelación:</strong> pedir que los eliminemos cuando ya no sean necesarios.</li>
          <li><strong>Oposición:</strong> pedir que dejemos de usarlos para una finalidad concreta.</li>
        </ul>
        <p>
          Para ejercerlos, escríbanos a{" "}
          <a href={`mailto:${EMPRESA.correo}`} className="underline">
            {EMPRESA.correo}
          </a>{" "}
          indicando su nombre, el derecho que quiere ejercer y un medio para responderle. Le
          contestaremos dentro de los {PLAZOS.respuestaDerechos} que fija el reglamento a la
          Ley 8968.
        </p>
        <p>
          <strong>Para el boletín no hace falta escribirnos:</strong> todos los correos que le
          enviamos llevan al pie un enlace de <strong>Darme de baja</strong>. Con un clic deja
          de recibirlo, sin explicar nada y sin esperar respuesta de nadie. Si su programa de
          correo muestra un botón propio de cancelar suscripción, ese también funciona.
        </p>
        <p>
          Si considera que no atendimos su solicitud correctamente, puede acudir a la{" "}
          <strong>Agencia de Protección de Datos de los Habitantes (PRODHAB)</strong>, órgano
          encargado de velar por el cumplimiento de la Ley 8968.
        </p>
      </Seccion>

      <Seccion titulo="8. Cómo protegemos sus datos">
        <p>
          Aplicamos medidas de seguridad razonables para evitar la pérdida, el acceso no
          autorizado y el uso indebido de la información:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Conexión cifrada (HTTPS) en todo el sitio.</li>
          <li>Acceso a los datos restringido al personal que lo necesita para su trabajo.</li>
          <li>Credenciales de acceso individuales y contraseñas almacenadas cifradas.</li>
          <li>
            Los datos de su tarjeta no pasan por nuestros sistemas: van directo a la pasarela
            de pagos.
          </li>
        </ul>
        <p>
          Ningún sistema es infalible. Si ocurriera una violación de seguridad que afecte sus
          datos, se lo comunicaremos conforme a la normativa vigente.
        </p>
      </Seccion>

      <Seccion titulo="9. Cookies y datos guardados en su navegador">
        <p>
          <strong>Este sitio no instala cookies propias</strong> para seguirlo ni para
          perfilarlo con fines publicitarios.
        </p>
        <p>
          Sí guarda información <strong>en su propio navegador</strong>, y conviene que lo
          sepa: cuando usted empieza a llenar el formulario de inscripción de pymes o el de
          constitución de sociedades, los datos que va escribiendo (nombre, correo, teléfono
          y número de identificación) quedan guardados en su equipo para que no los pierda si
          la página se recarga o si vuelve más tarde a terminar el trámite.
        </p>
        <p>
          Esa información <strong>permanece en su dispositivo</strong>, no se envía a ningún
          lado mientras usted no complete el trámite, y desaparece al borrar los datos de
          navegación del sitio desde la configuración de su navegador. Si comparte el equipo
          con otras personas, conviene hacerlo al terminar.
        </p>
        <p>
          Los servicios externos que utilizamos (la pasarela de pagos y el traductor del
          sitio) pueden usar sus propias tecnologías cuando usted los utiliza, sujetas a las
          políticas de cada uno. Las estadísticas de visitas que usamos son anónimas y no
          emplean cookies.
        </p>
      </Seccion>

      <Seccion titulo="10. Menores de edad">
        <p>
          Nuestros servicios están dirigidos a personas mayores de edad. No recolectamos
          intencionalmente datos de menores. Si detectamos que recibimos datos de una persona
          menor sin autorización de quien ejerce su representación, los eliminaremos.
        </p>
      </Seccion>

      <Seccion titulo="11. Cambios a esta política">
        <p>
          Podemos actualizar esta política cuando cambien nuestros servicios o la normativa. Si
          el cambio es relevante, se lo comunicaremos por los medios de contacto que nos haya
          proporcionado antes de que entre en vigencia. La fecha que aparece al inicio indica
          la última actualización.
        </p>
      </Seccion>
    </DocumentoLegal>
  );
}
