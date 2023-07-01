import { FETCH_SUBLOCS } from '../constants/actionTypes';

export default (sublocations = [], action) => {
   // console.log('client/src/reducers/chat/users action.payload: ', action.payload,'\n','client/src/reducers/chat/users/users: ', users);
    switch (action.type) {
        case FETCH_SUBLOCS:
            
            return action.payload;        

        default:
            return sublocations; 
    }
};