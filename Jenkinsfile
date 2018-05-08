pipeline {
  agent any
  stages {
    stage('Build route_edit') {
      parallel {
        stage('npm install & build ') {
          steps {
            sh 'echo "TODO BUILD ROUTE_EDIT"'
          }
        }
        stage('Copy Route_edit') {
          steps {
            sh 'echo "TODO : Copy route edit to destination folder"'
          }
        }
      }
    }
    stage('Copy docker data') {
      parallel {
        stage('copy compose to data folder') {
          steps {
            sh 'cp docker-compose.yml ${COMPOSE_FILE}'
          }
        }
        stage('copy kml_upload image definition') {
          steps {
            sh 'rm -rf ${DOCKER_DATA_CONTAINER}/maps/kml_upload'
            sh 'cp -R maps/kml_upload ${DOCKER_DATA_CONTAINER}/maps/kml_upload'
          }
        }
        stage('copy reverse_proxy data') {
          steps {
            sh 'rm -rf ${NGINX_DATA_CONTAINER}'
            sh 'cp -R ./reverse_proxy ${NGINX_DATA_CONTAINER}'
          }
        }
      }
    }
    stage('Build docker images') {
      steps {
        sh 'docker-compose -f ${COMPOSE_FILE} build'
      }
    }
    stage('stop containers') {
      steps {
        sh 'docker-compose -f ${COMPOSE_FILE} down'
      }
    }
    stage('start services') {
      steps {
        sh 'docker-compose -f ${COMPOSE_FILE} up -d'
      }
    }
  }
  environment {
    COMPOSE_FILE = "${DOCKER_DATA_CONTAINER}/docker-compose.yml"
    NGINX_DATA_CONTAINER = "${DATA_FOLDER_CONTAINER}/reverse_proxy"
  }
  triggers {
    githubPush()
  }
}