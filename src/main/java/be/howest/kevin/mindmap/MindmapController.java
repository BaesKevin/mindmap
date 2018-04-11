package be.howest.kevin.mindmap;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import be.howest.kevin.mindmap.models.Edge;
import be.howest.kevin.mindmap.models.MindMap;
import be.howest.kevin.mindmap.models.Node;

@RestController
public class MindmapController {
	
	@RequestMapping("/mindmap")
	MindMap getMindMap() {
		MindMap mm = new MindMap("Test");
		mm.getNodes().add(new Node("id1", 100, 100, "First node"));
		mm.getNodes().add(new Node("id2", 150, 100, "Second node"));
		mm.getEdges().add(new Edge("edge1", "id1", "id2"));
		
		return mm;
	}
	
	@RequestMapping(value="/mindmap", method=RequestMethod.POST)
	void postMindMap(@RequestBody MindMap map) {
		System.out.println(map.getNodes().get(1).getLabel());
	}
	
}
