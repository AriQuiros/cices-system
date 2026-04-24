package org.example.backend_cices_system.consult.notificacion;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class RepNotificacionesUsuarioService {

    private static final String TIPO_INFORME = "Informe";
    private static final String TIPO_ACREDITACION_LICENCIA = "Certificacion";
    private static final String TIPO_PERMISO_COORDINADOR = "Permiso coordinador";
    private static final String TIPO_OTRO = "Otro";

    private final RepNotificacionesUsuarioRepository repo;

    public List<RepNotificacionesUsuario> buscarPorIdUsuario(Integer idUsuario) {
        return repo.findByIdUsuario(idUsuario);
    }

    public List<RepNotificacionDetalladaDTO> buscarDetalladasPorNombreUsuario(Integer idUsuario) {
        return buscarPorIdUsuario(idUsuario)
                .stream()
                .map(this::mapearDetalladaSeguro)
                .toList();
    }

    public List<RepNotificacionesUsuario> buscarPorAsunto(String asunto) {
        return repo.findByAsuntoContainingIgnoreCase(asunto);
    }

    private RepNotificacionDetalladaDTO mapearDetallada(RepNotificacionesUsuario origen) {
        String tipo = detectarTipo(origen);
        String texto = String.format("%s | %s", nvl(origen.getAsunto()), nvl(origen.getMensaje()));

        List<RepNotificacionDetalladaDTO.CampoDetalleDTO> detalle;
        LocalDate fechaObjetivo = null;

        switch (tipo) {
            case TIPO_INFORME -> {
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
            }
            case TIPO_ACREDITACION_LICENCIA -> {
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
            }
            case TIPO_PERMISO_COORDINADOR -> {
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
            }
            case null, default -> {
                detalle = List.of(
                        new RepNotificacionDetalladaDTO.CampoDetalleDTO("Asunto", valorOGuion(origen.getAsunto())),
                        new RepNotificacionDetalladaDTO.CampoDetalleDTO("Mensaje", valorOGuion(origen.getMensaje())),
                        new RepNotificacionDetalladaDTO.CampoDetalleDTO("Categoria", valorOGuion(origen.getCategoria()))
                );
                fechaObjetivo = origen.getFechaCreacion();
            }
        }

        return new RepNotificacionDetalladaDTO(
                origen.getIdNotificacionUsuario(),
                origen.getIdUsuario(),
                origen.getNombreUsuario(),
                origen.getIdNotificacion(),
                tipo,
                detalle,
                origen.getLeido(),
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
