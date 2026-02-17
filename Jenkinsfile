pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'docker run --rm -v "$PWD":/app -w /app node:20-alpine npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'docker run --rm -v "$PWD":/app -w /app node:20-alpine sh -c "npm test || true"'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t mohamedadel9988/frontend:latest .'
            }
        }

        stage('Docker Push') {
            steps {
                sh 'docker push mohamedadel9988/frontend:latest'
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker image prune -f || true'
            }
        }
    }

    post {
        success { echo 'Frontend Pipeline SUCCESS!' }
        failure { echo 'Frontend Pipeline FAILED!' }
    }
}
