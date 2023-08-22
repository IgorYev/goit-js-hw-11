import { fetchImages } from './api';
import notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more');

loadMoreBtn.style.display = 'none';
let page = 1;
let currentQuery = '';

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  page = 1;
  currentQuery = event.target.searchQuery.value;
  gallery.innerHTML = '';

  await fetchAndRenderImages();
  loadMoreBtn.style.display = 'block';
});

loadMoreBtn.addEventListener('click', async () => {
  page++;
  await fetchAndRenderImages();
});

async function fetchAndRenderImages() {
  try {
    const data = await fetchImages(currentQuery, page);

    if (data.hits.length === 0) {
      showErrorNotification();
      loadMoreBtn.style.display = 'none';
      return;
    }

    data.hits.forEach(image => {
      const imageCard = createImageCard(image);
      gallery.appendChild(imageCard);
    });

    if (page * 40 < data.totalHits) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
      notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }

    const lightbox = new SimpleLightbox('.lightbox-link');
    lightbox.refresh();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function createImageCard(image) {
  const imageCard = document.createElement('div');
  imageCard.classList.add('photo-card');

  const imgLink = document.createElement('a');
  imgLink.href = image.largeImageURL;
  imgLink.classList.add('lightbox-link');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  imgLink.appendChild(img);
  imageCard.appendChild(imgLink);

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('info');

  const likes = document.createElement('p');
  likes.textContent = `Likes: ${image.likes}`;
  const views = document.createElement('p');
  views.textContent = `Views: ${image.views}`;
  const comments = document.createElement('p');
  comments.textContent = `Comments: ${image.comments}`;
  const downloads = document.createElement('p');
  downloads.textContent = `Downloads: ${image.downloads}`;

  infoDiv.appendChild(likes);
  infoDiv.appendChild(views);
  infoDiv.appendChild(comments);
  infoDiv.appendChild(downloads);

  imageCard.appendChild(infoDiv);

  return imageCard;
}

function showErrorNotification() {
  notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
