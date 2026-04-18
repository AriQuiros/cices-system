package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dao.RepProyectoDocumentoRepository;
import org.example.backend_cices_system.report.view.RepProyectoDocumento;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepProyectoDocumentoService {

    private final RepProyectoDocumentoRepository repo;

    public List<RepProyectoDocumento> obtenerTodos() {
        return repo.findAll();
    }

    public List<RepProyectoDocumento> buscarPorIdProyecto(Integer idProyecto) {
        return repo.findByIdProyecto(idProyecto);
    }

}
