import DocumentoLegal, { Seccion, Pendiente } from "../_legal/documentoLegal";
import { EMPRESA, CONDICIONES_AFILIADOS_BORRADOR, CONDICIONES_AFILIADOS_PUBLICADAS } from "../_legal/datos";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Condiciones del programa de afiliados",
  description: "Las reglas del programa de afiliados de JRC Consulting Group: cómo se recomienda, cuándo se gana una comisión y cómo se paga.",
  path: "/condiciones-afiliados"
});

/**
 * Condiciones del programa de afiliados (21 oct 2026, H7). BORRADOR escrito a
 * partir de las reglas que decidió Omar (plan del programa, «Reglas decididas»
 * y decisiones 1 a 26); falta la revisión del área legal. Por eso tiene su
 * propio interruptor (NEXT_PUBLIC_CONDICIONES_AFILIADOS, en _legal/datos.js):
 * en producción no existe hasta que legal lo apruebe, y en desarrollo se ve
 * con la franja de borrador. Lo que solo puede decidir legal o el contador va
 * en <Pendiente>.
 *
 * Las cifras de las categorías son las de fábrica del ERP; si Comercial las
 * cambia, este texto dice que rigen las de la categoría de cada afiliado, que
 * él ve en su panel.
 */
export default function CondicionesAfiliadosPage() {
  return (
    <DocumentoLegal
      titulo="Condiciones del programa de afiliados"
      actualizado="21 de octubre de 2026"
      publicado={CONDICIONES_AFILIADOS_PUBLICADAS}
      borrador={CONDICIONES_AFILIADOS_BORRADOR}>
      <Seccion titulo="1. Qué es el programa">
        <p>
          El programa de afiliados de {EMPRESA.nombreComercial} (en adelante, JRC), nombre
          comercial de {EMPRESA.razonSocial}, cédula jurídica {EMPRESA.cedula}, reconoce una
          comisión a las personas que recomiendan a JRC a empresas o personas que después se
          vuelven clientes y pagan sus servicios.
        </p>
        <p>
          Participar no crea una relación laboral, de representación ni de agencia entre el
          afiliado y JRC. El afiliado no puede presentarse como empleado ni como representante
          de JRC, ni ofrecer precios, descuentos o condiciones en su nombre.
        </p>
      </Seccion>

      <Seccion titulo="2. Quién puede ser afiliado">
        <p>
          El programa es para personas de confianza de JRC. Cualquiera puede solicitarlo desde
          la página de socios del sitio; JRC revisa cada solicitud y decide si la acepta, sin
          obligación de explicar el motivo.
        </p>
        <p>
          Al aceptarla, JRC registra al afiliado con su nombre (verificado con la información
          pública del Ministerio de Hacienda cuando tiene cédula costarricense), su correo, su
          teléfono, una categoría de comisión y la moneda en que se le paga, y le envía una
          invitación a su panel en jrc.cr/afiliados. Se entra al panel con un código que llega
          al correo registrado; el afiliado es responsable de no compartir ese correo ni sus
          códigos.
        </p>
      </Seccion>

      <Seccion titulo="3. Cómo se recomienda">
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Con su enlace personal</strong> (jrc.cr/r/ seguido de su nombre): quien lo
            abre y deja sus datos en los siguientes 90 días queda registrado a nombre del
            afiliado.
          </li>
          <li>
            <strong>Desde su panel</strong>, con «Recomendar»: el afiliado deja el nombre de la
            empresa, una persona de contacto y un teléfono o correo. Al hacerlo declara que esa
            persona sabe que la recomendó y acepta que JRC la contacte.
          </li>
          <li>
            <strong>Avisándole al equipo comercial de JRC</strong>, que puede anotar la
            recomendación a su nombre.
          </li>
        </ul>
        <p>
          Si dos afiliados recomiendan a la misma empresa o persona, la recomendación es del
          primero que quedó registrado. Quien ya era cliente de JRC antes de la recomendación no
          genera comisión, salvo que JRC acuerde por escrito con el afiliado ligarlo desde una
          fecha determinada; lo pagado antes de esa fecha no comisiona.
        </p>
        <p>
          El afiliado no puede enviar mensajes masivos ni no solicitados, ni usar la marca de JRC
          en publicidad, sin autorización escrita de JRC.
        </p>
      </Seccion>

      <Seccion titulo="4. Cuándo se gana una comisión">
        <p>
          La comisión se gana <strong>solo cuando el cliente recomendado paga</strong>, y se
          calcula sobre lo efectivamente cobrado <strong>sin el impuesto al valor agregado</strong>.
          No se gana al cotizar, al firmar ni al facturar. Un cobro sin factura emitida no genera
          comisión.
        </p>
        <p>Los porcentajes dependen de la categoría de cada afiliado. Las de fábrica son:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Servicios adicionales de hasta US$2.000 sin IVA: 5 %.</li>
          <li>Servicios adicionales de más de US$2.000 sin IVA: 10 %.</li>
          <li>Mensualidades: 5 %, solo en las categorías que las incluyen.</li>
        </ul>
        <p>
          El valor de un servicio en colones se compara con el límite en dólares al tipo de
          cambio del día en que se facturó. La comisión se gana mientras el recomendado siga
          siendo cliente de JRC, salvo que la categoría del afiliado fije un número de meses,
          contados desde el día en que la recomendación quedó registrada.
        </p>
        <p>
          JRC puede cambiar las categorías y sus porcentajes. Un cambio rige desde la fecha en
          que se hace y no afecta las comisiones ya ganadas. El panel muestra siempre las reglas
          vigentes de la categoría del afiliado.
        </p>
      </Seccion>

      <Seccion titulo="5. Moneda y tipo de cambio">
        <p>
          Cada afiliado tiene una moneda (colones o dólares) en la que se le muestra y se le paga
          todo. Si el cliente pagó en la otra moneda, la comisión se convierte al tipo de cambio
          de venta del día en que el cliente pagó, según el Ministerio de Hacienda o, en su
          defecto, el Banco Central de Costa Rica, y queda fija.
        </p>
      </Seccion>

      <Seccion titulo="6. Cómo y cuándo se paga">
        <ul className="ml-5 list-disc space-y-2">
          <li>
            Las comisiones de un mes se pagan <strong>una vez al mes</strong>, en un solo pago
            por afiliado, después del cierre de ese mes (los primeros días del mes siguiente,
            salvo que JRC fije otra fecha de cierre).
          </li>
          <li>
            Se pagan por transferencia a la cuenta registrada del afiliado, a su nombre y en su
            moneda. Un afiliado en dólares no puede recibir por SINPE Móvil.
          </li>
          <li>
            Para cambiar la cuenta, el afiliado lo solicita a JRC, que verifica la cuenta nueva.
            Mientras no esté verificada se sigue pagando a la anterior.
          </li>
          <li>
            Una comisión que se registra después del cierre de su mes se paga en el cierre
            siguiente. Si un pago del cliente se reversa, la comisión correspondiente se
            descuenta del pago siguiente al afiliado.
          </li>
          <li>
            JRC puede fijar un monto mínimo de pago; lo que no lo alcance se acumula para el mes
            siguiente.
          </li>
        </ul>
        <p>
          El afiliado es responsable de sus propias obligaciones tributarias por las comisiones
          que recibe. <Pendiente>tratamiento tributario de las comisiones pagadas sin factura y si JRC retiene algún impuesto: lo define el contador</Pendiente>
        </p>
      </Seccion>

      <Seccion titulo="7. Lo que ve el afiliado y la confidencialidad">
        <p>
          En su panel, el afiliado ve el nombre de cada recomendado, la etapa en que va y su
          propia comisión. Nunca ve los datos de contacto de los recomendados, los servicios
          que contratan ni los montos que pagan a JRC.
        </p>
        <p>
          El afiliado se compromete a no divulgar lo que conozca de JRC o de sus clientes con
          motivo del programa.
        </p>
      </Seccion>

      <Seccion titulo="8. Pausa y salida del programa">
        <p>
          JRC puede pausar o terminar la participación de un afiliado en cualquier momento,
          especialmente si incumple estas condiciones. Con el acceso pausado, el afiliado no
          entra al panel y su enlace personal deja de registrar recomendaciones; las comisiones
          ya ganadas se le pagan igual. El afiliado puede dejar el programa avisándole a JRC.
        </p>
        <p>
          <Pendiente>si las comisiones de clientes ya ligados se siguen generando después de que el afiliado sale del programa o es dado de baja</Pendiente>
        </p>
      </Seccion>

      <Seccion titulo="9. Datos personales">
        <p>
          Los datos del afiliado y de las personas que recomienda se tratan según la{" "}
          <a href="/privacidad" className="underline">
            Política de Privacidad
          </a>
          .
        </p>
      </Seccion>

      <Seccion titulo="10. Cambios a estas condiciones y ley aplicable">
        <p>
          JRC puede modificar estas condiciones y avisará los cambios sustanciales por correo a
          los afiliados antes de que entren en vigencia. Estas condiciones se rigen por las
          leyes de la República de Costa Rica. <Pendiente>tribunales o mecanismo de resolución de conflictos</Pendiente>
        </p>
      </Seccion>
    </DocumentoLegal>
  );
}
