package be.howest.kevin.mindmap.models;

import javax.persistence.Entity;
import javax.persistence.Id;

// TODO fix update bug: the node is not updated if only the coordinates changed
@Entity
public class Node {
	@Id
	private String id; //actually a GUID
	private String label;
	private float x,y;

	// for Jackson
	private Node() {}

	public Node(String id, float x, float y, String label) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.label = label;
	}

	public String getId() {
		return id;
	}
	
	public String getLabel() {
		return label;
	}
	public float getX() {
		return x;
	}
	public float getY() {
		return y;
	}
	public void setId(String id) {
		this.id = id;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public void setX(float x) {
		this.x = x;
	}
	public void setY(float y) {
		this.y = y;
	}
	
	
}
