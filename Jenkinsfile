pipeline {
  agent {
    docker {
      image 'node:25.5.0-bullseye'  # أو صورة تحتوي على libatomic
      args '--privileged'
    }
  }
  
  stages {
    stage('Setup') {
      steps {
        sh '''
          # تثبيت المكتبات المطلوبة
          apt-get update && apt-get install -y libatomic1
          node --version
        '''
      }
    }

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
