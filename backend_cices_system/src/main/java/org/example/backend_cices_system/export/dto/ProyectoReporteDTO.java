package org.example.backend_cices_system.export.dto;

import org.example.backend_cices_system.modules.proyecto.dto.DocumentoDTO;

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
        String detalleProyecto,

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
        List<DocumentoDTO> documentos,
        List<InformeReporteDTO> informes

) {}