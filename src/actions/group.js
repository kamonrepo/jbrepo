import { CREATE_GROUP, FETCH_GROUPS } from '../constants/actionTypes';
import * as api from '../api/index';

export const createGroup = group => async dispatch => {
    try {

        const { data } = await api.createGroup(group);
        dispatch({ type: CREATE_GROUP, payload: data});
      

    } catch (error) {
        console.log('reduxERROR: ', error)
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
  