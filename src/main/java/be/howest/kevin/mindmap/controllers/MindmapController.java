package be.howest.kevin.mindmap.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import be.howest.kevin.mindmap.models.MindMap;
import be.howest.kevin.mindmap.repositories.MindMapRepository;

@RestController
public class MindmapController {
	@Autowired
	private MindMapRepository mmRepo;
	
	
	@RequestMapping("/mindmap/{id}")
	MindMap getMindMap(@PathVariable String id) {
		// TODO validation
		Optional<MindMap> fromDb = mmRepo.findById(id);
		
		if(fromDb.isPresent()) {
			return fromDb.get();
		}
		
		return null;
	}
	
	@RequestMapping(value="/mindmap", method=RequestMethod.POST)
	void postMindMap(@RequestBody MindMap map) {
		try {
			// TODO validation
			mmRepo.save(map);
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		
		
	}
	
}
