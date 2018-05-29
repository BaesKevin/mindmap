package be.howest.kevin.mindmap.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class MindMap {
//	@Id
//	String name;
	
	@EmbeddedId
	MindmapId id;
	
	@OneToMany(cascade = CascadeType.ALL, 
	        orphanRemoval = true)
	List<Node> nodes;
	@OneToMany(cascade = CascadeType.ALL, 
	        orphanRemoval = true)
	List<Edge> edges;
//	private String username;
	
	private MindMap() {

		nodes = new ArrayList<>();
		edges = new ArrayList<>();
	}
	
	public MindMap(String name, String username) {
		this();
		this.id = new MindmapId(username, name);
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

	public MindmapId getId() {
		return id;
	}

	public void setId(MindmapId id) {
		this.id = id;
	}
	
	
	
}
