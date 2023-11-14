<template>
  <v-expansion-panels v-model="modelValues" multiple>
    <v-expansion-panel
        v-for="item in items"
        :value="item[itemValue]"
    >
      <v-expansion-panel-title>
        <v-row no-gutters>
          <slot name="prepend-title" v-bind:item="item">
          </slot>
          <v-col align-self="center">
            <slot name="title" v-bind:item="item">
              {{ item[itemTitle] }}
            </slot>
          </v-col>
          <v-col align-self="center" class="mr-2" cols="auto">
            <slot name="actions" v-bind:item="item">
            </slot>
          </v-col>
        </v-row>
      </v-expansion-panel-title>
      <v-expansion-panel-text class="list-like">
        <slot name="text" v-bind:item="item">
        </slot>
        <slot name="afterText" v-bind:item="item">
        </slot>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ExpandableList',
  emits: ['update:values'],
  props: {
    values: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    itemTitle: {
      type: String,
      default: 'name',
    },
    itemValue: {
      type: String,
      default: 'id',
    },
  },
  computed: {
    modelValues: {
      get() {
        return this.values;
      },
      set(values: string[]) {
        this.$emit('update:values', values);
      },
    },
  },
});
</script>

<style scoped>

</style>
