package com.lupulo.cerveceria.service;

import com.lupulo.cerveceria.model.Venta;
import org.springframework.stereotype.Service;

import java.io.PrintWriter;
import java.util.List;

@Service
public class CsvExportService {

  public void exportVentasToCsv(List<Venta> ventas, PrintWriter writer) {
    writer.println("ID,Cerveza,Cantidad,Fecha,Email");

    for (Venta venta : ventas) {
      writer.printf("%d,%s,%d,%s,%s%n",
          venta.getId(),
          venta.getCerveza().getNombre(),
          venta.getCantidad(),
          venta.getFecha(),
          venta.getUsuarioEmail());
    }
  }
}