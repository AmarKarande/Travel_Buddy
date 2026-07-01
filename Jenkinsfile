pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Generate .env') {
            steps {
                withCredentials([
                    string(credentialsId: 'react-app-env',    variable: 'APP_ENV'),
                    string(credentialsId: 'google-maps-key',  variable: 'GOOGLE_MAPS_KEY'),
                    string(credentialsId: 'rapidapi-key',     variable: 'RAPIDAPI_KEY'),
                    string(credentialsId: 'openweather-key',  variable: 'OPENWEATHER_KEY'),
                    string(credentialsId: 'gemini-key',       variable: 'GEMINI_KEY')
                ]) {
                    sh '''
                        cat > .env <<EOF
REACT_APP_ENV=$APP_ENV
REACT_APP_GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_KEY
REACT_APP_RAPIDAPI_KEY=$RAPIDAPI_KEY
REACT_APP_OPENWEATHERMAP_API_KEY=$OPENWEATHER_KEY
REACT_APP_GEMINI_API_KEY=$GEMINI_KEY
EOF
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t travel-buddy .'
            }
        }
    }

    post {
        always {
            sh 'rm -f .env'
        }
    }
}