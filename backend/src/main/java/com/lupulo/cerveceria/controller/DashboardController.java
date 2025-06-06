package com.lupulo.cerveceria.controller;

import com.lupulo.cerveceria.dto.RevenueDTO;
import com.lupulo.cerveceria.model.Cerveza;
import com.lupulo.cerveceria.model.Usuario;
import com.lupulo.cerveceria.model.Venta;
import com.lupulo.cerveceria.service.CervezaService;
import com.lupulo.cerveceria.service.UsuarioService;
import com.lupulo.cerveceria.service.VentaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

  private final VentaService ventaService;
  private final UsuarioService usuarioService;
  private final CervezaService cervezaService;

  public DashboardController(VentaService ventaService,
      UsuarioService usuarioService,
      CervezaService cervezaService) {
    this.ventaService = ventaService;
    this.usuarioService = usuarioService;
    this.cervezaService = cervezaService;
  }

  /**
   * Estadísticas resumidas
   */
  @GetMapping("/stats")
  public Map<String, Object> stats() {
    long orders = ventaService.countVentas();
    double revenue = ventaService.sumRevenue();
    long lowStock = cervezaService.countLowStock(10);
    long customers = usuarioService.countUsuarios();

    return Map.of(
        "orders", orders,
        "revenue", revenue,
        "lowStock", lowStock,
        "customers", customers);
  }

  /**
   * Listado completo de ventas
   */
  @GetMapping("/orders")
  public List<Venta> getAllOrders() {
    return ventaService.listarTodas();
  }

  /**
   * Detalle de ganancias por cerveza
   */
  @GetMapping("/revenue-details")
  public List<RevenueDTO> getRevenueDetails() {
    return ventaService.listarTodas().stream()
        .map(v -> new RevenueDTO(
            v.getCerveza().getNombre(),
            v.getCantidad() * v.getCerveza().getPrecio()))
        .toList();
  }

  /**
   * Listado de todos los usuarios
   */
  @GetMapping("/users")
  public List<Usuario> getAllUsers() {
    return usuarioService.findAll();
  }

  /**
   * Cervezas con stock por debajo de un umbral
   */
  @GetMapping("/low-stock")
  public List<Cerveza> getLowStock(
      @RequestParam(defaultValue = "10") int threshold) {
    return cervezaService.findLowStock(threshold);
  }

  /** Lista todas las ventas */
  @GetMapping("/orders-list")
  public List<Venta> ordersList() {
    return ventaService.listarTodas();
  }

  /** Lista cervezas con stock < threshold */
  @GetMapping("/low-stock-list")
  public List<Cerveza> lowStockList(@RequestParam int threshold) {
    return cervezaService.getLowStockList(threshold);
  }

  @GetMapping("/weekly-sales")
  public Map<String, Double> getWeeklySales() {
    return ventaService.obtenerVentasPorSemana();
  }

  @GetMapping("/ventas-por-estilo")
  public List<Map<String, Object>> ventasPorEstilo() {
    return ventaService.obtenerVentasPorEstilo();
  }
}
