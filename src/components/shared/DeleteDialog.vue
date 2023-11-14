<template>
  <v-dialog v-model="showDialogValue" width="500">
    <v-card>
      <v-card-title>
        <slot name="title">
          Wirklich löschen?
        </slot>
      </v-card-title>
      <v-card-text>
        <slot name="text">
          Sie sind dabei einen Datenbank eintrag zu löschen. Wollen Sie das wirklich tun?
        </slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="mr-2" color="error" variant="flat" @click="onClockDelete()">
          Löschen
        </v-btn>
        <v-btn color="primary" @click="onClickCancel()">
          Abbrechen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DeleteDialog',
  emits: ['click:delete', 'click:cancel', 'update:showDialog'],
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    onClockDelete() {
      this.$emit('click:delete');
    },
    onClickCancel() {
      this.$emit('click:cancel');
      this.$emit('update:showDialog', false);
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

</style>