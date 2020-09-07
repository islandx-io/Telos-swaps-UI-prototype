import axios from 'axios'

const baseURL = axios.create({
  baseURL: 'https://us-central1-coolx-242811.cloudfunctions.net/'
  //method: 'post'
});

async function requestApi(endpoint: string, params: any) {
  try {
    return baseURL.post(endpoint, params);
    // return await baseURL.request({
    //   url: endpoint,
    //   method: 'post'
    // })
  } catch (error) {
    throw error;
  }
}

export default requestApi;
