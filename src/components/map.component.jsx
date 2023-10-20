import React, { useRef, useState, useEffect } from "react";

import "leaflet-control-geocoder";
import {
  FeatureGroup,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMapEvents,
  GeoJSON,
  Tooltip
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Leaflet, { divIcon } from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
import markerRetina from "leaflet/dist/images/marker-icon-2x.png"
import { MapController } from "./MapController"
// import Polyline from 'react-leaflet-arrowheads'
import { ArrowheadsPolyline } from "./ArrowheadsPolyline"

import planningData from '../data/PlanningBoundaryArea_b.json'
import planningCenterData from '../data/PlanningCenterArea.json'
import { red } from "@mui/material/colors";

Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: markerRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});
let num = 1;

function floatToHexColor(value) {
  // Make sure the value is within the range of 0 to 40
  value = Math.max(0, Math.min(40, value));

  // Calculate the hue value based on the ratio of the value to the maximum value (40)
  var hue = (value / 40) * 360;

  // Convert the HSV color to RGB color
  var rgbColor = hsvToRgb(hue, 0.9, 0.8);
  // Increase the blue component
  rgbColor[2] += 100; // Adjust the value to add more blue (increase the blue component)

  // Clamp the RGB values to the valid range of 0-255
  rgbColor[0] = Math.max(0, Math.min(255, rgbColor[0]));
  rgbColor[1] = Math.max(0, Math.min(255, rgbColor[1]));
  rgbColor[2] = Math.max(0, Math.min(255, rgbColor[2]));

  // Convert the RGB color components to hexadecimal strings
  var redHex = Math.floor(rgbColor[0]).toString(16);
  var greenHex = Math.floor(rgbColor[1]).toString(16);
  var blueHex = Math.floor(rgbColor[2]).toString(16);

  // Pad the hexadecimal values with a leading zero if necessary
  if (redHex.length < 2) {
    redHex = "0" + redHex;
  }
  if (greenHex.length < 2) {
    greenHex = "0" + greenHex;
  }
  if (blueHex.length < 2) {
    blueHex = "0" + blueHex;
  }

  // Construct the final hexadecimal color code
  var colorCode = "#" + redHex + greenHex + blueHex;

  return colorCode;
}
// from small to big, 15 colors https://colordesigner.io/gradient-generator
const colors = [
  '#fffddd',
  '#faf3c8',
  '#f6e8b3',
  '#f4dd9f',
  '#f3d18b',
  '#f2c578',
  '#f2b866',
  '#f2ab55',
  '#f39d46',
  '#f38e38',
  '#f47d2c',
  '#f56b23',
  '#f6571d',
  '#f63c1a',
  '#f6081b'
]
// Helper function to convert HSV color to RGB color
function hsvToRgb(h, s, v) {
  var c = v * s;
  var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  var m = v - c;

  var r, g, b;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return [
    (r + m) * 255,
    (g + m) * 255,
    (b + m) * 255
  ];
}
const dataScopes = [
  {
    name: "Population",
    key: "pop_est",
    description: "The population of the country",
    unit: "",
    scale: [0, 5000000, 10000000, 25000000, 50000000, 75000000, 100000000, 200000000, 1000000000, 8000000000]
  },
  {
    name: "GDP",
    key: "gdp_md_est",
    description: "The GDP of the country",
    unit: "USD",
    scale: [0, 10000, 50000, 100000, 500000, 1000000, 5000000, 1000000000]
  }
];
function getGradient(value) {

  const colors = ['#851E8F', '#93379B', '#A050A8', '#AE69B4', '#BB82C1', '#C99BCD', '#D6B4DA', '#E4CDE6', '#F1E6F3', '#FFFFFF', '#701B78']
  // { color: '#f56b23', value:}, { color: '#f6571d', value:}, { color: '#f63c1a', value:}, { color: '#f6081b', value:}];
  // const colors = ['#fafa6e', '#c4ec74', '#92dc7e', '#64c987', '#39b48e', '#089f8f', '#00898a', '#08737f', '#215d6e', '#2a4858', '#2a4858']
  // const colors = ['#FFEEBB', '#EEDDAC', '#DDBB9A', '#CCAA88', '#BB9976', '#AA8864', '#996752', '#885640', '#77452E', '#66341C',]
  // const colors = ['#FFEEBB', '#FFE6A1', '#FFDD87', '#FFD46D', '#FFCB52', '#FFC239', '#FFB920', '#FFB007', '#FFA68E', '#FF9D74']
  return colors[Math.floor(Math.log2(value))]
}

