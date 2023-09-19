import { FETCH_SOA_BY_ID } from '../constants/actionTypes';
import * as api from '../api/index';


export const getSoaByBRCId = () => async dispatch => {
    try {

      const { data } = await api.fetchGroups();
      dispatch({ type: FETCH_SOA_BY_ID, payload: data});

    } catch (error) {
      console.log(error);
    }
};


  