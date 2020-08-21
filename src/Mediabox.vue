<template>
  <v-sheet
    :min-height="minHeight"
    :max-height="maxHeight"
    :height="height"
    @contextmenu.prevent="preventContextMenu"
    class="mediabox overflow-hidden"
    >
    <!-- <v-progress-linear
      absolute
      color="accent"
      :indeterminate="mainwindow.progressbar.indeterminate"
      :value="mainwindow.progressbar.progress"
      top
      v-show="mainwindow.loading"
    ></v-progress-linear> -->
    <v-row :style="`min-height: ${minHeight}px`" no-gutters class="fill-height">
      <v-navigation-drawer :dark="dark" :mini-variant="sidebar.variant" :color="sidebarColor" :height="height" :absolute="!sidebar.model" :floating="!viewmodeIsTable" class="mediabox-sidebar" v-model="sidebar.model" :permanent="sidebar.model">
        <v-list :dark="dark" dense class="ma-0 py-1" :color="appBarColor">
          <v-list-item>
            <v-list-item-icon><v-icon small>mdi-folder-multiple-image</v-icon></v-list-item-icon>
            <v-list-item-content v-if="!sidebar.variant">
              <v-list-item-title v-text="title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider v-if="divider"></v-divider>

        <v-list :dark="sidebarDark" dense shaped>
          <v-list-item-group v-model="sidebar.selected">
            <v-list-item color="primary" @click="list({p: '', s: 0})">
              <v-list-item-icon><v-icon small>mdi-home</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Home</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item color="primary" v-for="(item, i) in sidebar.items" :key="i" @click="open(item)">
              <v-list-item-icon v-if="sidebar.selected == i+1"><v-icon small>mdi-folder-open</v-icon></v-list-item-icon>
              <v-list-item-icon v-else><v-icon small v-text="item.icon"></v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <div class="mediabox-window-container flex-grow-1 fill-height">
        <v-card :disabled="mainwindow.loading" flat color="transparent" class="d-flex flex-column flex-grow-1 fill-height">
          <v-app-bar :dark="dark" flat dense tile :color="appBarColor" class="flex-grow-0">
            <template>
              <mediabox-breadcrumbs
                :hide-breadcrumbs="hideBreadcrumbs"
                :items="breadcrumbs"
                @item:click="open"
              ></mediabox-breadcrumbs>
            </template>
            <v-spacer></v-spacer>
            <div class="white-space-no-wrap">
              <v-slide-x-reverse-transition mode="in-out">
                <div v-if="hasSelectedItems" class="d-inline-flex ml-3">
                  <duplicate-file-form
                    :url="uri.copy"
                    icon="mdi-content-copy"
                    @copied="handleFileCopied"
                  ></duplicate-file-form>
                  <download-file-form
                    :url="{ download: uri.download, zip: uri.zip }"
                    icon="mdi-download-outline"
                    @downloaded="handleFileDownloaded"
                  ></download-file-form>
                  <remove-file-form
                    :url="uri.delete"
                    icon="mdi-delete-outline"
                    @removed="handleFileRemoved"
                  ></remove-file-form>
                  <v-divider vertical class="ml-3"></v-divider>
                </div>
              </v-slide-x-reverse-transition>
              <div class="d-inline-flex ml-3">
                <add-folder-form @click="addFolder">
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" small tile icon title="Add new folder"><v-icon small>mdi-folder-plus</v-icon></v-btn>
                  </template>
                </add-folder-form>
                <upload-file-form @click="handleItemsUpload" title="Upload file"></upload-file-form>
              </div>
              <div class="d-inline-flex ml-3">
                <sort-menu class="mx-0" :disabled="filesISEmpty" :headers="headers"></sort-menu>
                <v-btn v-if="viewmodeIsTable" title="Toggle grid view" @click="toggleMainWindowViewMode({viewmode: 'grid'})" small tile icon class="mx-0"><v-icon small>mdi-view-grid</v-icon></v-btn>
                <v-btn v-else title="Toggle list view" class="mx-0" @click="toggleMainWindowViewMode({viewmode: 'table'})" small tile icon><v-icon small>mdi-view-list</v-icon></v-btn>
                <v-btn small tile icon @click="toggleRightSidebarView" title="View details"><v-icon small>mdi-information-outline</v-icon></v-btn>
              </div>
              <div class="d-inline-flex ml-3">
                <v-menu
                  v-model="moremenu.model"
                  offset-y
                  left
                  :close-on-content-click="false"
                  >
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" small icon><v-icon small>mdi-dots-vertical</v-icon></v-btn>
                  </template>
                  <v-card>
                    <v-list dense>
                      <v-list-item>
                        <v-list-item-icon><v-icon small>mdi-check-all</v-icon></v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Multiple select</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox color="primary" input-value="true" v-model="selections.multiSelect"></v-checkbox>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item :disabled="!viewmodeIsTable">
                        <v-list-item-icon><v-icon small>mdi-check-all</v-icon></v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Show list selection</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox color="primary" input-value="true" v-model="selections.showListSelection"></v-checkbox>
                        </v-list-item-action>
                      </v-list-item>
                      <v-divider></v-divider>
                      <v-list-item>
                        <v-list-item-icon><v-icon small>mdi-file-hidden</v-icon></v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Show hidden files</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox color="primary" input-value="true" v-model="showHidden"></v-checkbox>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-icon><v-icon small>mdi-page-layout-sidebar-left</v-icon></v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Show sidebar</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox color="primary" input-value="true" v-model="sidebar.model"></v-checkbox>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-icon><v-icon small>mdi-format-horizontal-align-left</v-icon></v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Mini sidebar</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox color="primary" input-value="true" v-model="sidebar.variant"></v-checkbox>
                        </v-list-item-action>
                      </v-list-item>
                      <v-divider></v-divider>
                      <v-list-item @click="refresh">
                        <v-list-item-icon><v-icon small>mdi-reload</v-icon></v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Reload files</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>

                  </v-card>
                </v-menu>
              </div>
              <slot name="close"></slot>
            </div>
          </v-app-bar>

          <v-divider v-if="divider"></v-divider>

          <main-window
            :key="uri.locationSearch"
            :loading="mainwindow.loading"
            :headers="headers"
            @item:selected="handleMainWindowItemSelected"
            @item:click="handleMainWindowItemClick"
            @item:drop="handleItemsUpload"
            @item:renamed="handleMainWindowItemRenamed"
            @item:delete="handleItemsDelete"
            v-model="files"
            >
            <template v-slot:empty>
              <div class="d-flex flex-column flex-grow-1 justify-center align-center py-8">
                <div class="pt-8"><v-icon color="grey" size="78">mdi-folder-open</v-icon></div>
                <div class="title grey--text lighten-2" v-text="emptyText"></div>
                <div class="grey--text lighten-3 mt-1" v-text="dragFilesToUploadText"></div>
              </div>
            </template>
          </main-window>

          <media-status-bar></media-status-bar>
        </v-card>
      </div>

      <details-pane v-model="rightsidebar.model"></details-pane>
    </v-row>
  </v-sheet>
