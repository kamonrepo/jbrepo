import axios from 'axios';

//cloud
// const API = axios.create({ baseURL: 'https://igrey-connect.herokuapp.com/' });

//local
const API = axios.create({ baseURL: 'http://localhost:4444' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

export const signIn = (formData) => API.post('/users/signin', formData);
export const signUp = (formData) => API.post('/users/signup', formData);

export const createLocation = newLocation => API.post('/location', newLocation);
export const fetchLocations = () => API.get('/location');

export const createGroup = newGroup => API.post('/group', newGroup);
export const fetchGroups = () => API.get('/group');

export const createClient = newClient => API.post('/client', newClient);
export const fetchClientGroupBy = (group) => API.get(`/client/${group}`);

export const createBillrun = newBillrun => API.post('/billrun', newBillrun);
export const fetchBillrun = () => API.get('/billrun');

export const fetchBillrunCan = () => API.get('/billruncandidate');

export const fetchBRCById = id => API.get(`/billruncandidate/${id}`);
export const updateBRC = id => API.patch('/billruncandidate/updateBRC', id);

export const createCategory = newCategory => API.post('/category', newCategory);
export const fetchCategory = () => API.get('/category');

export const createPlan = newPlan => API.post('/plan', newPlan);
export const fetchPlanByCategoryId = id => API.get(`/plan/${id}`);
export const fetchPlan = () => API.get('/plan');

export const createFamily = combinedData => API.post('/family', combinedData);
export const updateFamily = (id, updatedFamily) => API.patch(`/family/${id}`, updatedFamily);
export const fetchFamilies = () => API.get('/family');
export const deleteFamily = id => API.delete(`/family/${id}`);
