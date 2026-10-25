const videoModal = document.querySelector('#video-modal');
const videoTriggers = document.querySelectorAll('.video-trigger');
const galleryTriggers = document.querySelectorAll('.gallery-trigger');
const portfolioVideo = document.querySelector('#portfolio-video');
const videoSource = portfolioVideo.querySelector('source');
const videoPlaceholder = document.querySelector('.video-placeholder');
const defaultVideoPlaceholderText = videoPlaceholder.textContent;
const portfolioImageFrame = document.querySelector('#portfolio-image-frame');
const portfolioImage = document.querySelector('#portfolio-image');
const portfolioMediaLinks = document.querySelectorAll('.portfolio-media-link');
const closeVideoButtons = document.querySelectorAll('[data-close-video]');
const videoFrame = document.querySelector('.video-frame');
const youtubeVideo = document.querySelector('#youtube-video');
const videoCarousel = document.querySelector('#video-carousel');
const carouselVideo = document.querySelector('#carousel-video');
const videoCounter = document.querySelector('#video-counter');
const photoCarousel = document.querySelector('#photo-carousel');
const packageDetails = document.querySelector('#package-details');
const packageDetailCopy = document.querySelector('#package-detail-copy');
const packageSlideContent = document.querySelector('#package-slide-content');
const packageSlideCounter = document.querySelector('#package-slide-counter');
const packageContact = document.querySelector('#package-contact');
const galleryImage = document.querySelector('#gallery-image');
const galleryCounter = document.querySelector('#gallery-counter');
const galleryTitle = document.querySelector('#video-modal-title');
const photoGalleries = {
  photos: Array.from(
  document.querySelector('#photo-assets').content.querySelectorAll('img'),
  (image) => image.getAttribute('src'),
  ),
  thumbnails: Array.from(
    document.querySelector('#thumbnail-assets').content.querySelectorAll('img'),
    (image) => image.getAttribute('src'),
  ),
};
const galleryVideos = Array.from(
  document.querySelector('#video-assets').content.querySelectorAll('source'),
  (source) => source.getAttribute('src'),
);
let currentPhotoIndex = 0;
let currentVideoIndex = 0;
let galleryPhotos = photoGalleries.photos;
let currentPackageSlides = [];
let currentPackageSlideIndex = 0;

function getYouTubeEmbedUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const isYouTubeHost = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'].includes(host);

    if (!isYouTubeHost) {
      return null;
    }

    const videoId = host === 'youtu.be'
      ? url.pathname.slice(1).split('/')[0]
      : url.pathname.startsWith('/shorts/')
        ? url.pathname.split('/')[2]
        : url.searchParams.get('v');

    return /^[\w-]{11}$/.test(videoId || '')
      ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`
      : null;
  } catch {
    return null;
  }
}

function stopYouTubeVideo() {
  youtubeVideo.hidden = true;
  youtubeVideo.src = 'about:blank';
}

function openVideoModal(event) {
  const selectedVideo = event.currentTarget.dataset.video;
  const youtubeEmbedUrl = selectedVideo ? getYouTubeEmbedUrl(selectedVideo) : null;

  videoModal.hidden = false;
  document.body.style.overflow = 'hidden';
  galleryTitle.textContent = 'Video de muestra';
  videoFrame.hidden = false;
  portfolioImageFrame.hidden = true;
  videoCarousel.hidden = true;
  photoCarousel.hidden = true;
  packageDetails.hidden = true;
  portfolioVideo.pause();
  carouselVideo.pause();
  stopYouTubeVideo();

  if (youtubeEmbedUrl) {
    portfolioVideo.hidden = true;
    videoPlaceholder.hidden = true;
    youtubeVideo.src = youtubeEmbedUrl;
    youtubeVideo.hidden = false;
  } else if (selectedVideo) {
    videoSource.src = selectedVideo;
    portfolioVideo.hidden = false;
    videoPlaceholder.hidden = true;
    portfolioVideo.load();
    portfolioVideo.play().catch(() => {});
  } else {
    portfolioVideo.hidden = true;
    videoPlaceholder.textContent = defaultVideoPlaceholderText;
    videoPlaceholder.hidden = false;
  }
}

function openPortfolioMedia(event) {
  event.preventDefault();
  const mediaUrl = event.currentTarget.href;
  const mediaPath = new URL(mediaUrl).pathname.toLowerCase();
  const title = event.currentTarget.dataset.title || 'Trabajo de muestra';
  const youtubeEmbedUrl = getYouTubeEmbedUrl(mediaUrl);
  const isVideo = /\.(mp4|m4v|webm|ogv|mov)$/.test(mediaPath);
  const isImage = /\.(avif|gif|jpe?g|png|svg|webp)$/.test(mediaPath);

  videoModal.hidden = false;
  document.body.style.overflow = 'hidden';
  galleryTitle.textContent = title;
  videoCarousel.hidden = true;
  photoCarousel.hidden = true;
  packageDetails.hidden = true;
  portfolioVideo.pause();
  carouselVideo.pause();
  stopYouTubeVideo();

  if (isVideo || youtubeEmbedUrl) {
    portfolioImageFrame.hidden = true;
    videoFrame.hidden = false;
    videoPlaceholder.hidden = true;
    if (youtubeEmbedUrl) {
      portfolioVideo.hidden = true;
      youtubeVideo.src = youtubeEmbedUrl;
      youtubeVideo.hidden = false;
    } else {
      portfolioVideo.hidden = false;
      videoSource.src = mediaUrl;
      portfolioVideo.load();
    }
  } else if (isImage) {
    portfolioVideo.pause();
    portfolioVideo.hidden = true;
    videoFrame.hidden = true;
    portfolioImage.src = mediaUrl;
    portfolioImage.alt = title;
    portfolioImageFrame.hidden = false;
  } else {
    portfolioVideo.pause();
    portfolioVideo.hidden = true;
    videoFrame.hidden = false;
    portfolioImageFrame.hidden = true;
    videoPlaceholder.textContent = 'Enlace no compatible. Usa un enlace directo a un video (MP4, WebM, MOV) o una imagen (JPG, PNG, WebP, GIF).';
    videoPlaceholder.hidden = false;
  }
}

function showVideo(index) {
  currentVideoIndex = (index + galleryVideos.length) % galleryVideos.length;
  carouselVideo.src = galleryVideos[currentVideoIndex];
  carouselVideo.load();
  videoCounter.textContent = `${currentVideoIndex + 1} / ${galleryVideos.length}`;
}

function openVideoCarousel() {
  videoModal.hidden = false;
  document.body.style.overflow = 'hidden';
  portfolioVideo.pause();
  portfolioVideo.hidden = true;
  stopYouTubeVideo();
  videoFrame.hidden = true;
  portfolioImageFrame.hidden = true;
  photoCarousel.hidden = true;
  packageDetails.hidden = true;
  videoCarousel.hidden = false;
  galleryTitle.textContent = 'Videos de muestra';
  showVideo(0);
}

function showPhoto(index) {
  currentPhotoIndex = (index + galleryPhotos.length) % galleryPhotos.length;
  const photoNumber = currentPhotoIndex + 1;

  galleryImage.src = galleryPhotos[currentPhotoIndex];
  galleryImage.alt = `Foto de muestra ${photoNumber} de ${galleryPhotos.length}`;
  galleryCounter.textContent = `${photoNumber} / ${galleryPhotos.length}`;
}

function openPhotoGallery(event) {
  videoModal.hidden = false;
  document.body.style.overflow = 'hidden';
  portfolioVideo.pause();
  carouselVideo.pause();
  stopYouTubeVideo();
  portfolioVideo.hidden = true;
  videoFrame.hidden = true;
  portfolioImageFrame.hidden = true;
  videoCarousel.hidden = true;
  packageDetails.hidden = true;
  photoCarousel.hidden = false;
  galleryTitle.textContent = event.currentTarget.dataset.galleryTitle || 'Fotos de muestra';
  galleryPhotos = photoGalleries[event.currentTarget.dataset.gallery] || photoGalleries.photos;
  showPhoto(0);
}

function showPackageSlide(index) {
  currentPackageSlideIndex = (index + currentPackageSlides.length) % currentPackageSlides.length;
  packageSlideContent.replaceChildren(currentPackageSlides[currentPackageSlideIndex].cloneNode(true));
  packageSlideCounter.textContent = `${currentPackageSlideIndex + 1} / ${currentPackageSlides.length}`;
}

function openPackageDetails(event) {
  const packageId = event.currentTarget.dataset.package;
  const packageTemplate = document.querySelector(`#package-${packageId}`);
  const packageTitle = event.currentTarget.closest('.price-card').querySelector('h3').textContent;

  if (!packageTemplate) {
    throw new Error(`No se encontró el contenido del paquete "${packageId}".`);
  }

  const packageDescription = packageTemplate.content.querySelector('.package-description');
  currentPackageSlides = Array.from(packageTemplate.content.querySelectorAll('.package-slide'));
  currentPackageSlideIndex = 0;

  videoModal.hidden = false;
  document.body.style.overflow = 'hidden';
  galleryTitle.textContent = packageTitle;
  videoFrame.hidden = true;
  portfolioVideo.hidden = true;
  stopYouTubeVideo();
  portfolioImageFrame.hidden = true;
  videoCarousel.hidden = true;
  carouselVideo.pause();
  photoCarousel.hidden = true;
  packageDetails.hidden = false;
  packageDetailCopy.replaceChildren(packageDescription.cloneNode(true));
  packageContact.href = `mailto:umpvisualizer@gmail.com?subject=${encodeURIComponent(`Información sobre el paquete ${packageTitle}`)}`;
  showPackageSlide(0);
}

