const EOE_FORMS = (() => {
  const text=(name,label,opts={})=>({type:"text",name,label,...opts});
  const select=(name,label,options,opts={})=>({type:"select",name,label,options,...opts});
  const yesno=(name,label,opts={})=>select(name,label,["Sí","No"],opts);

  const ficha = {
    sections:[
      {title:"Datos personales",fields:[
        text("nombres","Nombre(s)",{required:true}),text("apellidoPaterno","Apellido paterno",{required:true}),
        text("apellidoMaterno","Apellido materno",{required:true}),text("curp","CURP",{required:true,maxlength:18}),
        {type:"date",name:"fechaNacimiento",label:"Fecha de nacimiento"},select("sexo","Sexo",["F","M","Otro"]),
        text("edadPrimero","Edad"),select("estadoCivil","Estado civil",["Soltero(a)","Casado(a)","Unión libre","Otro"]),
        text("tipoSangre","Tipo de sangre"),select("manoDominante","Mano dominante",["Derecha","Izquierda","Ambidiestra"]),
        text("noExpediente","No. de expediente"),text("fechaIngreso","Fecha de ingreso",{type:"date"})
      ]},
      {title:"Contacto y domicilio",fields:[
        text("telefonoCelular","Teléfono celular",{inputmode:"tel"}),text("telefonoCasa","Teléfono de casa",{inputmode:"tel"}),
        text("email","Correo electrónico",{inputType:"email"}),text("domicilio","Domicilio",{wide:true}),
        text("referenciaDomicilio","Referencia del domicilio",{wide:true}),text("codigoPostal","Código postal"),
        text("facebook","Red social / Facebook"),select("transporte","Transporte habitual",["Público","Particular","Caminando","Otro"]),
        text("tiempoTraslado","Tiempo de traslado")
      ]},
      {title:"Datos escolares",fields:[
        select("grado","Grado",["Primero","Segundo","Tercero"]),text("grupo","Grupo"),text("promedioSecundaria","Promedio de secundaria"),
        yesno("computadora","¿Cuenta con computadora?"),yesno("internet","¿Cuenta con internet?")
      ]},
      {title:"Salud",fields:[
        yesno("enfermedad","¿Presenta alguna enfermedad?"),text("cualEnfermedad","¿Cuál?"),
        text("alergias","Alergias",{wide:true}),text("situacionSalud","Situación de salud relevante",{wide:true}),
        text("requiereMedicamento","Medicamento de uso regular",{wide:true})
      ]},
      {title:"Familia y emergencia",fields:[
        select("estadoCivilPadres","Estado civil de los padres",["Casados","Separados","Divorciados","Unión libre","Otro"]),
        text("vivoCon","Vive con"),yesno("tieneHijos","¿Tiene hijos?"),text("dependenEconomicamente","Personas que dependen económicamente"),
        text("emergenciaNombre","Contacto de emergencia",{required:true}),text("emergenciaParentesco","Parentesco"),
        text("emergenciaTelefono","Teléfono de emergencia",{required:true,inputmode:"tel"})
      ]}
    ]
  };

  const bio = {
    sections:[
      {title:"Trayectoria escolar",fields:[
        text("secundaria","Secundaria de procedencia"),text("domicilioSecundaria","Domicilio de la secundaria"),
        text("promedioSecundaria","Promedio de secundaria"),text("puntajeAdmision","Puntaje de admisión"),
        text("comoTerminoSec","¿Cómo concluyó la secundaria?",{wide:true}),text("logrosSecundaria","Logros obtenidos",{wide:true}),
        text("materiasGustaron","Materias que más le gustaron",{wide:true}),text("materiasDificiles","Materias que se dificultaron",{wide:true}),
        yesno("repitioAno","¿Repitió algún año?"),text("tallerSecundaria","Taller cursado"),
        yesno("conociaPrepa","¿Conocía previamente la preparatoria?"),text("opcionPrepa","Opción en la que eligió la preparatoria"),
        yesno("otraPrepa","¿Consideró otra preparatoria?"),text("problemaEstancia","Dificultad prevista para permanecer en la escuela",{wide:true})
      ]},
      {title:"Hábitos, estudio y proyecto",fields:[
        text("horasEstudio","Horas de estudio fuera de clase"),text("problemasEstudio","Principales problemas para estudiar",{wide:true}),
        text("gustaLeer","Lecturas o temas de interés",{wide:true}),text("proyectosMediaSuperior","Proyectos durante el bachillerato",{wide:true}),
        text("carrera","Carrera o área de interés"),text("porQueCarrera","¿Por qué le interesa?",{wide:true}),
        text("metaCortoAcad","Meta académica a corto plazo",{wide:true}),text("metaMedioAcad","Meta académica a mediano plazo",{wide:true}),
        text("metaLargoAcad","Meta académica a largo plazo",{wide:true}),text("metaCortoPersonal","Meta personal a corto plazo",{wide:true}),
        text("metaMedioPersonal","Meta personal a mediano plazo",{wide:true}),text("metaLargoPersonal","Meta personal a largo plazo",{wide:true}),
        text("motivosContinuar","Motivos para continuar estudiando",{wide:true})
      ]},
      {title:"Familia y convivencia",fields:[
        text("padreNombre","Nombre del padre"),yesno("padreVive","¿Vive el padre?"),text("padreEscolaridad","Escolaridad del padre"),
        text("madreNombre","Nombre de la madre"),yesno("madreVive","¿Vive la madre?"),text("madreEscolaridad","Escolaridad de la madre"),
        text("relacionPapa","Relación con el padre"),text("relacionMama","Relación con la madre"),
        yesno("tieneHermanos","¿Tiene hermanos?"),text("otrosParientes","Otros familiares con quienes vive",{wide:true}),
        text("porQueViveCon","Razón de la composición familiar",{wide:true}),text("dinamicaFamiliar","Describe brevemente la dinámica familiar",{wide:true}),
        text("normasConvivencia","Normas de convivencia en casa",{wide:true}),text("sanciones","Consecuencias o sanciones habituales",{wide:true}),
        text("confiasMas","Persona en quien más confía")
      ]},
      {title:"Condiciones de vida",fields:[
        text("casa","Tipo / condición de vivienda"),text("personasCasa","Personas que viven en casa"),
        text("habitaciones","Número de habitaciones"),yesno("cuartoPropio","¿Cuenta con espacio propio?"),
        text("serviciosCasa","Servicios con que cuenta la vivienda",{wide:true}),text("sostieneEconomicamente","Principal sostén económico"),
        text("ingresosFamilia","Ingreso familiar aproximado"),text("gastoEscolar","Gasto escolar aproximado"),
        yesno("trabajas","¿Trabaja actualmente?"),text("otraActividad","Otra actividad habitual")
      ]},
      {title:"Salud y desarrollo",fields:[
        text("estatura","Estatura"),text("peso","Peso"),text("vista","Situación visual"),text("auditivas","Situación auditiva"),
        text("motoras","Situación motora"),text("lenguaje","Situación de lenguaje"),text("enfermedadCronica","Enfermedad crónica"),
        text("alergia","Alergias"),text("operacion","Operaciones / cirugías"),text("malestares","Malestares frecuentes",{wide:true}),
        text("recomendacionesMedicas","Recomendaciones médicas relevantes",{wide:true})
      ]},
      {title:"Aspectos personales",fields:[
        text("personalidad","¿Cómo se describe?",{wide:true}),text("estudioActual","¿Cómo considera su desempeño actual?",{wide:true}),
        yesno("cine","¿Acude al cine?"),yesno("teatro","¿Acude al teatro?"),yesno("beca","¿Cuenta con beca?"),
        text("activoSexualmente","Información de salud sexual que considere relevante (opcional)",{wide:true})
      ]}
    ]
  };

  const barschItems = [
    "Recuerdo más acerca de un tema si lo escucho que si lo leo.",
    "Cumplo mejor con las instrucciones escritas que con las orales.",
    "Me agrada escribir o tomar notas para hacer una revisión visual.",
    "Sostengo muy fuerte el lápiz o lapicero cuando escribo.",
    "Prefiero tener una explicación verbal que gráficos y diagramas.",
    "Disfruto trabajar con herramientas manuales.",
    "Disfruto leyendo gráficas, cuadros, cartas y diagramas.",
    "Puedo decir si un sonido armoniza con otros sonidos.",
    "Recuerdo mejor si escribo algo varias veces.",
    "Puedo comprender y seguir direcciones leyendo un mapa.",
    "Tengo mejor desempeño en temas académicos escuchando clases y grabaciones que leyendo libros.",
    "Me gusta jugar con llaves y monedas en mis bolsillos.",
    "Aprendo mejor a deletrear repitiendo las letras de una palabra en voz alta que escribiendo la palabra en una hoja.",
    "Puedo comprender mejor una noticia leyéndola en el periódico que escuchándola en la radio.",
    "Me gusta comer algo o masticar chicle mientras estudio.",
    "Trato de recordar algo visualizándolo en mi cabeza.",
    "Aprendo a deletrear una palabra escribiéndola con mi dedo en el aire.",
    "Prefiero escuchar una buena clase que leer.",
    "Soy bueno resolviendo rompecabezas y laberintos.",
    "Prefiero revisar material escrito a discutirlo verbalmente.",
    "Prefiero escuchar las noticias en el radio que leerlas en un periódico.",
    "Me gusta obtener información de temas interesantes leyendo un material especializado.",
    "Me siento muy cómodo tocando a los demás (dando la mano, abrazando, etc.).",
    "Sigo las instrucciones verbales mejor que las escritas."
  ];

  const habits = {
    "ESTUDIO INDEPENDIENTE":[
      "Puedo organizar mi estudio","Se me facilita estudiar de manera independiente","Relaciono fácilmente las asignaturas",
      "Sé lo que debo estudiar para cada asignatura","Tengo los materiales de estudio necesarios","Soy ordenado en mis espacios y materiales de estudio",
      "Siempre termino mis tareas en el tiempo planeado","Puedo concentrarme sin dificultad en la tarea que hago",
      "Me gusta realizar una evaluación para saber lo que aprendí","Si tengo dudas pregunto a las personas adecuadas"
    ],
    "HABILIDADES DE LECTURA":[
      "Identifico y puedo definir claramente los objetivos de lectura","Trato de comprender el sentido de la lectura","Recuerdo muy bien lo que leí",
      "Anoto comentarios acerca de las lecturas que realizo","Tomo notas y hago mapas mentales acerca de la lectura","Investigo las palabras que desconozco",
      "Formulo preguntas guía para organizar la lectura","Cuando no entiendo un texto, lo leo varias veces","Relaciono las ideas que leo con las que ya conozco"
    ],
    "ADMINISTRACION DEL TIEMPO":[
      "Organizo mis compromisos con anticipación","Programo tiempos para la realización de mis actividades","Realizo mis actividades en el tiempo previsto",
      "Anticipo materiales que necesitaré","El tiempo me alcanza perfectamente para realizar todas mis actividades","Organizo mis tareas por grado de complejidad",
      "Entrego puntualmente mis tareas escolares","Establezco metas realistas y las cumplo","Atiendo imprevistos sin desviar mis metas","Conozco mis habilidades intelectuales"
    ],
    "CONCENTRACION":[
      "Recuerdo sin problemas lo que estudio","Puedo centrar mi atención en las lecturas","Logro concentrarme a pesar de los ruidos externos a mi lugar de estudio",
      "Puedo concentrarme en mi estudio a pesar de que tenga problemas u ocupaciones","Puedo concentrarme a pesar de que me estén distrayendo",
      "Busco asegurarme que entendí lo que solicitan mis profesores en las tareas escolares","Considero que aprendo de forma efectiva",
      "Mi estado físico y nutricional son buenos para el estudio","Cuando tengo mucho trabajo, tomo pequeños descansos","Puedo poner atención en la mayoría de las clases"
    ],
    "LUGAR DE ESTUDIO":[
      "El lugar donde estudio es tranquilo","El lugar donde estudio está ventilado","El lugar donde estudio está iluminado",
      "Tengo un espacio para estudiar sin distractores","Cuento con el apoyo de mi familia para mantener un ambiente tranquilo",
      "Evito atender otros estímulos mientras estudio (TV, videojuegos, etc.)","Tomo agua constantemente","La mesa que utilizo es amplia",
      "Alterno los materiales de estudio de cada materia","Me gusta tener algún objeto (planta, arreglo, etc.) en mi lugar de estudio"
    ],
    "HABILIDADES PARA PROCESAR INFORMACIÓN":[
      "Busco ordenar la información que estudio en cuadros sinópticos","Sé organizar la información en mapas mentales",
      "Sé organizar información en mapas conceptuales","Sé organizar información en cuadros comparativos","Señalo las ideas que no comprendo en un texto",
      "Realizo resúmenes o guías de estudio de los temas estudiados","Expongo todas mis dudas al profesor",
      "En caso de necesitar, busco asesoría de otras personas","Realizo ejercicios hasta comprender el procedimiento de estudio","Busco mantener un orden en mis notas"
    ],
    "CONTROL DE LA ANSIEDAD":[
      "Cuando estudio normalmente estoy alegre y de buen humor","Me siento tranquilo aunque no comprenda bien los temas de clase",
      "Mi estómago funciona perfectamente aún en situaciones de estrés","Mantengo la calma ante las dificultades","Generalmente tengo pensamientos positivos",
      "He notado que aumentan mi atención, concentración y memoria","Controlo perfectamente mis métodos de estudio",
      "Me siento tranquilo aunque se me dificulte comprender lo que estudio","Me puedo controlar bien cuando tengo que exponer frente a grupo",
      "Puedo hacer exámenes sin entrar en angustia y estar totalmente tranquilo"
    ],
    "LA CLASE":[
      "Procuro asistir a clase todos los días","En clase pregunto al profesor lo que no entiendo","Me llevo bien con los profesores",
      "Procuro estar activo(a) en clase para no distraerme","Tomo apuntes en clase","Después de clase paso mis apuntes en limpio",
      "Uso abreviaturas cuando tomo apuntes en clase","Intento organizar mis apuntes todos los días","Cumplo con todas las tareas en clases","Soy puntual en mis clases"
    ],
    "TECNICAS AUXILIARES":[
      "Consulto la biblioteca para hacer mis trabajos de clase","Uso el diccionario cuando no sé una palabra","Me gusta cuidar mi ortografía",
      "Cuando hago un trabajo, primero hago el borrador","Me gusta presentar bien mis trabajos","Cuando tengo que hacer un trabajo me hago un esquema previo",
      "Mi profesor entiende lo que escribo sin dificultad","Me intereso por interpretar los gráficos que aparecen en mis lecturas",
      "Me gusta participar en clase","Me gusta trabajar de forma colaborativa"
    ],
    "REVISIÓN Y PREPARACIÓN DE EXÁMENES":[
      "Realizo guías de estudio","Estoy al corriente en mi escala","Estudio un día antes o minutos antes del examen",
      "Estudio con días de anticipación a la fecha de examen","Llevo un calendario para repasar","Antes de empezar a hacer un examen, organizo lo que voy a hacer",
      "En los exámenes empiezo siempre por la pregunta que mejor me sé","Antes de contestar una pregunta en un examen, pienso detenidamente qué tengo que poner",
      "Antes de entregar un examen reviso que lo haya contestado en su totalidad","Solicito la revisión del examen al profesor para aclarar mis dudas y aceptar mis errores"
    ]
  };

  const socio = {
    sections:[
      {title:"Vivienda y servicios",fields:[
        text("direccion","Dirección",{wide:true}),text("localidad","Localidad"),text("casaTipo","Tipo de vivienda"),
        text("internet","Internet"),text("computadora","Computadora"),text("vehiculo","Vehículo"),
        text("dependenIngreso","Personas que dependen del ingreso familiar"),text("ingresoFamiliar","Ingreso familiar aproximado")
      ]},
      {title:"Padre / tutor",fields:[
        text("padreTutor","Nombre del padre o tutor"),text("papaEstudios","Escolaridad"),text("papaTrabajo","Ocupación"),
        text("papaSueldo","Ingreso aproximado")
      ]},
      {title:"Madre",fields:[
        text("mamaEstudios","Escolaridad"),text("mamaTrabajo","Ocupación"),text("mamaSueldo","Ingreso aproximado")
      ]},
      {title:"Situación escolar",fields:[
        text("promedioSemestre","Promedio del semestre"),text("materiasReprobadas","Materias reprobadas"),
        text("gastoEscolar","Gasto escolar aproximado"),text("trabajo","Trabajo del estudiante")
      ]},
      {title:"Salud y servicios médicos",fields:[
        text("institucionMedica","Institución médica"),text("medicamentosInstitucion","Medicamentos / atención recibida"),
        text("enfermedad","Enfermedad relevante"),text("vista","Situación visual"),text("auditiva","Situación auditiva"),
        text("motora","Situación motora"),text("lenguaje","Situación de lenguaje")
      ]},
      {title:"Red familiar y emergencias",fields:[
        text("hermanos","Número de hermanos"),text("lugarHermanos","Lugar que ocupa entre hermanos"),
        text("estadoCivilPadres","Estado civil de los padres"),text("emergenciaPersona1","Contacto de emergencia 1"),
        text("emergenciaParentesco1","Parentesco"),text("emergenciaTel1","Teléfono"),
        text("emergenciaPersona2","Contacto de emergencia 2"),text("emergenciaParentesco2","Parentesco"),text("emergenciaTel2","Teléfono")
      ]}
    ]
  };

  return { ficha, bio, socio, barschItems, habits };
})();