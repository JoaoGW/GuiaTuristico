import data from "@data/tags.json";

// const imageMap: { [key: string]: any } = {
    
//     "av_paulista.png": require("@assets/av_paulista.png"),
//     "ibirapuera.png": require("@assets/ibirapuera.png"),
//     "shopping_jk.png": require("@assets/shopping_jk.png"),
//     "teatro_municipal.png": require("@assets/teatro_municipal.png"),
//     "masp.png": require("@assets/masp.png"),
//     "aquario_sao_paulo.png": require("@assets/aquario_sao_paulo.png"),
//     "liberdade.png": require("@assets/liberdade.png"),
//     "pinacoteca.png": require("@assets/pinacoteca.png"),
//     "farol_santander.png": require("@assets/farol_santander.png"),
//     "pacaembu.png": require("@assets/pacaembu.png"),
//     "profile.png": require("@assets/profile.png"),
//   };

// export const loadImage = (imageName: string) => {
//     return imageMap[imageName] || require("@assets/default.webp");
// };

export const loadTags = async () => {
    try {
      return data.map((item: { id: string; name: string;}) => ({
        id: Number(item.id),
        name: item.name
      }));
    } catch (error) {
      console.error("Erro ao carregar tags:", error);
      return [];
    }
  };

