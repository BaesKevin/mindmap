package be.howest.kevin.mindmap.repositories;

import org.springframework.data.repository.CrudRepository;

import be.howest.kevin.mindmap.models.MindMap;

//This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
//CRUD refers Create, Read, Update, Delete
public interface MindMapRepository extends CrudRepository<MindMap, String> {

}