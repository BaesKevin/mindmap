package be.howest.kevin.mindmap.models;

public class Edge {
	private String id;
	private String to, from;
	
	// for Jackson
	private Edge() {}
	
	public Edge(String id, String to, String from) {
		this.id = id;
		this.to = to;
		this.from = from;
	}
	public String getId() {
		return id;
	}
	private void setId(String id) {
		this.id = id;
	}
	public String getTo() {
		return to;
	}
	private void setTo(String to) {
		this.to = to;
	}
	public String getFrom() {
		return from;
	}
	private void setFrom(String from) {
		this.from = from;
	}
}
