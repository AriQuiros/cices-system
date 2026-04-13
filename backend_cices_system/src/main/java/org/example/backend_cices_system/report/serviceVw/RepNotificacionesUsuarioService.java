package org.example.backend_cices_system.report.serviceVw;

import jakarta.transaction.Transactional;
import org.example.backend_cices_system.data.NotificacionUsuarioRepository;
import org.example.backend_cices_system.logic.NotificacionUsuario;
import org.example.backend_cices_system.report.dao.RepNotificacionesUsuarioRepository;
import org.example.backend_cices_system.report.dto.RepNotificacionDetalladaDTO;
import org.example.backend_cices_system.report.view.RepNotificacionesUsuario;
import org.example.backend_cices_system.service.NotificacionCambioService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;

@Service
public class RepNotificacionesUsuarioService {

    private static final String TIPO_INFORME = "Informe";
    private static final String TIPO_ACREDITACION_LICENCIA = "Acreditacion o licencia";
    private static final String TIPO_PERMISO_COORDINADOR = "Permiso coordinador";
    private static final String TIPO_OTRO = "Otro";

    private final RepNotificacionesUsuarioRepository repo;
    private final NotificacionUsuarioRepository notificacionUsuarioRepository;
    private final NotificacionCambioService notificacionCambioService;

    public RepNotificacionesUsuarioService(RepNotificacionesUsuarioRepository repo,
                                           NotificacionUsuarioRepository notificacionUsuarioRepository,
                                           NotificacionCambioService notificacionCambioService) {
        this.repo = repo;
        this.notificacionUsuarioRepository = notificacionUsuarioRepository;
        this.notificacionCambioService = notificacionCambioService;
    }

    public List<RepNotificacionesUsuario> obtenerTodos() {
        return repo.findAll();
    }

    public RepNotificacionesUsuario buscarPorId(Integer idNotificacionUsuario) {
        return repo.findById(idNotificacionUsuario).orElse(null);
    }

    public List<RepNotificacionesUsuario> buscarPorIdUsuario(Integer idUsuario) {
        return repo.findByIdUsuario(idUsuario);
    }

    public List<RepNotificacionesUsuario> buscarPorNombreUsuario(String nombreUsuario) {
        return repo.findByNombreUsuarioIgnoreCase(nombreUsuario)
                .stream()
                .filter(n -> n.getEliminado() == null || !n.getEliminado())
                .toList();
    }

    public List<RepNotificacionDetalladaDTO> buscarDetalladasPorNombreUsuario(String nombreUsuario) {
        return buscarPorNombreUsuario(nombreUsuario)
                .stream()
                .map(this::mapearDetalladaSeguro)
                .toList();
    }

    public List<RepNotificacionesUsuario> buscarPorAsunto(String asunto) {
        return repo.findByAsuntoContainingIgnoreCase(asunto);
    }

    @Transactional
    public void marcarLeida(Integer idNotificacionUsuario, String nombreUsuario) {
        NotificacionUsuario notificacionUsuario = obtenerNotificacionUsuario(idNotificacionUsuario, nombreUsuario);
        notificacionUsuario.setLeido(true);
        notificacionUsuario.setFechaLeido(LocalDate.now());
        notificacionUsuarioRepository.save(notificacionUsuario);
        notificacionCambioService.notificarCambioUsuario(nombreUsuario);
    }

    @Transactional
    public void marcarNoLeida(Integer idNotificacionUsuario, String nombreUsuario) {
        NotificacionUsuario notificacionUsuario = obtenerNotificacionUsuario(idNotificacionUsuario, nombreUsuario);
        notificacionUsuario.setLeido(false);
        notificacionUsuario.setFechaLeido(null);
        notificacionUsuarioRepository.save(notificacionUsuario);
        notificacionCambioService.notificarCambioUsuario(nombreUsuario);
    }

    @Transactional
    public void eliminar(Integer idNotificacionUsuario, String nombreUsuario) {
        NotificacionUsuario notificacionUsuario = obtenerNotificacionUsuario(idNotificacionUsuario, nombreUsuario);
        notificacionUsuario.setEliminado(true);
        notificacionUsuarioRepository.save(notificacionUsuario);
        notificacionCambioService.notificarCambioUsuario(nombreUsuario);
    }

    private NotificacionUsuario obtenerNotificacionUsuario(Integer idNotificacionUsuario, String nombreUsuario) {
        return notificacionUsuarioRepository
                .findByIdAndIdUsuario_NombreUsuarioIgnoreCase(idNotificacionUsuario, nombreUsuario)
                .orElseThrow(() -> new NoSuchElementException("Notificacion no encontrada para el usuario"));
    }

