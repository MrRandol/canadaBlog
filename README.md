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

### Route following

This is a planned feature :
- Extract position and format it to whatever the tools used deems the best
- add in the same flavor as planned route a viewer in the blog on read only