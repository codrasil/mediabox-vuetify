<template>
  <v-breadcrumbs v-if="canShowBreadcrumbs" class="mediabox-breadcrumbs flex-nowrap px-4 py-3" :items="breadcrumbs">
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item
        :disabled="item.disabled"
        @click.prevent="handleClick(item)"
        class="media-crumb white-space-no-wrap"
        href="#"
      >
        <v-icon small v-if="item.icon" v-text="item.icon"></v-icon>
        <span v-else class="caption" v-text="item.text"></span>
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  name: 'MediaboxBreadcrumbs',

  props: {
    items: [Array],

    hideBreadcrumbs: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    breadcrumbs: {
      get () {
        return this.items;
      },

      set (val) {
        this.$emit('breadcrumbs', val);
      },
    },

    canShowBreadcrumbs () {
      return !this.hideBreadcrumbs && this.items.length > 1;
    },
  },

  methods: {
    handleClick (item) {
      this.$emit('item:click', item);
    },
  },
}
</script>

<style>
.mediabox-breadcrumbs {
  overflow: hidden;
  overflow-x: hidden;
  max-width: 100%;
}
</style>
