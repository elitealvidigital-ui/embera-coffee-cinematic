export const mediaUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

export const images = {
  master: mediaUrl("media/images/master-product.webp"),
  origin: mediaUrl("media/images/frame-origin.webp"),
  roast: mediaUrl("media/images/frame-roast.webp"),
  extraction: mediaUrl("media/images/frame-extraction.webp"),
  product: mediaUrl("media/images/frame-product.webp"),
};

export const journeyVideo = {
  desktop: mediaUrl("media/video/journey-master.mp4"),
  mobile: mediaUrl("media/video-mobile/journey-master.mp4"),
  poster: mediaUrl("media/posters/journey-01.webp"),
};

export const journeyPhases = [
  { number: "01", label: "Origin", title: "Coffee, awakened by fire.", eyebrow: "The first spark" },
  { number: "02", label: "Roast", title: "Roasted with intent.", eyebrow: "Time, heat, instinct" },
  { number: "03", label: "Extract", title: "Pulled into ritual.", eyebrow: "Pressure reveals character" },
  { number: "04", label: "Ritual", title: "A richer kind of morning.", eyebrow: "The pause before the day" },
  { number: "05", label: "Reserve", title: "Forest Reserve.", eyebrow: "Dark chocolate. Caramel. Cedar." },
];