    private RepNotificacionDetalladaDTO mapearDetallada(RepNotificacionesUsuario origen) {
        String tipo = detectarTipo(origen);
        String texto = String.format("%s | %s", nvl(origen.getAsunto()), nvl(origen.getMensaje()));

        List<RepNotificacionDetalladaDTO.CampoDetalleDTO> detalle;
        LocalDate fechaObjetivo = null;

        if (TIPO_INFORME.equals(tipo)) {
            String codigoProyecto = extraerValorPorEtiqueta(texto, List.of("codigo de proyecto", "cod proyecto", "proyecto"));
            String numeroInforme = extraerValorPorEtiqueta(texto, List.of("numero de informe", "numero informe", "num informe", "informe"));
            String fechaPresentacionStr = extraerValorPorEtiqueta(
                    texto,
                List.of("fecha de presentacion", "fecha presentacion", "presentacion", "fecha")
            );

            if (codigoProyecto.isBlank()) {
            codigoProyecto = primerNoVacio(
                extraerPorPatron(nvl(origen.getAsunto()), "(?i)informe\\s*[-:]\\s*([A-Z0-9-]+)$"),
                extraerPorPatron(texto, "(?i)proyecto\\s*[:\\-]\\s*([A-Z0-9-]+)")
            );
            }

            fechaObjetivo = parseDateFlexible(fechaPresentacionStr);

            detalle = List.of(
                    new RepNotificacionDetalladaDTO.CampoDetalleDTO("Codigo de proyecto", valorOGuion(codigoProyecto)),
                    new RepNotificacionDetalladaDTO.CampoDetalleDTO("Numero de informe", valorOGuion(numeroInforme)),
                    new RepNotificacionDetalladaDTO.CampoDetalleDTO("Fecha de presentacion", valorOGuion(fechaPresentacionStr))
            );
        } else if (TIPO_ACREDITACION_LICENCIA.equals(tipo)) {
            String mensaje = nvl(origen.getMensaje());

            String nombreAcreditacion = extraerValorPorEtiqueta(
                    mensaje,
                List.of(
                    "nombre de la acreditacion o licencia",
                    "nombre de la acreditación o licencia",
                    "nombre acreditacion",
                    "nombre acreditación",
                    "nombre licencia",
                    "nombre de la certificacion",
                    "nombre de la certificación",
                    "nombre certificacion",
                    "nombre certificación",
                    "certificacion",
                    "certificación",
                    "acreditacion",
                    "acreditación",
                    "licencia"
                )
            );
            String fechaExpiracionStr = extraerValorPorEtiqueta(
                    mensaje,
                List.of("fecha de expiracion", "fecha expiracion", "expiracion", "expira", "vence")
            );
            String nombreInvestigador = extraerValorPorEtiqueta(mensaje, List.of("nombre del investigador", "investigador"));

            if (nombreAcreditacion.isBlank()) {
                nombreAcreditacion = primerNoVacio(
                        extraerPorPatron(mensaje, "(?i)certificaci[oó]n\\s*[:\\-]\\s*([^\\n,;|]+)"),
                        extraerPorPatron(mensaje, "(?i)acreditaci[oó]n\\s*[:\\-]\\s*([^\\n,;|]+)"),
                        extraerPorPatron(mensaje, "(?i)licencia\\s*[:\\-]\\s*([^\\n,;|]+)")
                );
            }

            // Fallback para textos con codificacion extraña: toma el valor que sigue al primer ':'
            // y corta antes de "expira"/"vencio"/separadores.
            if (nombreAcreditacion.isBlank()) {
                nombreAcreditacion = extraerPorPatron(
                        mensaje,
                        "[:\\-]\\s*([^|;\\n]+?)(?:\\s+expir|\\s+venc|\\||;|$)"
                );
            }

            if (fechaExpiracionStr.isBlank()) {
                fechaExpiracionStr = primerNoVacio(
                        extraerPorPatron(mensaje, "(?i)expira\\s*[:\\-]\\s*(\\d{4}-\\d{2}-\\d{2}|\\d{2}[/-]\\d{2}[/-]\\d{4})"),
                        extraerPorPatron(mensaje, "(?i)venci[oó]\\s+el\\s+(\\d{4}-\\d{2}-\\d{2}|\\d{2}[/-]\\d{2}[/-]\\d{4})")
                );
            }

            // Fallback final: cualquier fecha valida en el texto.
            if (fechaExpiracionStr.isBlank()) {
                fechaExpiracionStr = extraerPorPatron(mensaje, "(\\d{4}-\\d{2}-\\d{2}|\\d{2}[/-]\\d{2}[/-]\\d{4})");
            }

            // Evita que quede texto adicional pegado a la fecha (ej: "2026-04-30 pertenece al ...").
            String fechaSolo = extraerPorPatron(fechaExpiracionStr, "(\\d{4}-\\d{2}-\\d{2}|\\d{2}[/-]\\d{2}[/-]\\d{4})");
            if (!fechaSolo.isBlank()) {
                fechaExpiracionStr = fechaSolo;
            }

            if (nombreInvestigador.isBlank()) {
                nombreInvestigador = extraerPorPatron(mensaje, "(?i)pertenece\\s+al\\s+investigador/a\\s*[:\\-]?\\s*([^\\n,;|]+)");
            }

            fechaObjetivo = parseDateFlexible(fechaExpiracionStr);

            detalle = List.of(
                    new RepNotificacionDetalladaDTO.CampoDetalleDTO("Nombre de la acreditacion o licencia", valorOGuion(nombreAcreditacion)),
                    new RepNotificacionDetalladaDTO.CampoDetalleDTO("Fecha de expiracion", valorOGuion(fechaExpiracionStr)),
                    new RepNotificacionDetalladaDTO.CampoDetalleDTO("Nombre del investigador", valorOGuion(nombreInvestigador))
            );
        } else if (TIPO_PERMISO_COORDINADOR.equals(tipo)) {
            String codigoProyecto = extraerValorPorEtiqueta(texto, List.of("codigo de proyecto", "cod proyecto", "proyecto"));
            String fechaInicioStr = extraerValorPorEtiqueta(texto, List.of("fecha de inicio", "inicio"));
            String fechaFinStr = extraerValorPorEtiqueta(texto, List.of("fecha fin", "fecha de fin", "fin"));

            if (codigoProyecto.isBlank()) {
                codigoProyecto = extraerPorPatron(texto, "(?i)proyecto\\s*'([^']+)'");
            }
            if (fechaInicioStr.isBlank()) {
                fechaInicioStr = extraerPorPatron(texto, "(?i)periodo\\s+del\\s+(\\d{4}-\\d{2}-\\d{2}|\\d{2}[/-]\\d{2}[/-]\\d{4})");
            }
            if (fechaFinStr.isBlank()) {
                fechaFinStr = primerNoVacio(
                        extraerPorPatron(texto, "(?i)\\sa\\s*l\\s+(\\d{4}-\\d{2}-\\d{2}|\\d{2}[/-]\\d{2}[/-]\\d{4})"),
                        extraerPorPatron(texto, "(?i)\\sa\\s+indefinido")
                );
            }

            LocalDate fechaInicio = parseDateFlexible(fechaInicioStr);
            LocalDate fechaFin = parseDateFlexible(fechaFinStr);
            fechaObjetivo = fechaInicio != null ? fechaInicio : fechaFin;

            detalle = List.of(
                    new RepNotificacionDetalladaDTO.CampoDetalleDTO("Codigo de proyecto", valorOGuion(codigoProyecto)),
                    new RepNotificacionDetalladaDTO.CampoDetalleDTO("Fecha de inicio", valorOGuion(fechaInicioStr)),
                    new RepNotificacionDetalladaDTO.CampoDetalleDTO("Fecha fin", valorOGuion(fechaFinStr))
            );
        } else {
            detalle = List.of(
                    new RepNotificacionDetalladaDTO.CampoDetalleDTO("Asunto", valorOGuion(origen.getAsunto())),
                    new RepNotificacionDetalladaDTO.CampoDetalleDTO("Mensaje", valorOGuion(origen.getMensaje())),
                    new RepNotificacionDetalladaDTO.CampoDetalleDTO("Categoria", valorOGuion(origen.getCategoria()))
            );
            fechaObjetivo = origen.getFechaCreacion();
        }

        return new RepNotificacionDetalladaDTO(
                origen.getIdNotificacionUsuario(),
                origen.getIdUsuario(),
                origen.getNombreUsuario(),
                origen.getIdNotificacion(),
                tipo,
                detalle,
                origen.getLeido(),
                origen.getEliminado(),
                origen.getFechaCreacion(),
                origen.getFechaLeido(),
                fechaObjetivo
        );
    }

