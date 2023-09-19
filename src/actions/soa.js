import { FETCH_SOA_BY_BRCID, FETCH_SOAS } from '../constants/actionTypes';
import * as api from '../api/index';


export const getSoaByBRCId = brcid => async dispatch => {
    try {

      const { data } = await api.fetchSoaByBRCID(brcid);
      dispatch({ type: FETCH_SOA_BY_BRCID, payload: data});

    } catch (error) {
      console.log(error);
    }
};

export const getSoas = () => async dispatch => {
  try {

    const { data } = await api.fetchSoas();
    dispatch({ type: FETCH_SOAS, payload: data});

  } catch (error) {
    console.log(error);
  }
};


  