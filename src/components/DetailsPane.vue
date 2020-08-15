<template>
  <v-navigation-drawer width="300" absolute temporary right v-model="model">
    <v-card flat>
      <v-card-text v-if="file" class="text-center pa-6">
        <div>
          <media-file-previewer
            :file="file"
          ></media-file-previewer>
          <p class="title mt-3" v-html="file.name"></p>
        </div>
        <div>
          <v-row class="text-left">
            <v-col cols="6" class="grey--text">Type</v-col>
            <v-col class="text-truncate"><span v-text="file.mimetype"></span></v-col>
          </v-row>
          <v-row class="text-left">
            <v-col cols="6" class="grey--text">Size</v-col>
            <v-col class="text-truncate" v-if="file.type == 'dir'"><span v-text="`${file.count} ${file.count > 1 ? 'items' : 'item'}`" :title="`${file.count} ${file.count > 1 ? 'items' : 'item'}`"></span></v-col>
            <v-col class="text-truncate" v-else><span v-text="file.size"></span></v-col>
          </v-row>
          <v-row class="text-left">
            <v-col cols="6" class="grey--text">Location</v-col>
            <v-col class="text-truncate"><span :title="file.dirname" v-text="file.dirname"></span></v-col>
          </v-row>
          <v-row class="text-left">
            <v-col cols="6" class="grey--text">Owner</v-col>
            <v-col class="text-truncate"><span v-text="file.owner.name"></span></v-col>
          </v-row>
          <v-row class="text-left">
            <v-col cols="6" class="grey--text">Permission</v-col>
            <v-col class="text-truncate"><span v-text="file.permission"></span></v-col>
          </v-row>
          <v-row class="text-left">
            <v-col cols="6" class="grey--text">Created</v-col>
            <v-col class="text-truncate"><span :title="file.created_at" v-text="file.created"></span></v-col>
          </v-row>
          <v-row class="text-left">
            <v-col cols="6" class="grey--text">Modified</v-col>
            <v-col class="text-truncate"><span :title="file.updated_at" v-text="file.modified"></span></v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-card-text v-else class="text-center pa-6">
        No data seelcted
      </v-card-text>
    </v-card>

    <template v-slot:append>
      <v-card flat v-if="rightsidebar.data.file">
        <v-card-text>
          <div class="mr-3 caption">
            <v-icon small left>mdi-memory</v-icon>
            <span>Memory:</span>&nbsp;<span v-text="rightsidebar.data.disk.memory"></span>
          </div>
          <div class="mr-3 caption">
            <v-icon small left>mdi-chart-arc</v-icon>
            <span>Total size:</span>&nbsp;<span v-text="rightsidebar.data.total"></span>
          </div>
          <div class="mr-3 caption">
            <v-icon small left>mdi-harddisk</v-icon>
            <span>Free disk:</span>&nbsp;<span v-text="`${rightsidebar.data.disk.free} of ${rightsidebar.data.disk.total}`"></span>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-navigation-drawer>
</template>

<script>
import store from '../store';
import MediaFilePreviewer from './MediaFilePreviewer';
import { mapGetters } from 'vuex';

export default {
  name: 'DetailsPane',

  store,

  props: ['value'],

  components: {
    MediaFilePreviewer,
  },

  computed: {
    ...mapGetters({
      rightsidebar: 'rightsidebar',
      selections: 'selections',
    }),

    hasMultipleFilesSelected () {
      return this.selections.items.length >= 2;
    },

    file () {
      return this.selections.hasSelectedItems
        ? this.selections.items[0]
        : this.rightsidebar.data.file;
    },

    model: {
      get () {
        return this.value;
      },

      set (val) {
        this.$emit('input', val);
      },
    },
  },
}
</script>

<style>
.media-file__thumbnail {
  cursor: zoom-in;
}
</style>
