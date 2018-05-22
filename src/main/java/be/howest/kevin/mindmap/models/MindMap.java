package be.howest.kevin.mindmap.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class MindMap {
	@Id
	String name;
	
	@OneToMany(cascade = CascadeType.ALL, 
	        orphanRemoval = true)
	List<Node> nodes;
	@OneToMany(cascade = CascadeType.ALL, 
	        orphanRemoval = true)
	List<Edge> edges;
	private String username;
	
	private MindMap() {

		nodes = new ArrayList<>();
		edges = new ArrayList<>();
	}
	
	public MindMap(String name, String username) {
		this();
		this.name = name;
		this.username = username;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Node> getNodes() {
		return nodes;
	}

	public void setNodes(List<Node> nodes) {
		this.nodes = nodes;
	}

	public List<Edge> getEdges() {
		return edges;
	}

	public void setEdges(List<Edge> edges) {
		this.edges = edges;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	
	
}
