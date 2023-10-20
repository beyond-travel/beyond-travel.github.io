import React, { useEffect, useRef, useState, useReducer } from "react";

import "../App.css";
import MapComponent from "./map.component";
import 'bootstrap/dist/css/bootstrap.min.css';
import BoxSx from './BoxSX'
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import RenderingCaregiverTable from './RenderingCaregiverTable'
import RenderingArrayOfObjects from './RenderingArrayOfObjects'
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import SideBar from "./SideBar";
import BarChartHor from "./BarChartHor";

export default function MapBar({ state, currentRegionalTrips, selectedReview, selectReview, setLineWidth, setArea, regionCaregivers = [], setCaregiverThreshold, colors }) {
    console.log('selectedCaregivers', regionCaregivers)
    const selectedCaregivers = regionCaregivers && regionCaregivers.length > 0 ? regionCaregivers.filter(element => element.threshold === state.settings.threshold) : []
    console.log('selectedCaregivers', regionCaregivers, selectedCaregivers)
    const caregiverNumbers = selectedCaregivers.map(entry => parseInt(entry.caregiver_no)); // Convert to integers
    const childNumbers = selectedCaregivers.map(entry => parseInt(entry.child_no)); // Convert to integers

    const transformedArray = [caregiverNumbers, childNumbers];
    return (
        <div style={{ display: 'flex', width: '100%', flex: 1, height: '1000', flexDirection: 'column' }}>
            {/*  */}
            <MapComponent
                selectedReview={selectedReview}
                selectReview={selectReview}
                rows={state.currentAllTrips}
                regionData={state.areaData.regionData}
                setLineWidth={setLineWidth}
                lineWidth={state.settings.lineWidth}
                setArea={setArea}
                selectedPlanningArea={state.settings.selectedPlanningArea}
                tripsvsregion={state.settings.tripsvsregion}
                currentRegionalTrips={currentRegionalTrips}
                timeOfDay={state.settings.timeOfDay}
            />
            <div className='upper-layer' style={{ display: 'flex', margin: 30, padding: 30, flexDirection: 'row' }}  >
                {/* <div >1222</div> */}
                {colors.map(element => {
                    // console.log(element)
                    return <div key={element.value} style={{ margin: 5, flexDirection: 'column' }} ><BoxSx color={element.color} />{element.value}</div>

                })
                }
                {/* <div style={{ margin: 5, flexDirection: 'row' }} ><BoxSx />HHH</div>
      <div style={{ margin: 5, flexDirection: 'row' }} ><BoxSx />{element}</div>
      <div style={{ margin: 5, flexDirection: 'row' }} ><BoxSx /></div>
      <div style={{ margin: 5, flexDirection: 'row' }} ><BoxSx /></div> */}
            </div>

            <div className='upper-layer' style={{ display: 'flex', margin: 30, padding: 30, flexDirection: 'column' }}  >
                {regionCaregivers && regionCaregivers.length > 0 &&
                    <>
                        <h2>Children traveling with another person</h2>
                        <h3>{state.settings.selectedPlanningArea}</h3>
                        <h2>By percentage of trips shared with the child</h2>
                        <ToggleButtonGroup
                            color="primary"
                            value={state.settings.threshold}
                            exclusive
                            onChange={event => setCaregiverThreshold(event.target.value)}
                            aria-label="Platform"
                        >
                            <ToggleButton value="30%">30%</ToggleButton>
                            <ToggleButton value="50%">50%</ToggleButton>
                            <ToggleButton value="75%">75%</ToggleButton>
                            <ToggleButton value="100%">100%</ToggleButton>
                        </ToggleButtonGroup>
                        <div style={{ display: 'flex', margin: 30, padding: 30, flexDirection: 'row' }}  >

                            {/* <div >1222</div> */}
                            <br></br>


                            <BarChartHor title={'Number of children frequently traveling to regions'} dataSets={transformedArray} />
                            {/* <RenderingCaregiverTable currentRegionalTrips={regionCaregivers} headings={['Caregiver Sector', 'Number of Children', 'No of Caregivers']} threshold={state.settings.threshold} /> */}
                            {/* <div style={{ margin: 5, flexDirection: 'row' }} ><BoxSx />HHH</div>
      <div style={{ margin: 5, flexDirection: 'row' }} ><BoxSx />{element}</div>
      <div style={{ margin: 5, flexDirection: 'row' }} ><BoxSx /></div>
      <div style={{ margin: 5, flexDirection: 'row' }} ><BoxSx /></div> */}

                        </div>
                    </>
                }
            </div>
            {/* <div class="container">
      <div class="item item1">item 1</div>
      <div class="item item2">item 2</div>
    </div> */}
        </div>
    )
}