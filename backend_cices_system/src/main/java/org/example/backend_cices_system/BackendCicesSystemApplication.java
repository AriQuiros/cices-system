package org.example.backend_cices_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.time.Clock;
import java.time.ZoneId;

@SpringBootApplication
@EnableScheduling
@EnableCaching
public class
BackendCicesSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendCicesSystemApplication.class, args);
	}

	@Bean
	public Clock clock() {
		return Clock.system(ZoneId.of("America/Costa_Rica"));
	}
}
