# DESIGN.md --- Panel Cripto

## 1. Propósito del documento

Este documento define la dirección visual y los criterios de experiencia
de usuario para **Panel Cripto**, una aplicación frontend de seguimiento
de criptomonedas que consume directamente la API pública de CoinGecko.

La interfaz debe ser profesional, clara, moderna y fácil de leer. Debe
priorizar la información del mercado y evitar la saturación visual
típica de algunos paneles financieros.

Este archivo es la fuente de verdad para las decisiones visuales del
proyecto. Antes de introducir nuevos colores, tamaños, componentes o
patrones de interfaz, se deben consultar estas reglas.

## 2. Alcance y restricciones técnicas

-   Proyecto frontend construido con React, Vite y Tailwind CSS.
-   Utilizar la estructura y las dependencias existentes siempre que sea
    posible.
-   Los datos de mercado deben proceder de CoinGecko cuando la API
    proporcione el dato solicitado.
-   No existe backend propio.
-   No implementar servidor, base de datos, API propia, Firebase,
    Supabase ni autenticación real.
-   La barra de navegación debe incluir los botones **Iniciar sesión** y
    **Registrarse**. En esta etapa son elementos de interfaz y
    navegación solamente: no validan credenciales, no crean cuentas, no
    crean sesiones y no persisten contraseñas.
-   No presentar información simulada como si fueran datos reales de
    CoinGecko. Si se usan datos de ejemplo para un estado de desarrollo,
    deben identificarse explícitamente como demostración.
-   No afirmar que una operación financiera real se ha ejecutado. El
    proyecto es informativo y no realiza transacciones.
-   No reescribir todo el proyecto si una modificación localizada es
    suficiente.
-   No eliminar funciones existentes sin identificar antes su uso y
    explicar el motivo.

## 3. Principios de diseño

1.  **Claridad primero:** el usuario debe identificar rápidamente el
    estado del mercado, buscar una moneda y comparar precios.
2.  **Jerarquía visual:** primero el resumen y los datos principales;
    después las métricas secundarias y el listado de monedas.
3.  **Consistencia:** un mismo color, botón, etiqueta o estado debe
    conservar el mismo significado en toda la aplicación.
4.  **Espacio en blanco:** separar secciones y tarjetas; no llenar cada
    espacio disponible.
5.  **Datos legibles:** alinear números, mantener cifras fáciles de
    comparar y evitar textos secundarios demasiado pequeños.
6.  **Responsive:** la interfaz debe funcionar en escritorio, tableta y
    móvil.
7.  **Accesibilidad:** no usar únicamente el color para expresar
    subidas, bajadas, errores o estados.
8.  **Honestidad de datos:** indicar carga, error, ausencia de
    resultados y datos de demostración cuando corresponda.

## 4. Paleta oficial

No sustituir esta paleta por otra sin autorización. Aplicar los colores
por función, no de manera decorativa indiscriminada.

  -----------------------------------------------------------------------
  Rol               Nombre            Hexadecimal       Uso
  ----------------- ----------------- ----------------- -----------------
  Primario          Navy              `#0F2540`         Títulos,
                                                        encabezado,
                                                        navegación,
                                                        cifras
                                                        importantes y
                                                        texto principal
                                                        destacado

  Secundario        Teal              `#148F8A`         Iconos,
                                                        indicadores
                                                        visuales y
                                                        elementos grandes
                                                        activos; evitar
                                                        texto pequeño
                                                        sobre blanco si
                                                        no alcanza el
                                                        contraste

  Secundario para   Teal oscuro       `#0E6F6B`         Enlaces, pestañas
  texto                                                 activas y texto
                                                        interactivo sobre
                                                        fondos claros

  Apoyo             Cyan              `#2EC4B6`         Acentos de
                                                        gráficos,
                                                        detalles
                                                        decorativos y
                                                        áreas visuales;
                                                        comprobar
                                                        contraste antes
                                                        de usarlo como
                                                        línea esencial
                                                        sobre blanco

  Acción            Coral             `#FF6B4A`         Botones
                                                        principales:
                                                        Buscar, Iniciar
                                                        sesión,
                                                        Registrarse y
                                                        Guardar

  Neutro            Gris              `#5B6B7C`         Texto secundario,
                                                        etiquetas,
                                                        descripciones y
                                                        bordes cuando el
                                                        contraste sea
                                                        suficiente

  Fondo             Gris muy claro    `#F5F8FA`         Fondo general de
                                                        la aplicación

  Superficie        Blanco            `#FFFFFF`         Tarjetas, tablas,
                                                        formularios y
                                                        superficies de
                                                        contenido

  Estado positivo   Verde             `#1B7F4B`         Variaciones
                                                        positivas del
                                                        mercado, siempre
                                                        junto a `▲` y
                                                        signo `+`

  Estado negativo   Rojo              `#C62828`         Variaciones
                                                        negativas y
                                                        errores, siempre
                                                        con flecha, signo
                                                        o mensaje
                                                        explícito
  -----------------------------------------------------------------------

