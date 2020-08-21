<template>
  <div
    :class="{ 'grid-nav__item--active': focus }"
    class="grid-nav__item"
    data-grid-item
    tabindex="0"
    @click="toggleFocus"
    @blur="emitBlur"
    @focus="emitFocus"
    @keyup.enter="emitKeyUpEvent"
  >
    <slot v-bind="{ focus, blur }"></slot>
  </div>
</template>

<script>
export default {
  name: 'GridNavItem',

  data: () => ({
    focus: false,
    blur: false,
  }),

  methods: {
    emitKeyUpEvent (e) {
      this.$emit('enter', e);
    },

    emitBlur (e) {
      this.setFocus(false);
      this.$emit('blur', { el: e.target, focus: this.focus, blur: this.blur });
    },

    emitFocus (e) {
      this.setFocus(true);
      this.$emit('focus', { el: e.target, focus: this.focus, blur: this.blur });
    },

    setFocus (value) {
      this.focus = value;
      this.blur = !value;
    },

    toggleFocus () {
      this.focus = !this.focus;
      this.blur = !this.blur;
    }
  },
}
</script>

<style>
.grid-nav__item {
  outline: none;
}
</style>
