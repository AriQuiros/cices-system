package org.example.backend_cices_system.repository.entity;

import org.example.backend_cices_system.model.entity.Meta;
import org.example.backend_cices_system.model.entity.ObjetivoEspecifico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MetaRepository extends JpaRepository<Meta, Integer> {
    List<Meta> findMetaByIdObjetivoEspecifico(ObjetivoEspecifico objetivo);
}
