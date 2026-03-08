

/* =====================================================
   INVESTIGADOR 1: Vivian Vilchez Barboza (110270978)
   ===================================================== */
BEGIN
    PRC_REGISTRAR_INVESTIGADOR(
        Pnombre_completo   => 'Vivian Vilchez Barboza',
        Pnacionalidad      => 'Costarricense',
        Pidentificacion    => '110270978',
        Pcorreo            => 'vivian.vilchez@ucr.ac.cr',
        Ptelefono          => '88881002',
        Punidad_academica  => 'Facultad de Ciencias Sociales',
        Pinstitucion_origen=> 'Universidad de Costa Rica',
        Pgrado_academico   => (SELECT ID FROM REP_GRADO_ACADEMICO WHERE UPPER(NOMBRE)='DOCTORADO'),
        Pnombre_usuario    => 'vivian.vilchez@ucr.ac.cr',
        Pcontrasena        => '$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',
        Pactivo            => 1,
        Pnombre_cert       => 'Buenas prácticas de laboratorio',
        Ptipo_cert         => (SELECT ID FROM REP_TIPO_CERTIFICACION WHERE UPPER(NOMBRE)='LICENCIA PROFESIONAL'),
        Pfecha_exp_cert    => TO_DATE('2027-06-15','YYYY-MM-DD'),
        Pestado_cert       => (SELECT ID FROM REP_ESTADO_CERTIFICACION WHERE UPPER(NOMBRE)='VIGENTE')
    );
END;
/

/* =====================================================
   INVESTIGADOR 2: Yamileth Chacon Araya (105540538)
   ===================================================== */
BEGIN
    PRC_REGISTRAR_INVESTIGADOR(
        Pnombre_completo   => 'Yamileth Chacon Araya',
        Pnacionalidad      => 'Costarricense',
        Pidentificacion    => '105540538',
        Pcorreo            => 'yamileth.chacon@ucr.ac.cr',
        Ptelefono          => '88881003',
        Punidad_academica  => 'Facultad de Educación',
        Pinstitucion_origen=> 'Universidad de Costa Rica',
        Pgrado_academico   => (SELECT ID FROM REP_GRADO_ACADEMICO WHERE UPPER(NOMBRE)='DOCTORADO'),
        Pnombre_usuario    => 'yamileth.chacon@ucr.ac.cr',
        Pcontrasena        => '$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',
        Pactivo            => 1,
        Pnombre_cert       => 'Investigación cualitativa avanzada',
        Ptipo_cert         => (SELECT ID FROM REP_TIPO_CERTIFICACION WHERE UPPER(NOMBRE)='LICENCIA PROFESIONAL'),
        Pfecha_exp_cert    => TO_DATE('2025-10-10','YYYY-MM-DD'),
        Pestado_cert       => (SELECT ID FROM REP_ESTADO_CERTIFICACION WHERE UPPER(NOMBRE)='VIGENTE')
    );
END;
/

/* =====================================================
   INVESTIGADOR 3: Cynthia Córdoba López (303910277)
   ===================================================== */
BEGIN
    PRC_REGISTRAR_INVESTIGADOR(
        Pnombre_completo   => 'Cynthia Córdoba López',
        Pnacionalidad      => 'Costarricense',
        Pidentificacion    => '303910277',
        Pcorreo            => 'cynthia.cordoba@ucr.ac.cr',
        Ptelefono          => '88881004',
        Punidad_academica  => 'Escuela de Psicologia',
        Pinstitucion_origen=> 'Universidad de Costa Rica',
        Pgrado_academico   => (SELECT ID FROM REP_GRADO_ACADEMICO WHERE UPPER(NOMBRE)='LICENCIATURA'),
        Pnombre_usuario    => 'cynthia.cordoba@ucr.ac.cr',
        Pcontrasena        => '$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',
        Pactivo            => 1,
        Pnombre_cert       => 'Ética y consentimiento informado',
        Ptipo_cert         => (SELECT ID FROM REP_TIPO_CERTIFICACION WHERE UPPER(NOMBRE)='LICENCIA PROFESIONAL'),
        Pfecha_exp_cert    => TO_DATE('2027-03-05','YYYY-MM-DD'),
        Pestado_cert       => (SELECT ID FROM REP_ESTADO_CERTIFICACION WHERE UPPER(NOMBRE)='VIGENTE')
    );
END;
/

/* =====================================================
   INVESTIGADOR 4: Ana Laura Solano López (304050852)
   ===================================================== */
