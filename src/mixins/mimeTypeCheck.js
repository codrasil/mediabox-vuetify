export default {
  methods: {
    isImage (mimetype) {
      return mimetype.match(/^image.*$/);
    },

    isAudio (mimetype) {
      return mimetype.match(/^audio.*$/);
    },

    isVideo (mimetype) {
      return mimetype.match(/^video.*$/);
    },

    videoThumbnail (videoUrl, type) {
      // TODO
      return videoUrl + type;
    },

    isPdf (mimetype) {
      return mimetype.match(/pdf.*$/);
    },
  },
}
