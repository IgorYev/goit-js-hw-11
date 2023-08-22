import axios from 'axios';

const API_KEY = '38984899-fb7c4ed0e683a5a58fd4e2d52';
const BASE_URL = 'https://pixabay.com/api';

export async function fetchImages(query, page) {
  try {
    const response = await axios.get(`${BASE_URL}/`, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}