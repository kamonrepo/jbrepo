import { CREATE_GROUP, FETCH_GROUPS, FETCH_SUBLOCS, CREATE_SUBLOC,  CREATE_TARGETLOC } from '../constants/actionTypes';
import * as api from '../api/index';

export const createGroup = group => async dispatch => {
    try {

        const { data } = await api.createGroup(group);
        dispatch({ type: CREATE_GROUP, payload: data });
      
    } catch (error) {
        console.log('createGroup-error: ', error);
    }
}

export const createSubLoc = subloc => async dispatch => {
  try {

      const { data } = await api.createSubloc(subloc);
      dispatch({ type: CREATE_SUBLOC, payload: data});
    
  } catch (error) {
      console.log('createSubLoc-error: ', error);
  }
}

export const createTargetLoc = targetloc => async dispatch => {
  try {

      const { data } = await api.createTargetloc(targetloc);
      dispatch({ type: CREATE_TARGETLOC, payload: data});
    
  } catch (error) {
      console.log('createTargetLoc-error: ', error);
  }
}


//accept the history object that came from the front end
export const getGroups = () => async dispatch => {
    try {

      const { data } = await api.fetchGroups();
      dispatch({ type: FETCH_GROUPS, payload: data});

    } catch (error) {
      console.log(error);
    }
};

export const getSublocs = () => async dispatch => {
  try {

    const { data } = await api.fetchSublocs();
    console.log('datadatadatadatadatadatadatadatadatadatadata::::::: ', data);
    dispatch({ type: FETCH_SUBLOCS, payload: data});

  } catch (error) {
    console.log(error);
  }
};
  