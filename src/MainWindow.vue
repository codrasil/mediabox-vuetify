<template>
  <div class="fill-height overflow-auto" @contextmenu.prevent="toggleContextMenu({e: $event})">
    <drag-drop-sheet ref="mainwindow" @drop="emitDrop" @click.native="deselect">
      <template v-if="hasItems">
        <v-data-table
          :headers="headers"
          :items="items"
          :show-select="selections.showListSelection"
          :single-select="!selections.multiSelect"
          :sort-by="sorting.sortBy"
          :sort-desc="sorting.sortDesc"
          @update:sort-by="handleSortBy"
          @update:sort-desc="handleSortDesc"
          class="mediabox-table"
          dense
          disable-pagination
          hide-default-footer
          multi-sort
          v-if="viewmodeIsTable"
          v-model="selections.items"
        >
          <template v-slot:item.name="{ item }">
            <div @contextmenu.prevent="toggleContextMenu({e: $event, item})" class="text-truncate" style="max-width: 400px;">
              <v-icon v-if="item.icon" small left v-text="item.icon"></v-icon>
              <a @click="emitItemClicked(item)" :title="item.name" v-text="item.name"></a>
            </div>
          </template>
          <template v-slot:item.mimetype="{ item }">
            <div style="width: 100px;" class="text-truncate" v-text="item.mimetype"></div>
          </template>
          <template v-slot:item.size="{ item }">
            <template v-if="item.type == 'dir'">
              <span v-text="`${item.count} ${item.count > 1 ? 'items' : 'item'}`"></span>
            </template>
            <template v-else>
              <span v-text="item.size"></span>
            </template>
          </template>
          <template v-slot:item.updated_at="{ item }">
            <span v-text="item.modified" :title="item.updated_at"></span>
          </template>
        </v-data-table>

        <div v-else class="fill-height">
          <v-data-iterator
            :items="items"
            :sort-by="sorting.sortBy"
            :sort-desc="sorting.sortDesc"
            :single-select="!selections.multiSelect"
            class="fill-height"
            disable-pagination
            hide-default-footer
            multi-sort
          >
            <template v-slot:default="props">
              <v-item-group
                :multiple="selections.multiSelect"
                class="fill-height"
                v-model="modelForIterator"
              >
                <grid-nav :key="mainwindow.refreshed">
                  <v-row
                    class="d-flex"
                    data-element="a"
                    data-gridx
                    no-gutters
                  >
                    <v-col
                      data-item-container
                      cols="auto"
                      :key="item.filename" v-for="item in props.items"
                    >
                      <v-item :value="item" v-slot:default="{ active, toggle }">
                        <grid-nav-item
                          @focus="toggle"
                          @enter="active && emitItemClicked(item)"
                          >
                          <template>
                            <v-card
                              :class="{ 'mediabox-file--selected': active }"
                              :ripple="false"
                              :title="`${item.name} (${item.size})`"
                              @click="toggle"
                              @contextmenu.prevent="toggleContextMenu({e: $event, item, toggle })"
                              @dblclick="emitItemClicked(item)"
                              @keyup.enter="active && emitItemClicked(item)"
                              @keyup.f2="toggleRename(item)"
                              class="mediabox-file d-flex align-start ma-1"
                              color="transparent"
                              flat
                              height="120"
                              min-height="120"
                              width="120"
                            >
                              <v-card-text class="text-center pa-1">
                                <div class="mt-auto mediabox-file__preview mb-1">
                                  <v-img height="64" contain v-if="isImage(item.mimetype)" :src="item.url">
                                    <div v-if="active" class="fill-height mediabox-file__thumbnail-overlay"></div>
                                  </v-img>
                                  <v-icon v-else size="64" v-text="item.icon"></v-icon>
                                </div>
                                <rename-file-form :attach="`[data-name=file-${item.id}]`" :filename="item.name" v-model="item.editing" @save="(text) => emitItemRenamed(text, item)" @cancel="cancelRename(item)">
                                  <template v-slot:activator>
                                    <span :data-name="`file-${item.id}`" class="mediabox-file__name text-truncate" v-text="item.name"></span>
                                  </template>
                                </rename-file-form>
                              </v-card-text>
                            </v-card>
                          </template>
                        </grid-nav-item>
                      </v-item>
                    </v-col>
                  </v-row>
                </grid-nav>
              </v-item-group>
            </template>
          </v-data-iterator>
        </div>
      </template>

      <template v-if="directoryIsEmpty">
        <slot name="empty">Empty</slot>
      </template>
    </drag-drop-sheet>

    <mb-context-menu
      @rename="toggleRename"
      @open="emitItemClicked"
      @delete="emitItemDelete"
      @download="emitItemDownload"
      @properties="toggleRightSidebarView"
    ></mb-context-menu>
  </div>
