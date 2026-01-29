pipeline {
  agent any
      tools {
        nodejs 'NodeJS 25.5.0'
    }

  stages {
    stage('Build') {
      steps {
        echo 'this is the first job'
        sh 'npm install'
      }
    }

    stage('Test') {
      steps {
        echo 'this is the second job'
        sh 'npm test'
      }
    }

    stage('Package') {
      steps {
        echo 'this is the third job'
        sh 'npm run package'
      }
    }

  }
  post {
    always {
      echo 'this pipeline has completed...'
    }

  }
}
