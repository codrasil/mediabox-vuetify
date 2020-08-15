<template>
  <v-menu
    offset-y
    left
    :close-on-content-click="false"
    >
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" title="Sort items" :disabled="disabled" small tile icon><v-icon small v-text="icon"></v-icon></v-btn>
    </template>
    <v-card flat>
      <v-radio-group class="ma-0 pa-0" hide-details>
        <v-list dense>
          <v-list-item-group multiple v-model="sorting.sortBy">
            <v-list-item v-for="item in headers" :value="item.value" :key="item.text">
              <v-list-item-content>
                <v-list-item-title class="mr-5">
                  <span v-text="item.text"></span>
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon small left v-if="sorting.sortBy.includes(item.value)">mdi-check</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
          <v-divider></v-divider>
          <v-list-item-group v-model="sortDescValue">
            <v-list-item v-for="(item, i) in sorting.ordering" :value="item.value" :key="i">
              <v-list-item-content>
                <v-list-item-title class="mr-5"><span v-text="item.text"></span></v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon small v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-action>
                <v-icon small left v-if="sortDescValue == item.value">mdi-check</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
          <v-divider></v-divider>
          <v-list-item @click="clearSort">
            <v-list-item-content>
              <v-list-item-title class="mr-5">Clear sort</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-radio-group>
    </v-card>
  </v-menu>
</template>

<script>
import store from '../store';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'SortMenu',

  store,

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    headers: {
      type: [Array],
      default: () => ([]),
    },
  },

  computed: {
    ...mapGetters({
      sorting: 'sorting',
    }),

    icon () {
      return this.sorting.sortDesc ? this.sorting.ordering.descending.icon : this.sorting.ordering.ascending.icon;
    },

    sortDescValue: {
      get () {
        return this.sorting.sortDesc;
      },

      set (val) {
        this.sortOrder(val);
      },
    },
  },

  methods: {
    ...mapActions({
      sortOrder: 'sortOrder',
      clearSort: 'clearSort',
    }),
  },
}
</script>
