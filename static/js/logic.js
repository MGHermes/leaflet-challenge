/* Visualizing Data with Leaflet
GOAL: Create a map of the US with circular markers for earthquakes in the US
    * Marker specifications:
        - Marker size is based on earthquake magnitude
        - Marker color is based on earthquake depth
    * Clickable popups:
        - Popups with additional earthquake information
    * Legend:
        - Assign meanings to colors of the markers
*/

// STEP 1a: Create a new map object, titled myMap
var myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 4,
});

// Step 1b: Add the tile layer (the background map image)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// STEP 2a: Load data with D3
var dataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(dataURL).then(function(jsonData){

    // STEP 2b: Loop through the earthquake data
    // Use a for-loop based on the number of earthquakes (metadata -> count)
    for(var i = 0; i <jsonData.metadata.count; i ++){

        // STEP 3: Identify the longitude, latitude, depth, magnitude, and radius
        lon = jsonData.features[i].geometry.coordinates[0];
        lat = jsonData.features[i].geometry.coordinates[1];
        dep = jsonData.features[i].geometry.coordinates[2];
        mag = jsonData.features[i].properties.mag;

        // STEP 4a: Write a function to assign colors to various depths
        function assignColor(depth) {
            switch(true) {
                case depth > 90:
                    return "red";
                case depth > 70:
                    return "orangered";
                case depth > 50:
                    return "orange";
                case depth > 30:
                    return "gold";
                case depth > 10:
                    return "yellow";
                default:
                    return "lightgreen";
            }
        }

        // STEP 4b: Write a function to assign radius to various magnitudes
        function assignRadius(magnitude) {
            switch(true) {
                case magnitude == 0:
                    return 1000;
                default:
                    return magnitude * 10000;
            }
        }

        // STEP 4c: Create a new marker with the appropriate icon and coordinates
        var newMarker = L.circle([lat,lon],{
            opacity: 1,
            fillOpacity: 1,
            color: "black",
            fillColor: assignColor(dep),
            radius: assignRadius(mag),
            stroke: true,
            weight: 0.5
        });

        // STEP 4d: Add the new marker to the appropriate layer
        newMarker.addTo(myMap);

        // STEP 5: Bind a popup to the marker that will display on being clicked. This will be rendered as HTML.
        newMarker.bindPopup("Magnitude: " + mag + "<br> Location: " + lat + ", " + lon + "<br> Depth: " + dep);
    }
});

// STEP 6a: Create a legend to display information about our map.
let legend = L.control({
    position: "bottomright"
  });

// STEP 6b: Add the properties for the legend
legend.onAdd = function() {
    // Create a div for the legend to appear on the page
    let div = L.DomUtil.create("div", "info legend");
    
    // Set up intervals for the legend
    let intervals = [-10, 10, 30, 50, 70, 90]; // (-10-10,10-30,30-50,50-70,70-90,90+)
    
    // Set up colors for the intervals
    let colors = ["red", "orangered", "orange", "gold", "yellow", "lightgreen"];

    // Loop through the intervals and colors
    // Generate a label with a colored square for each interval
    for(var i = 0; i < intervals.length; i++)
    {
        // Div.innerHTML references the "info legend" div that we created
        // This allows us to set the square for each interval and label
        div.innerHTML += "<i style = 'background: "
            + colors[i]
            + "'></i>"
            + intervals[i]
            + (intervals[i+1]? "km - " + intervals[i+1]+"km<br>" : "+");
            // If there is another element in the list of intervals,
            // This code adds a dash, followed by the next interval.
            // Otherwise, this code adds a plus sign.
            // Format: (Boolean? ReturnIfTrue : ReturnIfFalse)
    }

    return div;
};

// STEP 6c: Add the legend to the map.
legend.addTo(myMap);