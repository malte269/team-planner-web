<template>
  <v-container class="position-relative table" fluid>
    <v-table :height="height" :hover="tableItems.length > 0" class="table" fixed-footer fixed-header>
      <thead>
      <tr>
        <th v-for="header in headers" :key="'header_' + header.key" :style="{width: header.width}">
          {{ header.title }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="tableItems.length === 0" class="justify-center">
        <td :colspan="headers.length" class="text-center">
          <v-progress-circular v-if="loading" color="primary" indeterminate></v-progress-circular>
          <div v-else>
            Keine Einträge vorhanden
          </div>
        </td>
      </tr>
      <tr v-for="(rowItem, index) in tableItems" :key="index" @click="onRowClick(rowItem)">
        <td v-for="header in headers" :key="'body_' + header.key" :style="{width: header.width}">
          <slot :name="header.key" v-bind:item="rowItem">
            {{ rowItem[header.key] }}
          </slot>
        </td>
      </tr>
      </tbody>
      <v-spacer></v-spacer>
      <tfoot class="elevation-2">
      <tr>
        <td :colspan="headers.length" class="mx-1 bg-surface">
          <div class="elevation-1">
            <PaginationComponent
                v-model:items-per-page="perPage"
                v-model:page="page"
                :item-count="filteredItems.length"/>
          </div>
        </td>
      </tr>
      </tfoot>
    </v-table>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import PaginationComponent from '@/components/shared/table/Pagination.component.vue';

export default defineComponent({
  components: {
    PaginationComponent,
  },
  data() {
    return {
      page: 1,
      perPage: 10,
    };
  },
  name: 'TableComponent',
  props: {
    /**
     * {title: string, key: string, class: string, width: string}
     */
    headers: {
      type: Array<{ title: string, key: string, class?: string, width?: string }>,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    searchString: {
      type: String,
      required: false,
      default: '',
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    fixedHeader: {
      type: Boolean,
      required: false,
      default: true,
    },
    /**
     * The important keys of the items to search in, using the searchString. If it is undefined, every key is important.
     * Example: {
     *    name: String,
     *    address: Address, This causes to get through all Address Keys
     *    contactPerson: {
     *      firstName: String,
     *      lastName: String,
     *    },
     * }
     * The type does not matter
     */
    importantKeys: {
      type: Object,
      required: false,
      default: undefined,
    },
    onRowClick: {
      type: Function,
      required: false,
      default: () => {
        return () => {
          console.log('No specified function on row click');
        };
      },
    },
    height: {
      type: String,
      required: false,
    },
  },
  computed: {
    filteredItems() {
      let tableItems = this.items;
      if (this.searchString.trim() !== '') {
        tableItems = this.searchInItems();
      }
      return tableItems;
    },
    tableItems(): any[] {
      return this.filteredItems.filter((item: any, index: number) => index >= (this.page - 1) * this.perPage && index < (this.page) * this.perPage);
    },
  },
  methods: {
    searchInItems() {
      // split at space?
      const searchValue = this.searchString.toLowerCase();
      return this.items.filter((item: any) => this.searchInKeys(item, searchValue, this.importantKeys));
    },
    searchInKeys(item: any, searchValue: string, importantKey?: any): boolean {
      for (const key of Object.keys(item)) {
        if (importantKey === undefined || importantKey[key]) {
          // not null and object
          if (item[key] !== null && typeof item[key] === 'object') {
            if (this.searchInKeys(item[key], searchValue, importantKey ? importantKey[key] : undefined)) {
              return true;
            }
          } else {
            if (item[key]?.toString().toLowerCase().includes(searchValue)) {
              return true;
            }
          }
        }
      }
      return false;
    },
  },
});
</script>

<style scoped>
tbody > tr {
  cursor: pointer;
}
</style>
