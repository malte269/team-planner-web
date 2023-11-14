<template>
  <ExpandableList
      v-model:values="modelValues"
      :item-title="itemTitle"
      :item-value="itemValue"
      :items="items">
    <template #prepend-title="{item}">
      <slot name="prepend-title" v-bind:item="item"></slot>
    </template>
    <template #title="{item}">
      <slot name="title" v-bind:item="item"></slot>
    </template>
    <template #actions="{item}">
      <slot name="actions" v-bind:item="item"></slot>
    </template>
    <template #text="{item}">
      <DeepExpendableList
          v-if="item[deepAttribute]?.length"
          v-model:values="valuesOf(values, item[itemValue], context).computed"
          :items="item[deepAttribute]">
        <template #prepend-title="{item}">
          <slot name="prepend-title" v-bind:item="item"></slot>
        </template>
        <template #title="{item}">
          <slot name="title" v-bind:item="item"></slot>
        </template>
        <template #afterText="{item}">
          <slot name="afterText" v-bind:item="item"></slot>
        </template>
        <template #actions="{item}">
          <slot name="actions" v-bind:item="item"></slot>
        </template>
      </DeepExpendableList>
    </template>
    <template #afterText="{item}">
      <slot name="afterText" v-bind:item="item"></slot>
    </template>
  </ExpandableList>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ExpandableList from '@/components/shared/ExpandableList.vue';

export default defineComponent({
  name: 'DeepExpendableList',
  components: { ExpandableList },
  emits: ['update:values'],
  props: {
    values: {
      type: Object,
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
    deepAttribute: {
      type: String,
      default: 'children',
    },
  },
  methods: {
    valuesOf(propValues: object, name: string, context: any) {
      return {
        get computed() {
          return propValues?.[name] ?? [];
        },
        set computed(values: any) {
          const retVal = { ...propValues };
          retVal[name] = values;
          context.$emit('update:values', retVal);
        },
      };
    },
  },
  computed: {
    context() {
      return this;
    },
    modelValues: {
      get() {
        return Object.keys(this.values);
      },
      set(values: string[]) {
        this.$emit('update:values', values.reduce((res, curr) => {
          res[curr] = { ...this.values[curr] };
          return res;
        }, {}));
      },
    },
  },
});
</script>

<style scoped>

</style>