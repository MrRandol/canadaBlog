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
- [Openlayers](http://openlayers.org/) : Geographic library to display maps and process geographic data
- [Docker](https://www.docker.com) : All services run inside containers
- [Nginx](https://www.nginx.com) : The reverse proxy

![Global Architecture](https://raw.githubusercontent.com/MrRandol/canadaBlog/master/canadablog.png)

# Description of the services

## Nginx

The main entry point. It is basically a reverse_proxy to redirect to services, serve static data and protect some endpoints.

## Ghost

The official [Ghost docker containter](https://hub.docker.com/_/ghost/) without real customisation here.
Ghost is a light NodeJs blog engine, that you can customize with themes. Thus casper-randol :

### Casper Randol

This is my fork of the default ghost theme [Casper](https://github.com/TryGhost/Casper)
I changed it simply to fit my taste and what I wanted the blog to look and feel like.

For strucure and documentation, the Ghost team did an amazing job, just hop on the Casper page and the [official documentation](https://themes.ghost.org/docs)

### Isso

Based on [wonderfall's Isso](https://hub.docker.com/r/wonderfall/isso/). 
Isso, similar to Disqus, is a comment service. The biggest difference is that you can easily self host it. 
Also it accepts anonymous comments :]

## Maps

The goal of the map components is to bring a [GIS](https://en.wikipedia.org/wiki/Geographic_information_system) flavor to the blog.

There are 2 components planned :
- a route prevision tool, to plan the trip and allow a previsualization of the travel
- a route follow up, to propose a gps tracking system allowing to see "live" the status of the trip

### Route planning

The route prevision map will allow to update on a dedicated and restricted backoffice the planned route of the trip, by adding waypoints, filling in metadata and saving the result to a kml file through a very light and protected nodejs api.

The modules are the following :
- the blog page
- the nodejs service : kml_upload
- the backoffice front app : route_editor

#### Route visualization

The source can be found in map/blog_views/route_planning.html
The content of the file is basically the content of the corresponding blog page.

It is a simple Openlayers map displaying the kml file generated with the [route editor](#Route-editor) component.

#### kml_upload

Very small NodeJs/Express service to upload the [route_edit](#Route-editor) resulting kml and give access to it in the [route vizualization](#Route-Visualization)

It is as basic as it can be :

You can *GET* /route to obtain the current kml
You can *POST* /route with a JSON body containing a kml property.

> NOTE : This endpoint is designed to be restricted for the POST request. I chose to do this in the reverse proxy.

#### Route editor

A *very simple* vanilla ReactJs app (no proper need for Redux here) allowing to edit the planned route by adding/updating waypoints and their metadata ("title", description, etc ...) and upload the result as kml to the server.

> NOTE : This endpoint is designed to be restricted. I chose to do this in the reverse proxy by adding a simple http auth basic.

The sources are under maps/route_editor.

The following are configurations only used in development mode (`npm run start`) :

```
PORT=3000 # Only used in development mode, specify the local port to start the app on
```

To build a production ready app use `npm run build`. It will use the .env file. 
The following are the desired variable when building the app :

```
# BASE LAYER (I chose Bing maps)
REACT_APP_BING_MAX_ZOOM=19 # max zoom level of the layer
REACT_APP_BING_LAYER='Road' # Layer. Can be one of 'Road', 'RoadOnDemand', 'Aerial', 'AerialWithLabels', 'collinsBart', 'ordnanceSurvey'
REACT_APP_BING_KEY='<Your Bing map api key. see https://www.bingmapsportal.com/'

# The route service communication
REACT_APP_ROUTE_KML_URL # where to fetch the kml (kml upload GET)
REACT_APP_ROUTE_KML_SAVE_URL # where to save the kml (kml upload POST)
# Warn : Since it is personal project, I do not take into account generic behavior. 
# Hence http auth basic is enforced for the save url
REACT_APP_ROUTE_KML_SAVE_USERNAME
REACT_APP_ROUTE_KML_SAVE_PASSWORD
```

### Route follow

The source can be found in map/blog_views/route_planning.html
The content of the file is basically the content of the corresponding blog page, similar to [route vizualization](#Route-Visualization).

It is another simple Openlayers map displaying a kml generated by the [GPSLogger](https://play.google.com/store/apps/details?id=com.mendhak.gpslogger) android app (uploaded manually).

# Static Resources

## Libraries 

### Galleries

This is simply a set of common js libraries from [Juicebox](https://www.juicebox.net/) to call, that are preconfigured and common to avoid repetition.

### Maps

A simple collection of [Openlayers](http://openlayers.org/) custom helpers (map creation, styles ...) to avoid having a too heavy blog page & allow versionning and reusability.
Used for [route vizualization](#Route-Visualization) anv [route follow](#Route-Follow).

# What to do to install it

Everything runs with docker (no proper docker images building since I do not have or plan to have a registry for this).

Please note that if the images should work directly with the repo structure, I still use Jenkins on the back to "build" the app and deploy it to a proper centralized data folder, so the "on the repo" run is not tested.

## Preparation

### htpasswd

In order to have a http auth basic, you need to generate a htpasswd file : 
https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-http-basic-authentication/

### dh param

Used in nginx ssl configuration, you will need the dh param : 
https://www.ibm.com/support/knowledgecenter/en/SSB27H_6.2.0/fa2ti_openssl_generate_dh_parms.html

### Let's Encrypt

You will need a certificate created for your domain and a renewal process.
I followed this very well made tutorial : 
https://www.humankode.com/ssl/how-to-set-up-free-ssl-certificates-from-lets-encrypt-using-docker-and-nginx

### Folders

Several folders are needed for each component. See below environment configuration for details.

### Envirnment
```
# SITE HOSTNAME
BLOG_HOST                   # Your domain name (like example.com, www.example.com ...)

# DATA FOLDERS
# For reverse_proxy (should have nginx user owner or read access)
LETS_ENCRYPT_FULLCHAIN_PATH # The fullchain generated by lets encrypt 
LETS_ENCRYPT_PRIVKEY_PATH   # The private key generated by lets_encrypt
ROUTE_EDIT_DATA             # Path to the generated react app from route_edit
STATIC_DATA_PATH            # Path to the static_common ressources
PHOTO_GALLERIES_PATH        # Path to the generated juicebox galleries (by script photo_upload) 
GPS_LOGGER_PATH             # Path to the uploaded gps tracking file generated by GPSLogger app

# For other services (should have dedicated service user owner or read access)
GHOST_DATA                  # Ghost data dir to store db, media, etc ...
KML_UPLOAD_DATA             # Root folder for GET / POST used by the kml_upload service
ISSO_CONFIG_FOLDER          # Config folder for isso
ISSO_DB_FOLDER              # DB folder for isso

# REVERSE_PROXY
NGINX_UID                   # System UID dedicated to nginx
NGINX_TEMPLATE_PATH         # Path to the template path
NGINX_HTPASSWD_PATH         # Path to the htpasswd file (generated once and manually)
NGINX_DH_PARAM_PATH         # Path to dh param file (generated once and manually)

# KML_UPLOAD
KML_UPLOAD_UID              # System UID dedicated to kml_upload
KML_UPLOAD_PORT             # Port dedicated to kml_upload

# GHOST
GHOST_UID                   # System UID dedicated to nginx
GHOST_URL                   # Url of the blog (with current status it is ${BLOG_HOST}/canada)

# ISSO
ISSO_UID                    # System UID dedicated to isso
ISSO_GID                    # System GID dedicated to isso


```

## Notes 

### Jenkins

I am using a Jenkins in the background to take care of the following  :
  - Build the app on push : build the docker images, build and copy route_edit app, copy docker definitions, nginx template & static data to central storage point, restart containers
  - Automate let's encrypt certificate renewal (with certbot docker image)
  - Automate new photos galleries integration following juicebox format (cf scripts/photos_upload.sh) 
  - Make backups (cf scripts/backup.sh)
  
This is done by having a second column of services to mainly avoid collision between the two and allow full services restart control from jenkins (running docker control commands from docker container). 