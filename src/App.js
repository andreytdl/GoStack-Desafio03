import React, { useState, useEffect } from "react";

import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {

  const [repositories, setRepositories] = useState([]);

  //Listagem de repositórios
  useEffect(() => {
    async function getFromApi(){
      //Buscando os repositórios da api
      await api.get("/repositories").then(response => {
        
        //guardando no estado para ser exibido na tela
        setRepositories(response.data);
  
      });

    }
    getFromApi();
    
  }, []);

  // Implement "Like Repository" functionality
  async function handleLikeRepository(id) {
    await api.post(`/repositories/${id}/like`).then(response => {
      //Encontrando o index do repositório em questão
      const newRepositories = repositories;
      const repositoryIndex = repositories.findIndex(repository => repository.id === id);

      newRepositories[repositoryIndex].likes = response.data.likes;
      setRepositories([...newRepositories]); 


    });
    
  }


  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList 
        data={repositories}
        keyExtractor={repository => repository.id}
        renderItem={( { item: repository } ) => (
          <>
            <View style={styles.repositoryContainer}>
              {/* Título */}
              <Text style={styles.repository}>{repository.title}</Text>

              {/* Tecnologias */}
              <View style={styles.techsContainer}>
              {repository.techs[0].trim().split(',').map(tech => (
              <Text key={tech} style={styles.tech}>
                {tech}
              </Text>
              ))}
              </View>
            <View style={styles.likesContainer}>
              <Text
                style={styles.likeText}
                // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                testID={`repository-likes-${repository.id}`}
              >
                {console.log(repository.likes)}
              {repository.likes < 2 ? `${repository.likes} curtida` : `${repository.likes} curtidas`}
              </Text>
            </View>
          <TouchableOpacity
          style={styles.button}
          onPress={() => handleLikeRepository(repository.id)}
          // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
          testID={`like-button-${repository.id}`}
          >
            <Text style={styles.buttonText}>Curtir</Text>
          </TouchableOpacity>
        </View>
          </>
        )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
