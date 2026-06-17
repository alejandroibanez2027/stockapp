package com.stockflow.stockflow.docs;

public interface AlertEndpoint {

    interface FIND_ALL {
        String SUMMARY = "Listar alertas de stock";
        String DESCRIPTION = "Devuelve los productos cuyo stock actual es menor o igual al stock mínimo. Las alertas se calculan dinámicamente.";
    }
}
