<template>
  <v-btn :title="title" small tile icon @click="handleDownloadClicked">
    <v-badge
      v-if="hasMultipleFilesSelected"
      overlap
      color="accent"
      title="Archive and download"
      :content="selections.count"
    >
      <slot>
        <v-icon small v-text="icon"></v-icon>
      </slot>
    </v-badge>
    <template v-else>
      <slot>
        <v-icon small v-text="icon"></v-icon>
      </slot>
    </template>
  </v-btn>
</template>

<script>
import store from '../store';
import FileDownload from 'js-file-download';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'DownloadFileForm',

  store,

  props: ['url', 'icon'],

  computed: {
    ...mapGetters({
      rightsidebar: 'rightsidebar',
      selections: 'selections',
    }),

    hasMultipleFilesSelected () {
      return this.selections.items.length >= 2;
    },

    file: {
      get () {
        return this.hasMultipleFilesSelected || !this.selections.hasSelectedItems
          ? this.rightsidebar.data.file
          : this.selections.items[0];
      },

      set (val) {
        this.setSelected(val);
      },
    },

    title () {
      return this.selections.count > 1
        ? 'Download files'
        : 'Download file';
    },
  },

  data: () => ({
    dialog: true,
  }),

  methods: {
    ...mapActions({
      setSelected: 'setSelected',
      toggleMainWindowLoading: 'toggleMainWindowLoading',
    }),

    handleDownloadClicked () {
      this.toggleMainWindowLoading(true);
      if (this.hasMultipleFilesSelected) {
        this.zip();
      } else {
        this.download();
      }
    },

    zip () {
      let data = {
        files: this.selections.items.map(item => (item.filename)),
        parent: this.file.filename,
      };

      this.$axios.post(
        this.url.zip, data
      ).then(response => {
        this.file = response.data;
        this.download();
      }).finally(() => {
        this.toggleMainWindowLoading(false);
      });
    },

    download () {
      return this.$axios.post(
        this.url.download(this.file.filename), null, {
          responseType: 'blob',
      }).then(response => {
        let filename = this.file.is_dir ? `${this.file.name}.zip` : this.file.name;

        FileDownload(response.data, filename);

        this.$emit('downloaded', this.file);
      }).finally(() => {
        this.toggleMainWindowLoading(false);
      });
    },
  },
}
</script>
