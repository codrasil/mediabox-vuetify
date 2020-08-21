import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mainwindow: {
      loading: true,
      progressbar: {
        progress: null,
        indeterminate: true,
      },
      refreshed: false,
      viewmode: 'grid', // or 'table',
      selected: [],
    },

    rightsidebar: {
      data: { file: null },
      model: false,
    },

    sorting: {
      sortBy: ['type'],
      sortDesc: false,
      headers: [],
      ordering: {
        ascending: {text: 'Ascending', value: false, icon: 'mdi-sort-alphabetical-ascending'},
        descending: {text: 'Descending', value: true, icon: 'mdi-sort-alphabetical-descending'},
      },
    },

    selections: {
      items: [],
      count: 0,
      edit: { text: null },
      editing: false,
      isNotEditing: true,
      multiSelect: false,
      hasSelectedItems: false,
      showListSelection: false,
    },

    upload: {
      isUploading: false,
      progress: 0,
    },

    contextmenu: {
      show: false,
      item: null,
      x: 0, y: 0,
    },
  },
  getters: {
    viewmode: state => state.mainwindow.viewmode,
    viewmodeIsTable: state => state.mainwindow.viewmode === 'table',
    viewmodeIsGrid: state => state.mainwindow.viewmode === 'grid',

    mainwindow: state => state.mainwindow,

    rightsidebar: state => state.rightsidebar,

    sorting: state => state.sorting,

    selections: state => state.selections,
    hasSelectedItems: state => state.selections.hasSelectedItems,

    upload: state => state.upload,

    contextmenu: state => state.contextmenu,
  },
  mutations: {
    TOGGLE_MAINWINDOW_REFRESHED (state) {
      state.mainwindow.refreshed = !state.mainwindow.refreshed;
    },

    TOGGLE_MAINWINDOW_LOADING (state, payload) {
      state.mainwindow.loading = payload;
    },

    TOGGLE_MAINWINDOW_VIEWMODE (state, payload) {
      state.mainwindow.viewmode = payload.viewmode;
    },

    TOGGLE_RIGHTSIDEBAR_VIEW (state) {
      state.rightsidebar.model = !state.rightsidebar.model;
    },

    SET_RIGHTSIDEBAR_DATA (state, payload) {
      state.rightsidebar.data = Object.assign(state.rightsidebar.data, payload);
    },

    SORT_ORDER (state, payload) {
      state.sorting.sortDesc = payload;
    },
    SORT_SORTBY (state, payload) {
      state.sorting.sortBy = payload;
    },
    CLEAR_SORT (state) {
      state.sorting.sortBy = [];
      state.sorting.sortDesc = null;
    },

    TOGGLE_LIST_SELECTION (state) {
      state.selections.showListSelection = !state.selections.showListSelection;
    },
    TOGGLE_MULTIPLE_SELECTION (state) {
      state.selections.multiSelect = !state.selections.multiSelect;
    },

    SET_SELECTED (state, payload) {
      state.selections.items = payload instanceof Array ? payload : [].concat(payload);
      state.selections.count = payload instanceof Array ? payload.length : 1;
      state.selections.hasSelectedItems = state.selections.count > 0;
    },

    TOGGLE_SELECTION_RENAMING_MODE (state, payload) {
      payload.editing = !payload.editing;
      state.selections.editing = !state.selections.editing;
      state.selections.isNotEditing = state.selections.editing;
    },

    SET_PROGRESS_STATUS (state, payload) {
      state.upload.isUploading = payload.isUploading;
      state.upload.progress = payload.progress || 0;
      state.mainwindow.progressbar.indeterminate = payload.indeterminate || false;
      state.mainwindow.progressbar.progress = payload.progress || 0;
    },

    TOGGLE_CONTEXTMENU (state, { e, item, toggle }) {
      if (toggle) toggle(e);
      state.contextmenu.show = true;
      state.contextmenu.x = e.clientX;
      state.contextmenu.y = e.clientY;
      state.contextmenu.item = item;
      e.preventDefault();
      e.stopPropagation();
    },

    HIDE_CONTEXTMENU (state) {
      state.contextmenu.show = false;
      state.contextmenu.item = null;
    },
  },
  actions: {
    toggleMainWindowRefreshed: (context) => {
      context.commit('TOGGLE_MAINWINDOW_REFRESHED');
    },

    toggleMainWindowLoading: (context, payload) => {
      context.commit('TOGGLE_MAINWINDOW_LOADING', payload);
    },

    toggleMainWindowViewMode: (context, payload) => {
      context.commit('TOGGLE_MAINWINDOW_VIEWMODE', payload);
    },

    toggleRightSidebarView: (context) => {
      context.commit('TOGGLE_RIGHTSIDEBAR_VIEW');
    },

    setRightSidebarData: (context, payload) => {
      context.commit('SET_RIGHTSIDEBAR_DATA', payload);
    },

    sortSortBy: (context, payload) => {
      context.commit('SORT_SORTBY', payload);
    },
    sortOrder: (context, payload) => {
      context.commit('SORT_ORDER', payload);
    },
    clearSort: (context) => {
      context.commit('CLEAR_SORT');
    },

    toggleMultipleSelection: (context) => {
      context.commit('TOGGLE_MULTIPLE_SELECTION');
    },
    toggleListSelection: (context) => {
      context.commit('TOGGLE_LIST_SELECTION');
    },

    setSelected: (context, payload) => {
      context.commit('SET_SELECTED', payload);
    },

    toggleSelectionRenamingMode: (context, payload) => {
      context.commit('TOGGLE_SELECTION_RENAMING_MODE', payload);
    },

    setProgressStatus: (context, payload) => {
      context.commit('SET_PROGRESS_STATUS', payload);
    },

    toggleContextMenu: (context, payload) => {
      context.commit('TOGGLE_CONTEXTMENU', payload);
    },

    toggleFolderContextMenu: (context, payload) => {
      context.commit('TOGGLE_CONTEXTMENU', payload);
    },

    hideContextMenu: (context) => {
      context.commit('HIDE_CONTEXTMENU');
    },
  },
  modules: {
  }
})
