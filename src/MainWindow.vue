<template>
  <div class="fill-height overflow-auto">
    <drag-drop-sheet ref="mainwindow-container" @drop="emitDrop" @click.native="deselect">
      <template v-if="hasItems">
        <v-data-table
          :headers="headers"
          :items="items"
          :loading="loading"
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
            <div class="text-truncate" style="max-width: 400px;">
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

        <div v-else>
          <v-data-iterator
            :items="items"
            :loading="loading"
            :sort-by="sorting.sortBy"
            :sort-desc="sorting.sortDesc"
            :single-select="!selections.multiSelect"
            disable-pagination
            hide-default-footer
            multi-sort
            >
            <template v-slot:default="props">
              <v-item-group :multiple="selections.multiSelect" v-model="modelForIterator">
                <v-row no-gutters class="d-flex">
                  <template v-for="item in props.items">
                    <v-col :key="item.filename" cols="auto">
                      <v-item v-slot:default="{ active, toggle }" :value="item">
                        <v-card
                          :ripple="false"
                          :class="{ 'mediabox-file--selected': active }"
                          @click="toggle"
                          @dblclick="emitItemClicked(item)"
                          @keyup.f2="toggleRename(item)"
                          class="mediabox-file d-flex align-start ma-1"
                          color="transparent"
                          flat
                          height="120"
                          min-height="120"
                          tabindex="0"
                          width="120"
                        >
                          <v-card-text class="text-center">
                            <div class="mt-auto mediabox-file__preview">
                              <img v-if="isImage(item)" :src="item.url" :alt="item.name" height="64">
                              <v-icon v-else size="64" v-text="item.icon"></v-icon>
                            </div>
                            <rename-file-form :attach="`[data-name=file-${item.id}]`" :filename="item.name" v-model="item.editing" @save="(text) => emitItemRenamed(text, item)" @cancel="cancelRename(item)">
                              <template v-slot:activator>
                                <span :data-name="`file-${item.id}`" :title="`${item.name} (${item.size})`" class="mediabox-file__name text-truncate" v-text="item.name"></span>
                              </template>
                            </rename-file-form>
                          </v-card-text>
                        </v-card>
                      </v-item>
                    </v-col>
                  </template>
                </v-row>
              </v-item-group>
            </template>
          </v-data-iterator>
        </div>
      </template>

      <template v-if="directoryIsEmpty">
        <slot name="empty">Empty</slot>
      </template>
    </drag-drop-sheet>
  </div>
</template>

<script>
import store from './store';
import DragDropSheet from './components/DragDropSheet';
import RenameFileForm from './components/RenameFileForm';
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'MainWindow',

  props: {
    value: {
      type: [Array, Object, Number],
      default: () => ([]),
    },
    headers: {
      type: [Array, Object],
      default: () => ([]),
    },
  },

  store,

  components: {
    DragDropSheet,
    RenameFileForm,
  },

  computed: {
    ...mapGetters({
      viewmode: 'viewmode',
      sorting: 'sorting',
      selections: 'selections',
      viewmodeIsTable: 'viewmodeIsTable',
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
      return this.items.length;
    },
  },

  data: () => ({
    loading: false,
    selected: [],
  }),

  methods: {
    ...mapActions({
      sortOrder: 'sortOrder',
      sortSortBy: 'sortSortBy',
      setSelected: 'setSelected',
      toggleSelectionRenamingMode: 'toggleSelectionRenamingMode',
    }),

    handleSortBy (item) {
      this.sortSortBy(item)
    },

    handleSortDesc (item) {
      this.sortOrder(item);
    },

    isImage (item) {
      return item.mimetype.match(/^image.*$/);
    },

    emitItemRenamed (text, item) {
      item.name = text;
      this.$emit('item:renamed', item);
    },

    emitItemClicked (item) {
      this.setSelected([item]);
      this.$emit('item:click', item);
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
.mediabox-file:hover {
  /*background: rgba(0,0,0,0.05)*/
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
}

.mediabox-file__name {
  padding: 4px;
  text-overflow: ellipsis;
  vertical-align: top;
  max-width: 100%;
  display: inline-block;
}

.mediabox-file--selected .mediabox-file__name {
  border-radius: 3px;
  background-color: var(--v-primary-base);
  color: #ffffff;
  text-overflow: unset !important;
  white-space: break-spaces !important;
  position: absolute;
  left: 50%;
  margin: 0 auto;
  transform: translateX(-50%);
}

.sticky {
  position: sticky;
}
</style>
