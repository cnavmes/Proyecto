package com.lupulo.cerveceria.repository;

import com.lupulo.cerveceria.model.Venta;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VentaRepository extends JpaRepository<Venta, Long> {

  List<Venta> findByFechaBetween(LocalDateTime desde, LocalDateTime hasta);

  boolean existsByCervezaId(Long cervezaId);
}