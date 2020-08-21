<template>
  <v-menu
    :min-width="220"
    :position-x="contextmenu.x"
    :position-y="contextmenu.y"
    absolute
    offset-y
    v-model="contextmenu.show"
  >

    <v-list dense>
      <template v-if="hasItemSelected">
        <!-- Open/Preview -->
        <v-list-item @click="emitOpen">
          <v-list-item-icon>
            <v-icon small v-if="item.is_file">mdi-eye</v-icon>
            <v-icon small v-else>mdi-folder-open</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-if="item.is_dir">Open</v-list-item-title>
            <v-list-item-title v-else>Preview</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Open/Preview -->

        <v-divider></v-divider>

        <!-- Rename -->
        <v-list-item @click="emitRename">
          <v-list-item-icon>
            <v-icon small>mdi-form-textbox</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Rename</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text>F2</v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <!-- Rename -->

        <!-- Copy/Cut -->
        <v-list-item @click="emitCopy">
          <v-list-item-icon>
            <v-icon small>mdi-content-copy</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Copy</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="emitCut">
          <v-list-item-icon>
            <v-icon small>mdi-content-cut</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Cut</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Copy/Cut -->

        <v-divider></v-divider>

        <!-- Delete -->
        <v-list-item @click="emitDelete">
          <v-list-item-icon>
            <v-icon small>mdi-delete-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Delete -->

        <v-divider></v-divider>

        <!-- Download -->
        <v-list-item @click="emitDownload">
          <v-list-item-icon>
            <v-icon small>mdi-download-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Download</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Download -->

        <!-- Compress -->
        <v-list-item @click="emitCompress">
          <v-list-item-icon>
            <v-icon small>mdi-folder-zip-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Compress...</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Compress -->
      </template>

      <template v-else>
        <!-- New Folder / Upload file -->
        <v-list-item @click="emitNewFolder">
          <v-list-item-icon>
            <v-icon small>mdi-folder-plus-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>New folder</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="emitUpload">
          <v-list-item-icon>
            <v-icon small>mdi-upload-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Upload file...</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- New Folder / Upload file -->

        <v-divider></v-divider>

        <v-list-item @click="emitUpload">
          <v-list-item-icon>
            <v-icon small>mdi-select-drag</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Select all</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text>Ctrl+A</v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <!-- Properties -->
      <v-list-item @click="emitProperties">
        <v-list-item-icon>
          <v-icon small>mdi-information-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>View details</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- Properties -->
    </v-list>

  </v-menu>
</template>

<script>
import { mapGetters } from 'vuex';
import { isEmpty } from 'lodash';

export default {
  name: 'MbContextMenu',

  computed: {
    ...mapGetters({
      contextmenu: 'contextmenu',
    }),

    noItemSelected () {
      return isEmpty(this.contextmenu.item);
    },

    hasItemSelected () {
      return ! isEmpty(this.contextmenu.item);
    },

    item () {
      return this.contextmenu.item
    },
  },

  data: () => ({
    selected: null,
  }),

  methods: {
    emitOpen () {
      this.$emit('open', this.item);
    },

    emitCopy () {
      this.$emit('copy', this.item);
    },

    emitCut () {
      this.$emit('cut', this.item);
    },

    emitRename () {
      this.$emit('rename', this.item);
    },

    emitDownload () {
      this.$emit('download', this.item);
    },

    emitDelete () {
      this.$emit('delete', this.item);
    },

    emitCompress () {
      this.$emit('compress', this.item);
    },

    emitNewFolder () {
      this.$emit('newfolder');
    },

    emitUpload () {
      this.$emit('upload');
    },

    emitProperties () {
      this.$emit('properties', this.item);
    },
  },
}
</script>
