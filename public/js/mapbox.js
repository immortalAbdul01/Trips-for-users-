const locations = JSON.parse(document.getElementById('map').dataset.locations)
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1IjoiYWJkdWwxMDIwMDAxMjEyYSIsImEiOiJjbGN2dXozbDUxa2NwM29wMGZxa3AwaW1iIn0.nWlerlAFIRR2oFU2EIgnlg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/abdul1020001212a/clcvvsgqe000a15ph8u5vxlj6',

});
const bounds = new mapboxgl.LngLatBounds()
Object.keys(locations).forEach(loc => {
    const el = document.createElement('div')
    el.className = 'marker'
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map)
    bounds.extend(loc.coordinates)
});
map.fitBounds(bounds)


