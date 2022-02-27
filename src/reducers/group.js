import { FETCH_GROUPS } from '../constants/actionTypes';

export default (groups = [], action) => {
   // console.log('client/src/reducers/chat/users action.payload: ', action.payload,'\n','client/src/reducers/chat/users/users: ', users);
    switch (action.type) {
        case FETCH_GROUPS:

            // console.log('reducer-locations: ', action.payload)
            return action.payload;        

        default:
            return groups; 
    }
};