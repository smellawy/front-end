pipeline{

    agent any

    stages{
        stage('build'){
            steps{
                echo 'this is the first job'
                sh 'npm install'
            }
        }
        stage('test'){
            steps{
                echo 'this is the second job'
                sh 'npm test'
            }
        }
        stage('package'){
            steps{
                echo 'this is the third job'
                sh 'npm run package'
            }
        }
    }
    
    post{
        always{
            echo 'this pipeline has completed...'
        }
        
    }
