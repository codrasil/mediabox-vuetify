<template>
  <v-menu
    v-model="menu"
    min-width="250"
    :close-on-content-click="false"
    bottom
    :nudge-buttom="300"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }"></slot>
    </template>
    <v-card>
      <v-card-text>
        <v-form v-model="valid" @submit.prevent="save">
          <v-text-field
            :hide-details="valid"
            :rules="rules"
            @blur="cancel"
            @focus="highight"
            autofocus
            dense
            outlined
            ref="rename-field"
            single-line
            v-model="text"
          ></v-text-field>
        </v-form>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'RenameFileForm',

  props: ['filename', 'value', 'attach'],

  computed: {
    menu: {
      get () {
        return this.value;
      },

      set (val) {
        this.$emit('input', val);
      },
    },
  },

  data: (vm) => ({
    text: vm.filename,
    oldText: vm.filename,
    submitted: false,
    isEditing: false,
    valid: true,
    rules: [
      value => !!value || 'The file name is required',
      value => (value || '').length <= 255 || 'The file name must not exceed 255 characters',
      value => !!value.match(/^[\w\-. ]+$/) || 'Invalid file name',
    ],
  }),

  methods: {
    toggleRename () {
      this.isEditing = !this.isEditing;
    },

    highight () {
      this.$refs['rename-field'].$el.querySelector('input').select();
    },

    save () {
      if (this.valid) {
        this.$emit('save', this.text);
        this.menu = false;
        this.submitted = true;
      }
    },

    cancel () {
      if (!this.submitted) {
        this.filename = this.oldText;
        this.$emit('cancel', this.text);
        this.submitted = false;
      }
    },
  },
}
</script>
