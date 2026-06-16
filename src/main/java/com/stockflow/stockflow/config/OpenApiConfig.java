package com.stockflow.stockflow.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "StockFlow API",
        version = "1.0",
        description = "API de monitoreo de inventario en tiempo real",
        contact = @Contact(name = "StockFlow Inc."),
        license = @License(name = "Alejandro Ibañez")),
    servers = @Server(url = "http://localhost:8080", description = "Servidor de desarrollo")
)
public class OpenApiConfig {
}
