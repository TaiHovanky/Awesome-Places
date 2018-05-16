import { SET_PLACES, DELETE_PLACE } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';

export const addPlace = (placeName, location, image) => {
    return dispatch => {
        dispatch(uiStartLoading());

        fetch('https://us-central1-rnitcourse-1526268662241.cloudfunctions.net/storeImage', {
            method: 'POST',
            body: JSON.stringify({
                image: image.base64
            })
        })
        .then(res => {
           return res.json();
        })
        .then(parsedRes => {
            const placeData = {
                name: placeName,
                location,
                image: parsedRes.imageUrl
            };
            return fetch("https://rnitcourse-1526268662241.firebaseio.com/places.json", {
                method: "POST",
                body: JSON.stringify(placeData)
            })
            .then(res => res.json())
            .then(parsedRes => {
                console.log('after saving rest of place data------------', parsedRes);
                dispatch(uiStopLoading());
            })
            .catch(err => {
                console.log(err);
                alert('Something went wrong. Try again');
                dispatch(uiStopLoading());
            });
        })
        .catch(err => {
            console.log(err);
            alert('Something went wrong. Try again');
            dispatch(uiStopLoading())
        });
    };
};

export const deletePlace = (key) => {
    return {
        type: DELETE_PLACE,
        placeKey: key
    };
};

export const getPlaces = () => {
    return dispatch => {
        fetch("https://rnitcourse-1526268662241.firebaseio.com/places.json")
        .then(res => res.json())
        .then(parsedRes => {
            const places = [];
            for (let key in parsedRes) {
                places.push({
                    ...parsedRes[key],
                    image: {
                        uri: parsedRes[key].image
                    },
                    key: key
                });
            }
            dispatch(setPlaces(places));
            return { type: 'GET_PLACES' };
        })
        .catch(err => {
            alert('Something went wrong');
            console.log('err', err)
            return { type: 'GET_PLACES' };
        })
    };
};

export const setPlaces = places => {
    return {
        type: SET_PLACES,
        places: places
    };
};