package org.example.backend_cices_system.consult.notificacion;

public record NotificacionFiltroDTO(
        String categoria,    // valor del catálogo CATEGORIA_NOTIFICACION
        Boolean leido,       // null = todas, true = leídas, false = no leídas
        String busqueda      // texto libre sobre asunto o mensaje
) {}