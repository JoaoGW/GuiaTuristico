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

export const loadImage = (imageName: string) => {
    return imageMap[imageName] || require("@assets/default.webp");
};

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

