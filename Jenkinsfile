pipeline {
    agent any

    environment {
        IMAGE_NAME = "mohamedadel9988/frontend"
        TAG = "${BUILD_NUMBER}"
    }

    triggers {
        githubPush()   // تشغيل تلقائي عند أي push (لازم webhook)
        // لو معندكش webhook استخدم بدلها:
        // pollSCM('H/1 * * * *')
    }

    stages {
        stage('Login DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'mohamedadel9988',
                    passwordVariable: 'M01064387786m'
                )]) {
                    sh 'echo "M01064387786m" | docker login -u mohamedadel9988 --password-stdin'
                }
            }
        }
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/smellawy/front-end.git'
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

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$TAG -t $IMAGE_NAME:latest .'
            }
        }


        stage('Push Image') {
            steps {
                sh '''
                docker push $IMAGE_NAME:$TAG
                docker push $IMAGE_NAME:latest
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker image prune -f || true'
            }
        }
    }

    post {
        success {
            echo "✅ Frontend Image Built & Pushed: $IMAGE_NAME:$TAG"
        }
        failure {
            echo "❌ Pipeline Failed"
        }
    }
}
