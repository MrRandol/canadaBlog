# canadaBlog

Source of my furure travel blog :)

I will self host my blog (yes I know, you can have one for free, but hell - why not !)

The blog is powered by [Ghost](https://ghost.io/), a NodeJs library;

## Casper Randol

This is my fork of the default ghost theme [Casper](https://github.com/TryGhost/Casper)
I remodelled it simply to fit my taste and what I wanted the blog to look and feel like.

For strucure and documentation, the Ghost team did an amazing job, just hop on the Casper page and the [official documentation](https://themes.ghost.org/docs)

## Maps

*This is a Work In Progress*

The goal of the maps is to bring a map flavor to the blog.
I plan to create 2 "set-up" :

### Route prevision

The route prevision map will allow to update on a dedicated backoffice the planned route we want to take, by adding waypoints, filling in metadata and saving the result to a kml file.
Then either an iframe of a direct html insert will be done in the blog through the theme or the blog backoffice to read the kml file and display the data

The modules are the following : 
```bash
# REACT-SCRIPTS
PORT=1234

# BASE LAYER (Bing maps only for now)
REACT_APP_BING_MAX_ZOOM=19 # Maximum zoom available for the layer
#'Road', 'RoadOnDemand', 'Aerial', 'AerialWithLabels', 'collinsBart', 'ordnanceSurvey'
REACT_APP_BING_LAYER='Road' # The Bing layer to display (see above for possibilities)
REACT_APP_BING_KEY='<YOUR BING MAPS API KEY : https://www.bingmapsportal.com/>'

# DRAWING LAYER
REACT_APP_ROUTE_KML_URL="http://localhost:8080/route.kml" # location of the route definition kml file
```

#### route_editor

A very simple app (I used react to be quicker and a bit cleaner) allowing to edit the planned route by adding/updating waypoints and their metadata ("title", description, etc ...) and upload the result as kml to the server.

> NOTE : This endpoint is designed to be restricted. I chose to do this in the reverse proxy.

The route editor is configured via env. it uses dotenv ( and it's associated practices)
Here are the configuration variables :



#### kml_upload

Very small node service to upload the route_editor resulting kml and give access to it in the route_visualization

> NOTE : This endpoint is designed to be restricted. I chose to do this in the reverse proxy.

#### route_visualization

TODO : will probably end up being a blog content stored in db.

### Route follow up

This is a planned feature :
- Extract position and format it to whatever the tools used deems the best
- add in the same flavor as planned route a viewer in the blog on read only