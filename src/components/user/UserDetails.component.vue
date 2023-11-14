<template>
  <v-container fluid>
    <v-row>
      <v-col align-self="center">
        <h1>
          {{
            !userId ?
                'Erstelle einen neuen Mitarbeiter' :
                editMode ? 'Mitarbeiter bearbeiten' :
                    'Mitarbeiter Details'
          }}
        </h1>
      </v-col>
      <v-col v-if="userId" align-self="center" cols="auto">
        <div>
          <v-btn class="mr-2" icon @click="onEditUser()">
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn icon @click="onDeleteUser()">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
            v-model="userCopy.firstName"
            :disabled="disabled"
            density="compact"
            hide-details
            label="Vorname"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="userCopy.lastName"
            :disabled="disabled"
            density="compact"
            hide-details
            label="Nachname"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
            v-model="userCopy.email"
            :disabled="disabled"
            density="compact"
            hide-details
            label="Email"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="userCopy.workTimes[0].weeklyAmount"
            :disabled="disabled"
            density="compact"
            hide-details
            label="Arbeitspensum in h"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col align-self="center">
        <v-autocomplete
            v-model="userCopy.skills"
            :disabled="disabled"
            chips
            closable-chips
            density="compact"
            hide-details
            hide-no-data
            item-title="name"
            item-value="name"
            label="Fähigkeiten"
            multiple>
        </v-autocomplete>
      </v-col>
      <v-col cols="auto">
        <v-combobox
            v-model="newSkill"
            :disabled="disabled"
            :items="skills"
            class="mb-3"
            density="compact"
            hide-details
            item-title="name"
            item-value="name"
            label="Fähigkeit"
            @keydown.enter="addSkill()">
        </v-combobox>
        <v-text-field
            v-model="newSkillLevel"
            :disabled="disabled"
            density="compact"
            hide-details
            label="Level"
            type="number"
            @keydown.enter="addSkill()">
          <template #append-inner>
            <InfoComponent text="Ein Wert zwischen 0 und 100(%)"></InfoComponent>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex">
        <div class="d-flex align-center">
          <v-checkbox
              v-model="userCopy.isExpert"
              :disabled="disabled"
              class="mr-2"
              color="primary" density="compact" hide-details
              label="Ist Experte"></v-checkbox>
          <InfoComponent
              text="Ein Experte ist jemand, der andere anleiten kann und bereits Erfahrung besitzt. Es muss immer einen Experten pro Team geben"></InfoComponent>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="!userId">
      <v-btn color="success" @click="createUser()">
        Erstellen
      </v-btn>
    </v-row>
    <v-row v-if="editMode">
      <v-btn class="mr-3" color="success" @click="updateUser()">
        Speichern
      </v-btn>
      <v-btn @click="revertChanges()">
        Abbrechen
      </v-btn>
    </v-row>
    <DeleteDialog v-model:show-dialog="showDeleteDialog" @click:delete="deleteUser()">
      <template #title>
        Mitarbeiter löschen?
      </template>
      <template #text>
        Wollen Sie den Mitarbeiter {{ storeUser.fullName }} wirklich löschen?
      </template>
    </DeleteDialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import User from '@/models/user';
import { UserActions, useUserStore } from '@/stores/user.store';
import DeleteDialog from '@/components/shared/DeleteDialog.vue';
import { Views } from '@/views';
import InfoComponent from '@/components/shared/InfoComponent.vue';
import { SkillActions, useSkillStore } from '@/stores/skill.store';
import Skill from '@/models/Skill';

export default defineComponent({
  name: 'UserDetails.component',
  components: { InfoComponent, DeleteDialog },
  emits: ['submit:user'],
  props: {
    user: {
      type: User,
      default: new User(),
    },
    userId: {
      type: String,
      default: '',
    },
  },
  data() {
    const newSkill: Skill | null = null;
    return {
      editMode: false,
      userCopy: new User(),
      showDeleteDialog: false,
      weeklyAmount: 0,
      newSkill,
      newSkillLevel: 0,
    };
  },
  async created() {
    console.log(!!this.userStore, !!this.skillStore);
    let user: User = this.user;
    if (this.userId) {
      user = await this.userStore.dispatch(UserActions.FIND_ONE, this.userId);
    }
    if (!this.skills?.length) {
      await this.skillStore.dispatch(SkillActions.FIND_ALL);
    }
    this.userCopy = user.copy() as User;
  },
  methods: {
    onEditUser() {
      this.editMode = true;
    },
    onDeleteUser() {
      this.showDeleteDialog = true;
    },
    revertChanges() {
      this.userCopy = this.storeUser?.copy() as User;
      this.editMode = false;
    },
    addSkill() {
      if (!this.newSkill) {
        this.$notify({
          type: 'info',
          title: 'Fehlende Info',
          text: 'Es wurde kein Skill spezifiziert',
        });
        return;
      }
      if (!this.newSkillLevel) {
        this.$notify({
          type: 'info',
          title: 'Fehlende Info',
          text: 'Es wurde kein Skill Level spezifiziert',
        });
        return;
      }
      const skillToAdd = `${ this.newSkill.name }+${ Math.min(this.newSkillLevel, 100) }`;
      const index = this.userCopy.getSkillIndex(this.newSkill.name);
      if (index > -1) {
        this.userCopy.skills.splice(index, 1, skillToAdd);
      } else {
        this.userCopy.skills.push(skillToAdd);
      }
      this.newSkill = null;
      this.newSkillLevel = 0;
    },
    async createUser() {
      try {
        await this.userStore.dispatch(UserActions.CREATE_USER, this.userCopy);
        this.$notify({
          type: 'success',
          title: 'Erfolg',
          text: 'Der Mitarbeiter wurde erfolgreich erstellt',
        });
        this.$emit('submit:user');
      } catch (e) {
        console.log('error', e);
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Der Mitarbeiter konnte nicht erstellt werden',
        });
      }
    },
    async updateUser() {
      try {
        await this.userStore.dispatch(UserActions.UPDATE_USER, this.userCopy);
        this.$notify({
          type: 'success',
          title: 'Erfolg',
          text: 'Der Mitarbeiter wurde erfolgreich aktualisiert',
        });
        this.$emit('submit:user');
        this.editMode = false;
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Der Mitarbeiter konnte nicht gelöscht werden',
        });
      }
    },
    async deleteUser() {
      try {
        await this.userStore.dispatch(UserActions.DELETE_USER, this.userId ?? this.storeUser?.id);
        this.$notify({
          type: 'success',
          title: 'Erfolg',
          text: 'Der Mitarbeiter wurde erfolgreich gelöscht',
        });
        this.$emit('submit:user');
        await this.$router.push({
          name: Views.USERS_VIEW,
        });
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Der Mitarbeiter konnte nicht gelöscht werden',
        });
      }
    },
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    storeUser() {
      return this.userStore.getters.activeUser;
    },
    skillStore() {
      return useSkillStore();
    },
    skills() {
      return this.skillStore.getters.skills;
    },
    disabled() {
      return !(!this.userId || this.editMode);
    },
  },
});
</script>

<style scoped>

</style>