import iziToast from "izitoast";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector(".gallery");
// const loader = document.querySelector(".loader");
// const loadMoreBtn = document.querySelector(".load-more");

let lightbox = new SimpleLightbox(".gallery a");

export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <li class="gallery-item">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" />
      </a>
      <div class="info">
        <p><span>Likes</span><span>${likes}</span></p>
        <p><span>Views</span><span>${views}</span></p>
        <p><span>Comments</span><span>${comments}</span></p>
        <p><span>Downloads</span><span>${downloads}</span></p>
      </div>
    </li>
  `
    )
    .join("");
  gallery.insertAdjacentHTML("beforeend", markup);
  lightbox.refresh();
}

export function clearGallery() {
  gallery.innerHTML = "";
}

export function showLoader() {
  document.querySelector('.loader').classList.remove("is-hidden");
}

export function hideLoader() {
  document.querySelector('.loader').classList.add("is-hidden");
}

export function showLoadMoreButton() {
  document.querySelector('.load-more').classList.remove("is-hidden");
}

export function hideLoadMoreButton() {
 document.querySelector('.load-more').classList.add("is-hidden");
}

export function loadMoreIs(totalHits, page, per_page = 15) {
    const maxPage = Math.ceil(totalHits / per_page);
    if (page < maxPage) {
        showLoadMoreButton();
    } else {
        hideLoadMoreButton();
        iziToast.info({
            message: "We're sorry, but you've reached the end of search results.",
        });
    };
}



export function scrollNewContent() {
    const firstCard = document.querySelector('.gallery').firstElementChild;
    if (!firstCard) return;
    const { height: cardHeight } = firstCard.getBoundingClientRect();
  
  

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}
