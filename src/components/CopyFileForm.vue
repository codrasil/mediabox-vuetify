<template>
  <v-btn title="Duplicate file" small tile icon @click="copy"><v-icon small v-text="icon"></v-icon></v-btn>
</template>

<script>
import store from '../store';
import { mapGetters } from 'vuex';

export default {
  name: 'RemoveFileForm',

  store,

  props: ['url', 'icon'],

  computed: {
    ...mapGetters({
      selections: 'selections',
    }),
  },

  methods: {
    copy () {
      for (var i = this.selections.items.length - 1; i >= 0; i--) {
        let file = this.selections.items[i]

        this.submit(file);
      }
    },

    submit (file) {
      this.$axios.post(
        this.url(file.filename)
      ).then(response => {
        this.$emit('copied', response);
      });
    },
  },
}
</script>
