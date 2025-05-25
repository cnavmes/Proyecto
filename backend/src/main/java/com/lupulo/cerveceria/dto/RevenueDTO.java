package com.lupulo.cerveceria.dto;

public class RevenueDTO {
  private String nombreCerveza;
  private double importe;

  public RevenueDTO(String nombreCerveza, double importe) {
    this.nombreCerveza = nombreCerveza;
    this.importe = importe;
  }

  public String getNombreCerveza() {
    return nombreCerveza;
  }

  public double getImporte() {
    return importe;
  }
}