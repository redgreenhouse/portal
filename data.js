const RED_DATA = {
  effort: [
    ["Procedimientos", 7, "Revisar, adaptar y aprobar", "Alto"],
    ["Análisis de riesgos", 7, "Completar con información propia", "Alto"],
    ["Bitácoras / registros", 10, "Llenado operativo periódico", "Alto"],
    ["Programas", 2, "Definir actividades, responsables y fechas", "Medio"],
    ["Planes", 7, "Revisar y completar", "Alto"],
    ["Mapas / croquis", 5, "Sustituir con información y evidencia propia", "Alto"],
    ["Organización", 2, "Asignar estructura y responsables", "Medio"],
    ["Políticas / reglas", 1, "Personalizar y aprobar", "Medio"],
    ["Portadas", 6, "Personalizar e imprimir", "Medio"],
    ["Otros formatos", 1, "Revisar y completar", "Medio"]
  ],
  modules: [
    {number:2,name:"Mantenimiento de infraestructura",documents:12,state:"received",priority:"Crítica"},
    {number:3,name:"Higiene",documents:19,state:"received",priority:"Crítica"},
    {number:4,name:"Control de fauna",documents:5,state:"received",priority:"Alta"},
    {number:5,name:"Capacitación",documents:4,state:"received",priority:"Alta"},
    {number:6,name:"Auditorías internas",documents:4,state:"received",priority:"Alta"},
    {number:7,name:"Validación de procedimientos",documents:4,state:"received",priority:"Alta"},
    {number:8,name:"Trazabilidad",documents:0,state:"pending",priority:"Crítica"},
    {number:9,name:"Historial de la unidad productiva",documents:0,state:"pending",priority:"Alta"},
    {number:10,name:"Uso y manejo del agua",documents:0,state:"pending",priority:"Crítica"},
    {number:11,name:"Fertilización",documents:0,state:"pending",priority:"Alta"},
    {number:12,name:"Uso y manejo de plaguicidas",documents:0,state:"pending",priority:"Crítica"},
    {number:13,name:"Cosecha",documents:0,state:"pending",priority:"Crítica"},
    {number:14,name:"Transporte",documents:0,state:"pending",priority:"Alta"}
  ],
  module2: [
    {
      id:"RG-02-001", code:"PORTADA", title:"POE Mantenimiento de Infraestructura", type:"Portada", risk:"low", effort:"Bajo",
      action:"Personalizar e imprimir", frequency:"Una vez", status:"Por diagnosticar",
      description:"Carátula de identificación del procedimiento. Debe eliminar la identidad de la empresa anterior e incorporar los datos maestros de RED Greenhouse.",
      fields:["Razón social", "Domicilio de la unidad", "Folio SENASICA", "Fecha de emisión", "Vigencia", "Versión"],
      preview:"cover"
    },
    {
      id:"RG-02-002", code:"POE MTTO INFRAESTR", title:"Procedimiento de Mantenimiento de Infraestructura", type:"Procedimiento", risk:"high", effort:"Alto",
      action:"Revisar, adaptar, aprobar y firmar", frequency:"Al inicio y cuando cambie", status:"Por diagnosticar",
      description:"Documento rector del módulo. Debe describir cómo se inspecciona, mantiene, repara y documenta la infraestructura para prevenir peligros de contaminación.",
      fields:["Objetivo", "Alcance", "Frecuencia", "Definiciones", "Responsabilidades", "Materiales", "Reglas de operación", "Descripción del procedimiento", "Referencias", "Formatos / Anexos", "Firmas de aprobación"],
      preview:"procedure"
    },
    {
      id:"RG-02-003", code:"ANÁLISIS DESCRIPTIVO", title:"Análisis de Peligro de Infraestructura Física", type:"Análisis de riesgos", risk:"high", effort:"Muy alto",
      action:"Completar con condiciones reales del invernadero", frequency:"Inicial y revisión periódica", status:"Por diagnosticar",
      description:"Identifica peligros asociados con áreas, instalaciones y equipos. No puede conservarse como ejemplo genérico: debe reflejar las condiciones reales de RED Greenhouse.",
      fields:["Área o instalación", "Peligro identificado", "Causa", "Probabilidad", "Severidad", "Medida preventiva", "Evidencia"],
      preview:"risk"
    },
    {
      id:"RG-02-004", code:"PLAN DE ACCIÓN", title:"Plan Técnico y Acciones de Control", type:"Análisis de riesgos", risk:"high", effort:"Muy alto",
      action:"Definir controles y responsables", frequency:"Inicial y revisión periódica", status:"Por diagnosticar",
      description:"Convierte los peligros identificados en medidas concretas: mantenimiento, reparación, verificación, responsable y fecha compromiso.",
      fields:["Hallazgo", "Acción preventiva o correctiva", "Responsable", "Fecha objetivo", "Evidencia de cierre", "Verificación"],
      preview:"action"
    },
    {
      id:"RG-02-005", code:"MAPA 2.1", title:"Mapa de Macro Ubicación", type:"Mapa / croquis", risk:"medium", effort:"Medio",
      action:"Sustituir con información y evidencia propia", frequency:"Una vez y cuando cambie", status:"Pendiente de evidencia",
      description:"Ubica la unidad de producción dentro de su contexto regional y vías principales de acceso.",
      fields:["Nombre de la unidad", "Municipio y estado", "Coordenadas", "Vías de acceso", "Norte geográfico", "Escala o referencia"],
      preview:"map"
    },
    {
      id:"RG-02-006", code:"MAPA 2.1.1", title:"Mapa de Micro Ubicación", type:"Mapa / croquis", risk:"medium", effort:"Medio",
      action:"Sustituir con información y evidencia propia", frequency:"Una vez y cuando cambie", status:"Pendiente de evidencia",
      description:"Muestra la ubicación inmediata de la unidad, predios vecinos, accesos y posibles fuentes externas de riesgo.",
      fields:["Límites del predio", "Predios colindantes", "Accesos", "Fuentes potenciales de contaminación", "Coordenadas"],
      preview:"map"
    },
    {
      id:"RG-02-007", code:"MAPA 2.1.2", title:"Mapa de Polígonos", type:"Mapa / croquis", risk:"medium", effort:"Medio",
      action:"Sustituir con información y evidencia propia", frequency:"Una vez y cuando cambie", status:"Pendiente de evidencia",
      description:"Delimita los polígonos productivos y áreas que forman parte de la unidad de producción.",
      fields:["Polígono", "Superficie", "Coordenadas de vértices", "Uso del área", "Identificación visual"],
      preview:"map"
    },
    {
      id:"RG-02-008", code:"CROQUIS 2.2", title:"Croquis de Instalaciones", type:"Mapa / croquis", risk:"medium", effort:"Medio",
      action:"Sustituir con el diseño real del invernadero", frequency:"Una vez y cuando cambie", status:"Pendiente de evidencia",
      description:"Representa físicamente invernaderos, sanitarios, comedor, almacenes, preparación de mezclas, accesos y demás instalaciones relevantes.",
      fields:["Invernaderos", "Sanitarios", "Lavado de manos", "Comedor", "Almacenes", "Preparación de mezclas", "Zona buffer", "Accesos"],
      preview:"layout"
    },
    {
      id:"RG-02-009", code:"DOC-2.3 FRENTE", title:"Programa de Mantenimiento Preventivo", type:"Programa", risk:"high", effort:"Muy alto",
      action:"Programar actividades con base en el análisis de peligros", frequency:"Quincenal, mensual o semestral según instalación", status:"Por construir",
      description:"Calendario anual de inspección y mantenimiento. El formato recibido contempla cerco perimetral, comedor, sanitarios, lavado de manos, fosa séptica, almacén, preparación de mezclas, zona buffer, fumigadora y transporte.",
      fields:["Instalación o equipo", "Frecuencia", "Mes", "Día", "Estado", "Indicador de cumplimiento", "Verificó", "Firma"],
      preview:"schedule"
    },
    {
      id:"RG-02-010", code:"DOC-2.3 REVERSO", title:"Plan de Mantenimiento y Seguimiento de Hallazgos", type:"Bitácora / registro", risk:"medium", effort:"Medio",
      action:"Usar para documentar fallas y cierres", frequency:"Por hallazgo", status:"Por construir",
      description:"Registro operativo para documentar fecha del hallazgo, área o equipo, descripción y persona que realizó el reporte. Debe complementarse con el seguimiento y evidencia de cierre.",
      fields:["Fecha y hora", "Área, instalación o equipo", "Descripción", "Acción", "Responsable", "Fecha de cierre", "Realizó", "Verificó"],
      preview:"log"
    },
    {
      id:"RG-02-011", code:"DOC-2.4", title:"Organigrama", type:"Organización", risk:"medium", effort:"Medio",
      action:"Definir estructura, responsables y líneas de reporte", frequency:"Una vez y cuando cambie", status:"Por definir",
      description:"Debe mostrar quién dirige, quién es responsable de inocuidad y quién ejecuta las actividades relacionadas con infraestructura.",
      fields:["Dirección general", "Responsable técnico", "Responsable de inocuidad", "Producción", "Auxiliares", "Líneas de autoridad"],
      preview:"org"
    },
    {
      id:"RG-02-012", code:"DOC-2.5", title:"Perfil de Puestos y Funciones", type:"Organización", risk:"medium", effort:"Medio",
      action:"Adaptar funciones y asignar personas reales", frequency:"Una vez y cuando cambie", status:"Por definir",
      description:"El archivo recibido incluye funciones preliminares para Dirección General y Auxiliar de Campo. Debe completarse con los puestos reales y responsabilidades SRRC de RED Greenhouse.",
      fields:["Nombre del puesto", "Reporta a", "Objetivo", "Funciones específicas", "Autoridad", "Competencias", "Nombre del ocupante", "Firma"],
      preview:"roles"
    }
  ]
};
;

