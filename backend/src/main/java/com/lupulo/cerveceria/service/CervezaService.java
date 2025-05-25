package com.lupulo.cerveceria.service;

import com.lupulo.cerveceria.model.Cerveza;
import com.lupulo.cerveceria.repository.CervezaRepository;
import com.lupulo.cerveceria.repository.VentaRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.*;

@Service
public class CervezaService {
  public long countLowStock(int threshold) {
    return repository.countByStockLessThan(threshold);
  }

  private final CervezaRepository repository;
  private final VentaRepository ventaRepository;

  public CervezaService(CervezaRepository repository, VentaRepository ventaRepository) {
    this.repository = repository;
    this.ventaRepository = ventaRepository;
  }

  public List<Cerveza> findLowStock(int threshold) {
    return repository.findAll().stream()
        .filter(c -> c.getStock() < threshold)
        .toList();
  }

  public List<Cerveza> listarTodas() {
    return repository.findAll();
  }

  public Optional<Cerveza> buscarPorId(Long id) {
    return repository.findById(id);
  }

  public Cerveza guardar(Cerveza cerveza) {
    return repository.save(cerveza);
  }

  public void eliminar(Long id) {
    if (ventaRepository.existsByCervezaId(id)) {
      throw new IllegalStateException("No se puede eliminar la cerveza porque está asociada a una o más ventas.");
    }
    repository.deleteById(id);
  }

  public List<Cerveza> buscarPorEstilo(String estilo) {
    return repository.findByEstiloIgnoreCase(estilo);
  }

  public List<Cerveza> buscarPorNombre(String nombre) {
    return repository.findByNombreContainingIgnoreCase(nombre);
  }

  public List<Cerveza> listarOrdenadas(String orden, String direccion) {
    Sort sort = direccion.equalsIgnoreCase("desc") ? Sort.by(orden).descending() : Sort.by(orden).ascending();

    return repository.findAll(sort);
  }

  public Page<Cerveza> buscarConFiltros(
      int page, int size, String orden, String direccion,
      String estilo, String nombre,
      String paisOrigen,
      Double precioMin, Double precioMax,
      Double graduacionMin, Double graduacionMax) {

    Sort sort = direccion.equalsIgnoreCase("desc") ? Sort.by(orden).descending() : Sort.by(orden).ascending();
    Pageable pageable = PageRequest.of(page, size, sort);

    List<Cerveza> todas = repository.findAll();

    List<Cerveza> filtradas = todas.stream()
        .filter(c -> estilo == null || c.getEstilo().equalsIgnoreCase(estilo))
        .filter(c -> nombre == null || c.getNombre().toLowerCase().contains(nombre.toLowerCase()))
        .filter(c -> paisOrigen == null || c.getPaisOrigen().equalsIgnoreCase(paisOrigen))
        .filter(c -> precioMin == null || c.getPrecio() >= precioMin)
        .filter(c -> precioMax == null || c.getPrecio() <= precioMax)
        .filter(c -> graduacionMin == null || c.getGraduacion() >= graduacionMin)
        .filter(c -> graduacionMax == null || c.getGraduacion() <= graduacionMax)
        .toList();

    int start = (int) pageable.getOffset();
    int end = Math.min(start + pageable.getPageSize(), filtradas.size());

    List<Cerveza> pageContent = start <= end ? filtradas.subList(start, end) : List.of();

    return new PageImpl<>(pageContent, pageable, filtradas.size());
  }

  public String exportarCSV() {
    List<Cerveza> cervezas = repository.findAll();

    String encabezados = "ID,Nombre,Estilo,Graduación,País de Origen,Precio,Stock,Descripción,Imagen URL,Código de Barras";
    String cuerpo = cervezas.stream()
        .map(c -> String.format("%d,\"%s\",\"%s\",%.2f,\"%s\",%.2f,%d,\"%s\",\"%s\",\"%s\"",
            c.getId(), c.getNombre(), c.getEstilo(), c.getGraduacion(), c.getPaisOrigen(),
            c.getPrecio(), c.getStock(), c.getDescripcion().replace("\"", "'"),
            c.getImagenUrl(), c.getCodigoBarras()))
        .collect(Collectors.joining("\n"));

    return encabezados + "\n" + cuerpo;
  }

  public Optional<Cerveza> buscarPorCodigoBarras(String codigoBarras) {
    return repository.findByCodigoBarras(codigoBarras);
  }

  public List<Cerveza> getLowStockList(int threshold) {
    return repository.findByStockLessThan(threshold);
  }
}