const MapComponent = (props) => {
  const mapRef = useRef();
  const [center, setCenter] = useState({
    lat: 1.345,
    lng: 103.82
  });
  const [dataScope, setDataScope] = useState(dataScopes[0]);
  const [destinationList, setDestinationList] = useState([])
  const [selectedArea, setSelectedArea] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState({});
  const [arrows, setArrows] = useState([]);
  // const [destinationCount, setDestinationCount] = useState(null);
  const [updateFeatures, setUpdateFeatures] = useState(null)

  const { selectedPlanningArea, setArea, tripsvsregion, currentRegionalTrips, timeOfDay } = props

  // console.log('destinationList', selectedArea, updateFeatures)
  const handleDataScopeChange = (event) => {
    setDataScope(dataScopes.find(element => element.key === event.target.value));
  }
  // getCenter()
  // useEffect(() => {
  //   // console.log('---------')
  //   const counts = destinationList.filter(item => item.destination_area_name === hoveredCountry.PLN_AREA_N)
  //   console.log(hoveredCountry.PLN_AREA_N, counts)

  //   setDestinationCount(counts && counts[0] && counts[0].count_trips)
  //   // console.log(destinationList)
  // }, [destinationList, hoveredCountry])


  useEffect(() => {
    // console.log('currentRegionalTrips ----- ')
    // console.log(currentRegionalTrips)
    const tripList = []
    currentRegionalTrips.forEach(element => {
      const { destination_area_name, section_of_day, count_trips } = element
      const destination = { section_of_day, destination_area_name, count_trips: parseInt(count_trips) }

      if (timeOfDay === 'DAY') tripList.push(destination)
      if (section_of_day.toUpperCase() === timeOfDay) tripList.push(destination)

    });
    const sumByDestination = {};

    // Iterate through each trip object
    tripList.forEach((trip) => {
      const destinationName = trip.destination_area_name;
      const countTrips = parseInt(trip.count_trips);

      // If the destination area name is not in the sumByDestination object, add it and set the initial sum to 0
      if (!sumByDestination[destinationName]) {
        sumByDestination[destinationName] = 0;
      }

      // Add the count_trips value to the sum for the corresponding destination area
      sumByDestination[destinationName] += countTrips;
    });
    // console.log(sumByDestination)
    const destinationList = []
    for (let [key, value] of Object.entries(sumByDestination)) {
      const destination = { destination_area_name: key, count_trips: parseInt(value) }
      destinationList.push(destination)
    }
    setDestinationList(destinationList)
    // selectedPlanningArea

  }, [selectedPlanningArea, currentRegionalTrips, timeOfDay])


  const highlightFeature = (e) => {
    let layer = e.target;
    setHoveredCountry(layer.feature.properties);
  }

  const resetHighlight = (e) => {
    setHoveredCountry({});
  }

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: () => setArea(feature.properties.PLN_AREA_N)
    });
  }
  const getColor = (val) => {
    for (let i = 1; i < dataScope.scale.length; i++) {
      if (val < dataScope.scale[i]) {
        return colors[i - 1];
      }
    }

    return colors[colors.length - 1];
  }
  const style = (feature) => {

    let mapStyle = {
      fillColor: '#888',
      weight: 1,
      opacity: 1,
      color: '#888',
      dashArray: '3',
      fillOpacity: 0.2
    };

    if (hoveredCountry && feature.properties.Name === hoveredCountry.Name) {
      mapStyle.color = '#18ff6d';
      mapStyle.weight = 2;
      mapStyle.fillColor = '#18ff6d'
      mapStyle.fillOpacity = 0.5;
    }
    if (selectedPlanningArea && feature.properties.PLN_AREA_N === selectedPlanningArea) {
      mapStyle.color = '#18ff6d';
      mapStyle.weight = 2;
      mapStyle.fillColor = '#52d7e7'
      mapStyle.fillOpacity = 0.7;
    }
    if (destinationList) {
      destinationList.forEach(element => {
        if (feature.properties.PLN_AREA_N === element.destination_area_name && feature.properties.PLN_AREA_N !== selectedPlanningArea) {
          mapStyle.color = '#888'
          mapStyle.fillColor = getGradient(element.count_trips)
          mapStyle.opacity = 1;
          mapStyle.fillOpacity = 0.8;
        }
      });
    }
    // console.log(feature)
    return mapStyle;
  }
  const { borders, regionData } = props
  const [map, setMap] = useState(null);

  const [reviewData, setReviewData] = useState([]);
  // const [selectedReview, selectReview] = useState();
  // const mapRef = useRef();
  const zoom = 12;
  const containerStyle = {
    width: "100%",
    height: "800px",
    alignSelf: "right"
  }
  // const center = {
  //     lat: 1.345,
  //     lng: 103.82
  // }
  // 1.345, 103.82
  const initialMarkers = [
    {
      position: {
        lat: 1.345,
        lng: 103.82
      },
      draggable: true
    },
  ];

  const [markers, setMarkers] = useState(initialMarkers);

  const mapClicked = (event) => {
    // console.log(event)
    // console.log(event.latlng)
    // props.setLineWidth(3)
    // if (event && event.latlng) {
    //   // console.log(event.latlng.lat, event.latlng.lng)   
    //   props.selectReview({ location: [event.latlng.lat, event.latlng.lng] })
    // }
    // selectReview(event & event.latlng & {location: [event.latlng.lat, event.latlng.lng]})
  }

  const markerClicked = (marker, index) => {
    console.log(marker.position.lat, marker.position.lng)

  }

  const markerDragEnd = (event, index) => {
    console.log(event.lat, event.lng)
  }

  const getAddress = (lat, lng) => {
    const geocoder = Leaflet.Control.Geocoder.nominatim();
    return new Promise((resolve, reject) => {
      geocoder.reverse(
        { lat, lng },
        mapRef.current.getZoom(),
        results => results.length ? resolve(results[0].name) : reject(null)
      );
    })
  }

  const { lineWidth } = props;
  const customMarkerIcon = (name) =>
    divIcon({
      html: name,
      className: "icon"
    });
  const setIcon = ({ properties }, latlng) => {
    // { properties }, latlng

    // console.log(properties)
    // // let result = result1.filter(o1 => !result2.some(o2 => o1.id === o2.id));
    // // if (properties.count_trips > 0) {
    return Leaflet.marker(latlng, { icon: customMarkerIcon(properties.PLN_AREA_N) });
    // // return Leaflet.marker(latlng, { icon: customMarkerIcon(properties.count_trips) });
    // }
  };

  const getSetIcon = ({ properties }, latlng) => {

    const customMarkerIcon = (name) =>
      divIcon({
        html: name,
        className: "icon"
      });
    const setIcon = () => {

      // let result = result1.filter(o1 => !result2.some(o2 => o1.id === o2.id));
      // if (properties.count_trips > 0) {
      return Leaflet.marker(latlng, { icon: customMarkerIcon(properties.PLN_AREA_N) });
      // return Leaflet.marker(latlng, { icon: customMarkerIcon(properties.count_trips) });
      // }
    };
    return setIcon
  };
  useEffect(() => {
    const { features } = planningCenterData;
    const { features: _, ...data } = planningCenterData;
    const updatedFeatures = []
    const destinationLatLon = []
    let originLatLon = []
    features.forEach(element => {
      const { properties, geometry, type } = element
      // console.log(destinationList)
      const currentArea = destinationList.filter(element => element.destination_area_name === properties.PLN_AREA_N)
      if (properties.PLN_AREA_N === selectedPlanningArea) {
        setSelectedArea(element)
        originLatLon = geometry.coordinates
      }
      // console.log('currentArea', currentArea)
      if (currentArea && currentArea[0] && currentArea[0].count_trips) {
        const newEle = { ...element, properties: { ...properties, count_trips: currentArea[0].count_trips } }
        updatedFeatures.push(newEle);
        destinationLatLon.push(geometry.coordinates)
      }
    });
    const arrowLatLon = []
    destinationLatLon.forEach(element => {
      arrowLatLon.push([originLatLon, element])
    });
    setArrows(arrowLatLon)
    const newPlanningCenterData = { ...planningCenterData, features: updatedFeatures }

    setUpdateFeatures(newPlanningCenterData)

  }, [destinationList])

  return (
    <MapContainer
      style={containerStyle}
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      ref={mapRef}
    >
      {/* {!tripsvsregion && arrows && <Polyline positions={arrows} color="blue" weight='2' />} */}
      {/* {!tripsvsregion && arrows && arrows[0] && <Polyline positions={testArray} color="blue" weight='5' />} */}
      {/* <Polyline positions={testArray} color="blue" weight='5' /> */}
      {!tripsvsregion && arrows && arrows.map((feature) => {
        if (feature && feature[0] && feature[1])
          return < ArrowheadsPolyline key={feature.destination_area_name} positions={[[feature[0][1], feature[0][0]], [feature[1][1], feature[1][0]]]} color="blue" weight='2' arrowheads />
      }
      )}
      {/* {!tripsvsregion &&
        <GeoJSON data={planningCenterData} pointToLayer={setIcon} />
      } */}
      {!tripsvsregion &&

        <GeoJSON data={planningData} style={style} onEachFeature={onEachFeature} >
          <Tooltip sticky>{hoveredCountry && hoveredCountry.PLN_AREA_N}</Tooltip>
        </GeoJSON>


      }
      {tripsvsregion &&
        <FeatureGroup>
          {/* {pos?.map((mark, i) => (
        <Marker key={i} position={mark} icon={customMarkerUserPos} />
      ))} */}
          {/* <Polyline positions={[lines[10],lines[13]]} color="blue" weight='3' /> */}

          {/* {borders && <Polyline positions={borders} color="blue" weight='2' />} */}
          {
            props.rows.map((feature) =>
              <Polyline
                key={feature.distance + num++}
                positions={feature.loc}
                color={
                  '#0000FF'
                  // floatToHexColor(feature.distance)
                }
                weight={2} o
                pacity={0.5} />)
          }
        </FeatureGroup>
      }
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* <MapController
        selectedReview={props.selectedReview}
        setLineWidth={props.setLineWidth} /> */}
      {/* <MapContent
        onClick={mapClicked}
      /> */}
      {/* {markers.map((marker, index) => (
              <MarkerContent
                  key={index}
                  position={marker.position}
                  draggable={marker.draggable}
                  onMarkerClick={event => markerClicked(marker, index)}
                  onDragEnd={event => markerDragEnd(event, index)}
              />
          ))} */}
    </MapContainer>)
  {/* <DataScopeSelector options={dataScopes} value={dataScope} changeHandler={handleDataScopeChange} /></> */ }

};

const MapContent = ({ onClick }) => {
  const map = useMapEvents({
    click: event => onClick(event)

  })
  return null;
}

// const MarkerContent = (props) => {
//     const markerRef = useRef();
//     const {position, draggable, onMarkerClick, onDragEnd} = props;

//     return <Marker
//         position={position}
//         draggable={draggable}
//         eventHandlers={{
//             click: event => onMarkerClick(event),
//             dragend: () => onDragEnd(markerRef.current.getLatLng())
//         }}
//         ref={markerRef}
//     >
//         <Popup>
//             <b>{position.lat}, {position.lng}</b>
//         </Popup>
//     </Marker>
// }

export const customMarkerUserPos = new Leaflet.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  iconSize: [15, 20],
  iconAnchor: [5, 20],
  popupAnchor: [2, -40]
});
export default MapComponent;
