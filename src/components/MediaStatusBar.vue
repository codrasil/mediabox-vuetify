<template>
  <v-system-bar color="transparent">
    <v-spacer></v-spacer>
    <v-slide-x-reverse-transition mode="in-out">
      <span v-if="hasItemSelected" class="caption" v-text="itemSelected">12:30</span>
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