BEGIN
    PRC_REGISTRAR_INVESTIGADOR(
        Pnombre_completo   => 'Ana Laura Solano López',
        Pnacionalidad      => 'Costarricense',
        Pidentificacion    => '304050852',
        Pcorreo            => 'ana.solano@ucr.ac.cr',
        Ptelefono          => '88881005',
        Punidad_academica  => 'Facultad de Ciencias Sociales',
        Pinstitucion_origen=> 'Universidad de Costa Rica',
        Pgrado_academico   => (SELECT ID FROM REP_GRADO_ACADEMICO WHERE UPPER(NOMBRE)='DOCTORADO'),
        Pnombre_usuario    => 'ana.solano@ucr.ac.cr',
        Pcontrasena        => '$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',
        Pactivo            => 1,
        Pnombre_cert       => 'Bioestadística aplicada',
        Ptipo_cert         => (SELECT ID FROM REP_TIPO_CERTIFICACION WHERE UPPER(NOMBRE)='LICENCIA PROFESIONAL'),
        Pfecha_exp_cert    => TO_DATE('2026-09-01','YYYY-MM-DD'),
        Pestado_cert       => (SELECT ID FROM REP_ESTADO_CERTIFICACION WHERE UPPER(NOMBRE)='VIGENTE')
    );
END;
/

/* =====================================================
   INVESTIGADOR 5: Sedali Solís Agüero (109770013)
   ===================================================== */
BEGIN
    PRC_REGISTRAR_INVESTIGADOR(
        Pnombre_completo   => 'Sedali Solís Agüero',
        Pnacionalidad      => 'Costarricense',
        Pidentificacion    => '109770013',
        Pcorreo            => 'sedali.solis@ucr.ac.cr',
        Ptelefono          => '88881006',
        Punidad_academica  => 'Facultad de Ciencias Económicas',
        Pinstitucion_origen=> 'Universidad de Costa Rica',
        Pgrado_academico   => (SELECT ID FROM REP_GRADO_ACADEMICO WHERE UPPER(NOMBRE)='MAESTRÍA'),
        Pnombre_usuario    => 'sedali.solis@ucr.ac.cr',
        Pcontrasena        => '$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',
        Pactivo            => 1,
        Pnombre_cert       => 'Gestión de proyectos de investigación',
        Ptipo_cert         => (SELECT ID FROM REP_TIPO_CERTIFICACION WHERE UPPER(NOMBRE)='LICENCIA PROFESIONAL'),
        Pfecha_exp_cert    => TO_DATE('2026-05-20','YYYY-MM-DD'),
        Pestado_cert       => (SELECT ID FROM REP_ESTADO_CERTIFICACION WHERE UPPER(NOMBRE)='VIGENTE')
    );
END;
/

/* =====================================================
   INVESTIGADOR 6: Ingrid Gómez Duarte (108660046)
   ===================================================== */
BEGIN
    PRC_REGISTRAR_INVESTIGADOR(
        Pnombre_completo   => 'Ingrid Gómez Duarte',
        Pnacionalidad      => 'Costarricense',
        Pidentificacion    => '108660046',
        Pcorreo            => 'ingrid.gomez@ucr.ac.cr',
        Ptelefono          => '88881007',
        Punidad_academica  => 'Escuela de Medicina',
        Pinstitucion_origen=> 'Universidad de Costa Rica',
        Pgrado_academico   => (SELECT ID FROM REP_GRADO_ACADEMICO WHERE UPPER(NOMBRE)='DOCTORADO'),
        Pnombre_usuario    => 'ingrid.gomez@ucr.ac.cr',
        Pcontrasena        => '$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',
        Pactivo            => 1,
        Pnombre_cert       => 'Ensayos clínicos',
        Ptipo_cert         => (SELECT ID FROM REP_TIPO_CERTIFICACION WHERE UPPER(NOMBRE)='LICENCIA PROFESIONAL'),
        Pfecha_exp_cert    => TO_DATE('2026-11-12','YYYY-MM-DD'),
        Pestado_cert       => (SELECT ID FROM REP_ESTADO_CERTIFICACION WHERE UPPER(NOMBRE)='VIGENTE')
    );
END;
/

/* =====================================================
   INVESTIGADOR 7: Eiliana Montero Rojas (105910052)
   ===================================================== */
