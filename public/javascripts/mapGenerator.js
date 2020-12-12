const address = document.getElementById('user-input-address').innerHTML;
const google_key = document.getElementById('google-key').innerHTML;
const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${google_key}`;

let coordinates = {
  lat: Number(document.getElementById('lat').innerHTML),
  lng: Number(document.getElementById('lng').innerHTML),
}

console.log('coo: ', coordinates);


function startMap(coords) {
  const map = new google.maps.Map(
    document.getElementById('map'),
    {
      zoom: 16,
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