function closeVideoModal() {
  videoModal.hidden = true;
  document.body.style.overflow = '';
  portfolioVideo.pause();
  carouselVideo.pause();
  stopYouTubeVideo();
}

portfolioMediaLinks.forEach((link) => link.addEventListener('click', openPortfolioMedia));

videoTriggers.forEach((button) => {
  if (!button.classList.contains('gallery-trigger') && !button.classList.contains('video-carousel-trigger') && !button.classList.contains('package-trigger')) {
    button.addEventListener('click', openVideoModal);
  }
});
document.querySelectorAll('.package-trigger').forEach((button) => {
  button.addEventListener('click', openPackageDetails);
});
galleryTriggers.forEach((button) => button.addEventListener('click', openPhotoGallery));
document.querySelectorAll('.video-carousel-trigger').forEach((button) => {
  button.addEventListener('click', openVideoCarousel);
});
document.querySelector('#previous-video').addEventListener('click', () => {
  showVideo(currentVideoIndex - 1);
});
document.querySelector('#next-video').addEventListener('click', () => {
  showVideo(currentVideoIndex + 1);
});
document.querySelector('#previous-photo').addEventListener('click', () => {
  showPhoto(currentPhotoIndex - 1);
});
document.querySelector('#next-photo').addEventListener('click', () => {
  showPhoto(currentPhotoIndex + 1);
});
document.querySelector('#previous-package-slide').addEventListener('click', () => {
  showPackageSlide(currentPackageSlideIndex - 1);
});
document.querySelector('#next-package-slide').addEventListener('click', () => {
  showPackageSlide(currentPackageSlideIndex + 1);
});
closeVideoButtons.forEach((button) => button.addEventListener('click', closeVideoModal));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !videoModal.hidden) {
    closeVideoModal();
  } else if (!videoModal.hidden && !videoCarousel.hidden && event.key === 'ArrowRight') {
    showVideo(currentVideoIndex + 1);
  } else if (!videoModal.hidden && !videoCarousel.hidden && event.key === 'ArrowLeft') {
    showVideo(currentVideoIndex - 1);
  } else if (!videoModal.hidden && !photoCarousel.hidden && event.key === 'ArrowRight') {
    showPhoto(currentPhotoIndex + 1);
  } else if (!videoModal.hidden && !photoCarousel.hidden && event.key === 'ArrowLeft') {
    showPhoto(currentPhotoIndex - 1);
  } else if (!videoModal.hidden && !packageDetails.hidden && event.key === 'ArrowRight') {
    showPackageSlide(currentPackageSlideIndex + 1);
  } else if (!videoModal.hidden && !packageDetails.hidden && event.key === 'ArrowLeft') {
    showPackageSlide(currentPackageSlideIndex - 1);
  }
});
