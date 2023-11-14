<template>
  <v-card>
    <v-card-title>
      Erstelle ein neues Projekt
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-text-field
              v-model="project.name"
              hide-details
              label="Name*"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
              v-model="project.short"
              hide-details
              label="Kürzel*"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select
              v-model="project.status"
              :items="projectStatusItems"
              hide-details
              label="Status">
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
              v-model="project.startDateSoftIso"
              hide-details
              label="Frühestes Start-Datum"
              type="date">
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field
              v-model="project.endDateSoftIso"
              hide-details
              label="Frühestes End-Datum"
              type="date">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
              v-model="project.startDateHardIso"
              hide-details
              label="Spätestes Start-Datum"
              type="date">
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field
              v-model="project.endDateHardIso"
              hide-details
              label="Spätestes End-Datum"
              type="date">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea
              v-model="project.description"
              hide-details
              label="Beschreibung">
          </v-textarea>
        </v-col>
        <v-col>
          <v-text-field
              v-model="project.teamSize"
              hide-details
              label="Teamgröße"
              type="number">
          </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row dense>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-btn color="success" variant="flat" @click="submit()">
            Erstellen
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn color="error" @click="cancel()">
            Abbrechen
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import MenuWithPickerComponent from '@/components/MenuWithPicker.component.vue';
import Project, { projectStatusItems } from '@/models/Project';

export default defineComponent({
  components: { MenuWithPickerComponent },
  emits: ['cancel', 'submit-project'],
  props: {
    project: {
      type: Project,
      required: true,
      default: new Project(),
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    submit() {
      this.$emit('submit-project');
    },
  },
  computed: {
    projectStatusItems() {
      return projectStatusItems;
    },
  },
});
</script>


<style scoped>

</style>