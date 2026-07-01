pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                withCredentials([
                    string(credentialsId: 'react-app-env',   variable: 'APP_ENV'),
                    string(credentialsId: 'google-maps-key', variable: 'GOOGLE_MAPS_KEY'),
                    string(credentialsId: 'rapidapi-key',    variable: 'RAPIDAPI_KEY'),
                    string(credentialsId: 'openweather-key', variable: 'OPENWEATHER_KEY'),
                    string(credentialsId: 'gemini-key',      variable: 'GEMINI_KEY')
                ]) {
                    sh '''
                        docker build \
                          --build-arg REACT_APP_ENV=$APP_ENV \
                          --build-arg REACT_APP_GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_KEY \
                          --build-arg REACT_APP_RAPIDAPI_KEY=$RAPIDAPI_KEY \
                          --build-arg REACT_APP_OPENWEATHERMAP_API_KEY=$OPENWEATHER_KEY \
                          --build-arg REACT_APP_GEMINI_API_KEY=$GEMINI_KEY \
                          -t travel-buddy:$BUILD_NUMBER .
                    '''
                }
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                    docker stop travel-buddy || true
                    docker rm travel-buddy || true
                    docker run -d --name travel-buddy -p 3000:80 travel-buddy:$BUILD_NUMBER
                '''
            }
        }
    }
}