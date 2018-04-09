package be.howest.kevin.mindmap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableAutoConfiguration
public class MindmapApplication {

	public static void main(String[] args) {
		SpringApplication.run(MindmapApplication.class, args);
	}
}
