package com.lupulo.cerveceria.dto;

import com.lupulo.cerveceria.model.Cerveza;
import java.util.List;

public class CervezaRespuestaDTO {
  private List<Cerveza> cervezas;
  private int pagina;
  private int totalPaginas;
  private long totalElementos;

  public CervezaRespuestaDTO(List<Cerveza> cervezas, int pagina, int totalPaginas, long totalElementos) {
    this.cervezas = cervezas;
    this.pagina = pagina;
    this.totalPaginas = totalPaginas;
    this.totalElementos = totalElementos;
  }

  public List<Cerveza> getCervezas() {
    return cervezas;
  }

  public int getPagina() {
    return pagina;
  }

  public int getTotalPaginas() {
    return totalPaginas;
  }

  public long getTotalElementos() {
    return totalElementos;
  }
}
