<template>
  <div class="d-flex align-center ma-3 pa-2">
    <v-spacer/>
    <div class="d-inline-flex align-center ml-auto">
      <div>
        <v-select v-model="itemsPerPageValue" :items="selectValues" hide-details type="number"/>
      </div>
      <div class="d-flex align-center mx-6">
        {{ page }} / {{ maxPage }}
      </div>
      <v-btn :disabled="page <= 1" class="mx-2" icon @click="changePage(-1)">
        <v-icon>
          mdi-chevron-left
        </v-icon>
      </v-btn>
      <v-btn :disabled="page >= maxPage" class="mx-2" icon @click="changePage(1)">
        <v-icon>
          mdi-chevron-right
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  emits: ['update:page', 'update:itemsPerPage'],
  props: {
    page: {
      required: true,
      type: Number,
    },
    itemsPerPage: {
      required: true,
      type: Number,
    },
    itemCount: {
      type: Number,
      required: true,
    },
  },
  computed: {
    maxPage() {
      // if maxPage is 0 defaults to 1
      const maxPage = Math.ceil(this.itemCount / this.itemsPerPageValue) || 1;
      if (this.pageValue > maxPage) {
        this.pageValue = maxPage;
      }
      return maxPage;
    },
    pageValue: {
      get() {
        return this.page <= 0 ? 1 : this.page;
      },
      set(value) {
        this.$emit('update:page', value);
      },
    },
    itemsPerPageValue: {
      get() {
        return this.itemsPerPage;
      },
      set(value) {
        this.$emit('update:itemsPerPage', value);
      },
    },
    selectValues() {
      return [10, 20, 50, 100];
    },
  },
  methods: {
    changePage(amount: number) {
      this.pageValue += amount;
    },
  },
});
</script>


<style scoped>

</style>
