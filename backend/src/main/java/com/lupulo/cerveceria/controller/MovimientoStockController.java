package com.lupulo.cerveceria.controller;

import com.lupulo.cerveceria.dto.MovimientoStockRespuestaDTO;

import com.lupulo.cerveceria.service.MovimientoStockService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.lupulo.cerveceria.dto.ReponerStockRequest;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.nio.charset.StandardCharsets;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/movimientos")
@CrossOrigin(origins = "*")
public class MovimientoStockController {

  private final MovimientoStockService service;

  public MovimientoStockController(MovimientoStockService service) {
    this.service = service;
  }

  @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
  @GetMapping("/filtro")
  public MovimientoStockRespuestaDTO filtrar(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "5") int size,
      @RequestParam(required = false) String tipo,
      @RequestParam(required = false) String desde,
      @RequestParam(required = false) String hasta,
      @RequestParam(required = false) String usuarioEmail,
      @RequestParam(required = false) String cervezaNombre) {

    LocalDateTime desdeFecha = (desde != null) ? LocalDate.parse(desde).atStartOfDay() : null;
    LocalDateTime hastaFecha = (hasta != null) ? LocalDate.parse(hasta).atTime(23, 59, 59) : null;

    return service.filtrarMovimientos(tipo, desdeFecha, hastaFecha, usuarioEmail, cervezaNombre, page, size);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/reponer/{cervezaId}")
  public ResponseEntity<String> reponer(@PathVariable Long cervezaId, @RequestBody ReponerStockRequest request) {
    service.reponerStock(cervezaId, request);
    return ResponseEntity.ok("Stock repuesto correctamente");
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/exportar")
  public ResponseEntity<Resource> exportarCSV() {
    String contenido = service.exportarCSV();
    ByteArrayResource resource = new ByteArrayResource(contenido.getBytes(StandardCharsets.UTF_8));

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"movimientos_stock.csv\"")
        .contentType(MediaType.parseMediaType("text/csv"))
        .contentLength(resource.contentLength())
        .body(resource);
  }
}
