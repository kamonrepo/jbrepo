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

export const createSubloc = newSubloc => API.post('/group/subloc', newSubloc);
export const fetchSublocs = () => API.get('/group/get/sublocs');

export const createTargetloc = newTargetloc => API.post('/group/targetloc', newTargetloc);
export const fetchTargetlocs = () => API.get('/group/get/targetlocs');

export const createClient = newClient => API.post('/client', newClient);
export const fetchClientGroupBy = (group) => API.get(`/client/${group}`);

export const createBillrun = newBillrun => API.post('/billrun', newBillrun);
export const fetchBillrun = () => API.get('/billrun');

export const fetchBillrunCan = () => API.get('/billruncandidate');
export const computeFees = cf => API.get('/billruncandidate/computeFees', cf);
export const fetchBRCByBRId = id => API.get(`/billruncandidate/${id}`);
export const updateBRC = id => API.patch('/billruncandidate/updateBRC', id);

export const createCategory = newCategory => API.post('/category', newCategory);
export const fetchCategory = () => API.get('/category');

export const createPlan = newPlan => API.post('/plan', newPlan);
export const fetchPlanByCategoryId = id => API.get(`/plan/${id}`);
export const fetchPlan = () => API.get('/plan');

export const createPayment = newPayment => API.post('/payment', newPayment);
export const updatePayment = id => API.patch('/payment/updatePayment', id);
export const fetchPayment = () => API.get('/payment');

//posts
export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);

export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`) // query params starts with question mark

export const createPost = (newPost) => API.post('/posts', newPost);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const comment = (value, id) => API.post(`/posts/${id}/commentPost`, { value });
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);


