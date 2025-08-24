import axios from "axios";

const API_KEY = "51939816-d2a4c418c191417f29ceae84e";
const BASE_URL = "https://pixabay.com/api/";

export async function getImagesByQuery(query, page = 1, per_page = 15) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    page,
    per_page,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    return { hits: [], totalHits: 0 }; // повертаємо пустий результат, щоб додаток не падав
  }
}
