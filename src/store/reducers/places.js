import { ADD_PLACE, DELETE_PLACE } from '../actions/actionTypes';
import placeImage from '../../../assets/austin.jpg';

const initialState = {
   places: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PLACE:
            return {
                ...state,
                places: state.places.concat({
                    name: action.placeName,
                    key: Math.random(),
                    image: placeImage
                })
            }

        case DELETE_PLACE:
            return {
                ...state,
                places: state.places.filter((place) => {
                    return place.key !== action.placeKey;
                })
            }

        default:
            return state;
    }
}

export default reducer;