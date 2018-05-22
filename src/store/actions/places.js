import { SET_PLACES, DELETE_PLACE, PLACE_ADDED, START_ADD_PLACE } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';

export const startAddPlace = () => {
    return {
        type: START_ADD_PLACE
    }
}

export const addPlace = (placeName, location, image) => {
    let authToken;
    return dispatch => {
        dispatch(uiStartLoading());
        dispatch(authGetToken())
            .catch(() => {
                alert('No token found!');
            })
            .then(token => {
                authToken = token;
                return fetch('https://us-central1-rnitcourse-1526268662241.cloudfunctions.net/storeImage', {
                    method: 'POST',
                    body: JSON.stringify({
                        image: image.base64
                    }),
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            })
            .catch(err => {
                console.log('err', err);
                alert('Something went wrong');
                dispatch(uiStopLoading());
            }) // only catches network errors, not 400/500 errors
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw(new Error());
                }
            })
            .then(parsedRes => {
                const placeData = {
                    name: placeName,
                    location,
                    image: parsedRes.imageUrl,
                    imagePath: parsedRes.imagePath
                };
                return fetch("https://rnitcourse-1526268662241.firebaseio.com/places.json?auth=" + authToken, {
                    method: "POST",
                    body: JSON.stringify(placeData)
                })
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw(new Error());
                    }
                })
                .then(parsedRes => {
                    console.log('after saving rest of place data------------', parsedRes);
                    dispatch(uiStopLoading());
                    dispatch(placeAdded());
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
    return dispatch => {
        dispatch(authGetToken())
            .then(() => {
                return fetch("https://rnitcourse-1526268662241.firebaseio.com/places.json?auth=" + token, {
                    method: 'DELETE'
                })
            })
            .catch(() => {
                alert('No token found!');
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw(new Error());
                }
            })
            .then(parsedRes => {
                console.log('parsed res-----', parsedRes);
                return { type: 'DELETE_PLACE' };
            })
            .catch(err => {
                alert('Something went wrong');
                console.log('err', err);
            })
    }
};

export const getPlaces = () => {
    return dispatch => {
        dispatch(authGetToken())
            .then(token => {
                return fetch("https://rnitcourse-1526268662241.firebaseio.com/places.json?auth=" + token)
            })
            .catch(() => {
                alert('No token found!');
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw(new Error());
                }
            })
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

export const placeAdded = () => {
    return {
        type: PLACE_ADDED
    }
}