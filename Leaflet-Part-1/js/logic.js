const earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Initialize the map
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

function getColor(depth) {
    return depth > 100 ? '#800026' :
           depth > 50  ? '#BD0026' :
           depth > 30  ? '#E31A1C' :
           depth > 10  ? '#FD8D3C' :
                         '#FEB24C';
}

function getRadius(magnitude) {
    return magnitude * 3;
}

async function fetchEarthquakeData() {
    const response = await fetch(earthquakeUrl);
    const data = await response.json();
    data.features.forEach(feature => {
        const coords = feature.geometry.coordinates;
        const depth = coords[2];
        const magnitude = feature.properties.mag;

        L.circleMarker([coords[1], coords[0]], {
            radius: getRadius(magnitude),
            fillColor: getColor(depth),
            color: getColor(depth),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
        })
        .bindPopup(`<b>Location:</b> ${feature.properties.place}<br>
                    <b>Magnitude:</b> ${magnitude}<br>
                    <b>Depth:</b> ${depth} km`)
        .addTo(map);
    });
}

fetchEarthquakeData();

const legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'legend');
    const depths = [0, 10, 30, 50, 100];

    div.innerHTML = "<b>Depth (km)</b><br>";
    depths.forEach((depth, index) => {
        div.innerHTML +=
            `<i style="background:${getColor(depth + 1)}"></i> ` +
            depth + (depths[index + 1] ? '&ndash;' + depths[index + 1] + '<br>' : '+');
    });

    return div;
};
legend.addTo(map);
