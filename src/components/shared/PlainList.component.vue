<template>
  <v-list :class="styleClass" density="compact">
    <div v-for="(item, index) in items">
      <v-list-item class="px-0" @click="onRowClick(item)">
        <v-list-item-title>
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-2">
              <slot name="prepend-item" v-bind:item="item"></slot>
            </div>
            <div class="text-truncate">
              <slot name="title" v-bind:item="item"></slot>
            </div>
          </div>
        </v-list-item-title>
      </v-list-item>
      <v-divider v-if="index < items.length - 1"></v-divider>
    </div>
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PlainList.component',
  emits: ['click:row'],
  props: {
    items: {
      type: Array,
      required: true,
    },
    styleClass: {
      type: String,
      default: 'bg-lightGray',
    },
  },
  methods: {
    onRowClick(item: any) {
      this.$emit('click:row', item);
    },
  },
});
</script>

<style scoped>

</style>