</template>

<script>
import queryString from 'query-string';
import MainWindow from './MainWindow';
import MimeTypeCheckMixin from './mixins/mimeTypeCheck';
import MediaboxBreadcrumbs from './components/MediaboxBreadcrumbs';
import AddFolderForm from './components/AddFolderForm';
import DownloadFileForm from './components/DownloadFileForm';
import UploadFileForm from './components/UploadFileForm';
import RemoveFileForm from './components/RemoveFileForm';
import DuplicateFileForm from './components/DuplicateFileForm';
import DetailsPane from './components/DetailsPane';
import MediaStatusBar from './components/MediaStatusBar';
import SortMenu from './components/SortMenu';
import store from './store';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Mediabox',

  store,

  props: {
    url: [String, Object],
    hideBreadcrumbs: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: 'This folder is empty',
    },
    dragFilesToUploadText: {
      type: String,
      default: 'Drag files to upload',
    },
    appBarColor: {
      type: [String],
      default: 'white',
    },
    sidebarColor: {
      type: [String],
      default: 'white',
    },
    maxHeight: {
      type: [String, Number],
      default: '100vh',
    },
    minHeight: {
      type: [String, Number],
      default: 400,
    },
    height: {
      type: [String, Number],
      default: 'auto',
    },
    floating: {
      type: [Boolean],
      default: true,
    },
    sidebarDark: {
      type: [Boolean],
      default: false,
    },
    dark: {
      type: [Boolean],
      default: false,
    },
    divider: {
      type: [Boolean],
      default: false,
    },
  },

  mixins: [ MimeTypeCheckMixin ],

  components: {
    AddFolderForm,
    DetailsPane,
    DownloadFileForm,
    DuplicateFileForm,
    MainWindow,
    MediaboxBreadcrumbs,
    MediaStatusBar,
    RemoveFileForm,
    SortMenu,
    UploadFileForm,
  },

  computed: {
    ...mapGetters({
      viewmodeIsTable: 'viewmodeIsTable',
      rightsidebar: 'rightsidebar',
      selections: 'selections',
      hasSelectedItems: 'hasSelectedItems',
      mainwindow: 'mainwindow',
    }),

    filesISEmpty () {
      return this.files.length == 0;
    },

    headers () {
      return [
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'mimetype' },
        { text: 'Size', value: 'size' },
        { text: 'Permission', value: 'permission' },
        { text: 'Modified', value: 'updated_at' },
      ];
    },
  },

  data: (vm) => ({
    opened: [],
    media: [],

    title: null,

    directories: [],
    files: [],
    items: [],
    selected: [],
    breadcrumbs: [],

    uri: Object.assign(vm.url, {
      locationSearch: window.location.search,
    }),

    sidebar: {
      items: [],
      selected: vm.getUrlParams(true).s,
      model: true,
      variant: false,
    },

    moremenu: {
      model: false,
    },

    showHidden: vm.getUrlParams(true).h == 'true',
  }),

  methods: {
    ...mapActions({
      toggleMainWindowRefreshed: 'toggleMainWindowRefreshed',
      toggleMainWindowLoading: 'toggleMainWindowLoading',
      toggleMainWindowViewMode: 'toggleMainWindowViewMode',
      toggleRightSidebarView: 'toggleRightSidebarView',
      setRightSidebarData: 'setRightSidebarData',
      setSelected: 'setSelected',
      setProgressStatus: 'setProgressStatus',
    }),

    preventContextMenu (e) {
      e.preventDefault();
    },

    buildBreadcrumbs (breadcrumbs) {
      let params = [];
      let lastItem = 'home';
      if (this.getUrlParams(true).p) {
        params = this.getUrlParams(true).p.split('/').filter(function (k) {
          return k !== '';
        });
        lastItem = params.pop();
      }

      this.breadcrumbs = ([{text: 'Home', icon: 'mdi-home', params: new URLSearchParams('?p=')}]);
      this.breadcrumbs = this.breadcrumbs.concat(breadcrumbs || []).map((item) => {
          return Object.assign({
            href: this.uri.list+item.url,
            disabled: lastItem.toLowerCase() === item.text.toLowerCase(),
            params: new URLSearchParams(item.url),
          }, item);
      });
    },

    buildItems (items) {
      this.items = (items || []).map(function (item, i) {
        return Object.assign({
          id: i,
          editing: false,
          params: new URLSearchParams(item.fragment),
        }, item);
      });
    },

    buildSidebarItems (items) {
      this.sidebar.selected = parseInt(this.getUrlParams(true).s || 0);
      this.sidebar.items = (items || []).map(function (item, i) {
        return Object.assign({
          id: i,
          editing: false,
          params: new URLSearchParams(item.fragment),
        }, item);
      }).filter(function (item) {
        return item.is_dir;
      });
    },

    buildDirectories (directories) {
      this.directories = (directories || []).filter(function (item) {
        return item.is_dir;
      });
    },

    buildFiles (files) {
      this.files = (files || []).map(function (item, i) {
        return Object.assign({
          id: i,
          editing: false,
          params: new URLSearchParams(item.fragment),
        }, item);
      }).filter(function (item) {
        return item.is_file || item.is_dir;
      });
    },

    buildFilesOnly (files) {
      this.files = (files || []).map(function (item, i) {
        return Object.assign({
          id: i,
          editing: false,
          params: new URLSearchParams(item.fragment),
        }, item);
      }).filter(function (item) {
        return item.is_file;
      });
    },

    buildUrlParams (params) {
      params = this.mergeUrlParamsObject(params);
      this.uri.locationSearch = queryString.stringify(params);
      window.history.replaceState(null, null, `?${queryString.stringify(params)}`);
    },

    getUrlParams (asObject = false) {
      return asObject ? queryString.parse(window.location.search) : window.location.search;
    },

    mergeUrlParamsObject (params = {}) {
      return Object.assign(this.getUrlParams(true), {
        s: this.sidebar.selected
      }, params);
    },

    setTitle (title) {
      this.title = title;
    },

    open (item) {
      let params = this.mergeUrlParamsObject({ p: item.params.get('p') });

      this.toggleMainWindowLoading(true);
      this.$axios.get(this.uri.list, { params }).then(response => {
        this.buildFiles(response.data.data);
        this.setRightSidebarData(response.data.info);
        this.buildUrlParams(Object.fromEntries(item.params));
        this.buildBreadcrumbs(response.data.breadcrumbs);
      }).finally(() => {
        this.toggleMainWindowRefreshed();
        this.toggleMainWindowLoading(false);
        this.setSelected([]);
      });
    },

    list (params = {}) {
      params = this.mergeUrlParamsObject(params);

      this.toggleMainWindowLoading(true);
      this.$axios.get(
        this.uri.list, { params }
      ).then(response => {
        this.setTitle(response.data.title)
        this.buildItems(response.data.data);
        this.buildDirectories(this.items);
        this.buildUrlParams(params);
        this.buildFiles(this.items);
        this.setRightSidebarData(response.data.info);
        this.buildBreadcrumbs(response.data.breadcrumbs);
      }).finally(() => {
        this.toggleMainWindowRefreshed();
        this.toggleMainWindowLoading(false);
      });
    },

    refresh () {
      this.getInitialSidebarItems();
    },

    getInitialSidebarItems (params = {}) {
      this.toggleMainWindowLoading(true);
      this.$axios.get(this.uri.list, { params }).then(response => {
        this.list(params);
        this.setTitle(response.data.title)
        this.buildSidebarItems(response.data.data);
        this.setRightSidebarData(response.data.info);
      }).finally(() => {
        this.toggleMainWindowLoading(false);
      });
    },

    toggleSidebar () {
      this.sidebar.model = !this.sidebar.model;
    },

    handleMainWindowItemSelected (items) {
      this.setSelected(items);
    },

    handleMainWindowItemClick (item) {
      if (item.is_dir) {
        this.open(item);
      } else {
        this.$emit('item:click', item);
      }
    },

    handleItemsUpload (items) {
      for (var i = 0; i < items.length; i++ ){
        let file = items[i];
        this.uploadFile(file);
      }
    },

    handleItemsDelete (paths) {
      this.deleteFiles(paths);
    },

    handleFileRemoved () {
      this.list();
    },

    handleFileCopied () {
      this.list();
    },

    handleFileDownloaded () {
      this.list();
    },

    handleMainWindowItemRenamed (item) {
      let data = {
        name: item.name,
        parent: item.dirname,
      }

      this.toggleMainWindowLoading(true);
      this.$axios.patch(
        this.uri.rename(item.filename), data
      ).then(() => {
        this.list();
      }).finally(() => {
        this.toggleMainWindowLoading(false);
      });
    },

    addFolder (text) {
      let data = {
        name: text,
        parent: this.getUrlParams(true).p,
        type: 'dir',
      }

      this.$axios.post(
        this.uri.add, data
      ).then(() => {
        this.getInitialSidebarItems();
      });
    },

    uploadFile (item) {
      let data = new FormData();
      data.append('file', item);
      data.append('parent', this.getUrlParams(true).p);
      this.toggleMainWindowLoading(true);
      this.$axios.post(this.uri.upload, data, {
        headers: {'Content-Type': 'multipart/form-data'},
        onUploadProgress: (e) => {
          var progress = Math.round((e.loaded * 100) / e.total)
          this.setProgressStatus({ isUploading:true, progress: progress });
        },
      }).then(() => {
        this.list();
      }).finally(() => {
        this.toggleMainWindowLoading(false);
        this.setProgressStatus({ isUploading: false });
      })
    },

    deleteFiles (paths) {
      this.$axios.delete(
        this.uri.delete, { data: { paths } }
      ).then(() => {
        this.handleFileRemoved();
      });
    },
  },

  mounted () {
    this.getInitialSidebarItems();
  },

  watch: {
    showHidden: function (val) {
      this.list(this.mergeUrlParamsObject({h: val}));
    },

    breadcrumbs: function (val) {
      if (val.length <= 1) {
        this.sidebar.selected = 0;
      }
    },
  },
}
</script>

<style>
.mediabox-sidebar.v-navigation-drawer--close + .mediabox-window-container {
  width: 100%;
}

.mediabox-sidebar.v-navigation-drawer--open + .mediabox-window-container {
  width: calc(100% - 256px);
}

.white-space-no-wrap {
  white-space: nowrap !important;
}
</style>
