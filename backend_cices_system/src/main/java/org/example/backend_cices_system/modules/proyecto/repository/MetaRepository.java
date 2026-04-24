package org.example.backend_cices_system.modules.proyecto.repository;

import org.example.backend_cices_system.modules.proyecto.model.Meta;
import org.example.backend_cices_system.modules.proyecto.model.ObjetivoEspecifico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MetaRepository extends JpaRepository<Meta, Integer> {
    List<Meta> findMetaByIdObjetivoEspecifico(ObjetivoEspecifico objetivo);
}
