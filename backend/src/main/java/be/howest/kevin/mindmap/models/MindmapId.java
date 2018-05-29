package be.howest.kevin.mindmap.models;

import java.io.Serializable;

import javax.persistence.Embeddable;

@Embeddable
public class MindmapId implements Serializable{
	private static final long serialVersionUID = 1L;
	private String username;
	private String name;
	
	public MindmapId() {}
	
	public MindmapId(String username, String name) {
		this.username = username;
		this.name = name;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	
}