BEGIN
    PRC_REGISTRAR_INVESTIGADOR(
        Pnombre_completo   => 'Eiliana Montero Rojas',
        Pnacionalidad      => 'Costarricense',
        Pidentificacion    => '105910052',
        Pcorreo            => 'eiliana.montero@ucr.ac.cr',
        Ptelefono          => '88881008',
        Punidad_academica  => 'Facultad de Ciencias',
        Pinstitucion_origen=> 'Universidad de Costa Rica',
        Pgrado_academico   => (SELECT ID FROM REP_GRADO_ACADEMICO WHERE UPPER(NOMBRE)='DOCTORADO'),
        Pnombre_usuario    => 'eiliana.montero@ucr.ac.cr',
        Pcontrasena        => '$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',
        Pactivo            => 1,
        Pnombre_cert       => 'Investigación cuantitativa',
        Ptipo_cert         => (SELECT ID FROM REP_TIPO_CERTIFICACION WHERE UPPER(NOMBRE)='LICENCIA PROFESIONAL'),
        Pfecha_exp_cert    => TO_DATE('2026-12-31','YYYY-MM-DD'),
        Pestado_cert       => (SELECT ID FROM REP_ESTADO_CERTIFICACION WHERE UPPER(NOMBRE)='VIGENTE')
    );
END;
/

/* =====================================================
   INVESTIGADOR 8: Benjamín Reyes Fernández (110500964)
   ===================================================== */
BEGIN
    PRC_REGISTRAR_INVESTIGADOR(
        Pnombre_completo   => 'Benjamín Reyes Fernández',
        Pnacionalidad      => 'Costarricense',
        Pidentificacion    => '110500964',
        Pcorreo            => 'benjamin.reyes@ucr.ac.cr',
        Ptelefono          => '88881009',
        Punidad_academica  => 'Facultad de Ciencias',
        Pinstitucion_origen=> 'Universidad de Costa Rica',
        Pgrado_academico   => (SELECT ID FROM REP_GRADO_ACADEMICO WHERE UPPER(NOMBRE)='DOCTORADO'),
        Pnombre_usuario    => 'benjamin.reyes@ucr.ac.cr',
        Pcontrasena        => '$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',
        Pactivo            => 1,
        Pnombre_cert       => 'Gestión de datos de investigación',
        Ptipo_cert         => (SELECT ID FROM REP_TIPO_CERTIFICACION WHERE UPPER(NOMBRE)='LICENCIA PROFESIONAL'),
        Pfecha_exp_cert    => TO_DATE('2026-08-30','YYYY-MM-DD'),
        Pestado_cert       => (SELECT ID FROM REP_ESTADO_CERTIFICACION WHERE UPPER(NOMBRE)='VIGENTE')
    );
END;
/

/* =====================================================
   INVESTIGADOR 9: José Moncada Jiménez (107660515)
   ===================================================== */
BEGIN
    PRC_REGISTRAR_INVESTIGADOR(
        Pnombre_completo   => 'José Moncada Jiménez',
        Pnacionalidad      => 'Costarricense',
        Pidentificacion    => '107660515',
        Pcorreo            => 'jose.moncada@ucr.ac.cr',
        Ptelefono          => '88881010',
        Punidad_academica  => 'Escuela de Educación Física',
        Pinstitucion_origen=> 'Universidad de Costa Rica',
        Pgrado_academico   => (SELECT ID FROM REP_GRADO_ACADEMICO WHERE UPPER(NOMBRE)='DOCTORADO'),
        Pnombre_usuario    => 'jose.moncada@ucr.ac.cr',
        Pcontrasena        => '$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',
        Pactivo            => 1,
        Pnombre_cert       => 'Actividad física y salud pública',
        Ptipo_cert         => (SELECT ID FROM REP_TIPO_CERTIFICACION WHERE UPPER(NOMBRE)='LICENCIA PROFESIONAL'),
        Pfecha_exp_cert    => TO_DATE('2027-12-31','YYYY-MM-DD'),
        Pestado_cert       => (SELECT ID FROM REP_ESTADO_CERTIFICACION WHERE UPPER(NOMBRE)='VIGENTE')
    );
END;
/

/* =====================================================
   INVESTIGADOR 10: Maria del Rocio Martinez Hernandez (1305010987)
   ===================================================== */
BEGIN
    PRC_REGISTRAR_INVESTIGADOR(
        Pnombre_completo   => 'Maria del Rocio Martinez Hernandez',
        Pnacionalidad      => 'Costarricense',
        Pidentificacion    => '1305010987',
        Pcorreo            => 'maria.martinezhernandez@ucr.ac.cr',
        Ptelefono          => '85298000',
        Punidad_academica  => 'Facultad de Ciencias Sociales',
        Pinstitucion_origen=> 'Universidad de Costa Rica',
        Pgrado_academico   => (SELECT ID FROM REP_GRADO_ACADEMICO WHERE UPPER(NOMBRE)='LICENCIATURA'),
        Pnombre_usuario    => 'maria.martinezhernandez@ucr.ac.cr',
        Pcontrasena        => '$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',
        Pactivo            => 1,
        Pnombre_cert       => 'Metodología de la investigación',
        Ptipo_cert         => (SELECT ID FROM REP_TIPO_CERTIFICACION WHERE UPPER(NOMBRE)='LICENCIA PROFESIONAL'),
        Pfecha_exp_cert    => TO_DATE('2026-12-31','YYYY-MM-DD'),
        Pestado_cert       => (SELECT ID FROM REP_ESTADO_CERTIFICACION WHERE UPPER(NOMBRE)='VIGENTE')
    );
