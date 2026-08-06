import DocumentoLegal, { Seccion } from "../_legal/documentoLegal";
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
 * La sección 4 (contenido informativo, no asesoría) es la más importante
 * para una firma consultora: sin ella, alguien puede tomar una decisión
 * tributaria leyendo el blog y reclamar después. Es la misma lógica del
 * descargo que va al pie del boletín.
 *
 * La sección 16 (ley aplicable) es la segunda: acá arriba se explica lo
 * general, pero el porqué de cómo está redactada está en el comentario que
 * la acompaña, porque es un detalle que se puede "corregir" sin querer.
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

      <Seccion titulo="3. Servicios ofrecidos en este sitio">
        <ul className="ml-5 list-disc space-y-1">
          <li>
            Información sobre los servicios de asesoría tributaria, fiscal, legal y financiera
            que presta JRC.
          </li>
          <li>Un blog con novedades normativas y su análisis.</li>
          <li>Un boletín semanal gratuito, de suscripción voluntaria.</li>
          <li>Formularios para la solicitud de cotizaciones y trámites.</li>
          <li>Pago en línea de los servicios que lo permitan.</li>
        </ul>
      </Seccion>

      <Seccion titulo="4. El contenido es informativo, no es asesoría">
        <p>
          El contenido del blog, del boletín y de las secciones informativas de este sitio es
          de <strong>carácter general</strong> y se difunde con fines exclusivamente
          informativos.
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
          Las cotizaciones generadas por el sitio constituyen <strong>estimaciones</strong>{" "}
          elaboradas con base en la información suministrada por el usuario. No constituyen
          oferta en firme y pueden variar una vez analizado el caso concreto.
        </p>
        <p>
          La prestación efectiva de cualquier servicio se rige por el contrato o la carta de
          compromiso que al efecto se suscriba, instrumento que prevalece sobre lo indicado en
          este sitio.
        </p>
        <p>
          El usuario se obliga a suministrar información veraz y completa. JRC no responde por
          las consecuencias derivadas de información inexacta o incompleta suministrada por el
          cliente.
        </p>
      </Seccion>

      <Seccion titulo="9. Pagos">
        <p>
          Los pagos en línea se procesan a través de <strong>ONVO Pay</strong>, pasarela de
          pagos externa. Los datos de la tarjeta se transmiten directamente a dicha pasarela;
          JRC no los recibe ni los almacena.
        </p>
        <p>
          Los precios se expresan en <strong>colones costarricenses (₡)</strong> e{" "}
          <strong>incluyen el impuesto al valor agregado (IVA)</strong>. El monto consignado
          en pantalla con anterioridad al pago constituye el monto total a cobrar; no se
          adiciona impuesto ni cargo alguno al momento de confirmar la transacción.
        </p>
      </Seccion>

      <Seccion titulo="10. Cancelaciones y devoluciones">
        <p>
          Recibido el pago, el usuario dispone de un plazo de{" "}
          <strong>{DEVOLUCIONES.plazoDias} días naturales</strong> para cancelar el servicio y
          solicitar la devolución del monto pagado. La solicitud deberá formularse por escrito
          a{" "}
          <a href={`mailto:${EMPRESA.correo}`} className="underline">
            {EMPRESA.correo}
          </a>{" "}
          desde la misma dirección de correo con la que se efectuó la contratación.
        </p>
        <p>El monto a reembolsar se determina según el estado de avance del servicio:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Si el servicio no ha iniciado:</strong> JRC reembolsará el{" "}
            {DEVOLUCIONES.porcentajeSinIniciar}% del monto pagado. El{" "}
            {100 - DEVOLUCIONES.porcentajeSinIniciar}% restante se retendrá para cubrir los
            costos administrativos, operativos y de gestión ya incurridos.
          </li>
          <li>
            <strong>Si el servicio ya inició:</strong> el monto a reembolsar se determinará
            conforme al avance efectivo a la fecha de la solicitud. JRC detallará por escrito
            el avance considerado y el cálculo correspondiente con anterioridad a procesar la
            devolución.
          </li>
        </ul>
        <p>
          Transcurrido el plazo de {DEVOLUCIONES.plazoDias} días no procederá la devolución,
          salvo que JRC se encuentre imposibilitado de prestar el servicio por causas que le
          sean atribuibles. El reembolso se efectuará por el mismo medio de pago utilizado en
          la contratación.
        </p>
        <p>
          Los trámites que dependen de terceros (Registro Nacional, Ministerio de Hacienda,
          Caja Costarricense de Seguro Social y similares) conllevan tasas, timbres y derechos
          que se enteran a dichas entidades y no a JRC. Tales montos no son reembolsables una
          vez enterados, con independencia de lo dispuesto en los párrafos anteriores.
        </p>
      </Seccion>

      <Seccion titulo="11. Uso permitido del sitio">
        <p>El usuario se obliga a abstenerse de:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Acceder sin autorización a sistemas, cuentas o datos.</li>
          <li>
            Suministrar datos falsos, suscribir direcciones de correo ajenas o suplantar la
            identidad de terceros.
          </li>
          <li>Emplear medios automatizados para la extracción masiva de contenido.</li>
          <li>Interferir con el funcionamiento normal del sitio.</li>
        </ul>
      </Seccion>

      <Seccion titulo="12. Enlaces a sitios de terceros">
        <p>
          Las publicaciones de este sitio pueden remitir a sitios externos, tales como fuentes
          oficiales o medios de comunicación. Dichos sitios se rigen por sus propios términos y
          políticas; JRC no responde por su contenido ni por su disponibilidad.
        </p>
      </Seccion>

      <Seccion titulo="13. Disponibilidad del sitio">
        <p>
          JRC procura mantener el sitio disponible de forma continua. No obstante, pueden
          presentarse interrupciones por labores de mantenimiento, fallas técnicas o causas
          ajenas a su control, por lo que no se garantiza una disponibilidad ininterrumpida.
        </p>
      </Seccion>

      <Seccion titulo="14. Protección de datos personales">
        <p>
          El tratamiento de los datos personales del usuario se rige por la{" "}
          <a href="/privacidad" className="font-medium underline">Política de Privacidad</a>,
          elaborada conforme a la Ley N.° 8968, Ley de Protección de la Persona frente al
          Tratamiento de sus Datos Personales.
        </p>
      </Seccion>

      <Seccion titulo="15. Modificación de estos términos">
        <p>
          JRC se reserva la facultad de modificar los presentes términos cuando varíen los
          servicios ofrecidos o la normativa aplicable. Las modificaciones sustanciales serán
          comunicadas con anterioridad a su entrada en vigencia. La fecha consignada en el
          encabezado indica la última actualización.
        </p>
      </Seccion>

      {/* Esta cláusula NO lleva renuncia de fuero ni sede fija, y no es un
          olvido. El artículo 1023 inciso 2 del Código Civil declara
          absolutamente nulas, en los contratos de adhesión, las cláusulas
          que excluyen o restringen el derecho del adherente a recurrir a los
          tribunales comunes. Unos términos y condiciones de un sitio web son
          un contrato de adhesión de manual: nadie los negocia.

          El acuerdo directo previo se redacta como una vía preferente y no
          como un requisito, por lo mismo. Un plazo obligatorio antes de
          poder demandar es una restricción de acceso a la justicia, y una
          cláusula que se cae arrastra la credibilidad de las que quedan. */}
      <Seccion titulo="16. Ley aplicable y resolución de controversias">
        <p>
          Los presentes términos se rigen e interpretan conforme a las leyes de la República de
          Costa Rica.
        </p>
        <p>
          Ante cualquier desacuerdo derivado de estos términos o de los servicios contratados a
          través del sitio, JRC invita al usuario a plantear su reclamo por escrito a{" "}
          <a href={`mailto:${EMPRESA.correo}`} className="underline">
            {EMPRESA.correo}
          </a>
          . JRC se compromete a emitir respuesta dentro de los diez días hábiles siguientes a
          su recepción, con el propósito de procurar una solución directa.
        </p>
        <p>
          Este paso previo es voluntario y no constituye requisito para acudir a las
          instancias judiciales o administrativas correspondientes. De no alcanzarse un
          acuerdo, la controversia podrá someterse al conocimiento de los tribunales de la
          República de Costa Rica, conforme a las reglas de competencia que resulten
          aplicables.
        </p>
        <p>
          Lo dispuesto en esta cláusula no limita ni menoscaba los derechos que la Ley N.°
          7472, Ley de Promoción de la Competencia y Defensa Efectiva del Consumidor, reconoce
          al usuario, ni su facultad de presentar denuncia ante la Comisión Nacional del
          Consumidor del Ministerio de Economía, Industria y Comercio.
        </p>
      </Seccion>
    </DocumentoLegal>
  );
}
