[![Build Status](https://randol.fr:9000/jenkins/buildStatus/icon?job=canadaBlog/master)](https://randol.fr:9000/jenkins/buildStatus/icon?job=canadaBlog/master)

# Introduction

*This is a Work In Progress*

Blog url : https://randol.fr/canada

This repo contains the sources of of my future travel blog.

The main technologies involved are :
- [Ghost](https://ghost.io/) : NodeJs blog engine
- [Isso](https://posativ.org/isso/) : Comments server to self host (similar to disqus)
- [Juicebox](https://www.juicebox.net/) : HTML5 Photo gallery library
- [ReactJs](https://reactjs.org/) : Frontend library to create the route planning backoffice
- [Docker](https://www.docker.com) : All services run inside containers
- [Nginx](https://www.nginx.com) : The reverse proxy

![Global Architecture](https://raw.githubusercontent.com/MrRandol/canadaBlog/master/canadablog.png)

# Description of the services

## Reverse Proxy

The main entry point. It consists of a simple nginx container which will redirect to the services

## Ghost

The official [Ghost docker containter](https://hub.docker.com/_/ghost/). No real customisation here.
Everything happens in the theme : casper-randol.

## Casper Randol

This is my fork of the default ghost theme [Casper](https://github.com/TryGhost/Casper)
I changed it simply to fit my taste and what I wanted the blog to look and feel like.

For strucure and documentation, the Ghost team did an amazing job, just hop on the Casper page and the [official documentation](https://themes.ghost.org/docs)

There are 2 "features" added to the theme, mainly libraries headers for Isso and Juicebox.

## Photos galleries

This is simply a set of common js libraries to call and also a copy of the markdown page corresponding to the photo gallery.

## Maps

The goal of the map components is to bring a gis flavor to the blog.

There are 2 components planned :
- a route prevision tool, to plan the trip and allow a previsualization of the travel
- a route follow up, to propose a gps tracking system allowing to see "live" the status of the trip

### Route prevision

The route prevision map will allow to update on a dedicated and restricted backoffice the planned route of the trip, by adding waypoints, filling in metadata and saving the result to a kml file.

The modules are the following :

#### route_editor

A *very simple* ReactJs app (I used react to be quicker since I know it - no proper need for Redux here) allowing to edit the planned route by adding/updating waypoints and their metadata ("title", description, etc ...) and upload the result as kml to the server.

When build, it is a collection of static data served by nginx.

> NOTE : This endpoint is designed to be restricted. I chose to do this in the reverse proxy by adding a simple http auth basic.

The route editor is configured via env. it uses dotenv (and it's associated practices)

To use on development purpose, run `npm run start`. A .env.development file can be added to specify dev only value.
For example :

```
PORT=3000 # Only used in development mode, specify the local port to start the app on
```

To build a production ready app use `npm run build`. It will use .env file at the root of the node project (aka maps/route_editor). 

The following are the desired variable when building the app :

```
# BASE LAYER (I chose Bing maps)
REACT_APP_BING_MAX_ZOOM=19 # max zoom level of the layer
REACT_APP_BING_LAYER='Road' # Layer. Can be one of 'Road', 'RoadOnDemand', 'Aerial', 'AerialWithLabels', 'collinsBart', 'ordnanceSurvey'
REACT_APP_BING_KEY='<Your Bing map api key. see https://www.bingmapsportal.com/'

# The route service communication
REACT_APP_ROUTE_KML_URL # where to fetch the kml
REACT_APP_ROUTE_KML_SAVE_URL # where to save the kml
# Warn : Since it is personal project, I do not take into account generic behavior. 
# Hence http auth basic is enforced for the save url
REACT_APP_ROUTE_KML_SAVE_USERNAME
REACT_APP_ROUTE_KML_SAVE_PASSWORD
```

#### kml_upload

Very small NodeJs/Express service to upload the route_editor resulting kml and give access to it in the route_visualization

As basic as it can be :

You can *GET* /route to obtain the current kml
You can *POST* /route with a JSON body containing a kml property.

> NOTE : This endpoint is designed to be restricted for the POST request. I chose to do this in the reverse proxy.


#### route_visualization

This component - as for the Photos Galleries - is not a service or an app but a page in the blog. 
The source can be found in map/blog_views/route_planning.html

It is a "copy" of the route_edit map oriented on the visualization of the route waypoints. Nothing fancy, just a map with a base layer and a kml layer.

### Route follow up

This is a planned feature aiming to:
- Extract position and format it to whatever the tools used should be the best
- add in the same flavor as route visualization a page on the blog

# What to do to install it

Everything runs with docker (no proper docker images building since I do not have or plan to have a registry for this).

Please note that if the images should work directly with the repo structure, I still use Jenkins on the back to "build" the app and deploy it to a proper centralized data folder.

* Please note that this is a heavy factorisation work in progress. It is very likely to change a lot in the coming time*

A simple docker-compose up -d will do the trick.

A .env file is also necessary. Here are the expected parameters : 

```
# GENERIC VALUES

# REVERSE_PROXY
NGINX_HOST # Your domain name (like example.com, www.example.com ...)
NGINX_TEMPLATE_PATH # Path to the reverse_proxy.template file
NGINX_PASSWORD_PATH # Path to the generated .htpasswd file (server dependant)
DH_PARAM_DATA_HOST # DH param fodler storage on the host
LETS_ENCRYPT_DATA_HOST # Let's Encrypt data storage on the host (assumes certbot format)

# PHOTOS
PHOTO_GALLERIES_DATA_HOST # Folder containing all photos galleries on host
PHOTO_GALLERIES_DATA_CONTAINER # Mount point of the photos galleries folder on the containers

# KML_UPLOAD
KML_UPLOAD_UID # the uid of the user to run the container with
KML_UPLOAD_PORT # Port on which the app will listen
KML_UPLOAD_DATA_HOST # Folder on the host to store the kml route data
KML_UPLOAD_DATA_CONTAINER # Mount point on the container where the kml route data is


# GHOST
GHOST_PORT # Port on which the ghost service will listen (normally 2368)
GHOST_UID # the uid of the user to run the container with
GHOST_URL # The url the blog is available at
GHOST_DATA_HOST # Host folder where all Ghost data goes

# ROUTE_EDITOR
ROUTE_EDITOR_DATA_HOST # Folder on host where the built react app is
ROUTE_EDITOR_DATA_CONTAINER # Mount point on the container

# ISSO
ISSO_UID # uid of the isso user
ISSO_GID # gid of the isso group
ISSO_PORT # Port that isso used and exports
ISSO_CONFIG_FOLDER_HOST # host folder containing isso configs
ISSO_CONFIG_FOLDER_CONTAINER # Container mount point to isso configs
ISSO_DB_FOLDER_HOST # host folder containing isso database
ISSO_DB_FOLDER_CONTAINER # Container mount point to isso database
```

NOTE :
I am using a Jenkins in the background to take care of the following : 
  - Build the app on push : build the docker images, build and copy route_edit app, copy docker definitions, nginx template to central storage point, restart containers
  - Automate let's encrypt certificate renewal (with certbot docker image)
  - Automate new photos galleries integration following juicebox format (cf scripts/photos_upload.sh) 
  - Make backups (cf scripts/backup.sh)
  
This means I use another container to run nginx + docker, which use their own env definition.