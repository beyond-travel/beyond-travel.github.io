import React from 'react'
import Papa from 'papaparse'
import csvfile from '../data/loc_temp.csv'
import mar_freq from '../data/mar_freq_pd.csv'
import total_pop from '../data/total_population_data.csv'
import {
  caregivers_adult_30_unique, caregivers_adult_50_unique, caregivers_adult_75_unique, caregivers_adult_100_unique,
  caregivers_student_30_unique, caregivers_student_50_unique, caregivers_student_75_unique, caregivers_student_100_unique,
  caregivers_senior_30_unique, caregivers_senior_50_unique, caregivers_senior_75_unique, caregivers_senior_100_unique,
  // caregivers_child_30_unique, caregivers_child_50_unique, caregivers_child_75_unique, caregivers_child_100_unique
} from '../data/trips_w_child'
import xsl from '../data/t1-9.xls'
import subzone_population from '../data/subzone_population.csv'
import mar_freq_data from '../data/marfreq_data.csv'
import planningData from '../data/planning-boundary-area.json'
import { ExcelRenderer, OutTable } from 'react-excel-renderer';
import mar_freq_region_summary from '../data/mar_freq_region_summary.csv'
export default function CsvReader({ setRawData, setRegionalTrips, setCurrentData, setRegionData, extractedResults, setStats, setCaregiverData, setXlsData, setCensus }) {

  //   const [rows, setRows] = React.useState([])
  // Function to extract name and coordinates from region data
  // function extractData(obj) {
  //   const simpleData = obj.ExtendedData.SchemaData.SimpleData;
  //   const coordinatesString = obj.Polygon.outerBoundaryIs.LinearRing.coordinates;
  //   const coordinatesArray = coordinatesString.split(' ');
  //   const name = simpleData[0];
  //   const region = simpleData[3]
  //   // Process coordinates
  //   const coordinates = coordinatesArray.map(coordinate => {
  //     const [lon, lat, elevation] = coordinate.split(',');
  //     return { lon: parseFloat(lon), lat: parseFloat(lat), elevation: parseFloat(elevation) };
  //   });
  //   return {
  //     name,
  //     region,
  //     coordinates
  //   };
  // }

  // // Extracting data from each object in the array
  // const extractedResults = dataArray.map(obj => extractData(obj));



  React.useEffect(() => {
    async function getData(file, setData) {
      const response = await fetch(file)
      //   console.log(response)
      const reader = response.body.getReader()
      const result = await reader.read() // raw array
      const decoder = new TextDecoder('utf-8')
      const csv = decoder.decode(result.value) // the csv text

      const results = Papa.parse(csv, { header: true }) // object with { data, errors, meta }
      const csvData = results.data // array of objects

      // const selectedData = csvData.filter(item => {
      //   return item.section_of_day == timeOfDay
      //   // item.section_of_day == timeOfDay
      // })
      // item.section_of_day == timeOfDay
      // console.log(file)
      setData(csvData)
      // setRegionData(extractedResults)

      // return csvData;

      // setTripData(selectedData)
      /* -- set rows  -- */
      //   const rows = selectedData.flatMap((obj) => {
      //     const row = [[parseFloat(obj.origin_lat), parseFloat(obj.origin_lon)],
      //     [parseFloat(obj.destination_lat), parseFloat(obj.destination_lon)]]
      //     // console.log(row)
      //    if  (row[0][0] & row[0][1] & row[1][0] & row[1][1])
      //    { 
      //     return row
      //     }
      // });

      //   const rows_1 = rows.filter(function( element ) {
      //     return element !== undefined;
      //  });
      //   // setRows(rows_1)
    }
    async function getDataArray(fileArray, setData) {
      const dataSet = {}
      for (const file of fileArray) {
        const fileName = file.split('/')[3].split('.')[0]

        const response = await fetch(file)

        const reader = response.body.getReader()
        const result = await reader.read() // raw array
        const decoder = new TextDecoder('utf-8')
        const csv = decoder.decode(result.value) // the csv text

        const results = Papa.parse(csv, { header: true }) // object with { data, errors, meta }
        // console.log(results)
        const csvData = results.data // array of object
        dataSet[fileName] = csvData
      }

      setData(dataSet)
    }
    getData(mar_freq, setRawData)
    getData(mar_freq_region_summary, setRegionalTrips)
    getData(total_pop, setStats)
    getData(subzone_population, setCensus)

    // ExcelRenderer(xsl, (err, resp) => {

    //   console.log(resp)
    //   if (err) {
    //     console.log(err);
    //   }
    //   else {
    //     setXlsData({
    //       cols: resp.cols,
    //       rows: resp.rows
    //     });
    //   }
    // });
    const caregivers_array = [caregivers_adult_30_unique, caregivers_adult_50_unique, caregivers_adult_75_unique, caregivers_adult_100_unique,
      caregivers_student_30_unique, caregivers_student_50_unique, caregivers_student_75_unique, caregivers_student_100_unique,
      caregivers_senior_30_unique, caregivers_senior_50_unique, caregivers_senior_75_unique, caregivers_senior_100_unique,
      // caregivers_child_30_unique, caregivers_child_50_unique, caregivers_child_75_unique, caregivers_child_100_unique
    ]
    getDataArray(caregivers_array, setCaregiverData)
    // getData(caregivers_child, setCaregiversAdult)
    // getData(caregivers_senior, setCaregiversAdult)
    // getData(caregivers_student, setCaregiversAdult)
    // getData(mar_freq)
    // setRawData(csvData)
    setRegionData(extractedResults)

    // const reginal_trip_data =  getData(mar_freq_region_summary)

  }, []) // [] means just do this once, after initial render

  return (
    <div className="app">
      {/* <table cols={tripColumns} rows={rsows} /> */}
    </div>
  )
}