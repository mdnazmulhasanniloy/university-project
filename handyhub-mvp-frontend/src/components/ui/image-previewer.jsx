"use client";

import Lightbox from "yet-another-react-lightbox";
import {
  Fullscreen,
  Zoom,
  Slideshow,
} from "yet-another-react-lightbox/plugins";

export default function ImagePreviewer({
  imageUrls,
  previewImgIndex,
  setPreviewImgIndex,
}) {
  // Define image slides for lightbox
  const imageSlides = imageUrls?.map((imageUrl) => {
    return { src: imageUrl };
  });

  if (!imageUrls) return null;

  return (
    <Lightbox
      index={previewImgIndex}
      slides={imageSlides || []}
      open={previewImgIndex >= 0}
      close={() => setPreviewImgIndex(-1)} // Hide lightbox if index -1
      plugins={[Fullscreen, Zoom, Slideshow]}
    />
  );
}