END;
/

/* =====================================================
   INVESTIGADOR 11: Natalie Padilla Ureña (118370957)
   ===================================================== */
BEGIN
    PRC_REGISTRAR_INVESTIGADOR(
        Pnombre_completo   => 'Natalie Padilla Ureña',
        Pnacionalidad      => 'Costarricense',
        Pidentificacion    => '118370957',
        Pcorreo            => 'natalie.padilla@ucr.ac.cr',
        Ptelefono          => '87588264',
        Punidad_academica  => 'Facultad de Ciencias Sociales',
        Pinstitucion_origen=> 'Universidad de Costa Rica',
        Pgrado_academico   => (SELECT ID FROM REP_GRADO_ACADEMICO WHERE UPPER(NOMBRE)='LICENCIATURA'),
        Pnombre_usuario    => 'natalie.padilla@ucr.ac.cr',
        Pcontrasena        => '$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',
        Pactivo            => 1,
        Pnombre_cert       => 'Formación metodológica',
        Ptipo_cert         => (SELECT ID FROM REP_TIPO_CERTIFICACION WHERE UPPER(NOMBRE)='LICENCIA PROFESIONAL'),
        Pfecha_exp_cert    => TO_DATE('2026-12-31','YYYY-MM-DD'),
        Pestado_cert       => (SELECT ID FROM REP_ESTADO_CERTIFICACION WHERE UPPER(NOMBRE)='VIGENTE')
    );
END;
/

/* =====================================================
   INVESTIGADOR 12: Jimena Chacón Alvarez (1208590093)
   ===================================================== */
BEGIN
    PRC_REGISTRAR_INVESTIGADOR(
        Pnombre_completo   => 'Jimena Chacón Alvarez',
        Pnacionalidad      => 'Costarricense',
        Pidentificacion    => '1208590093',
        Pcorreo            => 'jimena.chaconalvarez@ucr.ac.cr',
        Ptelefono          => '70435884',
        Punidad_academica  => 'Facultad de Ciencias Sociales',
        Pinstitucion_origen=> 'Universidad de Costa Rica',
        Pgrado_academico   => (SELECT ID FROM REP_GRADO_ACADEMICO WHERE UPPER(NOMBRE)='LICENCIATURA'),
        Pnombre_usuario    => 'jimena.chaconalvarez@ucr.ac.cr',
        Pcontrasena        => '$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',
        Pactivo            => 1,
        Pnombre_cert       => 'Ética y consentimiento informado',
        Ptipo_cert         => (SELECT ID FROM REP_TIPO_CERTIFICACION WHERE UPPER(NOMBRE)='LICENCIA PROFESIONAL'),
        Pfecha_exp_cert    => TO_DATE('2027-03-05','YYYY-MM-DD'),
        Pestado_cert       => (SELECT ID FROM REP_ESTADO_CERTIFICACION WHERE UPPER(NOMBRE)='VIGENTE')
    );
END;
/

/* =====================================================
   INVESTIGADOR 13: Ericka Carolina Murillo Rodriguez (114940605)
   ===================================================== */
BEGIN
    PRC_REGISTRAR_INVESTIGADOR(
        Pnombre_completo   => 'Ericka Carolina Murillo Rodriguez',
        Pnacionalidad      => 'Costarricense',
        Pidentificacion    => '114940605',
        Pcorreo            => 'ericka.murillo@ucr.ac.cr',
        Ptelefono          => '87409468',
        Punidad_academica  => 'Facultad de Ciencias Sociales',
        Pinstitucion_origen=> 'Universidad de Costa Rica',
        Pgrado_academico   => (SELECT ID FROM REP_GRADO_ACADEMICO WHERE UPPER(NOMBRE)='MAESTRIA'),
        Pnombre_usuario    => 'ericka.murillo@ucr.ac.cr',
        Pcontrasena        => '$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',
        Pactivo            => 1,
        Pnombre_cert       => 'Formación metodológica avanzada',
        Ptipo_cert         => (SELECT ID FROM REP_TIPO_CERTIFICACION WHERE UPPER(NOMBRE)='LICENCIA PROFESIONAL'),
        Pfecha_exp_cert    => TO_DATE('2026-12-31','YYYY-MM-DD'),
        Pestado_cert       => (SELECT ID FROM REP_ESTADO_CERTIFICACION WHERE UPPER(NOMBRE)='VIGENTE')
    );
END;
/

COMMIT;
