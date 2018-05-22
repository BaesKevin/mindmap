package be.howest.kevin.mindmap.controllers;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

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
	
	@RequestMapping("/mindmap/names")
	List<String> getMindMapNames(Principal principal) {
		Iterable<MindMap> fromDb = mmRepo.findAll();
		List<String> names = new ArrayList<>();
		System.out.println(principal.getName());
		for(MindMap m : fromDb) {
			if(m.getUsername().equals(principal.getName())) {
				names.add(m.getName());
			}
			
		}
		
		return names;
	}
	
	@RequestMapping("/mindmap/{id}")
	MindMap getMindMap(@PathVariable String id, Principal principal) {
		// TODO validation
		Optional<MindMap> fromDb = mmRepo.findById(id);
		
		if(fromDb.isPresent()) {
			MindMap mm = fromDb.get();
			
			if(mm.getUsername().equals(principal.getName())) {
				return fromDb.get();
			}
		}
		
		return null;
	}
	
	@RequestMapping(value="/savemindmap", method=RequestMethod.POST)
	void saveMindMap(@RequestBody MindMap map, Principal principal) {
		try {
			Optional<MindMap> existing = mmRepo.findById(map.getName());
			
			// make sure the user is updating one of his own maps
			if(map != null && existing.isPresent() && existing.get().getUsername().equals(principal.getName())) {
				map.setUsername(principal.getName());
				mmRepo.save(map);
			}
			// TODO validation
			
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
	
	@RequestMapping(value="/createmindmap", method=RequestMethod.POST)
	void createMindMap(String mindmap_name, HttpServletResponse response, Principal principal) {
		String username = principal.getName();
		System.out.println("username: " + username);
		
		try {
			if(mindmap_name != null && !mindmap_name.trim().equals("") && mindmap_name.length() < 100) {
				MindMap newMap = new MindMap(mindmap_name, username);
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
