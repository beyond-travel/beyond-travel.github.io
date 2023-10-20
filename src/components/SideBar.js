import React, { useEffect, useRef, useState, useReducer } from "react";

import Button from '@mui/material/Button';
import { Dropdown, DropdownMenuItem } from './Dropdown';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';


import RenderingArrayOfObjects from './RenderingArrayOfObjects'
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";

export default function SideBar({ state, currentRegionalTrips, toggleAllData, areaDropdownArray, toggleAreavsRegion, setTimeEvent }) {
    const areaCensus = state.census.filter(element => element['Planning Area'].toUpperCase() === state.settings.selectedPlanningArea)
    const areaStat = state.stats.filter(element => element['Area Name'].toUpperCase() === state.settings.selectedPlanningArea)
    const sections_of_day = ['morning', "afternoon", 'evening', 'night']
    const filteredbytime = {}
    sections_of_day.forEach(element => {
        filteredbytime[element.section_of_day] = currentRegionalTrips.filter((trip) => trip.section_of_day === element.section_of_day)
    });
    // const destinationNames = currentRegionalTrips.map((trip) => trip.destination_area_name);
    const uniqueDestinationNames = new Set(currentRegionalTrips.map((trip) => trip.destination_area_name));

    // Convert Set to an array
    const uniqueDestinationNamesArray = Array.from(uniqueDestinationNames);


    const transformedData = {
        afternoon: {
            label: "afternoon",
            data: uniqueDestinationNamesArray.map((destinationName) => (
                currentRegionalTrips
                    .filter((trip) => trip.section_of_day === "afternoon" && trip.destination_area_name === destinationName)
                    .map((trip) => trip.count_trips)[0] ? currentRegionalTrips
                        .filter((trip) => trip.section_of_day === "afternoon" && trip.destination_area_name === destinationName)
                        .map((trip) => trip.count_trips)[0] : 0

            )),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        morning: {
            label: "morning",
            data: uniqueDestinationNamesArray.map((destinationName) => (
                currentRegionalTrips
                    .filter((trip) => trip.section_of_day === "morning" && trip.destination_area_name === destinationName)
                    .map((trip) => trip.count_trips)[0] ? currentRegionalTrips
                        .filter((trip) => trip.section_of_day === "morning" && trip.destination_area_name === destinationName)
                        .map((trip) => trip.count_trips)[0] : 0

            )),
            backgroundColor: 'rgb(75, 192, 192)',
        },
        evening: {
            label: "evening",
            data: uniqueDestinationNamesArray.map((destinationName) => (
                currentRegionalTrips
                    .filter((trip) => trip.section_of_day === "evening" && trip.destination_area_name === destinationName)
                    .map((trip) => trip.count_trips)[0] ? currentRegionalTrips
                        .filter((trip) => trip.section_of_day === "evening" && trip.destination_area_name === destinationName)
                        .map((trip) => trip.count_trips)[0] : 0

            )),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        night: {
            label: "night",
            data: uniqueDestinationNamesArray.map((destinationName) => (
                currentRegionalTrips
                    .filter((trip) => trip.section_of_day === "night" && trip.destination_area_name === destinationName)
                    .map((trip) => trip.count_trips)[0] ? currentRegionalTrips
                        .filter((trip) => trip.section_of_day === "night" && trip.destination_area_name === destinationName)
                        .map((trip) => trip.count_trips)[0] : 0

            )),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
        },
    };

    // console.log(transformedData);
    // Convert the transformedData object into an array
    const transformedArray = Object.values(transformedData);
    // const afternon = currentRegionalTrips.filter((trip) => trip.section_of_day === "afternoon");
    // console.log('currentRegionalTrips: ', transformedArray)

    // Filter the data to include only entries where "Subzone" is not equal to "Total"
    const filteredData = areaCensus.filter(entry => entry["Subzone"] !== "Total");

    // Create separate arrays for "labels" and "data"
    const labelsCensus = filteredData.map(entry => entry["Subzone"]);
    const dataCensus = filteredData.map(entry => parseFloat(entry["Total"].replaceAll(',', '')));
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                // position: 'relative',
            }}
        >
            <h2>Frequent Trips By Children</h2>
            <h3>{state.settings.selectedPlanningArea}</h3>
            <div>{state.currentAllTrips.length}</div>
            <div className="columnCenter"  >
                {/* <Card onClick={() => console.log("clicked")} />
            <Card /> */}
                <Button variant="outlined" onClick={() => {
                    toggleAllData()
                }}>{'TOGGLE ALL DATA'}</Button>
                <ToggleButtonGroup
                    style={{ margin: 15 }}
                    color="primary"
                    value={state.settings.tripsvsregion}
                    exclusive
                    onChange={event => toggleAreavsRegion()}
                    aria-label="Platform"
                >
                    <ToggleButton value={true}>View Trips</ToggleButton>
                    <ToggleButton value={false}>View Regional</ToggleButton>
                </ToggleButtonGroup>
                {/* <Dropdown
            keepOpen
            open={state.settings.isDropdownOpen.tripsvsregion}
            trigger={<Button>{state.settings.isDropdownOpen.tripsvsregion ? 'TRIP' : 'REGION'}</Button>}
            menu={[
              <DropdownMenuItem onClick={() => dispatch({ type: "SET_REGION_TRIP", value: true })}>
                ALL TRIPS
              </DropdownMenuItem>,
              <DropdownMenuItem onClick={() => dispatch({ type: "SET_REGION_TRIP", value: false })}>
                REGIONWISE
              </DropdownMenuItem>,
            ]}
          /> */}
                <ToggleButtonGroup
                    color="primary"
                    value={state.settings.timeOfDay}
                    exclusive
                    onChange={event => setTimeEvent(event)}
                    aria-label="Platform"
                >
                    <ToggleButton value={"DAY"}>DAY</ToggleButton>
                    <ToggleButton value={"MORNING"}>MORNING</ToggleButton>
                    <ToggleButton value={"AFTERNOON"}>AFTERNOON</ToggleButton>
                    <ToggleButton value={"EVENING"}>EVENING</ToggleButton>
                    <ToggleButton value={"NIGHT"}>NIGHT</ToggleButton>
                </ToggleButtonGroup>
                {/* <Dropdown
            keepOpen
            open={state.settings.isDropdownOpen.time}
            trigger={<Button>{state.settings.timeOfDay}</Button>}
            menu={[
              <DropdownMenuItem onClick={() => dispatch({ type: "SET_TIME", value: "DAY" })}>
                DAY
              </DropdownMenuItem>,
              <DropdownMenuItem onClick={() => dispatch({ type: "SET_TIME", value: "MORNING" })}>
                MORNING
              </DropdownMenuItem>,
              <DropdownMenuItem onClick={() => dispatch({ type: "SET_TIME", value: "AFTERNOON" })}>
                AFTERNOON
              </DropdownMenuItem>,
              <DropdownMenuItem onClick={() => dispatch({ type: "SET_TIME", value: "EVENING" })}>
                EVENING
              </DropdownMenuItem>,
              <DropdownMenuItem onClick={() => dispatch({ type: "SET_TIME", value: "NIGHT" })}>
                NIGHT
              </DropdownMenuItem>,
            ]}
          /> */}
                <br></br>
                <Dropdown
                    keepOpen={false}
                    open={state.settings.isDropdownOpen.area}
                    trigger={<Button variant="outlined">{state.settings.selectedPlanningArea ? state.settings.selectedPlanningArea : "AREA"}</Button>}
                    menu={areaDropdownArray}
                />

            </div>


            {currentRegionalTrips.length > 0 &&
                <>
                    <h4 style={{ margin: 20 }}>Number of children frequently traveling to regions (min 10 trips per month)</h4>
                    <div className="App">
                        <div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}>
                                {/* <br></br> */}
                                {/* <RenderingArrayOfObjects
                                    currentRegionalTrips={currentRegionalTrips}
                                    headings={['Destination', 'Time of Day', 'No of Children']}
                                    sort_col='count_trips'
                                    colnames={['destination_area_name', 'section_of_day', 'count_trips']} /> */}

                                <BarChart title='Number of children frequently traveling to regions' labels={uniqueDestinationNamesArray} dataSets={transformedArray}></BarChart>
                                {/* <RenderingStats stats={stats} childCountWithin={childCountWithin} childCountOutside={childCountOutside} /> */}
                            </div>
                        </div>
                    </div>
                </>
            }
            {areaCensus.length > 0 &&
                <>
                    <h4 style={{ margin: 20 }}>Population Statistics 2015</h4>
                    <div className="App">
                        <div>
                            {/* {console.log(state.stats)} */}
                            {/* {state && state.stats && console.log(state.stats.filter(element => element['Area Name'].toUpperCase() === state.settings.selectedPlanningArea))} */}
                            <br></br>
                            <DoughnutChart data={dataCensus} labels={labelsCensus} />
                            {/* <RenderingArrayOfObjects
                                currentRegionalTrips={areaCensus}
                                headings={['Area Name', 'Subzone', 'Total']}
                                sort_col='count_trips'
                                colnames={['Planning Area', 'Subzone', 'Total']} /> */}

                            {/* <RenderingStats stats={stats} childCountWithin={childCountWithin} childCountOutside={childCountOutside} /> */}

                        </div>
                    </div>
                </>}
            {areaStat.length > 0 &&
                <>
                    <h4 style={{ margin: 20 }}>Number of children (2015)</h4>
                    <div className="App">
                        <div>
                            {/* {console.log(state.stats)} */}
                            {/* {state && state.stats && console.log(state.stats.filter(element => element['Area Name'].toUpperCase() === state.settings.selectedPlanningArea))} */}
                            <br></br>
                            <RenderingArrayOfObjects
                                currentRegionalTrips={areaStat}
                                headings={['Area Name', 'Total', 'children']}
                                sort_col='count_trips'
                                colnames={['Area Name', 'Total', 'children']} />

                            {/* <RenderingStats stats={stats} childCountWithin={childCountWithin} childCountOutside={childCountOutside} /> */}

                        </div>
                    </div></>}
        </div >
    )
}