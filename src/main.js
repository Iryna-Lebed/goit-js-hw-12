import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImagesByQuery } from "./js/pixabay-api.js";
import { createGallery,showLoader,  hideLoader,
    showLoadMoreButton, hideLoadMoreButton, 
    loadMoreIs, scrollNewContent, clearGallery 
  } from "./js/render-functions.js";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");

let query = "";
let page = 1;
let totalHits = 0;
const per_page = 15;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  query = e.target.elements["search-text"].value.trim();

  if (query === '') {
    iziToast.warning({
      title: "Warning",
      message: 'Empty input field',
      backgroundColor: "#ff4d4f",
     
      messageColor: "#fff",
     
    });
  
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();
 

  try {
    const data = await getImagesByQuery(query, page, per_page);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
       
        message: "Sorry, there are no images matching your search query.Please try again!",
      
      });
      return;
    } 
         createGallery(data.hits);
         loadMoreIs(totalHits, page, per_page);


    

   
  } catch (error) {
    iziToast.error({
     
      message: "An error occurred while fetching images. Please try again.",
      backgroundColor: "#ff4d4f",
  
      messageColor: "#fff",
   
    });
  } finally {
    hideLoader();

  }
  e.target.reset();
});

loadMoreBtn.addEventListener("click", async () => {
  
  page += 1;
  showLoader();


  try {
    const data = await getImagesByQuery(query, page, per_page);
    createGallery(data.hits);
    loadMoreIs(totalHits, page, per_page);
    scrollNewContent();

    // if (page * per_page >= totalHits) {
    //   hideLoadMoreButton();
    //   iziToast.info({
    //     title: "End",
    //     message: "You've reached the end of search results.",
    //     position: "topCenter",
    //   });
    // }
  } catch (error) {
    iziToast.error({ message: "An error occurred while fetching images. Please try again." });
  } finally {
    hideLoader();
   
  }
});

