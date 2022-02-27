import { FETCH_LOCATIONS } from '../constants/actionTypes';

export default (locations = [], action) => {
   // console.log('client/src/reducers/chat/users action.payload: ', action.payload,'\n','client/src/reducers/chat/users/users: ', users);
    switch (action.type) {
        case FETCH_LOCATIONS:

            // console.log('reducer-locations: ', action.payload)
            return action.payload;        

        default:
            return locations; 
    }
};