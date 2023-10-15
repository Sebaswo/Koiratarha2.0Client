import * as L from 'leaflet';
import {Coordinates, PointOfInterest} from '../interfaces/Coordinates';

let btnChoice: String;
const map = L.map('map').setView([60.172659, 24.926596], 11);

// Use the leaflet.js library to show the location on the map (https://leafletjs.com/)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let layerGroup = L.layerGroup();
const markerGroup = new L.LayerGroup();

document.addEventListener('DOMContentLoaded', () => {
  function success(pos: GeolocationPosition) {
    const crd: Coordinates = pos.coords;
    console.log(crd);

    
    map.setView([crd.latitude, crd.longitude], 13);

    const ownLocation = addMarker(crd, 'Olen tässä!');
    

    getLocations(crd).then(function(pointsOfInterest) {
      for (let i = 0; i < pointsOfInterest.length; i++) {
        const placeName = pointsOfInterest[i].name_fi;
        const coordinates = {
          latitude: pointsOfInterest[i].latitude,
          longitude: pointsOfInterest[i].longitude,
        };
        const marker = addMarker(coordinates, placeName);
        //haetaan tiedot yhdestä pisteestä ja reitti sinne
        marker.on('click', function() {
          document.querySelector('#name')!.innerHTML = pointsOfInterest[i].name_fi;
          document.querySelector(
              '#address')!.innerHTML = pointsOfInterest[i].street_address_fi;
          document.querySelector(
              '#city')!.innerHTML = pointsOfInterest[i].address_city_fi;
          // const targetCrd = {
          //   latitude: pointsOfInterest[i].latitude,
          //   longitude: pointsOfInterest[i].longitude,
          // };
          // const button = document.querySelector('#navigationBtn');
          // button!.replaceWith(button!.cloneNode(true));
          // document.querySelector('#navigationBtn')!.
          //     addEventListener('click', function() {
          //       console.log('Klikattu!');
          //       getRoute(crd, targetCrd);
          //     });
        });
      }
      map.addLayer(markerGroup)
      ownLocation.openPopup();
    });

    function getLocations(crd: Coordinates): Promise<PointOfInterest[]> {
      console.log(crd)
      const apiUrl =
        'https://www.hel.fi/palvelukarttaws/rest/v4/unit/?ontologyword=317+318+319+320+321+322+323';

      return fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
          }
          return response.json();
        })
        .then((pointsOfInterest) => {
          console.log(pointsOfInterest);
          return pointsOfInterest;
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          throw error;
        });
    }
  }

  const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };

  function error(err: GeolocationPositionError) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);

  const placeChoiceBtn = document.querySelector('#submitBtn');
  const radioButtons = document.querySelectorAll<HTMLInputElement>('input[name="place"]');
  placeChoiceBtn!.addEventListener('click', () => {
  let selectedPlace;
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      selectedPlace = radioButton.value;
      break;
    }
  }
  if (selectedPlace === 'enclosure') {
    btnChoice = '317';
    navigator.geolocation.getCurrentPosition(success2, error, options);
  } else if (selectedPlace === 'trail') {
    btnChoice = '318';
    navigator.geolocation.getCurrentPosition(success2, error, options);
  } else if (selectedPlace === 'toilet') {
    btnChoice = '319';
    navigator.geolocation.getCurrentPosition(success2, error, options);
  } else if (selectedPlace === 'forest') {
    btnChoice = '320';
    navigator.geolocation.getCurrentPosition(success2, error, options);
  } else if (selectedPlace === 'beach') {
    btnChoice = '321';
    navigator.geolocation.getCurrentPosition(success2, error, options);
  } else {
    btnChoice = '317+318+319+320+321+322+323';
    navigator.geolocation.getCurrentPosition(success2, error, options);
  }
});
});

function addMarker(crd: Coordinates, text: string): L.Marker {
  return L.marker([crd.latitude, crd.longitude]).addTo(markerGroup).bindPopup(text);
}

