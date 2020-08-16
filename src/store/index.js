import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mainwindow: {
      viewmode: 'grid', // or 'table',
      selected: [],
    },

    rightsidebar: {
      data: { file: null },
      model: false,
    },

    sorting: {
      sortDesc: false,
      sortBy: ['name'],
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
  },
  getters: {
    viewmode: state => state.mainwindow.viewmode,
    viewmodeIsTable: state => state.mainwindow.viewmode === 'table',

    rightsidebar: state => state.rightsidebar,

    sorting: state => state.sorting,

    selections: state => state.selections,
    hasSelectedItems: state => state.selections.hasSelectedItems,
  },
  mutations: {
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
  },
  actions: {
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

    toggleListSelection: (context) => {
      context.commit('TOGGLE_LIST_SELECTION');
    },

    setSelected: (context, payload) => {
      context.commit('SET_SELECTED', payload);
    },

    toggleSelectionRenamingMode: (context, payload) => {
      context.commit('TOGGLE_SELECTION_RENAMING_MODE', payload);
    },
  },
  modules: {
  }
})