    private RepNotificacionDetalladaDTO mapearDetalladaSeguro(RepNotificacionesUsuario origen) {
        try {
            return mapearDetallada(origen);
        } catch (Exception ex) {
            return new RepNotificacionDetalladaDTO(
                    origen.getIdNotificacionUsuario(),
                    origen.getIdUsuario(),
                    origen.getNombreUsuario(),
                    origen.getIdNotificacion(),
                    TIPO_OTRO,
                    List.of(
                            new RepNotificacionDetalladaDTO.CampoDetalleDTO("Asunto", valorOGuion(origen.getAsunto())),
                            new RepNotificacionDetalladaDTO.CampoDetalleDTO("Mensaje", valorOGuion(origen.getMensaje())),
                            new RepNotificacionDetalladaDTO.CampoDetalleDTO("Categoria", valorOGuion(origen.getCategoria()))
                    ),
                    origen.getLeido(),
                    origen.getEliminado(),
                    origen.getFechaCreacion(),
                    origen.getFechaLeido(),
                    origen.getFechaCreacion()
            );
        }
    }

    private String detectarTipo(RepNotificacionesUsuario origen) {
        String categoria = normalizar(nvl(origen.getCategoria()));
        if (categoria.contains("permiso") && categoria.contains("coordin")) return TIPO_PERMISO_COORDINADOR;
        if (categoria.contains("informe")) return TIPO_INFORME;
        if (categoria.contains("acredit") || categoria.contains("licenc") || categoria.contains("certific")) {
            return TIPO_ACREDITACION_LICENCIA;
        }

        String base = normalizar(String.format("%s %s", nvl(origen.getAsunto()), nvl(origen.getMensaje())));
        if (base.contains("permiso") && base.contains("coordin")) return TIPO_PERMISO_COORDINADOR;
        if (base.contains("acredit") || base.contains("licenc") || base.contains("certific")) return TIPO_ACREDITACION_LICENCIA;
        if (base.contains("informe")) return TIPO_INFORME;
        return TIPO_OTRO;
    }

