import { DELETE_PLACE, SET_PLACES, PLACE_ADDED, START_ADD_PLACE } from '../actions/actionTypes';
import placeImage from '../../../assets/austin.jpg';

const initialState = {
   places: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PLACES:
            console.log('action places in reducer=======', action.places)
            return {
                ...state,
                places: action.places
            }

        case DELETE_PLACE:
            return {
                ...state,
                places: state.places.filter((place) => {
                    return place.key !== action.placeKey;
                })
            }

        case START_ADD_PLACE:
            return {
                ...state,
                placeAdded: false
            }

        case PLACE_ADDED:
            return {
                ...state,
                placeAdded: true
            }

        default:
            return state;
    }
}

export default reducer;