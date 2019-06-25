pipeline {
  agent any
 
  tools {nodejs 'node'}

  stages {
    stage('Cloning Git') {
      steps {
        git branch: 'v1.0', url: 'https://github.com/aionnetwork/aion_web3.git'
      }
    }
        
    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }
     
    stage('Test') {
      steps {
         sh 'npm test'
      }
    }      
  } 
}