</template>

<script>
import store from './store';
import DragDropSheet from './components/DragDropSheet';
import MimeTypeCheckMixin from './mixins/mimeTypeCheck';
import GridNav from './components/GridNav';
import GridNavItem from './components/GridNavItem';
import RenameFileForm from './components/RenameFileForm';
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'MainWindow',

  props: {
    value: {
      type: [Array, Object, Number],
      default: () => ([]),
    },
    loading: Boolean,
    headers: {
      type: [Array, Object],
      default: () => ([]),
    },
  },

  store,

  mixins: [ MimeTypeCheckMixin ],

  components: {
    DragDropSheet,
    RenameFileForm,
    GridNav,
    GridNavItem,
    MbContextMenu: () => import('./components/MbContextMenu'),
  },

  computed: {
    ...mapGetters({
      mainwindow: 'mainwindow',
      viewmode: 'viewmode',
      sorting: 'sorting',
      selections: 'selections',
      viewmodeIsTable: 'viewmodeIsTable',
      viewmodeIsGrid: 'viewmodeIsGrid',
    }),

    items: {
      get () {
        return (this.value || []).map(function (item) {
          return Object.assign({
            active: false,
          }, item);
        });
      },

      set (value) {
        this.$emit('input', value)
      },
    },

    modelForIterator: {
      get () {
        return this.selections.multiSelect
          ? this.selections.items
          : this.selections.items[0]
      },

      set (val) {
        this.setSelected(val);
      }
    },

    directoryIsEmpty () {
      return this.items.length == 0;
    },

    hasItems () {
      return this.items.length > 0;
    },
  },

  data: () => ({
    selected: [],
  }),

  methods: {
    ...mapActions({
      sortOrder: 'sortOrder',
      sortSortBy: 'sortSortBy',
      setSelected: 'setSelected',
      toggleContextMenu: 'toggleContextMenu',
      toggleRightSidebarView: 'toggleRightSidebarView',
      toggleSelectionRenamingMode: 'toggleSelectionRenamingMode',
    }),

    handleSortBy (item) {
      this.sortSortBy(item)
    },

    handleSortDesc (item) {
      this.sortOrder(item);
    },

    emitItemRenamed (text, item) {
      item.name = text;
      this.$emit('item:renamed', item);
    },

    emitItemClicked (item) {
      this.setSelected([item]);
      this.$emit('item:click', item);
    },

    emitItemDelete (item) {
      this.$emit('item:delete', item.filename);
    },

    emitItemDownload (item) {
      this.$emit('item:download', item);
    },

    activateItem (item) {
      item.active = !item.active;
    },

    emitDrop (item) {
      this.$emit('item:drop', item);
    },

    deselect (e) {
      let file = e.target.closest('.mediabox-file');

      if (file == null || !file.classList.contains('mediabox-file')) {
        this.setSelected([]);
      }
    },

    toggleRename (item) {
      this.toggleSelectionRenamingMode(item);
    },
    cancelRename (item) {
      item.editing = false;
    },

    handleViewDetails (item) {
      console.log('vie:detail', item);
    },
  },

  watch: {
    items: function () {
      this.setSelected([])
    },

    'selections.items': function (val) {
      this.$emit('item:selected', val);
    },
  },
}
</script>

<style>
.mediabox-file, .mediabox-file:hover {
  cursor: default;
}
.mediabox-file:before, .mediabox-file:active:before,
.mediabox-file:hover:before, .mediabox-file:focus:before {
  display: none;
}
.mediabox-file, .mediabox-file * {
  user-select: none;
}

.mediabox-file__preview {
  width: 64px;
  height: 64px;
  margin: 0 auto;
  overflow: hidden;
}
.mediabox-file__preview img {
  max-width: 100%;
  height: auto;
  object-fit: scale-down;
  vertical-align: middle;
}
.mediabox-file--selected {
  background-color: transparent !important;
}
.mediabox-file--selected:before {
  background-color: transparent !important;
  display: none;
}
.mediabox-file--selected .mediabox-file__preview img,
.mediabox-file--selected .mediabox-file__preview .icon {
  filter: brightness(0.8);
  color: var(--v-primary-base);
}

.mediabox-file__name {
  display: inline-block;
  max-width: 100%;
  padding: 4px;
  text-overflow: ellipsis;
  vertical-align: top;
}

.mediabox-file--selected .mediabox-file__name {
  background-color: var(--v-primary-base);
  border-radius: 3px;
  color: #ffffff;
  margin: 0 auto;
  text-overflow: unset !important;
  white-space: unset !important;
}

.mediabox-file__thumbnail-overlay {
  background-color: var(--v-primary-base);
  mix-blend-mode: color;
}
</style>
