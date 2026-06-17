package com.stockflow.stockflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class StockflowApplication {

	public static void main(String[] args) {
		SpringApplication.run(StockflowApplication.class, args);
	}

}
