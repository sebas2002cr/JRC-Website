import DocumentoLegal, { Seccion, Pendiente } from "../_legal/documentoLegal";
import { EMPRESA, DEVOLUCIONES, ACTUALIZADO } from "../_legal/datos";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Términos y Condiciones",
  description:
    "Condiciones de uso del sitio web de JRC Consulting Group, de sus servicios en línea y del boletín semanal.",
  path: "/terminos"
});

/**
 * Términos y condiciones. Ver _legal/documentoLegal.js para el interruptor.
 *
 * Cubre todo el sitio: contenido del blog y boletín, solicitudes de
 * servicios, cotizaciones y pagos en línea.
 *
 * Queda UN dato por definir, marcado con <Pendiente>: si las controversias
 * van a arbitraje o a los tribunales ordinarios. No es un dato que se pueda
 * suponer, porque un arbitraje mal pactado no vale y obliga a litigar de
 * todas formas, después de haber perdido tiempo discutiendo dónde.
 *
 * La sección 4 (contenido informativo, no asesoría) es la más importante
 * para una firma consultora: sin ella, alguien puede tomar una decisión
 * tributaria leyendo el blog y reclamar después. Es la misma lógica del
 * descargo que va al pie del boletín.
 */
export default function TerminosPage() {
  return (
    <DocumentoLegal titulo="Términos y Condiciones" actualizado={ACTUALIZADO}>
      <Seccion titulo="1. Quiénes somos">
        <p>
          Este sitio web es operado por <strong>{EMPRESA.razonSocial}</strong>, sociedad
          debidamente constituida conforme a las leyes de la República de Costa Rica, con
          cédula de persona jurídica número {EMPRESA.cedula} y domicilio en{" "}
          {EMPRESA.domicilio}, que opera comercialmente bajo el nombre{" "}
          <strong>{EMPRESA.nombreComercial}</strong>, en adelante e indistintamente
          &laquo;JRC&raquo;.
        </p>
        <p>
          La referencia a &laquo;JRC&raquo; a lo largo de este documento comprende a la
          sociedad antes indicada. Toda relación contractual derivada de los servicios
          ofrecidos en este sitio se entiende suscrita con dicha sociedad.
        </p>
        <p>
          Para cualquier consulta sobre estos términos puede escribirnos a{" "}
          <a href={`mailto:${EMPRESA.correo}`} className="underline">
            {EMPRESA.correo}
          </a>{" "}
          o llamarnos al{" "}
          <a href={`tel:${EMPRESA.telefonoEnlace}`} className="underline">
            {EMPRESA.telefono}
          </a>
          .
        </p>
      </Seccion>

      <Seccion titulo="2. Aceptación">
        <p>
          La navegación por este sitio, la suscripción al boletín, la solicitud de
          cotizaciones y la contratación de servicios en línea implican la aceptación plena y
          sin reservas de los presentes términos. Quien no esté de acuerdo con ellos deberá
          abstenerse de utilizar el sitio.
        </p>
      </Seccion>

      <Seccion titulo="3. Qué ofrecemos en este sitio">
        <ul className="ml-5 list-disc space-y-1">
          <li>Información sobre nuestros servicios de asesoría tributaria, fiscal, legal y financiera.</li>
          <li>Un blog con novedades normativas y su análisis.</li>
          <li>Un boletín semanal gratuito, de suscripción voluntaria.</li>
          <li>Formularios para solicitar cotizaciones y trámites.</li>
          <li>Pago en línea de los servicios que lo permitan.</li>
        </ul>
      </Seccion>

      <Seccion titulo="4. El contenido es informativo, no es asesoría">
        <p>
          <strong>Esta es la sección más importante de este documento.</strong> El contenido
          del blog, del boletín y de las secciones informativas del sitio es de{" "}
          <strong>carácter general</strong> y tiene fines exclusivamente informativos.
        </p>
        <p>
          No constituye asesoría tributaria, fiscal, contable, legal ni financiera sobre un
          caso concreto, ni genera relación profesional alguna entre el usuario y JRC. Dicha
          relación se constituye únicamente mediante la formalización de una contratación de
          servicios.
        </p>
        <p>
          Cada situación particular presenta circunstancias propias. Antes de adoptar
          cualquier decisión o emprender cualquier acción con fundamento en el contenido de
          este sitio, se recomienda consultar con un profesional que conozca el caso
          concreto. JRC queda a disposición del usuario para ese efecto a través de los
          medios de contacto indicados.
        </p>
        <p>
          JRC no asume responsabilidad por decisiones adoptadas con base en el contenido
          informativo del sitio.
        </p>
      </Seccion>

      <Seccion titulo="5. Exactitud y vigencia de la información">
        <p>
          La normativa tributaria y legal costarricense es objeto de modificación frecuente.
          JRC emplea la diligencia razonable para publicar información correcta y vigente; no
          obstante, cualquier publicación puede resultar desactualizada por disposiciones
          posteriores a su fecha de emisión.
        </p>
        <p>
          Cada publicación indica su fecha y la fuente correspondiente. JRC no asume la
          obligación de actualizar contenidos previamente publicados.
        </p>
      </Seccion>

      <Seccion titulo="6. Propiedad intelectual y uso del contenido">
        <p>
          Los textos, el logotipo, la marca y el diseño de este sitio pertenecen a JRC o se
          usan con autorización. Las fotografías provienen de bancos de imágenes con licencia
          para este uso y se acredita a su autor cuando corresponde.
        </p>
        <p>
          <strong>Puede</strong> leer, compartir y citar nuestras publicaciones indicando la
          fuente y enlazando al artículo original.
        </p>
        <p>
          <strong>No puede</strong> reproducirlas íntegramente en otro sitio como propias, ni
          usarlas con fines comerciales sin autorización escrita.
        </p>
      </Seccion>

      <Seccion titulo="7. Boletín semanal">
        <p>
          El boletín se remite los días lunes, es gratuito y su suscripción es enteramente
          voluntaria. Para activarla se envía un correo de confirmación: la suscripción queda
          perfeccionada únicamente cuando el usuario confirma desde dicho enlace. El enlace de
          confirmación caduca a los siete días naturales; transcurrido ese plazo será
          necesario suscribirse nuevamente.
        </p>
        <p>
          En las semanas en que no existan novedades que ameriten un envío,{" "}
          <strong>no se remitirá comunicación alguna</strong>. La ausencia de envío en una
          semana determinada no implica la interrupción ni la cancelación de la suscripción.
        </p>
        <p>
          Al suscribirse, el usuario declara que la dirección de correo electrónico
          suministrada le pertenece o que cuenta con autorización expresa para utilizarla.
        </p>
        <p>
          El usuario puede cancelar su suscripción en cualquier momento desde el enlace
          habilitado al pie de cada envío, sin necesidad de mediar solicitud ni expresar
          motivo alguno. JRC se reserva la facultad de excluir de la lista aquellas
          direcciones que presenten rebotes reiterados o que califiquen sus comunicaciones
          como no deseadas.
        </p>
      </Seccion>

      <Seccion titulo="8. Solicitudes, cotizaciones y contratación">
        <p>
          Las cotizaciones que genera el sitio son <strong>estimaciones</strong> basadas en la
          información que usted proporciona. No constituyen una oferta en firme y pueden
          variar una vez analizado el caso.
        </p>
        <p>
          La prestación efectiva de cualquier servicio se rige por el contrato o la carta de
          compromiso que se suscriba, que prevalece sobre lo indicado en el sitio.
        </p>
        <p>
          Usted se compromete a entregar información veraz y completa. JRC no responde por
          consecuencias derivadas de información inexacta suministrada por el cliente.
        </p>
      </Seccion>

      <Seccion titulo="9. Pagos">
        <p>
          Los pagos en línea se procesan a través de <strong>ONVO Pay</strong>, una pasarela
          de pagos externa. Los datos de su tarjeta viajan directamente a ella; JRC no los
          recibe ni los almacena.
        </p>
        <p>
          Los precios se expresan en <strong>colones costarricenses (₡)</strong> y{" "}
          <strong>ya incluyen el impuesto al valor agregado (IVA)</strong>. El monto que
          usted ve en pantalla antes de pagar es el monto total que se le cobra: no se le
          suma ningún impuesto ni cargo adicional al confirmar.
        </p>
      </Seccion>

      <Seccion titulo="10. Cancelaciones y devoluciones">
        <p>
          Una vez recibido el pago, usted dispone de <strong>{DEVOLUCIONES.plazoDias} días
          naturales</strong> para dar de baja el servicio y solicitar la devolución del
          dinero. La solicitud debe hacerse por escrito a{" "}
          <a href={`mailto:${EMPRESA.correo}`} className="underline">
            {EMPRESA.correo}
          </a>
          , desde la misma dirección con la que se contrató.
        </p>
        <p>El monto que se devuelve depende de si el servicio ya arrancó:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Si el servicio aún no ha iniciado:</strong> JRC reembolsa el{" "}
            {DEVOLUCIONES.porcentajeSinIniciar}% de lo pagado. El{" "}
            {100 - DEVOLUCIONES.porcentajeSinIniciar}% restante se retiene para cubrir los
            costos administrativos, operativos y de gestión en que ya se incurrió.
          </li>
          <li>
            <strong>Si el servicio ya inició:</strong> el monto se determina según el avance
            efectivo a la fecha de la solicitud. JRC le detallará por escrito el avance
            considerado y el cálculo del reembolso antes de procesarlo.
          </li>
        </ul>
        <p>
          Pasados los {DEVOLUCIONES.plazoDias} días no procede devolución, salvo que JRC no
          haya podido prestar el servicio por causas que le sean atribuibles. La devolución se
          hace por el mismo medio de pago con que se contrató.
        </p>
        <p>
          Los trámites que dependen de terceros (Registro Nacional, Hacienda, Caja
          Costarricense de Seguro Social y similares) llevan tasas y timbres que se pagan a
          esas entidades y no a JRC. Esos montos no son reembolsables una vez enterados, con
          independencia de lo anterior.
        </p>
      </Seccion>

      <Seccion titulo="11. Uso permitido del sitio">
        <p>Al usar este sitio, usted se compromete a no:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Intentar acceder sin autorización a sistemas, cuentas o datos.</li>
          <li>Enviar datos falsos, suscribir correos ajenos o suplantar identidades.</li>
          <li>Usar medios automatizados para extraer contenido de forma masiva.</li>
          <li>Interferir con el funcionamiento normal del sitio.</li>
        </ul>
      </Seccion>

      <Seccion titulo="12. Enlaces a sitios de terceros">
        <p>
          Nuestras publicaciones pueden enlazar a sitios externos, como fuentes oficiales o
          medios de comunicación. Esos sitios tienen sus propios términos y políticas, y JRC no
          responde por su contenido ni por su disponibilidad.
        </p>
      </Seccion>

      <Seccion titulo="13. Disponibilidad del sitio">
        <p>
          Procuramos que el sitio esté disponible de forma continua, pero puede haber
          interrupciones por mantenimiento, fallas técnicas o causas ajenas a nosotros. No
          garantizamos disponibilidad ininterrumpida.
        </p>
      </Seccion>

      <Seccion titulo="14. Protección de datos personales">
        <p>
          El tratamiento de sus datos personales se rige por nuestra{" "}
          <a href="/privacidad" className="font-medium underline">Política de Privacidad</a>,
          elaborada conforme a la Ley N.° 8968 de Costa Rica.
        </p>
      </Seccion>

      <Seccion titulo="15. Cambios en estos términos">
        <p>
          Podemos modificar estos términos cuando cambien nuestros servicios o la normativa
          aplicable. Si el cambio es relevante, lo comunicaremos antes de que entre en
          vigencia. La fecha del encabezado indica la última actualización.
        </p>
      </Seccion>

      <Seccion titulo="16. Ley aplicable y jurisdicción">
        <p>
          Estos términos se rigen por las leyes de la República de Costa Rica. Cualquier
          controversia se someterá a los tribunales costarricenses{" "}
          <Pendiente>confirmar si se prefiere arbitraje o jurisdicción ordinaria, y la sede</Pendiente>.
        </p>
      </Seccion>
    </DocumentoLegal>
  );
}
