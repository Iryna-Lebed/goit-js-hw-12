import Axios from "axios";

const axios = Axios.create({
    baseURL: 'https://pixabay.com/api/',
    params:{
        key: '51939816-d2a4c418c191417f29ceae84e',
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
    },

});

export async function getImagesByQuery(query, page, per_page = 15) {
    const response = await axios.get('', {
        params: {
            q: query,
            page: page,
            per_page: per_page,
        }

    });
    return response.data;
}
//   const params = {
//     key: API_KEY,
//     q: query,
//     image_type: "photo",
//     orientation: "horizontal",
//     safesearch: true,
//     page,
//     per_page,
//   };

//   try {
//     const response = await axios.get(BASE_URL, { params });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching images:", error);
//     return { hits: [], totalHits: 0 }; // повертаємо пустий результат, щоб додаток не падав
//   }

