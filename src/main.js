import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImagesByQuery } from "./js/pixabay-api.js";
import { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton } from "./js/render-functions.js";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");

let query = "";
let page = 1;
let totalHits = 0;
const per_page = 15;
let isLoading = false;

// --- Пошук зображень ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  query = e.currentTarget.elements["search-text"].value.trim();

  if (!query) {
    iziToast.error({
      title: "Error",
      message: "Please enter a search term!",
      backgroundColor: "#ff4d4f",
      titleColor: "#fff",
      messageColor: "#fff",
      position: "topRight",
    });
    form.reset();
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();
  isLoading = true;

  try {
    const data = await getImagesByQuery(query, page, per_page);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({
        title: "No results",
        message: "Sorry, there are no images matching your search query.",
        position: "topRight",
      });
      return;
    }

    createGallery(data.hits);

  } catch (error) {
    iziToast.error({
      title: "Error",
      message: "Something went wrong!",
      backgroundColor: "#ff4d4f",
      titleColor: "#fff",
      messageColor: "#fff",
      position: "topRight",
    });
  } finally {
    hideLoader();
    isLoading = false;
    form.reset();
  }
});

// --- Load More ---
loadMoreBtn.addEventListener("click", async () => {
  if (isLoading) return;
  page += 1;
  showLoader();
  isLoading = true;

  try {
    const data = await getImagesByQuery(query, page, per_page);
    createGallery(data.hits);

    if (page * per_page >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: "End",
        message: "You've reached the end of search results.",
        position: "topCenter",
      });
    }
  } catch (error) {
    iziToast.error({ message: "Error fetching more images" });
  } finally {
    hideLoader();
    isLoading = false;
  }
});

// --- Показ кнопки при скролі донизу ---
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 10 && !isLoading) {
    if (page * per_page < totalHits) {
      showLoadMoreButton();
    }
  }
});