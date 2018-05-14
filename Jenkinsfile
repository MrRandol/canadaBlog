pipeline {
  agent any
  stages {
    stage('build route_edit') {
      steps {
        sh 'cp ${DATA_FOLDER_CONTAINER}/docker/.env.route_editor maps/route_editor/.env'
        sh 'npm install --prefix=maps/route_editor'
        sh 'npm run build --prefix=maps/route_editor'
      }
    }
    stage('Copy services data') {
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
        stage('copy route_edit data') {
          steps {
            sh 'rm -rf ${DATA_FOLDER_CONTAINER}/route_editor/*'
            sh 'cp -R maps/route_editor/build/* ${DATA_FOLDER_CONTAINER}/route_editor/'
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
  options { 
    buildDiscarder(logRotator(numToKeepStr: '10')) 
  }
}