// function getRoute(lahto: Coordinates, kohde: Coordinates) {
//   layerGroup.clearLayers();
//   const routingAPI = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
//   // GraphQL haku
//   const haku = `{
//   plan(
//     from: {lat: ${lahto.latitude}, lon: ${lahto.longitude}}
//     to: {lat: ${kohde.latitude}, lon: ${kohde.longitude}}
//     numItineraries: 1
//   ) {
//     itineraries {
//       legs {
//         startTime
//         endTime
//         mode
//         duration
//         distance
//         legGeometry {
//           points
//         }
//       }
//     }
//   }
// }`;

//   const fetchOptions = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({query: haku}), // GraphQL haku lisätään queryyn
//   };

  // lähetetään haku
  // fetch(routingAPI, fetchOptions).then(function(vastaus) {
  //   return vastaus.json();
  // }).then(function(tulos) {
  //   console.log(tulos.data.plan.itineraries[0].legs);
  //   const googleKoodattuReitti = tulos.data.plan.itineraries[0].legs;
  //   for (let i = 0; i < googleKoodattuReitti.length; i++) {
  //     let color = '';
  //     switch (googleKoodattuReitti[i].mode) {
  //       case 'WALK':
  //         color = 'seagreen';
  //         break;
  //       case 'BUS':
  //         color = 'mediumpurple';
  //         break;
  //       case 'RAIL':
  //         color = 'deepskyblue';
  //         break;
  //       case 'TRAM':
  //         color = 'hotpink';
  //         break;
  //       default:
  //         color = 'coral';
  //         break;
  //     }
  //     const reitti = (googleKoodattuReitti[i].legGeometry.points);
  //     const pisteObjektit = L.Polyline.fromEncoded(reitti).getLatLngs(); // fromEncoded: muutetaan Googlekoodaus Leafletin Polylineksi
  //     console.log(layerGroup.getLayers());
  //     layerGroup.addLayer(L.polyline(pisteObjektit).setStyle({
  //       color,
  //     }));
  //     layerGroup.addTo(map);
  //   }
  //   map.fitBounds(
  //       [[lahto.latitude, lahto.longitude], [kohde.latitude, kohde.longitude]]);
  // }).catch(function(e) {
  //   console.error(e.message);
  // });
// }

function updateLocations(btnChoice: String) {
  const url = `https://www.hel.fi/palvelukarttaws/rest/v4/unit/?ontologyword=${btnChoice}`;
  return fetch(url).then(function(response) {
    return response.json();
  }).then(function(pointsOfInterest) {
    console.log(pointsOfInterest);
    return pointsOfInterest;
  });
}

function success2(pos: GeolocationPosition) {
  map.eachLayer((layer) => {
    if (layer/*['_latlng']*/!= undefined)
      layer.remove();
  });
  layerGroup.clearLayers();
  const crd = pos.coords;
  console.log(crd);

  map.setView([crd.latitude, crd.longitude], 11);

  //lisätään oman sijainnin marker
  const ownLocation = addMarker(crd, 'Olen tässä!');
  ownLocation.openPopup();

  //lisätään markerit kohdepaikoille
  updateLocations(btnChoice).then(function(pointsOfInterest) {
    for (let i = 0; i < pointsOfInterest.length; i++) {
      const placeName = pointsOfInterest[i].name_fi;
      const coordinates = {
        latitude: pointsOfInterest[i].latitude,
        longitude: pointsOfInterest[i].longitude,
      };
      const marker = addMarker(coordinates, placeName);
      //haetaan tiedot yhdestä pisteestä ja reitti sinne
      marker.on('click', function() {
        document.querySelector('#name')!.innerHTML = pointsOfInterest[i].name_fi;
        document.querySelector(
            '#address')!.innerHTML = pointsOfInterest[i].street_address_fi;
        document.querySelector(
            '#city')!.innerHTML = pointsOfInterest[i].address_city_fi;
        // const targetCrd = {
        //   latitude: pointsOfInterest[i].latitude,
        //   longitude: pointsOfInterest[i].longitude,
        // };
        // const button = document.querySelector('#navigationBtn');
        // button!.replaceWith(button!.cloneNode(true));
        // document.querySelector('#navigationBtn')!.
        //     addEventListener('click', function() {
        //       console.log('Klikattu!');
        //       getRoute(crd, targetCrd);
        //     });
      });
    }
  });
}