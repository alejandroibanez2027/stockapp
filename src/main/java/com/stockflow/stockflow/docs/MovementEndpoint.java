package com.stockflow.stockflow.docs;

public interface MovementEndpoint {

    interface SAVE {
        String SUMMARY = "Registrar movimiento";
        String DESCRIPTION = "Registra un movimiento de entrada o salida y actualiza el stock del producto automáticamente.";
    }

    interface FIND_BY_PRODUCT {
        String SUMMARY = "Historial de movimientos";
        String DESCRIPTION = "Devuelve todos los movimientos asociados a un producto.";
    }
}
