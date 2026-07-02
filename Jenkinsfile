pipeline {
    agent any

    environment {
        SONAR_HOME = tool "sonar-scanner"
        DOCKER_IMAGE = "yourdockerhubusername/travel-buddy"
    }

    stages {
        stage('Pull Code') {
            steps {
                checkout scm
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --format XML --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: 'dependency-check-report.xml'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh """
                        $SONAR_HOME/bin/sonar-scanner \
                          -Dsonar.projectName=travel-buddy \
                          -Dsonar.projectKey=travel-buddy \
                          -Dsonar.sources=src
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Trivy Filesystem Scan') {
            steps {
                sh 'trivy fs --format table -o trivy-fs-report.txt .'
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
                    sh """
                        docker build \
                          --build-arg REACT_APP_ENV=\$APP_ENV \
                          --build-arg REACT_APP_GOOGLE_MAPS_API_KEY=\$GOOGLE_MAPS_KEY \
                          --build-arg REACT_APP_RAPIDAPI_KEY=\$RAPIDAPI_KEY \
                          --build-arg REACT_APP_OPENWEATHERMAP_API_KEY=\$OPENWEATHER_KEY \
                          --build-arg REACT_APP_GEMINI_API_KEY=\$GEMINI_KEY \
                          -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .
                    """
                }
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                        docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest
                        docker push ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        stage('Trigger CD Job') {
            steps {
                build job: 'travel-buddy-CD', parameters: [
                    string(name: 'IMAGE_TAG', value: "${BUILD_NUMBER}")
                ], wait: false
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'trivy-fs-report.txt', allowEmptyArchive: true
        }
        failure {
            echo 'CI Pipeline failed — check the failing stage above.'
        }
    }
}