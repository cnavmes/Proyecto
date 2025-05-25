package com.lupulo.cerveceria.service;

import com.lupulo.cerveceria.dto.VentaRequest;
import com.lupulo.cerveceria.model.Cerveza;
import com.lupulo.cerveceria.model.Venta;
import com.lupulo.cerveceria.repository.CervezaRepository;
import com.lupulo.cerveceria.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VentaService {

  private final VentaRepository ventaRepository;
  private final CervezaRepository cervezaRepository;

  public VentaService(VentaRepository ventaRepository, CervezaRepository cervezaRepository) {
    this.ventaRepository = ventaRepository;
    this.cervezaRepository = cervezaRepository;
  }

  public void registrarVenta(VentaRequest request) {
    Cerveza cerveza = cervezaRepository.findById(request.getCervezaId())
        .orElseThrow(() -> new RuntimeException("Cerveza no encontrada"));

    if (cerveza.getStock() < request.getCantidad()) {
      throw new RuntimeException("Stock insuficiente para realizar la venta");
    }

    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    cerveza.setStock(cerveza.getStock() - request.getCantidad());
    cervezaRepository.save(cerveza);

    Venta venta = Venta.builder()
        .cerveza(cerveza)
        .cantidad(request.getCantidad())
        .fecha(LocalDateTime.now())
        .usuarioEmail(email)
        .build();

    ventaRepository.save(venta);
  }

  public List<Venta> listarTodas() {
    return ventaRepository.findAll();
  }

  public List<Venta> buscarPorRangoDeFechas(LocalDateTime desde, LocalDateTime hasta) {
    return ventaRepository.findByFechaBetween(desde, hasta);
  }

  public long countVentas() {
    return ventaRepository.count();
  }

  /**
   * Suma el total de ingresos: precio de la cerveza × cantidad vendida.
   */
  public double sumRevenue() {
    return ventaRepository.findAll().stream()
        .mapToDouble(v -> v.getCerveza().getPrecio() * v.getCantidad())
        .sum();
  }

  public Map<String, Double> obtenerVentasPorSemana() {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-'W'ww");

    return listarTodas().stream()
        .filter(v -> v.getFecha() != null)
        .collect(Collectors.groupingBy(
            v -> v.getFecha().toLocalDate().format(formatter),
            Collectors.summingDouble(v -> v.getCerveza().getPrecio() * v.getCantidad())));
  }

  public List<Map<String, Object>> obtenerVentasPorEstilo() {
    return ventaRepository.findAll().stream()
        .collect(Collectors.groupingBy(
            v -> v.getCerveza().getEstilo(),
            Collectors.summingInt(Venta::getCantidad)))
        .entrySet()
        .stream()
        .map(entry -> {
          Map<String, Object> map = new HashMap<>();
          map.put("estilo", entry.getKey());
          map.put("cantidad", entry.getValue());
          return map;
        })
        .toList();
  }
}
