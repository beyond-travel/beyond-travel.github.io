export const reducer = (state, action) => {
    const { settings, areaData } = state
    const { isDropdownOpen } = settings
    const { value, currentAllTrips, rawData, regionData, borders, processedData, regionalTrips, currentRegionalTrips, stats, caregivers, regionCaregivers, xls, threshold } = action
    switch (action.type) {
        case "SET_PROCESSED_DATA":
            return { ...state, processedData };
        case "SET_XLS_DATA":
            return { ...state, xls };
        case "SET_REGION_CAREGIVER_DATA":
            return { ...state, regionCaregivers };
        case "SET_CAREGIVER_DATA":
            return { ...state, caregivers };
        case "SET_CURRENT_ALL_TRIPS":
            return { ...state, currentAllTrips };
        case "SET_RAW_DATA":
            return { ...state, rawData };
        case "SET_CURRENT_REGIONAL_TRIPS":
            return { ...state, currentRegionalTrips };
        case "SET_REGIONAL_TRIPS":
            return { ...state, regionalTrips };
        case "SET_STATS":
            return { ...state, stats };
        case "SET_CENSUS":
            return { ...state, census: stats };
        //Region
        case "SET_BORDERS":
            return { ...state, areaData: { ...areaData, borders } };
        case "SET_REGION_DATA":
            return { ...state, areaData: { ...areaData, regionData } };
        //Settings
        case "SET_AREA":
            return { ...state, settings: { ...settings, selectedPlanningArea: value } }
        case "SET_TIME":
            return { ...state, settings: { ...settings, timeOfDay: value } }
        case "SET_LINE_WIDTH":
            return { ...state, settings: { ...settings, lineWidth: value } }
        case "SET_VIEW":
            return { ...state, settings: { ...settings, currentView: value } }
        case "SET_REGION_TRIP":
            return { ...state, settings: { ...settings, tripsvsregion: value } }

        case "SET_AREA_DROPDOWN":
            return { ...state, settings: { ...settings, isDropdownOpen: { ...isDropdownOpen, area: value } } }
        case "SET_TIME_DROPDOWN":
            return { ...state, settings: { ...settings, isDropdownOpen: { ...isDropdownOpen, time: value } } }
        case "SET_TIPREGION_DROPDOWN":
            return { ...state, settings: { ...settings, isDropdownOpen: { ...isDropdownOpen, tripsvsregion: value } } }
        case "SET_CAREGIVER_THRESHOLD":
            return { ...state, settings: { ...settings, threshold } }
        default:
            return state;
    }
}