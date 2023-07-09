import { FETCH_TARGETLOCS, CREATE_TARGETLOC } from '../constants/actionTypes';
import * as api from '../api/index';

export const createTargetLoc = targetloc => async dispatch => {
  try {
      const { data } = await api.createTargetloc(targetloc);
      dispatch({ type: CREATE_TARGETLOC, payload: data});
    
  } catch (error) {
      console.log('reduxERROR: ', error)
  }
}

//accept the history object that came from the front end
export const getTargetLocs = () => async dispatch => {
    try {
      const { data } = await api.fetchTargetlocs();
      dispatch({ type: FETCH_TARGETLOCS, payload: data});
      
    } catch (error) {
      console.log(error);
    }
};