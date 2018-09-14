pipeline {
  agent any
 
  tools {nodejs 'node'}

  stages {
    stage('Cloning Git') {
      steps {
        git 'https://github.com/aionnetwork/aion_web3.git#1.0_v2'
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
