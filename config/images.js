//Attention ici: créer un filtres avec **/*.* va remplacer la copie redimensionnée standard du générateur
module.exports = {
    config:{
      '**/*.+(jpeg|jpg|gif|png|tiff|webp)': {
        width: 500,
        height: 300,
        fit:"cover",
        rename:{
          prefix: ".thumbs/",
          suffix: ""
        }
      }
    }
};
