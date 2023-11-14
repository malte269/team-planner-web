<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1>
          Skill Overview
        </h1>
      </v-col>
      <v-col align-self="center" cols="auto">
        <v-btn color="primary" @click="onCreateSkill()">
          Neuer Skill
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list>
          <v-list-item v-for="skill in skills">
            <v-list-item-title class="d-flex align-center py-1">
              <div>
                {{ skill.name }}
              </div>
              <v-spacer></v-spacer>
              <v-btn icon size="30" @click="onDeleteSkill(skill)">
                <v-icon size="20">
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="newSkill">
            <v-list-item-title>
              <v-text-field
                  ref="skillName"
                  v-model="newSkill.name"
                  density="compact"
                  hide-details
                  variant="outlined"
                  @blur="onBlur()"
                  @keydown.enter="createSkill()"></v-text-field>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <DeleteDialog
        v-model:show-dialog="showDeleteDialog"
        @click:delete="deleteSkill()"
        @click:cancel="cancelDeletion()">
      <template #title>
        Skill löschen?
      </template>
      <template #text>
        Möchten Sie den Skill "{{ skillToDelete?.name }}" wirklich löschen? Wenn Sie den Skill löschen, können Sie ihn
        keinem Objekt mehr zuweisen. Objekte mit diesem Skill, behalten diesen aber
      </template>
    </DeleteDialog>
  </v-container>
</template>

<script lang='ts'>

import { defineComponent } from 'vue';
import { SkillActions, useSkillStore } from '@/stores/skill.store';

import TableComponent from '@/components/shared/table/Table.component.vue';
import Skill from '@/models/Skill';
import DeleteDialog from '@/components/shared/DeleteDialog.vue';

export default defineComponent({
  components: {
    DeleteDialog,
    TableComponent,
  },
  data() {
    const newSkill: Skill = null;
    const skillToDelete: Skill = null;
    return {
      newSkill,
      skillToDelete,
      showDeleteDialog: false,
    };
  },
  async mounted() {
    await this.skillStore.dispatch(SkillActions.FIND_ALL);
  },
  methods: {
    onCreateSkill() {
      this.newSkill = new Skill({
        name: '',
      });
      this.$nextTick(() => this.$refs.skillName?.focus());
    },
    async onBlur() {
      if (this.newSkill.name) {
        await this.createSkill();
      } else {
        this.newSkill = null;
      }
    },
    async createSkill() {
      try {
        await this.skillStore.dispatch(SkillActions.CREATE_SKILL, this.newSkill);
        this.$notify({
          type: 'success',
          title: 'Erfolg',
          text: 'Der Skill wurde erfolgreich erstellt',
        });
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'der Skill konnte nicht erstellt werden',
        });
        return;
      }
      this.newSkill = null;
    },
    onDeleteSkill(skill: Skill) {
      this.skillToDelete = skill;
      this.showDeleteDialog = true;
    },
    async deleteSkill() {
      try {
        await this.skillStore.dispatch(SkillActions.DELETE_SKILL, this.skillToDelete.id);
        this.$notify({
          type: 'success',
          title: 'Erfolg',
          text: 'Der Skill wurde erfolgreich gelöscht',
        });
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'der Skill konnte nicht gelöscht werden',
        });
      }
      this.showDeleteDialog = false;
      await this.$nextTick(() => this.skillToDelete = null);
    },
    cancelDeletion() {
      this.showDeleteDialog = false;
      this.$nextTick(() => this.skillToDelete = null);
    },
  },
  computed: {
    skillStore() {
      return useSkillStore();
    },
    skills() {
      return this.skillStore.getters.skills;
    },
  },
  watch: {
    showDeleteDialog() {
      if (!this.showDeleteDialog) {
        this.cancelDeletion();
      }
    },
  },
});
</script>

<style scoped>

</style>
