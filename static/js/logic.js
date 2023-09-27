// Setting up the map with the coordinates centered in Ubud, Bali
let myMap = L.map("map", {
    center: [-8.6, 115.3],
    zoom: 7
  });

// Adding the tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// The variable "url" holds the GeoJSON data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Creating a function to determine color based on earthquake depth 
function getColor(depth) {
    if (depth <= 10) 
        return "#E3BA82";
    else if (depth <= 30) 
        return "#CF9F93";
    else if (depth <= 50) 
        return "#A55860";
    else if (depth <= 70) 
        return "#8A3B5B";
    else if (depth <= 90) 
        return "#491D5A";
    else 
        return "#1C0555";
}

// Setting up the legend
// Define the legend control
let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let grades = [-10, 10, 30, 50, 70, 90];  
    
    // Loop through depth intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] +1) + '; width: 20px; height: 20px; display: inline-block; margin-right: 5px; ">   </i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    // 
    return div;


    
};

// Add the legend to the map
legend.addTo(myMap);


// Fetching the GeoJSON data using d3 library
d3.json(url).then(function(response) {

    let features = response.features;


    // Define the maximum number of markers to display
    let marker_limit = 10000;

    // Loop through the earthquake features
    for (let i = 0; i < marker_limit; i++) {

         // Get location and properties of the earthquake
        let location = features[i].geometry;
        let properties = features[i].properties;

        // Check if location data is available
        if(location){
            // Create a circle marker on the map
            L.circle([location.coordinates[1], location.coordinates[0]], {
            color: "black",
            weight: 0.5,
            fillColor: getColor(location.coordinates[2]),
            fillOpacity: 1,
            radius: properties.mag * 60000
            })
            // Add a popup with earthquake details
            .bindPopup(`<h1>Magnitude: ${properties.mag}</h1> <hr> <h3> Location: ${properties.place}</h3><hr> <h3>Depth: ${location.coordinates[2].toLocaleString()}</h3>`)
            .addTo(myMap);


        
    }

  }

});