    private String extraerValorPorEtiqueta(String texto, List<String> etiquetas) {
        if (texto == null || texto.isBlank()) return "";

        for (String etiqueta : etiquetas) {
            String pattern = "(?i)" + Pattern.quote(etiqueta) + "\\s*[:\\-]\\s*([^\\n,;|]+)";
            var matcher = Pattern.compile(pattern).matcher(texto);
            if (matcher.find()) {
                return matcher.group(1).trim();
            }
        }

        return "";
    }

    private String extraerPorPatron(String texto, String regex) {
        if (texto == null || texto.isBlank()) return "";
        var matcher = Pattern.compile(regex).matcher(texto);
        if (matcher.find()) {
            String valor = matcher.groupCount() >= 1 ? matcher.group(1) : matcher.group();
            return valor == null ? "" : valor.trim();
        }
        return "";
    }

    private String primerNoVacio(String... valores) {
        for (String v : valores) {
            if (v != null && !v.isBlank()) return v.trim();
        }
        return "";
    }

    private LocalDate parseDateFlexible(String valor) {
        if (valor == null || valor.isBlank()) return null;

        String texto = valor.trim();

        if (texto.matches("\\d{4}-\\d{2}-\\d{2}")) {
            try {
                return LocalDate.parse(texto);
            } catch (Exception ignored) {
                return null;
            }
        }

        if (texto.matches("\\d{2}[/-]\\d{2}[/-]\\d{4}")) {
            String[] partes = texto.split("[/-]");
            try {
                int dia = Integer.parseInt(partes[0]);
                int mes = Integer.parseInt(partes[1]);
                int anio = Integer.parseInt(partes[2]);
                return LocalDate.of(anio, mes, dia);
            } catch (Exception ignored) {
                return null;
            }
        }

        return null;
    }

    private String normalizar(String valor) {
        StringBuilder sb = new StringBuilder();
        for (char c : valor.toLowerCase().toCharArray()) {
            switch (c) {
                case 'á' -> sb.append('a');
                case 'é' -> sb.append('e');
                case 'í' -> sb.append('i');
                case 'ó' -> sb.append('o');
                case 'ú' -> sb.append('u');
                default -> sb.append(c);
            }
        }
        return sb.toString();
    }

    private String valorOGuion(String valor) {
        return (valor == null || valor.isBlank()) ? "-" : valor;
    }

    private String nvl(String valor) {
        return valor == null ? "" : valor;
    }
}
