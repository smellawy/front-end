pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo '✅ Code checked out'
            }
        }

        stage('Install & Test') {
            steps {
                sh '''
                    docker run --rm -v "$PWD":/app -w /app node:20-alpine sh -c "npm install && npm test || true"
                '''
                echo '✅ Install & Test completed'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t mohamedadel9988/frontend:latest -t mohamedadel9988/frontend:latest .'
                echo '✅ Docker image built'
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
                        docker push mohamedadel9988/frontend:latest
                        docker push mohamedadel9988/frontend:${BUILD_NUMBER}
                        docker logout
                    '''
                }
                echo '✅ Pushed to Docker Hub'
            }
        }

        stage('Update K8s Manifest') {
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
                        sed -i "s|image: mohamedadel9988/frontend:.*|image: mohamedadel9988/frontend:${BUILD_NUMBER}|g" apps/frontend/deployment.yml
                        git config user.email "jenkins@mogambo.com"
                        git config user.name "Jenkins CI"
                        git add .
                        git commit -m "Update frontend image to build ${BUILD_NUMBER}" || true
                        git push origin main || true
                    '''
                }
                echo '✅ ArgoCD manifest updated'
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                    docker rmi mohamedadel9988/frontend:${BUILD_NUMBER} || true
                    rm -rf mogambo-manifests
                '''
            }
        }
    }

    post {
        success { echo '🎉 Frontend Pipeline SUCCESS! Build #${BUILD_NUMBER}' }
        failure { echo '❌ Frontend Pipeline FAILED! Build #${BUILD_NUMBER}' }
    }
}
