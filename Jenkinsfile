pipeline {
  agent any
  tools {
    nodejs 'NodeJS 25.5.0'
  }

  stages {
    stage('Setup') {
      steps {
        sh '''
          # تثبيت libatomic داخل الحاوية
          apt-get update && apt-get install -y libatomic1
          
          # أو إذا كان النظام RedHat-based داخل الحاوية
          # microdnf install -y libatomic
          # أو
          # yum install -y libatomic
        '''
      }
    }

    stage('Build') {
      steps {
        echo 'this is the first job'
        sh '''
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
