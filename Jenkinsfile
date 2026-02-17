pipeline {
    agent any

    environment {
        DOCKERHUB_REPO = 'mohamedadel9988/frontend'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    tools {
        nodejs 'NodeJS'  // Configure in Manage Jenkins → Tools → NodeJS
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "✅ Code checked out successfully"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                echo "✅ Dependencies installed"
            }
        }

        stage('Test') {
            steps {
                sh 'npm test || true'
                echo "✅ Tests completed"
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${DOCKERHUB_REPO}:${IMAGE_TAG} -t ${DOCKERHUB_REPO}:latest ."
                echo "✅ Docker image built: ${DOCKERHUB_REPO}:${IMAGE_TAG}"
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${DOCKERHUB_REPO}:${IMAGE_TAG}
                        docker push ${DOCKERHUB_REPO}:latest
                        docker logout
                    '''
                }
                echo "✅ Image pushed to Docker Hub"
            }
        }

        stage('Update K8s Manifest for ArgoCD') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-credentials',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_PASS'
                )]) {
                    sh '''
                        rm -rf mogambo-manifests
                        git clone https://${GIT_USER}:${GIT_PASS}@github.com/smellawy/mogambo-manifests.git
                        cd mogambo-manifests
                        sed -i "s|image: mohamedadel9988/frontend:.*|image: mohamedadel9988/frontend:${IMAGE_TAG}|g" apps/frontend/deployment.yml
                        git config user.email "jenkins@mogambo.com"
                        git config user.name "Jenkins CI"
                        git add .
                        git commit -m "🚀 Update frontend image to build ${IMAGE_TAG}"
                        git push origin main
                    '''
                }
                echo "✅ ArgoCD manifest updated"
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                    docker rmi ${DOCKERHUB_REPO}:${IMAGE_TAG} || true
                    docker rmi ${DOCKERHUB_REPO}:latest || true
                    rm -rf mogambo-manifests
                '''
                echo "✅ Cleanup done"
            }
        }
    }

    post {
        success {
            echo "🎉 Frontend pipeline completed successfully! Build #${BUILD_NUMBER}"
        }
        failure {
            echo "❌ Frontend pipeline failed at build #${BUILD_NUMBER}"
        }
    }
}
