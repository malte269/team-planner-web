<template>
  <v-dialog v-model="showDialogValue" :height="height" :width="width">
    <v-card>
      <v-btn class="btn-position bg-transparent" flat icon @click="closeDialog()">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
      <v-card-text class="overflow-auto">
        <slot name="default"></slot>
      </v-card-text>
      <v-card-actions v-if="$slots.actions">
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DefaultDialog',
  emits: ['update:showDialog'],
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    width: {
      type: Number,
      required: false,
    },
    height: {
      type: Number,
      required: false,
    },
  },
  methods: {
    closeDialog() {
      this.showDialogValue = false;
    },
  },
  computed: {
    showDialogValue: {
      get() {
        return this.showDialog;
      },
      set(value: boolean) {
        this.$emit('update:showDialog', value);
      },
    },
  },
});
</script>

<style scoped>
.btn-position {
  position: absolute;
  right: 7px;
  z-index: 2;
}
</style>