### Reglas de uso de color

-   El fondo general es `#F5F8FA`; las tarjetas y superficies de
    contenido son blancas.
-   El navy establece la identidad y la jerarquía principal.
-   El teal aporta identidad tecnológica, pero no debe aparecer en todos
    los elementos.
-   El teal oscuro es la opción preferida para enlaces y texto
    interactivo sobre blanco.
-   El coral se reserva para acciones principales. No usarlo como color
    de variación negativa.
-   El verde y el rojo se reservan para estados financieros y errores
    semánticos.
-   Las subidas deben incluir `▲` y `+`; las bajadas, `▼` y `−`. No
    comunicar el cambio únicamente con color.
-   Para gráficos, revisar el contraste de cada línea respecto al fondo
    y a las líneas de cuadrícula. El cyan `#2EC4B6` sobre blanco no
    alcanza el contraste 3:1; para una línea de datos esencial, preferir
    un color más oscuro como el teal y usar el cyan como acento o
    relleno no esencial.
-   El foco de teclado debe ser visible y contrastar claramente con el
    fondo.
-   No asumir que un color cumple WCAG por su nombre: verificar las
    combinaciones reales en los componentes finales.

### Contraste de botones

Los botones principales deben usar fondo coral `#FF6B4A` con texto navy
`#0F2540`, no texto blanco. Mantener un estado hover perceptible sin
cambiar el significado semántico del color. Verificar contraste de
texto, foco, borde y estados deshabilitados.

## 5. Tipografía

-   Familia principal: **Inter**, con `sans-serif` como alternativa.
-   Usar una sola familia tipográfica en toda la aplicación, salvo una
    necesidad justificada.
-   H1: 30 px, peso 700.
-   H2: 22 px, peso 600.
-   H3: 17 px, peso 600.
-   Texto de cuerpo: 16 px, peso 400.
-   Etiquetas: 14 px, peso 500.
-   Interlineado recomendado para párrafos: 1.5.
-   Usar números tabulares (`font-variant-numeric: tabular-nums`) para
    precios, porcentajes, volúmenes y capitalización.
-   Evitar tipografía diminuta para información financiera importante.
-   Los títulos deben tener una jerarquía clara y no depender solo del
    color para distinguirse.

## 6. Espaciado, forma y superficies

Usar una escala basada en múltiplos de 8 px:

-   8 px: separación pequeña entre icono y texto.
-   16 px: padding interno habitual de tarjetas y campos.
-   24 px: separación entre elementos relacionados o bloques de
    contenido.
-   32 px: separación entre secciones principales.

Reglas visuales:

-   Tarjetas con fondo blanco, borde sutil y separación clara respecto
    al fondo.
-   Evitar sombras fuertes, efectos de vidrio excesivos, gradientes
    decorativos y bordes luminosos.
-   Mantener radios coherentes entre tarjetas, botones y campos.
-   Los botones principales pueden usar un radio amplio, cercano a 20
    px, si encaja con el sistema de componentes.
-   No añadir animaciones que distraigan de los precios o retrasen
    acciones.
-   Usar iconos de manera consistente y acompañarlos de texto cuando su
    función no sea obvia.

## 7. Navegación

La barra de navegación debe mostrar:

