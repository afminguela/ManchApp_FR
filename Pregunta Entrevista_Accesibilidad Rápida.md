
### Accesibilidad Rápida: Requisitos y Prácticas Clave

Actualmente la accesibilidad debe ser considerada al go imprescindible que debe estar pensada desde la toma de requerimientos y el modelado de datos de cualquier producto ya sea digital o fisico porque es lo qeu hace que el uso de los mismos sea ecuánime e iguale las condiciones de los usuarios, tengan la diversidad funcional que sea. 

Se tiende a pensar que la diversidad funcional es algo que afecta a menos del 15% de la población pero son medidas de las que se beneficia el 85% restante. 

***

#### 1. Gestión de Foco en Modales y Componentes Dinámicos

La gestión del foco garantiza usabilidad solo con teclado y orden lógico de tabulación, está pensada para usuarios de tecnologías de asistencia (lectores de pantalla o usuarios con movilidad reducida) pero también se benefician los que por diferentes motivos no disponen de ratón.
Se gestiona implementando las siguientes soluciones tanto de HTML como de CSS o JS en los componentes:
- Foco visible: El foco debe ser siempre visible. No eliminarlo nunca (evitar `outline: none` sin alternativa) y mantener el atributo hover y focus.
- Gestión del foco en modales: Al abrir un modal/superposición, el foco debe moverse automáticamente dentro de este.
- Trampas de teclado: Evitar que el foco quede atrapado. La tecla Escape debe cerrar el modal o menú.
- Al cerrar: El foco debe regresar al elemento activador tras cerrar el modal (aplicable también en rutas dinámicas).

***

#### 2. Uso de ARIA 

El uso de atributos ARIA es necesario cuando los elementos HTML nativos no son suficientes.
Nos permite mejorar comprensión de la estructura y funcionalidad de la interfaz para usuarios de tecnologías de asistencia.
Mendiante ellos podemos definir roles, estados y propiedades de los elementos. Así cuando el usuario navega con un lector de pantalla, este puede interpretar y comunicar correctamente nuestra información y que el guiado por el mismo sea correcto.

 `aria-live` y `role="alert"` son especialmente útiles para avisos y mensajes dinámicos, ya que informa a usuarios de lectores de pantalla sobre cambios de contenido que ocurren de forma dinámica y asíncrona fuera del foco actual.

Hay que tener en cuenta que debemos usar ARIA solo cuando sea necesario y siempre aplicando el patrón completo (rol, propiedades, teclas, estados). Html nativo siempre que sea posible ya que es mas robusto y compatible.

***

#### 3. Lighthouse A11y ≥ 90 y otras herramientas de auditoría 

Lighthouse es una herramienta de auditoría automatizada crítica (performance, SEO, PWA y accesibilidad) del frontend.
Viene integrada en Chrome DevTools y es muy útil para tener un vistazo general, aun así la cobertura de la herramienta no es completa y no sustituye pruebas manuales de accesibilidad. Nos puede dar una guía rápida de los problemas más comunes.

 Axe DevTools, se integra en Chrome DevTools. Proporciona una auditoría más exhaustiva y detallada que Lighthouse, incluyendo problemas específicos de accesibilidad y sugerencias de corrección. 

IBM Equal Access Toolkit es otra herramienta a desarrollada por IBM que ofrece una auditoría completa de accesibilidad, incluyendo pruebas automatizadas y manuales, así como recursos educativos para mejorar la accesibilidad. También incluye un roadmap para implementar Accesibilidad desde Diseño y toma de requisitos.
Permite generar informes muy detallados y y da un mapa muy claro de los saltos de Tabulación y el orden lógico de los mismos.

Wave, por otro lado, es una herramienta mas centrada en CSS y que proporciona una auditoría rápida y muy visual de accesibilidad directamente en el navegador. tiene integrado un lector de pantalla para indicarnos cada uno de los problemas detectados y donde se encuentran en el código. 

Todas tienen versión gratuita, configurables para valorar segun la directiva WCAG que queramos (A, AA, AAA) y dan al final el nivel de compleccion de las mismas. Son complementarias entre sí incluso se pueden usar varias a la vez para tener una visión más completa de los problemas de accesibilidad en un proyecto.

El objetivo es tener un nivel de accesibilidad minimo de ≥ 90 en Lighthouse y en el resto llegar al nivekl de AA en WCAG 2.1.