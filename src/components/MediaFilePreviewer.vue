<template>
  <div class="media-file-previewer">
    <template v-if="isImage(file.mimetype)">
      <v-dialog>
        <template v-slot:activator="{ on }">
          <img v-on="on" class="media-file__thumbnail" :src="file.url" :alt="file.name" width="100%" height="auto">
        </template>
        <v-card flat>
          <img :src="file.url" :alt="file.name" width="100%" height="auto">
        </v-card>
      </v-dialog>
    </template>
    <template v-else-if="isVideo(file.mimetype)">
      <v-dialog>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" x-large icon><v-icon size="54">mdi-play</v-icon></v-btn>
        </template>
        <v-card flat>
          <vue-plyr>
            <video height="auto" :poster="file.poster" :src="file.url">
              <source :src="file.url" :type="file.mimetype"/>
            </video>
          </vue-plyr>
        </v-card>
      </v-dialog>
    </template>
    <template v-else-if="isAudio(file.mimetype)">
      <vue-plyr class="media-file--audio my-8">
        <audio>
          <source :src="file.url" :type="file.mimetype"/>
        </audio>
      </vue-plyr>
    </template>
    <template v-else-if="isPdf(file.mimetype)">
      <!-- <object :data="file.url" :type="file.mimetype" width="100%" height="200"></object> -->
      <v-dialog>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" x-large icon><v-icon size="64" v-text="file.icon"></v-icon></v-btn>
        </template>
        <v-card flat>
          <embed class="fill-height" :src="file.url" :type="file.mimetype" width="100%" style="height: 100vh;" />
        </v-card>
      </v-dialog>
    </template>
    <v-icon v-else size="64" v-text="file.icon"></v-icon>
  </div>
</template>

<script>
import MimeTypeCheckMixin from '../mixins/mimeTypeCheck';

export default {
  name: 'MediaFilePreviewer',

  props: ['file'],

  mixins: [ MimeTypeCheckMixin ],

  components: {
    VuePlyr: () => import('vue-plyr'),
  },
}
</script>

<style>
.media-file-previewer .media-file--audio .plyr__controls__item.plyr__volume,
.media-file-previewer .media-file--audio .plyr__controls__item.plyr__menu {
  display: none;
}

.plyr__control--overlaid,
.plyr--audio .plyr__control.plyr__tab-focus,
.plyr--audio .plyr__control:hover,
.plyr--audio .plyr__control[aria-expanded=true],
.plyr--video .plyr__control.plyr__tab-focus,
.plyr--video .plyr__control:hover,
.plyr--video .plyr__control[aria-expanded=true] {
  background-color: var(--v-primary-base) !important;
}

.media-file-previewer .plyr--full-ui input[type=range],
.plyr--full-ui input[type=range] {
  color: var(--v-primary-base) !important;
}
</style>
