pipeline {
  agent any
  tools {
    nodejs 'NodeJS 25.5.0'
  }
  
  environment {
    LD_LIBRARY_PATH = '/usr/lib64:/usr/lib:${LD_LIBRARY_PATH}'
  }

  stages {
    stage('Build') {
      steps {
        echo 'this is the first job'
        sh '''
          echo "LD_LIBRARY_PATH: $LD_LIBRARY_PATH"
          node --version
          npm install
        '''
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
