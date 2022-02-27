import { CREATE_LOCATION, FETCH_LOCATIONS } from '../constants/actionTypes';
import * as api from '../api/index';

export const createLocation = (location) => async (dispatch) => {
    try {

        const { data } = await api.createLocation(location);
        // console.log('redux-action-create-location-server-respond: ', data)

        dispatch({ type: CREATE_LOCATION, payload: data});
      

    } catch (error) {
        console.log('redux-action-create-location-ERROR: ', error)
    }
}

//accept the history object that came from the front end
export const getLocations = () => async dispatch => {
    try {

      const { data } = await api.fetchLocations();
      // console.log('redux-action-get-locations-server-respond: ', data)
      dispatch({ type: FETCH_LOCATIONS, payload: data});

    } catch (error) {
      console.log(error);
    }
  };
  