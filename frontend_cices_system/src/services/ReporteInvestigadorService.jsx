import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const sanitizarNombreArchivo = (texto) => {
    return String(texto || "reporte")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .trim()
        .replace(/\s+/g, "_");
};

const formatearFecha = (fecha) => {
    if (!fecha) return "No aplica";

    const parsed = new Date(fecha);
    if (Number.isNaN(parsed.getTime())) return String(fecha);

    return parsed.toLocaleDateString("es-CR");
};

const formatearNumero = (valor) => {
    const numero = Number(valor ?? 0);
    if (!Number.isFinite(numero)) return "0";

    return numero.toLocaleString("es-CR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
};

const descargarBlob = (contenido, tipo, nombreArchivo) => {
    const blob = new Blob([contenido], { type: tipo });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
};

const construirFilasParticipantes = (participantes) => {
    if (!participantes?.length) {
        return [[
            "No disponible",
            "No hay participantes para mostrar.",
            "",
            "",
            "",
            "",
            ""
        ]];
    }

    return participantes.map((p) => ([
        p.documentoIdentidad || "No disponible",
        p.nombreCompleto || "No disponible",
        p.gradoAcademico || "No disponible",
        p.rolProyecto || "No disponible",
        formatearNumero(p.horasAsignadas || 0),
        formatearFecha(p.fechaInicioParticipacion),
        formatearFecha(p.fechaFinParticipacion)
    ]));
};

const construirExcelHtml = ({ proyecto, resumen, participantes }) => {
    const filasParticipantes = (participantes || []).map((p) => `
        <tr>
            <td>${p.documentoIdentidad || "No disponible"}</td>
            <td>${p.nombreCompleto || "No disponible"}</td>
            <td>${p.gradoAcademico || "No disponible"}</td>
            <td>${p.rolProyecto || "No disponible"}</td>
            <td>${formatearNumero(p.horasAsignadas || 0)}</td>
            <td>${formatearFecha(p.fechaInicioParticipacion)}</td>
            <td>${formatearFecha(p.fechaFinParticipacion)}</td>
        </tr>
    `).join("");

    return `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="UTF-8" />
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>Reporte</x:Name>
                                <x:WorksheetOptions>
                                    <x:DisplayGridlines/>
                                </x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
                <style>
                    body { font-family: Arial, sans-serif; }
                    .titulo { font-size: 18pt; font-weight: bold; }
                    .subtitulo { font-size: 12pt; font-weight: bold; margin-top: 12px; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #999; padding: 6px; }
                    th { background: #dbeafe; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="titulo">Reporte de investigadores por proyecto</div>
                <br />

                <div class="subtitulo">Información del proyecto</div>
                <table>
                    <tr><td><b>Nombre del proyecto</b></td><td>${proyecto?.nombreProyecto || "No disponible"}</td></tr>
                    <tr><td><b>Código del proyecto</b></td><td>${proyecto?.codigoProyecto || "No disponible"}</td></tr>
                    <tr><td><b>Fecha inicio</b></td><td>${formatearFecha(proyecto?.fechaInicio)}</td></tr>
                    <tr><td><b>Fecha finalización</b></td><td>${formatearFecha(proyecto?.fechaFinalizacion)}</td></tr>
                </table>

                <br />
                <div class="subtitulo">Resumen</div>
                <table>
                    <tr><td><b>Total investigadores</b></td><td>${resumen?.totalInvestigadores ?? 0}</td></tr>
                    <tr><td><b>Total horas asignadas</b></td><td>${formatearNumero(resumen?.totalHorasAsignadas ?? 0)}</td></tr>
                </table>

                <br />
                <div class="subtitulo">Participantes</div>
                <table>
                    <thead>
                        <tr>
                            <th>Documento</th>
                            <th>Nombre</th>
                            <th>Grado académico</th>
                            <th>Rol en el proyecto</th>
                            <th>Horas asignadas</th>
                            <th>Fecha inicio</th>
                            <th>Fecha fin</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filasParticipantes}
                    </tbody>
                </table>
            </body>
        </html>
    `;
};

const construirWordHtml = ({ proyecto, resumen, participantes }) => {
    const filasParticipantes = (participantes || []).map((p) => `
        <tr>
            <td>${p.documentoIdentidad || "No disponible"}</td>
            <td>${p.nombreCompleto || "No disponible"}</td>
            <td>${p.gradoAcademico || "No disponible"}</td>
            <td>${p.rolProyecto || "No disponible"}</td>
            <td>${formatearNumero(p.horasAsignadas || 0)}</td>
            <td>${formatearFecha(p.fechaInicioParticipacion)}</td>
            <td>${formatearFecha(p.fechaFinParticipacion)}</td>
        </tr>
    `).join("");

    return `
        <html>
            <head>
                <meta charset="UTF-8" />
                <title>Reporte de investigadores por proyecto</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 24px;
                        color: #111827;
                    }
                    h1, h2 {
                        margin-bottom: 12px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 12px;
                    }
                    th, td {
                        border: 1px solid #ccc;
                        padding: 8px;
                        text-align: left;
                        font-size: 12px;
                    }
                    th {
                        background: #f2f2f2;
                    }
                    .bloque {
                        margin-bottom: 24px;
                    }
                </style>
            </head>
            <body>
                <h1>Reporte de investigadores por proyecto</h1>

                <div class="bloque">
                    <h2>Información del proyecto</h2>
                    <p><b>Nombre del proyecto:</b> ${proyecto?.nombreProyecto || "No disponible"}</p>
                    <p><b>Código del proyecto:</b> ${proyecto?.codigoProyecto || "No disponible"}</p>
                    <p><b>Fecha inicio:</b> ${formatearFecha(proyecto?.fechaInicio)}</p>
                    <p><b>Fecha finalización:</b> ${formatearFecha(proyecto?.fechaFinalizacion)}</p>
                </div>

                <div class="bloque">
                    <h2>Resumen</h2>
                    <p><b>Total investigadores:</b> ${resumen?.totalInvestigadores ?? 0}</p>
                    <p><b>Total horas asignadas:</b> ${formatearNumero(resumen?.totalHorasAsignadas ?? 0)}</p>
                </div>

                <div class="bloque">
                    <h2>Participantes</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Documento</th>
                                <th>Nombre</th>
                                <th>Grado académico</th>
                                <th>Rol en el proyecto</th>
                                <th>Horas asignadas</th>
                                <th>Fecha inicio</th>
                                <th>Fecha fin</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filasParticipantes}
                        </tbody>
                    </table>
                </div>
            </body>
        </html>
    `;
};

const generarPdf = ({ proyecto, resumen, participantes, nombreArchivo }) => {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Reporte de investigadores por proyecto", 14, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${new Date().toLocaleString("es-CR")}`, pageWidth - 14, 16, {
        align: "right"
    });

    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.8);
    doc.line(14, 20, pageWidth - 14, 20);

    let currentY = 28;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Información del proyecto", 14, currentY);

    currentY += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const infoProyecto = [
        [`Nombre del proyecto:`, proyecto?.nombreProyecto || "No disponible"],
        [`Código del proyecto:`, proyecto?.codigoProyecto || "No disponible"],
        [`Fecha inicio:`, formatearFecha(proyecto?.fechaInicio)],
        [`Fecha finalización:`, formatearFecha(proyecto?.fechaFinalizacion)]
    ];

    autoTable(doc, {
        startY: currentY,
        body: infoProyecto,
        theme: "grid",
        styles: {
            fontSize: 10,
            cellPadding: 3
        },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 45 },
            1: { cellWidth: 120 }
        },
        margin: { left: 14, right: 14 }
    });

    currentY = doc.lastAutoTable.finalY + 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Resumen", 14, currentY);

    currentY += 6;

    const rolesTexto = (resumen?.totalesPorRol || []).length
        ? resumen.totalesPorRol.map((r) => `${r.rol}: ${r.total}`).join(" | ")
        : "No hay desglose por rol";

    autoTable(doc, {
        startY: currentY,
        body: [
            ["Total investigadores", String(resumen?.totalInvestigadores ?? 0)],
            ["Total horas asignadas", formatearNumero(resumen?.totalHorasAsignadas ?? 0)],
            ["Totales por rol", rolesTexto]
        ],
        theme: "grid",
        styles: {
            fontSize: 10,
            cellPadding: 3
        },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 45 },
            1: { cellWidth: 200 }
        },
        margin: { left: 14, right: 14 }
    });

    currentY = doc.lastAutoTable.finalY + 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Participantes del proyecto", 14, currentY);

    currentY += 4;

    autoTable(doc, {
        startY: currentY,
        head: [[
            "Documento",
            "Nombre",
            "Grado académico",
            "Rol en el proyecto",
            "Horas asignadas",
            "Fecha inicio",
            "Fecha fin"
        ]],
        body: construirFilasParticipantes(participantes),
        theme: "striped",
        headStyles: {
            fillColor: [219, 234, 254],
            textColor: [17, 24, 39],
            fontStyle: "bold",
            halign: "left"
        },
        styles: {
            fontSize: 9,
            cellPadding: 2.5,
            overflow: "linebreak",
            valign: "top"
        },
        columnStyles: {
            0: { cellWidth: 28 },
            1: { cellWidth: 52 },
            2: { cellWidth: 38 },
            3: { cellWidth: 38 },
            4: { cellWidth: 26, halign: "right" },
            5: { cellWidth: 26 },
            6: { cellWidth: 26 }
        },
        margin: { left: 14, right: 14 }
    });

    doc.save(`${nombreArchivo}.pdf`);
};

export const descargarReporteInvestigadoresProyecto = async ({
                                                                 formato,
                                                                 proyecto,
                                                                 resumen,
                                                                 participantes
                                                             }) => {
    const codigo = proyecto?.codigoProyecto || "SIN_CODIGO";
    const nombre = proyecto?.nombreProyecto || "SIN_NOMBRE";
    const baseNombre = `Reporte_Participantes_${sanitizarNombreArchivo(nombre)}_${sanitizarNombreArchivo(codigo)}`;

    if (formato === "excel") {
        const excelHtml = construirExcelHtml({ proyecto, resumen, participantes });
        descargarBlob(
            "\uFEFF" + excelHtml,
            "application/vnd.ms-excel;charset=utf-8;",
            `${baseNombre}.xls`
        );
        return;
    }

    if (formato === "word") {
        const wordHtml = construirWordHtml({ proyecto, resumen, participantes });
        descargarBlob(
            "\uFEFF" + wordHtml,
            "application/msword;charset=utf-8;",
            `${baseNombre}.doc`
        );
        return;
    }

    if (formato === "pdf") {
        generarPdf({
            proyecto,
            resumen,
            participantes,
            nombreArchivo: baseNombre
        });
        return;
    }

    throw new Error("Formato no soportado");
};