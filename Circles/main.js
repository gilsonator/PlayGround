// main.js

const circles = [];
const circleOverlays = [];

async function load() {
  await google.maps.importLibrary('maps');

  await initMap();
  document.getElementById('refreshMap').addEventListener('click', event => {
    refreshMap();
  });
}

async function initMap() {
  class CustomOverlay extends google.maps.OverlayView {
    constructor(position, text, map) {
      super();
      this.position = position;
      this.text = text;
      this.map = map;
      this.div = null;
      this.setMap(map);
    }

    onAdd() {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.background = '#fff';
      div.style.border = '1px solid #000';
      div.style.padding = '2px';
      div.style.fontSize = '12px';
      div.innerHTML = this.text;
      this.div = div;

      const panes = this.getPanes();
      panes.overlayLayer.appendChild(div);
    }

    draw() {
      const overlayProjection = this.getProjection();
      const position = overlayProjection.fromLatLngToDivPixel(this.position);

      const div = this.div;
      div.style.left = position.x + 'px';
      div.style.top = position.y + 'px';
    }

    onRemove() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
      console.log('Removed', this)
    }
  }

  const centerPosition = { lat: -19.258965, lng: 146.816956 };
  const map = new google.maps.Map(document.getElementById('map'), {
    center: centerPosition,
    zoom: 12,
  });

  const marker = new google.maps.Marker({
    position: centerPosition,
    map: map,
    title: 'Center Marker',
  });

  // const distances = [1, 2, 3, 4, 5, 6, 8, 10];

  const CrimeDistances = [
    0.5128958902527008, 1.0381423627462523, 1.1585139231349162, 1.1585139231349162,
    1.2494235159294305, 1.2494235159294305, 1.3583669832841652, 1.5828025411619544,
    2.493838188546239, 2.532326021365958, 2.893837598334613, 2.893837598334613, 2.964399364237416,
    3.0415329227227987, 3.143322932049005, 3.638900723834615, 3.7768679450727216,
    3.8975693016351967, 4.036164702665922, 4.312469564624424, 4.427175093040512, 4.754735888092851,
    6.006323445713376, 6.328695602368416, 6.462488471765351, 6.4669133454927605, 6.513579683546969,
    7.149700465985164, 8.548645905889119, 8.87541444702123, 9.043496597263461, 9.563048462010054,
    9.79898724688639, 10.016685188979244, 10.56509290508769, 10.844110255624662, 10.978225162259715,
    10.978225162259715, 11.275929528475173, 11.487835931157365, 11.50477030875314,
    11.50477030875314, 11.513169492004725, 11.54431699690462, 11.662164936257158,
    12.437621823107031, 13.109651327876543, 14.788141503253671, 14.789954194715927,
    15.392865309270759, 16.21879967732334, 17.161486997893768, 18.799228483669573,
    19.18386404920519, 19.216463287748578,
  ];

  function groupByInterval(array, interval) {
    const groupedCounts = array.reduce((acc, value) => {
      const group = Math.floor(value / interval) * interval;
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {});

    // Ensure all intervals are listed
    const maxGroup = Math.floor(Math.max(...array) / interval) * interval;
    for (let i = 0; i <= maxGroup; i += interval) {
      if (!groupedCounts.hasOwnProperty(i)) {
        groupedCounts[i] = 0;
      }
    }

    return groupedCounts;
  }

  // DG TODO: Make function to create markers to be called outside
  const interval = parseInt(document.getElementById('groupBy').value || 2);

  const groupedCounts = groupByInterval(CrimeDistances, interval);
  console.log(groupedCounts);

  Object.keys(groupedCounts).forEach(group => {
    const distance = parseFloat(group); // Convert group key to a number
    const count = groupedCounts[group]; // Get the count for this group

    const circle = new google.maps.Circle({
      map: map,
      radius: distance * 1000,
      fillColor: '#AA0000',
      fillOpacity: 0.1,
      strokeColor: '#AA0000',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      center: marker.getPosition(),
    });

    const position = {
      lat: marker.getPosition().lat() + distance * 0.003,
      lng: marker.getPosition().lng() + distance * 0.009,
    };

    circleOverlays.push(
      new CustomOverlay(
        position,
        `${distance} - ${distance + interval} km<br>${count} events reported`,
        map
      )
    );

    circles.push(circle);
  });
}

function removeAllCircles() {
  for (let i = 0; i < circles.length; i++) {
    circles[i].setMap(null);
    circleOverlays[i].setMap(null);
  }
  // Clear the arrays
  circles.length = 0;
  circleOverlays.length = 0;
}

function refreshMap() {
  alert(parseInt(document.getElementById('groupBy').value || 2));
  removeAllCircles();
  const interval = parseInt(document.getElementById('groupBy').value || 2);
}

window.onload = load;
// window.refreshMap = refreshMap;
