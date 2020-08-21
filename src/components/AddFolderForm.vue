<template>
  <v-edit-dialog
    @save="emitCreateButtonClicked"
    @open="cleanUpText"
    @close="cleanUpText"
  >
    <slot>
      <v-btn small tile icon title="Add new folder"><v-icon small>mdi-folder-plus-outline</v-icon></v-btn>
    </slot>
    <template v-slot:input>
      <p class="subtitle mt-3">New folder</p>
      <v-text-field
        autocomplete="off"
        autofocus
        single-line
        hide-details
        dense
        outlined
        class="my-4"
        v-model="dialog.text"
      ></v-text-field>
    </template>
  </v-edit-dialog>
</template>

<script>
export default {
  name: 'AddFolderForm',

  data: () => ({
    dialog: {
      text: null,
    },
  }),

  methods: {
    cleanUpText () {
      this.dialog.text = null;
    },

    emitCreateButtonClicked () {
      this.dialog.text = this.dialog.text.trim()
      if (this.dialog.text != '' && this.dialog.text != null) {
        this.$emit('click', this.dialog.text);
        this.cleanUpText();
      }
    },
  },
}
</script>
