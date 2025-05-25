package com.lupulo.cerveceria.service;

import com.lupulo.cerveceria.dto.*;
import com.lupulo.cerveceria.model.MovimientoStock;
import com.lupulo.cerveceria.model.Cerveza;
import com.lupulo.cerveceria.repository.CervezaRepository;
import com.lupulo.cerveceria.repository.MovimientoStockRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovimientoStockService {

  private final MovimientoStockRepository movimientoRepository;
  private final CervezaRepository cervezaRepository;

  public MovimientoStockService(CervezaRepository cervezaRepository, MovimientoStockRepository movimientoRepository) {
    this.cervezaRepository = cervezaRepository;
    this.movimientoRepository = movimientoRepository;
  }

  public MovimientoStockRespuestaDTO filtrarMovimientos(String tipo, LocalDateTime desde, LocalDateTime hasta,
      String email, String cervezaNombre, int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("fecha").descending());
    Page<MovimientoStock> pagina;

    if (cervezaNombre != null) {
      pagina = movimientoRepository.buscarPorNombreYTipo(cervezaNombre, tipo, pageable);
    } else if (tipo != null && desde != null && hasta != null && email != null) {
      pagina = movimientoRepository.findByTipoIgnoreCaseAndFechaBetweenAndUsuarioEmailIgnoreCase(tipo, desde, hasta,
          email, pageable);
    } else if (tipo != null && email != null) {
      pagina = movimientoRepository.findByTipoIgnoreCaseAndUsuarioEmailIgnoreCase(tipo, email, pageable);
    } else if (tipo != null && desde != null && hasta != null) {
      pagina = movimientoRepository.findByTipoIgnoreCaseAndFechaBetween(tipo, desde, hasta, pageable);
    } else if (desde != null && hasta != null && email != null) {
      pagina = movimientoRepository.findByFechaBetweenAndUsuarioEmailIgnoreCase(desde, hasta, email, pageable);
    } else if (tipo != null) {
      pagina = movimientoRepository.findByTipoIgnoreCase(tipo, pageable);
    } else if (desde != null && hasta != null) {
      pagina = movimientoRepository.findByFechaBetween(desde, hasta, pageable);
    } else if (email != null) {
      pagina = movimientoRepository.findByUsuarioEmailIgnoreCase(email, pageable);
    } else {
      pagina = movimientoRepository.findAll(pageable);
    }

    List<MovimientoStockDTO> movimientos = pagina.getContent().stream().map(m -> MovimientoStockDTO.builder()
        .nombreCerveza(m.getCerveza().getNombre())
        .cantidad(m.getCantidad())
        .tipo(m.getTipo())
        .fecha(m.getFecha())
        .usuarioEmail(m.getUsuarioEmail())
        .build()).toList();

    return new MovimientoStockRespuestaDTO(
        movimientos,
        pagina.getNumber(),
        pagina.getTotalPages(),
        pagina.getTotalElements());
  }

  public List<MovimientoStock> listarTodos() {
    return movimientoRepository.findAll();
  }

  public void reponerStock(Long cervezaId, ReponerStockRequest request) {
    Cerveza cerveza = cervezaRepository.findById(cervezaId)
        .orElseThrow(() -> new RuntimeException("Cerveza no encontrada"));

    cerveza.setStock(cerveza.getStock() + request.getCantidad());
    cervezaRepository.save(cerveza);

    String email = SecurityContextHolder.getContext().getAuthentication().getName();

    MovimientoStock movimiento = MovimientoStock.builder()
        .cerveza(cerveza)
        .cantidad(request.getCantidad())
        .tipo("REPOSICION")
        .fecha(LocalDateTime.now())
        .usuarioEmail(email)
        .build();

    movimientoRepository.save(movimiento);
  }

  public String exportarCSV() {
    List<MovimientoStock> movimientos = movimientoRepository.findAll();

    String encabezado = "ID,Cerveza,Cantidad,Tipo,Fecha,Usuario\n";

    String cuerpo = movimientos.stream()
        .map(m -> String.format("%d,\"%s\",%d,%s,%s,%s",
            m.getId(),
            m.getCerveza().getNombre(),
            m.getCantidad(),
            m.getTipo(),
            m.getFecha(),
            m.getUsuarioEmail()))
        .collect(Collectors.joining("\n"));

    return encabezado + cuerpo;
  }
}