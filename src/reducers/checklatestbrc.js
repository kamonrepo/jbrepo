import { FETCH_CHECK_LATEST_BRC, START_LOADING_CLBRC, END_LOADING_CLBRC } from '../constants/actionTypes';

export default (state = { isLoading: false, data: []}, action) => {

    switch (action.type) { 

        case START_LOADING_CLBRC: 
        return {...state, isLoading: true }
  
        case END_LOADING_CLBRC: 
        return {...state, isLoading: false }

        case FETCH_CHECK_LATEST_BRC:
            return { ...state, data: action.payload };
        default:
            return state; 
    }    
};