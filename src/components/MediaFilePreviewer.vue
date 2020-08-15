<template>
  <div>
    <template v-if="isImage(file)">
      <v-dialog>
        <template v-slot:activator="{ on }">
          <img v-on="on" class="media-file__thumbnail" :src="file.url" :alt="file.name" width="100%" height="auto">
        </template>
        <v-card flat>
          <img :src="file.url" :alt="file.name" width="100%" height="auto">
        </v-card>
      </v-dialog>
    </template>
    <template v-else-if="isAudio(file)">
      <v-btn @click="play(file)" icon x-large><v-icon size="45">mdi-play</v-icon></v-btn>
    </template>
    <template v-else-if="isPdf(file)">
      <v-icon size="64" v-text="file.icon"></v-icon>
    </template>
    <v-icon v-else size="64" v-text="file.icon"></v-icon>
  </div>
</template>

<script>
export default {
  name: 'MediaFilePreviewer',

  props: ['file'],

  methods: {
    isImage (item) {
      return item.mimetype.match(/^image.*$/);
    },

    isAudio (item) {
      return item.mimetype.match(/^audio.*$/);
    },

    isPdf (item) {
      return item.mimetype.match(/pdf.*$/);
    },

    play (file) {
      console.log(file);
    },
  },
}
</script>
