import data from "@data/languages.json";

const imageMap: { [key: string]: any } = { 
    "inglaterra.png": require("@assets/Flags/flagInglaterra.webp"),
    "portugal.png": require("@assets/Flags/flagPortugal.webp"),
    "espanha.png": require("@assets/Flags/flagEspanha.webp"),
    "franca.png": require("@assets/Flags/flagFranca.webp"),
    "italia.png": require("@assets/Flags/flagItalia.webp"),
    "japao.png": require("@assets/Flags/flagJapao.webp"),
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
export const loadLanguages = async () => {
    try {
      return data.map((item: { id: string; name: string; image:string}) => ({
        id: Number(item.id),
        name: item.name,
        image: loadImage(item.image)
      }));
    } catch (error) {
      console.error("Erro ao carregar linguas", error);
      return [];
    }
  };