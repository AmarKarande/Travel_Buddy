pipeline {
    agent any

    environment {
        SONAR_HOME = tool 'sonar-scanner'
        DOCKER_IMAGE = "amarskarande/travel-buddy"
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout Source Code') {
            steps {
                checkout scm
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                withCredentials([
                    string(credentialsId: 'nvd-api-key', variable: 'NVD_API_KEY')
                ]) {
                    dependencyCheck(
                        odcInstallation: 'DP-Check',
                        additionalArguments: """
                            --scan .
                            --format ALL
                            --disableYarnAudit
                            --nvdApiKey ${NVD_API_KEY}
                        """
                    )
                }

                dependencyCheckPublisher(
                    pattern: 'dependency-check-report.xml'
                )
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                    ${SONAR_HOME}/bin/sonar-scanner \
                    -Dsonar.projectKey=travel-buddy \
                    -Dsonar.projectName=travel-buddy \
                    -Dsonar.sources=src
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Trivy Filesystem Scan') {
            steps {
                sh '''
                trivy fs \
                --severity HIGH,CRITICAL \
                --format table \
                --output trivy-fs-report.txt \
                .
                '''
            }
        }

        stage('Docker Build') {
            steps {

                withCredentials([
                    string(credentialsId: 'react-app-env', variable: 'APP_ENV'),
                    string(credentialsId: 'google-maps-key', variable: 'GOOGLE_MAPS_KEY'),
                    string(credentialsId: 'rapidapi-key', variable: 'RAPIDAPI_KEY'),
                    string(credentialsId: 'openweather-key', variable: 'OPENWEATHER_KEY'),
                    string(credentialsId: 'gemini-key', variable: 'GEMINI_KEY')
                ]) {

                    sh """
                    docker build \
                    --build-arg REACT_APP_ENV=${APP_ENV} \
                    --build-arg REACT_APP_GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_KEY} \
                    --build-arg REACT_APP_RAPIDAPI_KEY=${RAPIDAPI_KEY} \
                    --build-arg REACT_APP_OPENWEATHERMAP_API_KEY=${OPENWEATHER_KEY} \
                    --build-arg REACT_APP_GEMINI_API_KEY=${GEMINI_KEY} \
                    -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .
                    """
                }
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh """
                trivy image \
                --severity HIGH,CRITICAL \
                --format table \
                --exit-code 0 \
                --output trivy-image-report.txt \
                ${DOCKER_IMAGE}:${BUILD_NUMBER}
                """
            }
        }

        stage('Docker Login & Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {

                    sh """
                    echo \$DOCKER_PASS | docker login \
                    -u \$DOCKER_USER \
                    --password-stdin

                    docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}

                    docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest

                    docker push ${DOCKER_IMAGE}:latest

                    docker logout
                    """
                }
            }
        }

        stage('Trigger CD Pipeline') {
            steps {
                build job: 'travel-buddy-CD',
                    wait: false,
                    parameters: [
                        string(
                            name: 'IMAGE_TAG',
                            value: "${BUILD_NUMBER}"
                        )
                    ]
            }
        }

    }

    post {

        success {
            echo "=========================================="
            echo "CI Pipeline Completed Successfully"
            echo "Docker Image: ${DOCKER_IMAGE}:${BUILD_NUMBER}"
            echo "=========================================="
        }

        failure {
            echo "=========================================="
            echo "CI Pipeline Failed"
            echo "=========================================="
        }

        always {

            archiveArtifacts artifacts: '''
                trivy-fs-report.txt,
                trivy-image-report.txt,
                dependency-check-report.xml,
                dependency-check-report.html,
                dependency-check-report.json
            ''', allowEmptyArchive: true

            cleanWs()
        }
    }
}