-   Marca o nombre **Panel Cripto**.
-   Enlace **Mercado**.
-   Enlace **Portafolio**, si esa vista se conserva en la aplicación.
-   Enlace **Intercambio**, si esa vista se conserva en la aplicación.
-   Botón **Iniciar sesión**.
-   Botón **Registrarse**.

### Comportamiento de Iniciar sesión y Registrarse

En esta etapa ambos botones son únicamente parte de la interfaz:

-   Deben ser visibles, diferenciables y accesibles por teclado.
-   Pueden navegar a vistas informativas o formularios visuales de
    demostración si se implementan esas vistas.
-   No deben enviar credenciales a ningún servidor.
-   No deben validar usuarios ni contraseñas.
-   No deben crear cuenta, sesión, token ni estado de usuario
    autenticado.
-   No deben guardar contraseñas ni datos sensibles en `localStorage`.
-   No mostrar mensajes que afirmen que el inicio de sesión o el
    registro fueron exitosos.
-   Si aún no existen las vistas de destino, no crear un flujo de
    autenticación ficticio sin dejarlo claramente identificado como
    demostración.

El botón de acción principal usa coral con texto navy. Los enlaces de
navegación usan navy o teal oscuro según el estado. El enlace activo
debe distinguirse con más de una señal visual, por ejemplo color y
subrayado/fondo.

En móvil, la navegación debe adaptarse sin desbordarse; los botones no
deben desaparecer ni quedar inaccesibles.

## 8. Jerarquía de la vista de mercado

La vista principal debe organizarse en este orden, adaptándolo a los
datos realmente disponibles:

1.  **Encabezado de página:** título del mercado y una descripción
    breve.
2.  **Resumen global:** capitalización total, volumen global de 24 horas
    y dominancia de BTC/ETH cuando se obtengan correctamente desde la
    API.
3.  **Búsqueda:** campo claro, etiqueta o nombre accesible y acción de
    buscar si se requiere botón.
4.  **Listado de criptomonedas:** tarjetas o tabla que permita comparar
    nombre, símbolo, precio, variación de 24 h y capitalización.
5.  **Estados de interfaz:** carga, error, reintento y resultados
    vacíos.

No inventar métricas globales si no se han consultado o si la API no las
devuelve. Si el endpoint falla, mostrar el estado de error en lugar de
presentar valores ficticios como reales.

Los valores de mercado deben formatearse de forma consistente. Usar USD
como moneda inicial si ese es el parámetro de consulta actual, pero no
dar a entender que los valores son universales o exactos fuera de la
hora de actualización indicada.

## 9. API de CoinGecko

La aplicación debe consumir CoinGecko desde el servicio frontend
existente, evitando duplicar llamadas en los componentes.

Endpoints que pueden utilizarse según las funcionalidades implementadas:

-   `/global`: resumen global del mercado.
-   `/coins/markets`: listado y métricas de mercado.
-   `/search`: búsqueda de monedas en CoinGecko.
-   `/coins/{id}/market_chart`: datos históricos para gráficos.
-   `/simple/price` o `/coins/markets?ids=...`: cotizaciones por
    identificador cuando corresponda.

Reglas:

-   Verificar los parámetros y límites en la documentación vigente de
    CoinGecko antes de añadir endpoints.
-   Gestionar `response.ok`, errores de red, respuestas inesperadas y
    límites de solicitudes.
-   Mostrar carga y errores comprensibles, con una acción de reintento.
-   Evitar solicitudes repetidas innecesarias; aprovechar el estado
    existente y aplicar debounce a búsquedas remotas.
-   No presentar datos de respaldo estáticos como cotizaciones reales.
    Si se conserva un fallback, marcarlo inequívocamente como dato de
    demostración y no mezclarlo con datos reales sin aviso.
-   No hardcodear una API key en el código. Si se necesita una clave
    Demo, leerla desde una variable de entorno de Vite como
    `VITE_COINGECKO_API_KEY` y documentar que las variables `VITE_` se
    exponen al navegador; esto no mantiene secreta la clave. Como no
    existe backend, no prometer protección de secretos en el cliente.
