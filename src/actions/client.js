import { CREATE_CLIENT, FETCH_CLIENT } from '../constants/actionTypes';
import * as api from '../api/index';

export const createClient = client => async dispatch => {
    try {

        const { data } = await api.createClient(client);
        console.log('clienmt successfull created: ', data);

        dispatch({ type: CREATE_CLIENT, payload: data});
      
    } catch (error) {
        console.log('createClient: ', error);
    }
};


export const getClientGroupBy = group => async dispatch => {
    try{

        const { data } = await api.fetchClientGroupBy(group);

        console.log('fetchClientGroupBy-RESP: ', data);
        dispatch({ type: FETCH_CLIENT, payload: data })

    } catch(error) {
        console.log('getClientGroupBy: ', error);
    }
};

  