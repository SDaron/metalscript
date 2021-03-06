module.exports = {
    config:{
      '**/*.*': {
        width: 1280,
        fit:"inside"
      }
    },
    options:{
      silent:true,
      progressive:true,
      quality: 80,
      errorOnEnlargement: false,
      errorOnUnusedImage:false,
      errorOnUnusedConfig:false,
      withoutEnlargement: true
    }
};
