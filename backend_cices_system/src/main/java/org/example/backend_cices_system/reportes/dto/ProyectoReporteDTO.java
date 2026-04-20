package org.example.backend_cices_system.reportes.dto;

import java.time.LocalDate;
import java.util.List;

public record ProyectoReporteDTO(

        // =====================
        // 📌 DATOS BÁSICOS
        // =====================
        String codigoProyecto,
        String nombreProyecto,
        String descripcionProyecto,
        String objetivoGeneral,
        String lineaInvestigacion,
        String tipoProyecto,
        String estado,
        LocalDate fechaInicio,
        LocalDate fechaFinalizacion,

        // =====================
        // 👥 PERSONAS
        // =====================
        List<InvestigadorReporteDTO> investigadores,
        List<EntidadReporteDTO> entidades,

        // =====================
        // 💰 FINANZAS
        // =====================
        List<PresupuestoReporteDTO> presupuestos,

        // =====================
        // 📊 ESTRUCTURA PROYECTO
        // =====================
        List<ObjetivoReporteDTO> objetivos,

        // =====================
        // 📄 DOCUMENTOS E INFORMES
        // =====================
        List<DocumentoReporteDTO> documentos,
        List<InformeReporteDTO> informes

) {}