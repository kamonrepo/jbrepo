import { GET_DATA_LOCATION, START_LOADING_GETDATALOC, END_LOADING_GETDATALOC } from '../constants/actionTypes';

export default (state = { isLoading: false, data: []}, action) => {

    switch (action.type) { 

        case START_LOADING_GETDATALOC: 
        return {...state, isLoading: true }
  
        case END_LOADING_GETDATALOC: 
        return {...state, isLoading: false }

        case GET_DATA_LOCATION:
            return { ...state, data: action.payload };
        default:
            return state; 
    }

};