-   No crear backend como parte de esta etapa.
-   No llamar a la API para acciones de autenticación, porque no existe
    ese servicio en este proyecto.

## 10. Estados obligatorios de interfaz

  -----------------------------------------------------------------------
  Estado                              Representación
  ----------------------------------- -----------------------------------
  Cargando                            Indicador o skeleton y texto
                                      "Cargando datos del mercado..."

  Éxito                               Datos de CoinGecko formateados y,
                                      cuando sea posible, hora de
                                      actualización

  Sin resultados                      "No encontramos monedas que
                                      coincidan con tu búsqueda"

  Error de red/API                    Mensaje claro y botón "Reintentar"

  Límite de API                       Mensaje comprensible que indique
                                      que el servicio está temporalmente
                                      limitado

  Datos de demostración               Etiqueta visible; nunca confundir
                                      con cotizaciones actuales

  Acción de interfaz no conectada     Explicar que es una demostración y
                                      no simular una operación completada
  -----------------------------------------------------------------------

No mostrar errores técnicos completos al usuario final. Se pueden
registrar detalles útiles en consola durante el desarrollo sin exponer
secretos.

## 11. Accesibilidad

Objetivo: WCAG 2.2 nivel AA cuando sea aplicable.

-   Contraste de texto normal de al menos 4.5:1.
-   Contraste de texto grande de al menos 3:1.
-   Contraste de componentes y gráficos esenciales según los criterios
    de contraste no textual aplicables.
-   Todos los controles interactivos deben funcionar con teclado.
-   Foco visible con `:focus-visible`.
-   Usar HTML semántico: `header`, `nav`, `main`, `section`, `table`,
    `button`, `form`.
-   Cada campo de formulario debe tener una etiqueta visible asociada.
-   Los botones de icono deben tener nombre accesible.
-   Los cambios de datos y mensajes relevantes deben anunciarse de
    manera apropiada con regiones `aria-live`, sin anunciar cada
    actualización de precio de forma excesiva.
-   Para variaciones, usar flecha y signo además del color.
-   No usar placeholder como única etiqueta.
-   Respetar `prefers-reduced-motion` cuando haya animaciones.
-   No agregar ARIA si la semántica HTML nativa ya expresa correctamente
    la función.

## 12. Responsive

-   Escritorio: aprovechar el ancho para mostrar resumen y tabla
    legible.
-   Tableta: reorganizar métricas en una cuadrícula más compacta.
-   Móvil: una columna de tarjetas, navegación adaptable y botones
    suficientemente grandes.
-   Evitar scroll horizontal de toda la página. Si una tabla necesita
    desplazamiento horizontal, limitarlo al contenedor de la tabla y
    mantener el resto de la interfaz utilizable.
-   Mantener los precios, símbolos y acciones importantes visibles en
    pantallas pequeñas.

## 13. Criterios de aceptación visual y funcional

Antes de dar por terminada una modificación:

-   [ ] La paleta oficial se aplica consistentemente.
-   [ ] Los botones de Iniciar sesión y Registrarse aparecen en la barra
    de navegación.
-   [ ] No existe autenticación real ni se afirma que exista.
-   [ ] Los datos de mercado proceden de CoinGecko o están marcados
    explícitamente como demostración.
-   [ ] Hay estados de carga, error, reintento y resultados vacíos.
-   [ ] Los cambios positivos y negativos no dependen únicamente del
    color.
-   [ ] Los botones y enlaces funcionan con teclado y tienen foco
    visible.
-   [ ] La interfaz se adapta a escritorio, tableta y móvil.
-   [ ] No se añadió backend ni una base de datos.
-   [ ] No se eliminaron funcionalidades existentes sin justificación.
-   [ ] Se ejecutan los comandos disponibles de lint y build y se
    informa el resultado real.
-   [ ] Los errores previos de integración entre el hook y el servicio
    de CoinGecko se identifican y corrigen solo como parte de la
    integración necesaria, sin ocultarlos con datos falsos.

## 14. Regla final

**La prioridad es una interfaz clara, coherente y funcional que
represente datos reales de CoinGecko.** La estética nunca debe ocultar
errores, simular operaciones reales o sacrificar legibilidad y
accesibilidad.
