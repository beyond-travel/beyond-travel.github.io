import React, { useEffect, useRef, useState, useReducer } from "react";

import "./App.css";
import MapComponent from "./components/map.component";
import CsvReader from "./components/CsvReader";
import planningData from './data/planning-boundary-area.json'
import Button from '@mui/material/Button';
import { Dropdown, DropdownMenuItem } from './components/Dropdown';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import BoxSx from './components/BoxSX'
import { reducer } from './Reducer'
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import RenderingCaregiverTable from './components/RenderingCaregiverTable'
import RenderingArrayOfObjects from './components/RenderingArrayOfObjects'
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import bgimage from "./resources/fullbg.jpg"
import SideBar from "./components/SideBar";
import MapBar from "./components/MapBar"

// import 
// Function to check if a coordinate is within a polygon using ray casting algorithm
function isCoordinateWithinPolygon(coordinate, polygon) {

  const x = parseFloat(coordinate.lon);
  const y = parseFloat(coordinate.lat);
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lon;
    const yi = polygon[i].lat;
    const xj = polygon[j].lon;
    const yj = polygon[j].lat;

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

function RenderingStats({ stats, childCountWithin, childCountOutside }) {
  // console.log(currentRegionalTrips, '-----------')
  const headings = ['Total Population', 'Percentage travel within', 'Percentage travel outside']
  // if (currentRegionalTrips.length) {
  //   const sortedCounts = currentRegionalTrips.sort((a, b) => parseInt(b.count_trips) - parseInt(a.count_trips));

  const tableRows = () =>
  //  = sortedCounts.map(
  //   (element) => {
  // return (
  {
    <tr>
      {/* {Object.values(stats).map((val) => ( */}
      <td>{stats.total}</td>
      <td>{childCountWithin}</td>
      <td>{childCountOutside}</td>
      {/* ))} */}
    </tr>

    // )
  }
  // )
  return (
    <div>

      <Table hover>
        <thead>
          <tr>
            {headings.map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </Table>

    </div>
  )
  // }
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    currentRegionalTrips: [],
    regionalTrips: [],
    currentAllTrips: [],
    processedData: [],
    rawData: [],
    areaData: { regionData: [], borders: [] },
    caregivers: { adult: [] },
    regionCaregivers: { adult: [] },
    stats: [],
    census: [],
    xlsx: {},
    settings: {
      tripsvsregion: true,
      timeOfDay: 'DAY',
      lineWidth: 1,
      selectedPlanningArea: "BUKIT MERAH",
      currentView: {},
      threshold: '30%',
      isDropdownOpen: {
        area: false,
        time: false,
        tripsvsregion: false
      }
    }
  })
  // const [reviewData, setReviewData] = useState();
  const [selectedReview, selectReview] = useState();


  // declarations
  const dataArray = planningData.kml.Document.Folder.Placemark;

  const { rawData, settings, areaData, regionalTrips, currentRegionalTrips, caregivers, regionCaregivers } = state
  const { regionData } = areaData;

  const setCurrentRegionalTrips = (currentRegionalTrips) => {
    dispatch({ type: "SET_CURRENT_REGIONAL_TRIPS", currentRegionalTrips })
  }
  const setRegionalTrips = (regionalTrips) => {
    dispatch({ type: "SET_REGIONAL_TRIPS", regionalTrips })
  }
  const setCurrentData = (currentAllTrips) => {
    dispatch({ type: "SET_CURRENT_ALL_TRIPS", currentAllTrips })
  }
  const setCaregiverData = (caregivers) => {
    dispatch({ type: "SET_CAREGIVER_DATA", caregivers })
  }
  const setRegionCaregiverData = (regionCaregivers) => {
    dispatch({ type: "SET_REGION_CAREGIVER_DATA", regionCaregivers })
  }
  const setXlsData = (xls) => {
    dispatch({ type: "SET_XLS_DATA", xls })
  }
  const setCaregiverThreshold = (threshold) => {
    dispatch({ type: "SET_CAREGIVER_THRESHOLD", threshold })
  }
  const setProcessedData = (processedData) => {
    dispatch({ type: "SET_PROCESSED_DATA", processedData })
  }
  const setRawData = (rawData) => {
    dispatch({ type: "SET_RAW_DATA", rawData })
  }
  const toggleAreavsRegion = () => {
    dispatch({ type: "SET_REGION_TRIP", value: !state.settings.tripsvsregion })
  }
  const setTimeEvent = (event) => { dispatch({ type: "SET_TIME", value: event.target.value }) }
  const setRegionData = (regionData) => {
    dispatch({ type: "SET_REGION_DATA", regionData })
  }
  const setLineWidth = (value) => {
    dispatch({ type: "SET_LINE_WIDTH", value })
  }
  const setBorders = (borders) => {
    dispatch({ type: "SET_BORDERS", borders })
  }
  const setStats = (stats) => {
    dispatch({ type: "SET_STATS", stats })
  }
  const setCensus = (stats) => {
    dispatch({ type: "SET_CENSUS", stats })
  }
  const setAreaDropdown = (value) => {
    dispatch({ type: "SET_AREA_DROPDOWN", value })
  }
  const setTimeDropdown = (value) => {
    dispatch({ type: "SET_TIME_DROPDOWN", value })
  }
  const setTripRegionDropdown = (value) => {
    dispatch({ type: "SET_TIPREGION_DROPDOWN", value })
  }
  const setArea = (value) => {
    dispatch({ type: "SET_AREA", value });
  }
  const setTime = (value) => {
    dispatch({ type: "SET_TIME", value });
  }

  const toggleAllData = () => {
    const { selectedPlanningArea } = settings;
    selectedPlanningArea === 'SINGAPORE' ? setArea('WESTERN ISLANDS') : setArea('SINGAPORE')
    setTime('DAY')
  }

  function selectPlanningAreaBorders(planningArea) {
    if (planningArea == '') {
      return []
    }
    // planningArea
    const selectedData = regionData.filter(item => item.name == planningArea)
    // console.log(selectedData)
    const { coordinates } = selectedData[0]
    const borders = [];
    for (let i = 0; i < coordinates.length; i += 2) {
      if (i + 1 < coordinates.length) {
        borders.push([
          [coordinates[i].lat, coordinates[i].lon],
          [coordinates[i + 1].lat, coordinates[i + 1].lon]
        ]);
      }
    }
    // console.log(borders)
    return borders
  }
  // console.log(regionData)
  function extractData(obj) {
    const simpleData = obj.ExtendedData.SchemaData.SimpleData;
    const coordinatesString = obj.Polygon.outerBoundaryIs.LinearRing.coordinates;
    const coordinatesArray = coordinatesString.split(' ');
    const name = simpleData[0];
    const region = simpleData[3]
    // Process coordinates
    const coordinates = coordinatesArray.map(coordinate => {
      const [lon, lat, elevation] = coordinate.split(',');
      return { lon: parseFloat(lon), lat: parseFloat(lat), elevation: parseFloat(elevation) };
    });
    return {
      name,
      region,
      coordinates
    };
  }

  // Extracting data from each object in the array

  const extractedResults = dataArray.map(obj => extractData(obj));

  useEffect(() => {
    console.log(state)
  }, [])
  useEffect(() => {
    console.log(state)
  })
  useEffect(() => {
    if (regionalTrips) {
      const { timeOfDay, selectedPlanningArea } = settings;
      const regionTripDataSelected = regionalTrips.filter(item => item.origin_area_name === selectedPlanningArea)
      setCurrentRegionalTrips(regionTripDataSelected)
    }
  }, [regionalTrips, settings])

  //SET PLANNING DATA
  useEffect(() => {
    const { timeOfDay, selectedPlanningArea } = settings;
    if (regionalTrips) {
      const regionTripDataSelected = regionalTrips.filter(item => item.origin_area_name === selectedPlanningArea)
      const regionTripData = regionTripDataSelected.filter(item => timeOfDay === 'DAY' ? true : item.section_of_day.toUpperCase() === timeOfDay)
      setCurrentRegionalTrips(regionTripData)

    }
    const regionCaregiverData = []
    if (caregivers) {
      const caregiversValues = Object.entries(caregivers)
      caregiversValues.forEach(element => {
        // if (element) {
        if (element && element[0]) {
          const elementName = element[0].substring(11, element[0].length - 7)
          const aa = element[1].filter(item => item.area ? item.area === selectedPlanningArea : false)[0]
          if (elementName && aa) {
            // console.log(elementName, element)
            // console.log(
            console.log(aa, '33333333')
            // )
            const sector = elementName.split('_')[0]
            // console.log(elementName.split('_')[1])
            const threshold = elementName.split('_')[1] + '%'
            // console.log(sector, threshold, '888888888888888')
            regionCaregiverData.push({ ...aa, sector, threshold })
          }
        }
        // }
      });
      // console.log('--------- CCCCCC --------', regionCaregiverData)

      // console.log(regionTripDataSelected)
      setRegionCaregiverData(regionCaregiverData)
    }

  }, [regionalTrips, settings, caregivers])

  //SET PLANNING DATA
  useEffect(() => {
    const { timeOfDay, selectedPlanningArea } = settings;
    // console.log('sssss')
    // const { rawData } = state
    const dataToMap = rawData

    // const bus_data = dataToMap.filter(item => parseInt(item.origin_location_id) > 1000)  // select only bus data
    const bus_data = dataToMap                                                              // select bus and mrt data
    const selectedData = bus_data.filter(item => {
      if (item.section_of_day) {
        return timeOfDay === 'DAY' ? true : item.section_of_day.toUpperCase() === timeOfDay
      }
    })
    // const selectedData = bus_data;
    // console.log(selectedData, timeOfDay)
    const rows = selectedData.flatMap((obj) => {
      const row = [[parseFloat(obj.origin_lat), parseFloat(obj.origin_lon)],
      [parseFloat(obj.destination_lat), parseFloat(obj.destination_lon)]]
      // console.log('row', row)
      if (row[0][0] & row[0][1] & row[1][0] & row[1][1]) {
        return { loc: row, distance: obj.mean_distance, planningArea: obj.planningArea }
      }
    })
      .filter((row_1) => {
        if (row_1) {
          // console.log('********', row_1)
          const { loc, distance } = row_1;
          return (
            loc[0].every((coord) => !isNaN(coord)) &&
            loc[1].every((coord) => !isNaN(coord)) &&
            distance !== undefined
          );
        }
      })
      ;

    const updatedTripData = []
    rows.forEach(element => {
      // console.log(element)
      const geoData = { lat: element.loc[0][0], lon: element.loc[0][1] }
      regionData && regionData.forEach(e => {

        if (isCoordinateWithinPolygon(geoData, e.coordinates)) {

          const elementWithArea = { ...element, planningArea: e.name }
          updatedTripData.push(elementWithArea);
        }
      });
      // const a = c == 7 ? 5 : 7
      // element.origin_lat
      // element.origin_lon
    });
    // getOriginPlanningArea()
    setProcessedData(updatedTripData)
    const currentAllTrips = updatedTripData.filter(item => selectedPlanningArea === 'SINGAPORE' ? true : item.planningArea === selectedPlanningArea)

    setCurrentData(currentAllTrips)





    // // planningArea
    // if (selectedPlanningArea) {
    //   const borderData = regionData.filter(item => item.name === selectedPlanningArea)
    //   // console.log(selectedData)
    //   const { coordinates } = borderData[0]
    //   const borders = [];
    //   for (let i = 0; i < coordinates.length; i += 2) {
    //     if (i + 1 < coordinates.length) {
    //       borders.push([
    //         [coordinates[i].lat, coordinates[i].lon],
    //         [coordinates[i + 1].lat, coordinates[i + 1].lon]
    //       ]);
    //     }
    //   }
    // }
  }, [rawData, regionData, settings])

  const areaDropdownArray = extractedResults.map(station => (
    <DropdownMenuItem onClick={() => dispatch({ type: "SET_AREA", value: station.name })}>
      {station.name}
    </DropdownMenuItem>
  ))
  // #851E8F, #93379B, #A050A8, #AE69B4, #BB82C1, #C99BCD, #D6B4DA, #E4CDE6, #F1E6F3, #FFFFFF, #701B78
  const colors = [
    { color: '#FFFFFF', value: '1' }, { color: '#F1E6F3', value: '2-3' }, { color: '#E4CDE6', value: '4-8' },
    { color: '#D6B4DA', value: '9-15' }, { color: '#C99BCD', value: '16-31' }, { color: '#BB82C1', value: '32-63' },
    { color: '#AE69B4', value: '64-127' }, { color: '#A050A8', value: '128-255' }, { color: '#93379B', value: '256-511' },
    { color: '#851E8F', value: '512-1023' }, { color: '#701B78', value: '1024-' }];
  // colors[(Math.floor(Math.log(value)) * 2)]
  // });
  const background = "https://images.pexels.com/photos/34153/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
  const background2 = "https://images.unsplash.com/photo-1598698222618-3602b9da496d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3870&q=80"
  const background3 = "https://images.unsplash.com/photo-1583387848679-3fd7d847b1ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3097&q=80"
  // const selectedCaregivers = regionCaregivers && regionCaregivers.filter(element => element.threshold === settings.threshold)
  return (
    <div style={{
      display: 'flex', backgroundImage: `url(${background3})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'repeat',
      backgroundAttachment: 'fixed',
      backgroundPositionY: '40%'
    }}>

      <CsvReader
        setRawData={setRawData}
        setRegionalTrips={setRegionalTrips}
        setCurrentData={setCurrentData}
        setCaregiverData={setCaregiverData}
        setRegionData={setRegionData}
        setStats={setStats}
        setCensus={setCensus}
        setXlsData={setXlsData}
        extractedResults={extractedResults}
      />


      <div style={{ display: 'flex', width: '80%', height: '1000', flexDirection: 'column', position: 'relative', }}>
        <MapBar
          state={state}
          currentRegionalTrips={currentRegionalTrips}
          selectedReview={selectedReview}
          selectReview={selectReview}
          setLineWidth={setLineWidth}
          setArea={setArea}
          setCaregiverThreshold={setCaregiverThreshold}
          regionCaregivers={regionCaregivers}
          colors={colors}
        />
      </div>
      <div className='upper-layer' style={{ display: 'flex', width: '30%', height: '1000', flexDirection: 'column' }}>

        {/* <Bar options={options} data={data} /> */}
        <SideBar
          setTimeEvent={setTimeEvent}
          state={state}
          currentRegionalTrips={currentRegionalTrips}
          toggleAllData={toggleAllData}
          areaDropdownArray={areaDropdownArray}
          toggleAreavsRegion={toggleAreavsRegion}
        ></SideBar>

      </div>
      {/* <div className="App">
      <h1>React Leaflet Maps</h1>
      <div className="rowC">
        <div className="columnC">Test 1</div>
        <div className="RowC">Test 2</div>
        <div className="RowA">
        <ul>
          {Movies.map(data => (
              <li key={data.id}> {data.name}</li>
          ))}
        </ul> */}


      {/* </div>
        <div className="RowA">
        <ul>
        {Movies.map(data => (
            <li key={data.id}> {data.name}</li>
        ))}
      </ul>
        </div>
      {/* <div className="App">
      <h1>React Leaflet Maps</h1>
      <div className="rowC">
        <div className="columnC">Test 1</div>
        <div className="RowC">Test 2</div>
        <div className="RowA">
        <ul>
          {Movies.map(data => (
              <li key={data.id}> {data.name}</li>
          ))}
        </ul> */}


    </div >
  );

}

export default App;
