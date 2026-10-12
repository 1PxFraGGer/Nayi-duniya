const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://serviceapi.wedpictures.in/api"
).replace(/\/api\/?$/, "");

export const getImageUrl = (img) => {
  if (!img || typeof img !== "string") {
    return "/placeholder.jpg";
  }

  if (
    img.startsWith("http://") ||
    img.startsWith("https://")
  ) {
    return img;
  }

  return `${BASE_URL}/${img.replace(/^\/+/, "")}`;
};
