package com.lupulo.cerveceria.util;

import com.lupulo.cerveceria.model.Cerveza;
import com.lupulo.cerveceria.model.MovimientoStock;
import com.lupulo.cerveceria.model.Venta;

import java.util.List;

public class CsvExporter {

  public static String generarCsvCervezas(List<Cerveza> cervezas) {
    StringBuilder sb = new StringBuilder();
    sb.append("ID,Nombre,Estilo,Graduación,País,Precio,Stock,Descripción,Código de Barras\n");

    for (Cerveza c : cervezas) {
      sb.append(c.getId()).append(",");
      sb.append("\"").append(c.getNombre()).append("\",");
      sb.append("\"").append(c.getEstilo()).append("\",");
      sb.append(c.getGraduacion()).append(",");
      sb.append("\"").append(c.getPaisOrigen()).append("\",");
      sb.append(c.getPrecio()).append(",");
      sb.append(c.getStock()).append(",");
      sb.append("\"").append(c.getDescripcion().replace("\"", "'")).append("\",");
      sb.append(c.getCodigoBarras()).append("\n");
    }

    return sb.toString();
  }

  public static String generarCsvVentas(List<Venta> ventas) {
    StringBuilder sb = new StringBuilder();
    sb.append("ID,Cantidad,Fecha,Usuario,Cerveza,Código de Barras\n");

    for (Venta v : ventas) {
      sb.append(v.getId()).append(",");
      sb.append(v.getCantidad()).append(",");
      sb.append(v.getFecha()).append(",");
      sb.append("\"").append(v.getUsuarioEmail()).append("\",");
      sb.append("\"").append(v.getCerveza().getNombre()).append("\",");
      sb.append(v.getCerveza().getCodigoBarras()).append("\n");
    }

    return sb.toString();
  }

  public static String generarCsvMovimientos(List<MovimientoStock> movimientos) {
    StringBuilder sb = new StringBuilder();
    sb.append("ID,Tipo,Cantidad,Fecha,Usuario,Cerveza,Código de Barras\n");

    for (MovimientoStock m : movimientos) {
      sb.append(m.getId()).append(",");
      sb.append(m.getTipo()).append(",");
      sb.append(m.getCantidad()).append(",");
      sb.append(m.getFecha()).append(",");
      sb.append("\"").append(m.getUsuarioEmail()).append("\",");
      sb.append("\"").append(m.getCerveza().getNombre()).append("\",");
      sb.append(m.getCerveza().getCodigoBarras()).append("\n");
    }

    return sb.toString();
  }
}
