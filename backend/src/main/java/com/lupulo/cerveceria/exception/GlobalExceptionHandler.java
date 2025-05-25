package com.lupulo.cerveceria.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
    Map<String, String> errores = new HashMap<>();

    ex.getBindingResult().getFieldErrors().forEach(error -> {
      String campo = error.getField();
      String mensaje = error.getDefaultMessage();
      errores.put(campo, mensaje);
    });

    return new ResponseEntity<>(errores, HttpStatus.BAD_REQUEST);
  }
}
