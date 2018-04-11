package be.howest.kevin.mindmap.models;

import java.util.ArrayList;
import java.util.List;

public class MindMap {
	String name;
	List<Node> nodes;
	List<Edge> edges;
	
	private MindMap() {}
	
	public MindMap(String name) {
		this.name = name;
		nodes = new ArrayList<>();
		edges = new ArrayList<>();
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
	
	
}
