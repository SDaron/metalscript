module.exports = {
    config:{
      '**/*.*': {
        width: 1280,
        height: 1280
      }
    },
    options:{
      silent:true,
      progressive:true,
      quality: 80,
      errorOnEnlargement: false,
      errorOnUnusedImage:false,
      withoutEnlargement: true
    }
};
