<template>
  <span>
    <v-btn small tile icon @click="openFileBrowser"><v-icon small>mdi-upload</v-icon></v-btn>
    <input ref="file-input" type="file" name="file" class="d-none" @change="emitUploadButtonClicked">
  </span>
</template>

<script>
export default {
  name: 'UploadFileForm',

  methods: {
    openFileBrowser () {
      this.$refs['file-input'].click();
    },

    emitUploadButtonClicked () {
      this.$emit('click', this.$refs['file-input'].files[0]);
    },
  },
}
</script>
