package com.stockflow.stockflow.docs;

public interface ProductEndpoint {

    interface FIND_ALL {
        String SUMMARY = "Listar productos";
        String DESCRIPTION = "Devuelve todos los productos con paginación y filtro opcional por categoría.";
    }

    interface FIND_BY_ID {
        String SUMMARY = "Obtener producto por ID";
        String DESCRIPTION = "Busca un producto por su identificador único. Lanza 404 si no existe.";
    }

    interface SAVE {
        String SUMMARY = "Crear producto";
        String DESCRIPTION = "Registra un nuevo producto con los datos proporcionados.";
    }
}
