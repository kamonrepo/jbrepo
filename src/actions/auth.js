import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });

    router.push('/home');
  } catch (error) {
    console.log(error);
  }
};

export const signup = (formData, router) => async (dispatch) => {
  console.log('client signup form redux-action: ', formData);

  try {

    const { data } = await api.signUp(formData);
    console.log('signup data: ', data)
    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {

  }
};
