<template>
  <v-btn title="Remove file" small tile icon @click="remove"><v-icon small v-text="icon"></v-icon></v-btn>
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
    remove () {
      if (this.selections.items instanceof Array) {
        let paths = (this.selections.items || []).map(function (item) {
          return item.filename;
        });

        this.submit(paths)
      }

      if (this.selections.items instanceof Object) {
        let path = this.selections.items.filename;
        this.submit(path);
      }
    },

    submit (paths) {
      this.$axios.delete(
        this.url, { data: { paths } }
      ).then(response => {
        this.$emit('removed', response);
      });
    },
  },
}
</script>
