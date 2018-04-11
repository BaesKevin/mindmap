package be.howest.kevin.mindmap.models;

public class Node {
	private String id; //actually a GUID
	private float x,y;
	private String label;

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
	public void setId(String id) {
		this.id = id;
	}
	public float getX() {
		return x;
	}
	public void setX(float x) {
		this.x = x;
	}
	public float getY() {
		return y;
	}
	public void setY(float y) {
		this.y = y;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	
	
}
