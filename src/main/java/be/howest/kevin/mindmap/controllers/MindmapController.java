package be.howest.kevin.mindmap.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
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
	
	@CrossOrigin
	@RequestMapping("/mindmap/names")
	List<String> getMindMapNames() {
		Iterable<MindMap> fromDb = mmRepo.findAll();
		List<String> names = new ArrayList<>();
		
		for(MindMap m : fromDb) {
			names.add(m.getName());
		}
		
		return names;
	}
	
	@CrossOrigin
	@RequestMapping("/mindmap/{id}")
	MindMap getMindMap(@PathVariable String id) {
		// TODO validation
		Optional<MindMap> fromDb = mmRepo.findById(id);
		
		if(fromDb.isPresent()) {
			return fromDb.get();
		}
		
		return null;
	}
	
	@CrossOrigin
	@RequestMapping(value="/savemindmap", method=RequestMethod.POST)
	void saveMindMap(@RequestBody MindMap map) {
		try {
			Optional<MindMap> existing = mmRepo.findById(map.getName());
			
			if(map != null) {
				mmRepo.save(map);
			}
			// TODO validation
			
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
	
	@CrossOrigin
	@RequestMapping(value="/createmindmap", method=RequestMethod.POST)
	void createMindMap(String mindmap_name, HttpServletResponse response) {
		try {
			if(mindmap_name != null && !mindmap_name.trim().equals("") && mindmap_name.length() < 100) {
				MindMap newMap = new MindMap(mindmap_name);
				mmRepo.save(newMap);
				
				response.sendRedirect("/mindmap.html?name=" + newMap.getName());
			} else {
				response.sendRedirect("/index.html?error=Please use a valid name under 100 characters");
			}
			
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
}