RED_DATA.tasks = [
  {id:"T-001",order:1,title:"Completar Datos Maestros de RED Greenhouse",category:"Información",priority:"critical",status:"ready",owner:"Dirección",impact:"Desbloquea portadas, procedimientos, mapas y firmas",needed:"Razón social, RFC, domicilio, coordenadas, teléfonos, correos, superficie, cultivo y folio SENASICA.",depends:[]},
  {id:"T-002",order:2,title:"Confirmar estructura y responsables SRRC",category:"Decisión",priority:"critical",status:"ready",owner:"Dirección",impact:"Desbloquea organigrama, perfiles, firmas y responsabilidades",needed:"Director, responsable técnico, responsable de inocuidad, mantenimiento, producción y suplentes.",depends:[]},
  {id:"T-003",order:3,title:"Recibir módulos 8 al 14",category:"Documentación",priority:"critical",status:"ready",owner:"Responsable técnico",impact:"Permite conocer el universo completo y evitar omisiones",needed:"Archivos originales de trazabilidad, historial, agua, fertilización, plaguicidas, cosecha y transporte.",depends:[]},
  {id:"T-004",order:4,title:"Realizar levantamiento físico de infraestructura",category:"Campo",priority:"critical",status:"blocked",owner:"Operaciones",impact:"Alimenta análisis de peligros, croquis, mantenimiento y evidencias",needed:"Recorrido, lista de áreas, equipos, instalaciones, estado físico y fotografías.",depends:["T-002"]},
  {id:"T-005",order:5,title:"Generar macro y micro ubicación",category:"Evidencia",priority:"high",status:"blocked",owner:"Responsable técnico",impact:"Completa mapas 2.1 y 2.1.1",needed:"Coordenadas, accesos, colindancias y posibles fuentes externas de contaminación.",depends:["T-001","T-004"]},
  {id:"T-006",order:6,title:"Elaborar croquis real de instalaciones",category:"Evidencia",priority:"critical",status:"blocked",owner:"Operaciones",impact:"Completa croquis 2.2 y apoya higiene, fauna y auditorías",needed:"Ubicación de invernaderos, sanitarios, lavamanos, comedor, almacenes, mezclas, accesos y zona buffer.",depends:["T-004"]},
  {id:"T-007",order:7,title:"Inventariar infraestructura y equipos mantenibles",category:"Campo",priority:"critical",status:"blocked",owner:"Mantenimiento",impact:"Desbloquea programa preventivo y bitácora",needed:"Activo, ubicación, condición, frecuencia sugerida, responsable y evidencia fotográfica.",depends:["T-004"]},
  {id:"T-008",order:8,title:"Completar análisis de peligros de infraestructura",category:"Análisis",priority:"critical",status:"blocked",owner:"Responsable de inocuidad",impact:"Define controles, prioridades y acciones correctivas",needed:"Peligros reales, causas, probabilidad, severidad, controles y evidencia.",depends:["T-004","T-006","T-007"]},
  {id:"T-009",order:9,title:"Construir programa de mantenimiento preventivo",category:"Programa",priority:"critical",status:"blocked",owner:"Mantenimiento",impact:"Completa documento 2.3 y genera evidencia futura",needed:"Instalaciones, actividades, frecuencias, calendario, responsable, verificador y firmas.",depends:["T-007","T-008"]},
  {id:"T-010",order:10,title:"Adaptar y aprobar el procedimiento de mantenimiento",category:"Procedimiento",priority:"high",status:"blocked",owner:"Responsable técnico",impact:"Completa el documento rector del Módulo 2",needed:"Objetivo, alcance, responsabilidades, método, frecuencias, registros, acciones correctivas y firmas.",depends:["T-002","T-008","T-009"]},
  {id:"T-011",order:11,title:"Definir bitácora y método de cierre de hallazgos",category:"Registro",priority:"high",status:"blocked",owner:"Mantenimiento",impact:"Permite demostrar ejecución y corrección",needed:"Campos, responsables, evidencia de cierre, verificación y control de folios.",depends:["T-009"]},
  {id:"T-012",order:12,title:"Imprimir, integrar, firmar y controlar versión del Módulo 2",category:"Carpeta física",priority:"high",status:"blocked",owner:"Responsable técnico",impact:"Convierte el trabajo digital en evidencia auditable",needed:"Documentos aprobados, firmas, fechas, códigos, índices, separadores y control de copias.",depends:["T-001","T-010","T-011"]}
];
