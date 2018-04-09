package be.howest.kevin.mindmap;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//@RestController
public class MindmapController {
	
//	@RequestMapping("/")
	String helloBoot() {
		return "Hello Spring boot";
	}
}
