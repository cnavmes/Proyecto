package com.lupulo.cerveceria.repository;

import com.lupulo.cerveceria.model.Cerveza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface CervezaRepository extends JpaRepository<Cerveza, Long> {

  // Versión con paginación
  Page<Cerveza> findByEstiloIgnoreCase(String estilo, Pageable pageable);

  Page<Cerveza> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);

  // Versión sin paginación
  List<Cerveza> findByEstiloIgnoreCase(String estilo);

  List<Cerveza> findByNombreContainingIgnoreCase(String nombre);

  Optional<Cerveza> findByCodigoBarras(String codigoBarras);

  long countByStockLessThan(int threshold);

  List<Cerveza> findByStockLessThan(int threshold);

  List<Cerveza> findByNombreContainingIgnoreCaseOrCodigoBarrasContaining(String nombre, String codigo);
}