import { FETCH_SUBLOCS, CREATE_SUBLOC } from '../constants/actionTypes';
import * as api from '../api/index';

export const createSubLoc = subloc => async dispatch => {
  try {

      const { data } = await api.createSubloc(subloc);
      dispatch({ type: CREATE_SUBLOC, payload: data});
    

  } catch (error) {
      console.log('reduxERROR: ', error)
  }
}


//accept the history object that came from the front end
export const getSublocs = () => async dispatch => {
    try {

      const { data } = await api.fetchSublocs();
      dispatch({ type: FETCH_SUBLOCS, payload: data});

    } catch (error) {
      console.log(error);
    }
};
  