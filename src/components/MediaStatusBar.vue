<template>
  <v-system-bar color="transparent">
    <div>
      <span v-if="upload.isUploading" class="mr-4 grey--text caption">
        <span>Uploading <em v-text="upload.progress"></em>%</span>
      </span>
      <v-progress-linear
        color="accent"
        :indeterminate="mainwindow.progressbar.indeterminate"
        :value="mainwindow.progressbar.progress"
        v-show="mainwindow.loading"
      ></v-progress-linear>
    </div>

    <v-spacer></v-spacer>

    <v-slide-x-reverse-transition mode="in-out">
      <span v-if="hasItemSelected" class="caption" v-text="itemSelected"></span>
    </v-slide-x-reverse-transition>
    <slot></slot>
  </v-system-bar>
</template>

<script>
import store from '../store';
import { mapGetters } from 'vuex';

export default {
  name: 'MediaStatusBar',

  store,

  computed: {
    ...mapGetters({
      selections: 'selections',
      upload: 'upload',
      mainwindow: 'mainwindow',
    }),

    hasItemSelected () {
      return this.selections.count > 0;
    },

    itemSelected () {
      return `${this.selections.count} ${this.selections.count > 1 ? 'items' : 'item'} selected`;
    }
  },
}
</script>
