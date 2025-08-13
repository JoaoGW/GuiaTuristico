import data from "@data/tags.json";

const imageMap: { [key: string]: any } = { 
    "museu.png": require("@assets/museu.png"),
    "balada.png": require("@assets/balada.png"),
    "eventos.png": require("@assets/eventos.png"),
    "monumentos.png": require("@assets/monumentos.png"),
    "igrejas.png": require("@assets/igrejas.png"),
    "parques.png": require("@assets/parques.png"),
    "cachoeiras.png": require("@assets/cachoeiras.png"),
    "ciencias.png": require("@assets/ciencias.png"),
    "cultura.png": require("@assets/cultura.png"),
    "comida.png": require("@assets/comida.png"),
  };

/**
 * Loads an image based on the provided image name.
 *
 * @param imageName - The name of the image to load.
 * @returns The corresponding image from the `imageMap` if it exists,
 *          otherwise a default image (`@assets/default.webp`).
 */
export const loadImage = (imageName: string) => {
    return imageMap[imageName] || require("@assets/default.webp");
};

/**
 * Asynchronously loads and processes a list of tags.
 *
 * This function retrieves tag data, maps each item to a new structure, and converts
 * the `id` field to a number. It also processes the `image` field using the `loadImage` function.
 * If an error occurs during the process, it logs the error and returns an empty array.
 *
 * @returns {Promise<Array<{ id: number; name: string; image: any }>>} A promise that resolves to an array of tag objects,
 * each containing an `id` (number), `name` (string), and `image` (processed image).
 */
export const loadTags = async () => {
    try {
      return data.map((item: { id: string; name: string; image: string}) => ({
        id: Number(item.id),
        name: item.name,
        image: loadImage(item.image)
      }));
    } catch (error) {
      console.error("Erro ao carregar tags:", error);
      return [];
    }
  };