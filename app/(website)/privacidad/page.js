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
          Los datos suministrados a través de este sitio se incorporan a una{" "}
          <strong>base de datos automatizada</strong> administrada por JRC, destinada
          exclusivamente a las finalidades descritas en el apartado 3. Dicha base es de uso
          interno: sus datos no se distribuyen, difunden ni comercializan.
        </p>
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
            contenidos. Ambos campos son opcionales y su omisión no impide la suscripción. En
            caso de cancelación posterior, se conservan la fecha de la baja y, si el usuario
            decidió indicarlo, su motivo. Los datos que respaldan su consentimiento se
            detallan en el último punto de esta lista.
          </li>
          <li>
            <strong>Formulario de contacto:</strong> nombre y apellido, correo electrónico,
            teléfono, nombre de la empresa, puesto, si actúa como persona física o jurídica,
            el tema de la consulta, el medio por el que prefiere que se le responda y el
            detalle que usted redacte. El formulario permite además adjuntar archivos; si
            estos contienen datos personales suyos o de terceros, reciben el mismo tratamiento
            descrito en esta política, y le pedimos adjuntar únicamente lo necesario para
            atender su gestión.
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
          {/* Este punto es el ÚNICO lugar del documento donde se explica el
              registro de fecha, hora e IP. Antes también aparecía dentro del
              punto del boletín, y el área legal marcó la repetición: en un
              documento que la gente lee de corrido, decir dos veces lo mismo
              con palabras distintas hace dudar de si son dos registros o uno.
              Si mañana hay que detallar algo del consentimiento de un
              formulario en particular, va acá, no en el punto de ese
              formulario. */}
          <li>
            <strong>Prueba de consentimiento:</strong> cuando usted acepta esta política o se
            suscribe al boletín, se registra la fecha, la hora y la dirección IP desde la que
            lo hizo, y en el caso del boletín también la fecha en que confirmó la suscripción
            desde el enlace que le enviamos. La ley nos exige poder demostrar que el
            consentimiento existió.
          </li>
        </ul>
        <p>
          No recolectamos datos sensibles (origen étnico, opiniones políticas, convicciones
          religiosas, salud o vida sexual) ni le pedimos que nos los proporcione.
        </p>
        <p>
          <strong>Qué datos son obligatorios y qué pasa si no los suministra.</strong> El
          suministro de datos es voluntario en todos los casos. Ahora bien, cada trámite
          requiere un mínimo de información para poder ejecutarse: sin una dirección de correo
          no es posible remitir el boletín ni responder una consulta, y sin los datos de
          identificación que exige cada gestión no es posible tramitarla ante la entidad
          correspondiente. La negativa a suministrar esos datos mínimos impide únicamente la
          prestación del servicio de que se trate, sin ninguna otra consecuencia.
        </p>
        <p>
          <strong>Exactitud de la información.</strong> Los datos suministrados deben ser
          veraces y encontrarse actualizados. JRC no responde por las consecuencias derivadas
          de información inexacta o desactualizada suministrada por el titular, quien puede
          solicitar su corrección en cualquier momento conforme al apartado 7.
        </p>
      </Seccion>

      <Seccion titulo="3. Para qué usamos sus datos">
        <p>
          Cada dato se destina exclusivamente a la finalidad para la cual fue suministrado:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Atender sus consultas y darles el seguimiento correspondiente.</li>
          <li>Elaborar y remitir cotizaciones.</li>
          <li>Prestar los servicios contratados y ejecutar el contrato respectivo.</li>
          <li>Remitir el boletín semanal, en caso de haberse suscrito.</li>
          <li>Cumplir las obligaciones legales, contables y tributarias aplicables.</li>
          <li>Mantener la seguridad del sitio y prevenir usos abusivos.</li>
        </ul>
        <p>
          <strong>Los datos personales no se venden, alquilan ni ceden</strong> a terceros con
          fines comerciales o publicitarios.
        </p>
      </Seccion>

      <Seccion titulo="4. Con qué fundamento los tratamos">
        <p>
          El fundamento principal es su <strong>consentimiento informado y expreso</strong>,
          otorgado mediante la marcación de la casilla correspondiente con anterioridad al
          envío de cualquier formulario. Dicha casilla no se encuentra marcada por defecto en
          ningún caso.
        </p>
        <p>
          Tratándose del boletín, se remite además un correo de confirmación: la suscripción
          queda activa únicamente si el titular confirma desde ese enlace, de modo que ninguna
          persona pueda suscribir a otra.
        </p>
        <p>
          Asimismo se tratan datos cuando resulta necesario para la ejecución de un contrato
          celebrado con el titular o para el cumplimiento de una obligación legal.
        </p>
        <p>
          <strong>El consentimiento puede revocarse en cualquier momento</strong>, sin
          necesidad de expresar motivo. La revocatoria no afecta la validez del tratamiento
          efectuado con anterioridad.
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
            <strong>Clientes:</strong> {PLAZOS.clientes} contados desde la última gestión
            realizada o el último documento emitido, por las obligaciones legales, contables
            y tributarias que nos alcanzan. El plazo de prescripción tributaria en Costa Rica
            es de cuatro años; conservamos un año más como margen.
          </li>
        </ul>
        <p>
          Revisamos estos plazos de forma periódica, al menos una vez cada seis meses, y los
          datos que ya los cumplieron se eliminan o se anonimizan. Si prefiere no esperar a
          esa revisión, puede pedirnos la eliminación en cualquier momento por los medios de
          la sección 7 y la atenderemos en el plazo que ahí se indica.
        </p>
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
          La Ley N.° 8968 reconoce al titular cuatro derechos sobre sus datos, ejercitables en
          cualquier momento y de forma gratuita:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>Acceso:</strong> conocer qué datos suyos se tratan, su procedencia y la
            finalidad con que se utilizan.
          </li>
          <li>
            <strong>Rectificación:</strong> obtener su corrección cuando resulten incompletos,
            inexactos o desactualizados.
          </li>
          <li>
            <strong>Cancelación:</strong> solicitar su eliminación cuando hayan dejado de ser
            necesarios para la finalidad que los originó.
          </li>
          <li>
            <strong>Oposición:</strong> solicitar el cese de su tratamiento para una finalidad
            determinada.
          </li>
        </ul>
        <p>
          Para ejercerlos, escríbanos a{" "}
          <a href={`mailto:${EMPRESA.correo}`} className="underline">
            {EMPRESA.correo}
          </a>{" "}
          indicando su nombre, el derecho que desea ejercer y un medio para remitirle
          respuesta. Esta se emitirá dentro del plazo de {PLAZOS.respuestaDerechos} que fija el
          reglamento a la Ley N.° 8968.
        </p>
        <p>
          <strong>Tratándose del boletín no es necesario mediar solicitud:</strong> todos los
          envíos incorporan al pie un enlace de <strong>Darme de baja</strong>. Con un clic el
          titular deja de recibirlo, sin expresar motivo ni esperar respuesta. Si su programa
          de correo muestra un botón propio de cancelación de suscripción, este también surte
          el mismo efecto.
        </p>
        <p>
          En caso de considerar que su solicitud no fue atendida debidamente, el titular puede
          acudir a la <strong>Agencia de Protección de Datos de los Habitantes
          (PRODHAB)</strong>, órgano encargado de velar por el cumplimiento de la Ley N.° 8968.
        </p>
      </Seccion>

      <Seccion titulo="8. Cómo protegemos sus datos">
        <p>
          JRC aplica medidas de seguridad razonables para evitar la pérdida, el acceso no
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
          Los servicios de JRC están dirigidos a personas mayores de edad. No se recolectan
          intencionalmente datos de personas menores de edad. De detectarse la recepción de
          datos de una persona menor sin la autorización de quien ejerce su representación,
          estos serán eliminados.
        </p>
      </Seccion>

      <Seccion titulo="11. Modificación de esta política">
        <p>
          JRC podrá actualizar la presente política cuando varíen los servicios ofrecidos o la
          normativa aplicable. Las modificaciones sustanciales serán comunicadas, con
          anterioridad a su entrada en vigencia, por los medios de contacto que el titular haya
          suministrado. La fecha consignada al inicio indica la última actualización.
        </p>
      </Seccion>
    </DocumentoLegal>
  );
}
