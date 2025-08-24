import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton
} from "./js/render-functions.js";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");

let query = "";
let page = 1;
let totalHits = 0;

// Кнопка спочатку схована
hideLoadMoreButton();

// Обробка сабміту форми
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  query = e.currentTarget.elements["search-text"].value.trim();
  page = 1;

  if (!query) {
    iziToast.error({
      title: "Error",
      message: "Please enter a search term!",
      backgroundColor: "#ff4d4f",
      titleColor: "#fff",
      messageColor: "#fff",
      position: "topCenter",
    });
    form.reset();
    return;
  }

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({
        title: "No results",
        message: "Sorry, there are no images matching your search query. Please try again!",
        position: "topCenter",
      });
      return;
    }

    createGallery(data.hits);

    // Показуємо кнопку, якщо є ще результати
    if (totalHits > page * 15) {
      showLoadMoreButton();
    }

  } catch (error) {
    iziToast.error({
      title: "Error",
      message: "Something went wrong!",
      backgroundColor: "#ff4d4f",
      titleColor: "#fff",
      messageColor: "#fff",
      position: "topCenter",
    });
  } finally {
    hideLoader();
    form.reset();
  }
});

// Обробка кліку по кнопці Load More
loadMoreBtn.addEventListener("click", async () => {
  page += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    // Прокрутка вниз після підвантаження
    const { height } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: height * 2,
      behavior: "smooth",
    });

    // Ховаємо кнопку, якщо більше немає елементів
    if (page * 15 >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: "End",
        message: "You've reached the end of search results.",
        position: "topCenter",
      });
    } else {
      showLoadMoreButton();
    }

  } catch (error) {
    iziToast.error({
      title: "Error",
      message: "Something went wrong while loading more images!",
      position: "topCenter",
    });
  } finally {
    hideLoader();
  }
});
