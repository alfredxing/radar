> Not actively maintained. Not intended for use as production code (this project was hacked together as a school project). Installation is outlined in the `INSTALL.md` file.

### Radar

Radar is a simple weather app that shows radar in the Greater Vancouver area, and displays current weather and forecast for a variety of cities.

#### Features
* Radar data from the [National Weather Service](http://www.weather.gov/)
* Weather data from [Environment Canada](http://weather.gc.ca/)
* User preferences
* Multiple location choices
* Search by location
* Manual data update

#### Code of interest
* [The radar drawer](https://github.com/alfredxing/radar/blob/master/app/assets/javascripts/radar.js), which is shown on the map using some overlays in [map.js](https://github.com/alfredxing/radar/blob/master/app/assets/javascripts/map.js)
* [The radar parser](https://github.com/alfredxing/radar/blob/master/bin/radar-parser/src/Parser.java), written in Java (dependent on the [NetCDF](http://www.unidata.ucar.edu/software/thredds/current/netcdf-java/) library)

#### Installation
For installation instructions, please see the `INSTALL.md` file.

#### People
* [@mfindlayolynyk](https://github.com/mfindlayolynyk)
* [@arclite181](https://github.com/arclite181)
* [@mimiko](https://github.com/mimiko)
* [@alfredxing](https://github.com/alfredxing)
