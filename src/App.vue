<template>
  <v-app>
    <v-main>
      <v-row>
        <v-col cols="12" class="px-10">
          <v-card>
            <!-- <v-dialog v-model="dialog"> -->
              <Mediabox height="500" @item:click="getItem" :url="{
                list: 'http://127.0.0.1:8000/api/v1/mediabox',
                add: 'http://127.0.0.1:8000/api/v1/media/add',
                upload: 'http://127.0.0.1:8000/api/v1/mediabox/upload',
                'delete': 'http://127.0.0.1:8000/api/v1/mediabox/delete',
                copy: (media) => (`http://127.0.0.1:8000/api/v1/media/${media}/copy`),
                rename: (media) => (`http://127.0.0.1:8000/api/v1/media/${media}/rename`),
              }">
                <template v-slot:close>
                  <v-btn icon small class="ml-3" @click="dialog = false"><v-icon small>mdi-close</v-icon></v-btn>
                </template>
              </Mediabox>
            <!-- </v-dialog> -->
          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import Mediabox from './Mediabox';

export default {
  name: 'App',

  components: {
    Mediabox,
  },

  data: () => ({
    dialog: true,
  }),

  methods: {
    getItem (item) {
      console.log('app.vue', item);
      this.dialog = false;
    }
  },
};
</script>

<style>
body, html, #app {
  background-color: rgba(0,0,0,0.04);
}
</style>
