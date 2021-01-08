const google_key = document.getElementById('google-key').innerHTML;

let coordinates = {
  lat: Number(document.getElementById('lat').innerHTML),
  lng: Number(document.getElementById('lng').innerHTML),
}

console.log(coordinates);

function startMap(coords) {
  const map = new google.maps.Map(
    document.getElementById('map'),
    {
      zoom: 18,
      center: coords
    }
  );

const marker = new google.maps.Marker({
    position: {
      lat: coords.lat,
      lng: coords.lng
    },
    map: map,
    title: "Picking point"
  });
}

startMap(coordinates);