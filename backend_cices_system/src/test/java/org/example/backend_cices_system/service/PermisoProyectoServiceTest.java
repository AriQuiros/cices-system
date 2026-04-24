package org.example.backend_cices_system.service;

/*
@ExtendWith(MockitoExtension.class)
class PermisoProyectoServiceTest {

    @Mock
    private PermisoProyectoRepository permisoProyectoRepository;

    @Mock
    private InvestigadorProyectoService investigadorProyectoService;

    @Mock
    private NotificacionUsuarioService notificacionUsuarioService;

    @InjectMocks
    private PermisoProyectoService permisoProyectoService;

    private InvestigadorProyecto investigadorProyecto;
    private PermisoProyecto permisoProyecto;
    private PermisoProyectoDTO permisoProyectoDTO;
    private InvestigadorProyectoDTO investigadorProyectoDTO;

    @BeforeEach
    void setUp() {
        Empleado empleado = new Empleado();
        empleado.setIdentificacion("123456789");
        empleado.setNombreCompleto("Ana Rodríguez");

        Investigador investigador = new Investigador();
        investigador.setIdEmpleado(empleado);

        Proyecto proyecto = new Proyecto();
        proyecto.setCodigoProyecto("PR-001");

        RolProyecto rolProyecto = new RolProyecto();
        rolProyecto.setId((short) 1);
        rolProyecto.setNombreRolProyecto("Director");

        investigadorProyecto = new InvestigadorProyecto();
        investigadorProyecto.setId(10);
        investigadorProyecto.setIdInvestigador(investigador);
        investigadorProyecto.setIdProyecto(proyecto);
        investigadorProyecto.setIdRolProyecto(rolProyecto);
        investigadorProyecto.setFechaInicioInvestigador(LocalDate.of(2026, 1, 1));
        investigadorProyecto.setFechaFinInvestigador(LocalDate.of(2026, 12, 31));

        investigadorProyectoDTO = new InvestigadorProyectoDTO(
                10,
                "123456789",
                "Ana Rodríguez",
                "bachi",
                "PR-001",
                new RolProyectoDTO((short) 1, "Director"),
                "Investigación",
                LocalDate.of(2026, 1, 1),
                LocalDate.of(2026, 12, 31)
        );

        permisoProyecto = new PermisoProyecto();
        permisoProyecto.setId(100);
        permisoProyecto.setIdInvestigadorProyecto(investigadorProyecto);
        permisoProyecto.setFechaInicioPermiso(LocalDate.of(2026, 4, 17));
        permisoProyecto.setFechaFinPermiso(LocalDate.of(2026, 12, 31));

        permisoProyectoDTO = new PermisoProyectoDTO(
                100,
                investigadorProyectoDTO,
                LocalDate.of(2026, 4, 17),
                LocalDate.of(2026, 12, 31)
        );
    }

    @Test
    void save_deberiaGuardarPermisoYNotificar() {
        when(investigadorProyectoService.obtenerInvestigadorProyecto(10))
                .thenReturn(investigadorProyecto);

        PermisoProyectoDTO resultado = permisoProyectoService.save(permisoProyectoDTO);

        assertNotNull(resultado);
        assertEquals(permisoProyectoDTO, resultado);

        ArgumentCaptor<PermisoProyecto> captor = ArgumentCaptor.forClass(PermisoProyecto.class);
        verify(permisoProyectoRepository).save(captor.capture());

        PermisoProyecto guardado = captor.getValue();
        assertEquals(investigadorProyecto, guardado.getIdInvestigadorProyecto());
        assertEquals(LocalDate.of(2026, 4, 17), guardado.getFechaInicioPermiso());
        assertEquals(LocalDate.of(2026, 12, 31), guardado.getFechaFinPermiso());

        verify(notificacionUsuarioService).guardarNotificacionPermiso(any(PermisoProyecto.class));
    }

    @Test
    void getById_deberiaRetornarPermiso_siExiste() {
        when(permisoProyectoRepository.findById(100)).thenReturn(Optional.of(permisoProyecto));

        PermisoProyecto resultado = permisoProyectoService.getById(100);

        assertNotNull(resultado);
        assertEquals(100, resultado.getId());
        verify(permisoProyectoRepository).findById(100);
    }

    @Test
    void getById_deberiaLanzarExcepcion_siNoExiste() {
        when(permisoProyectoRepository.findById(999)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> permisoProyectoService.getById(999)
        );

        assertTrue(ex.getMessage().contains("Permiso no encontrado"));
        verify(permisoProyectoRepository).findById(999);
    }

    @Test
    void delete_deberiaEliminar_siExiste() {
        when(permisoProyectoRepository.existsById(100)).thenReturn(true);

        permisoProyectoService.delete(100);

        verify(permisoProyectoRepository).deleteById(100);
    }

    @Test
    void delete_noDeberiaEliminar_siNoExiste() {
        when(permisoProyectoRepository.existsById(100)).thenReturn(false);

        permisoProyectoService.delete(100);

        verify(permisoProyectoRepository, never()).deleteById(anyInt());
    }

    @Test
    void existByInvestigadorProyecto_deberiaDelegarAlRepositorio() {
        when(permisoProyectoRepository.existsByIdInvestigadorProyecto(investigadorProyecto))
                .thenReturn(true);

        boolean resultado = permisoProyectoService.existByInvestigadorProyecto(investigadorProyecto);

        assertTrue(resultado);
        verify(permisoProyectoRepository).existsByIdInvestigadorProyecto(investigadorProyecto);
    }

    @Test
    void existByInvestigadorProyectoId_deberiaDelegarAlRepositorio() {
        when(permisoProyectoRepository.existsByIdInvestigadorProyecto_Id(10))
                .thenReturn(true);

        boolean resultado = permisoProyectoService.existByInvestigadorProyectoId(10);

        assertTrue(resultado);
        verify(permisoProyectoRepository).existsByIdInvestigadorProyecto_Id(10);
    }

    @Test
    void obtenerDTO_deberiaMapearCorrectamente() {
        when(investigadorProyectoService.obtenerDTO(investigadorProyecto))
                .thenReturn(investigadorProyectoDTO);

        PermisoProyectoDTO resultado = permisoProyectoService.obtenerDTO(permisoProyecto);

        assertNotNull(resultado);
        assertEquals(100, resultado.id());
        assertEquals(LocalDate.of(2026, 4, 17), resultado.fechaInicio());
        assertEquals(LocalDate.of(2026, 12, 31), resultado.fechaFin());
        assertEquals(10, resultado.investigadorProyectoDTO().id());
    }

    @Test
    void obtenerDTOsPorCodigoProyecto_deberiaRetornarListaMapeada() {
        when(permisoProyectoRepository.findByIdInvestigadorProyecto_IdProyecto_CodigoProyecto("PR-001"))
                .thenReturn(List.of(permisoProyecto));

        when(investigadorProyectoService.obtenerDTO(investigadorProyecto))
                .thenReturn(investigadorProyectoDTO);

        List<PermisoProyectoDTO> resultado = permisoProyectoService.obtenerDTOsPorCodigoProyecto("PR-001");

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("PR-001", resultado.get(0).investigadorProyectoDTO().codigoProyecto());

        verify(permisoProyectoRepository)
                .findByIdInvestigadorProyecto_IdProyecto_CodigoProyecto("PR-001");
    }
}*/