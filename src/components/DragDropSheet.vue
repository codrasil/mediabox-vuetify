<template>
  <!-- <div > -->
  <v-sheet
    :color="color"
    :height="height"
    class="drag-drop-sheet" :class="{ 'drag-drop-sheet--dragged-over': dragover }"
    width="100%"
    @dragenter="enter"
    @dragleave="leave"
    @mouseleave="leave"
    @dragover="over"
    @drop="drop"
  >
    <slot></slot>
  </v-sheet>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'DragDropSheet',

  props: {
    height: {
      type: [String, Number],
      default: '100%',
    },
    color: {
      type: [String],
      default: 'white',
    },
  },

  data: () => ({
    dragover: false,
  }),

  methods: {
    enter (e) {
      this.dragover = true;
      this.$emit('dragenter', e);
    },

    leave (e) {
      this.dragover = false;
      this.$emit('dragleave', e);
    },

    over (e) {
      this.dragover = true;
      this.$emit('dragover', e);
      e.preventDefault();
    },

    drop (e) {
      e.preventDefault()
      if (e.dataTransfer) {
        this.$emit('drop', e.dataTransfer.files);
      }
    },
  },
}
</script>

<style scoped>
.drag-drop-sheet {
  transition: all 0.03s ease-in;
  box-sizing: border-box;
}
.drag-drop-sheet.drag-drop-sheet--dragged-over {
  outline-style: auto;
  outline-width: 1px;
  outline-color: var(--v-primary-base);
}
</style>
