<template>
  <div tabindex="0" data-grid data-element="[data-grid-item]" ref="grid" class="mediabox-grid">
    <slot></slot>
  </div>
</template>
<script>
import Gridnav from '../plugins/gridnav';
import store from '../store';
import { mapGetters } from 'vuex';

export default {
  name: 'GridNav',

  store,

  methods: {
    ...mapGetters({
      selections: 'selections',
    }),

    initGridNav () {
      let grid = this.$refs.grid;

      new Gridnav(grid);
    },
  },

  mounted () {
    this.initGridNav();
  },
}
</script>

<style>
.mediabox-grid {
  outline: none;
}
</style>
