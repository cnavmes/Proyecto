package com.lupulo.cerveceria.repository;

import com.lupulo.cerveceria.model.MovimientoStock;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;

public interface MovimientoStockRepository extends JpaRepository<MovimientoStock, Long> {

  Page<MovimientoStock> findByTipoIgnoreCase(String tipo, Pageable pageable);

  Page<MovimientoStock> findByFechaBetween(LocalDateTime desde, LocalDateTime hasta, Pageable pageable);

  Page<MovimientoStock> findByUsuarioEmailIgnoreCase(String email, Pageable pageable);

  Page<MovimientoStock> findByTipoIgnoreCaseAndFechaBetween(String tipo, LocalDateTime desde, LocalDateTime hasta,
      Pageable pageable);

  Page<MovimientoStock> findByTipoIgnoreCaseAndUsuarioEmailIgnoreCase(String tipo, String email, Pageable pageable);

  Page<MovimientoStock> findByFechaBetweenAndUsuarioEmailIgnoreCase(LocalDateTime desde, LocalDateTime hasta,
      String email, Pageable pageable);

  Page<MovimientoStock> findByTipoIgnoreCaseAndFechaBetweenAndUsuarioEmailIgnoreCase(String tipo, LocalDateTime desde,
      LocalDateTime hasta, String email, Pageable pageable);

  // Filtro solo por nombre de cerveza
  @Query("SELECT m FROM MovimientoStock m WHERE LOWER(m.cerveza.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
  Page<MovimientoStock> buscarPorNombreCerveza(@Param("nombre") String nombre, Pageable pageable);

  // Filtro combinado por nombre de cerveza y tipo
  @Query("""
        SELECT m FROM MovimientoStock m
        WHERE LOWER(m.cerveza.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))
        AND (:tipo IS NULL OR LOWER(m.tipo) = LOWER(:tipo))
      """)
  Page<MovimientoStock> buscarPorNombreYTipo(@Param("nombre") String nombre, @Param("tipo") String tipo,
      Pageable pageable);
}
