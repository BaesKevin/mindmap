package be.howest.kevin.mindmap.models;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
public class Edge {
	
	@Id
	private String id;
	@JsonProperty("to")
	private String toNode;
	@JsonProperty("from")
	private String fromNode;
	
	// for Jackson
	private Edge() {}

	public Edge(String id, String to, String from) {
		this.id = id;
		this.toNode = to;
		this.fromNode = from;
	}

	public String getFrom() {
		return fromNode;
	}
	
	public String getId() {
		return id;
	}
	public String getTo() {
		return toNode;
	}
	private void setFrom(String from) {
		this.fromNode = from;
	}
	private void setId(String id) {
		this.id = id;
	}
	private void setTo(String to) {
		this.toNode = to;
	}
}
