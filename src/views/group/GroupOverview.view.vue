<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="auto">
        <h1>
          Aufgabengruppen
        </h1>
      </v-col>
      <v-col align-self="center" class="ml-2">
        <InfoComponent
            text="Aufgabengruppen gruppieren Aufgaben zu bestimmten Themenbereichen und werden für die Teamzusammenstellung verwendet. Eine Gruppe bedeutet ein (Sub)-Team. Nach möglichkeit sollten keine Entwickler zwischen zwei Gruppen des Selben Hierarchie-Levels geteilt werden">
        </InfoComponent>
      </v-col>
      <v-col align-self="center" cols="auto">
        <v-btn color="primary" @click="onCreateNewGroup()">
          Neue Gruppe
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col align-self="center" cols="auto">
        <v-btn @click="expandAll()">
          Alle öffnen
        </v-btn>
      </v-col>
      <v-col align-self="center" cols="auto">
        <v-btn @click="collapseAll()">
          Alle schließen
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DeepExpendableList v-model:values="modelValue" :items="groups">
          <template #title='{item}'>
            <v-text-field
              v-if='updateId && updateId === item?.id'
              ref='groupName'
              v-model="item.name"
              class="mr-3"
              variant="outlined"
              density="compact"
              hide-details
              @blur='updateGroup(item)'
              @keydown.enter="blurAny()"
              @click.stop></v-text-field>
            <div v-else>
              {{ item.name }}
            </div>
          </template>
          <template #actions="{item}">
            <v-btn class='mr-2' color="lightGray" flat size="25" @click.stop="onUpdateGroup(item)">
              <v-icon>
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn color="lightGray" flat size="25" @click.stop="onCreateNewSubGroup(item)">
              <v-icon>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <template #afterText="{item}">
            <v-text-field
                v-if="!!newSubGroup && newSubGroup.parentId === item.id"
                ref="newSubGroup"
                v-model="newSubGroup.name"
                class="mt-3 mr-5"
                density="compact"
                hide-details
                variant="outlined"
                @blur="createGroup('newSubGroup')"
                @keydown.enter="createGroupWithCheck('newSubGroup')">
            </v-text-field>
          </template>
        </DeepExpendableList>
      </v-col>
    </v-row>
    <v-row v-if="newGroup">
      <v-col>
        <v-text-field
            ref="newGroup"
            v-model="newGroup.name"
            density="compact"
            hide-details
            variant="outlined"
            @blur="createGroup('newGroup')"
            @keydown.enter="createGroupWithCheck('newGroup')">
        </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GroupActions, useGroupStore } from '@/stores/group.store';
import { Views } from '@/views';
import ExpandableList from '@/components/shared/ExpandableList.vue';
import DeepExpendableList from '@/components/shared/DeepExpendableList.vue';
import Group from '@/models/Group';
import InfoComponent from '@/components/shared/InfoComponent.vue';

export default defineComponent({
  name: 'GroupOverview.view',
  components: { InfoComponent, DeepExpendableList, ExpandableList },
  data() {
    const newGroup: Group = null;
    const newSubGroup: Group = null;
    return {
      values: {},
      saveNewRecord: true,
      newGroup,
      newSubGroup,
      updateId: '',
    };
  },
  async mounted() {
    await this.groupStore.dispatch(GroupActions.FIND_ALL, {
      projectId: this.projectId,
      family: true,
    });
  },
  methods: {
    async blurAny() {
      (document.activeElement as HTMLElement)?.blur();
    },
    async updateGroup(group: Group) {
      if (!group.name) {
        this.$notify({
          type: 'info',
          title: 'Kein Name',
          text: 'Bitte vergeben Sie einen Namen für die Gruppe'
        });
        return;
      }
      try {
        await this.groupStore.dispatch(GroupActions.UPDATE, {
          id: group.id,
          name: group.name,
        });
        this.updateId = '';
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Die Gruppe konnte nicht aktualisiert werden'
        });
      }
    },
    onUpdateGroup(group: Group) {
      this.updateId = group.id;
      this.$nextTick(() => this.$refs.groupName?.focus());
    },
    onCreateNewGroup() {
      this.newGroup = new Group({
        projectId: this.projectId,
      });
      this.$nextTick(() => this.$refs.newGroup?.focus());
    },
    onCreateNewSubGroup(parent: Group) {
      this.newSubGroup = new Group({
        projectId: this.projectId,
        parentId: parent.id,
      });
      this.saveNewRecord = false;
      this.addGroupToObject(parent);
      this.$nextTick(() => this.$refs.newSubGroup?.focus());
    },
    async createGroup(newGroupKey: 'newGroup' | 'newSubGroup') {
      if (!this[newGroupKey]?.name) {
        this[newGroupKey] = null;
        return;
      }
      try {
        await this.groupStore.dispatch(GroupActions.CREATE, {
          body: this[newGroupKey],
          save: this.saveNewRecord,
        });
        this[newGroupKey] = null;
        if (!this.saveNewRecord) {
          await this.groupStore.dispatch(GroupActions.FIND_ALL, {
            projectId: this.projectId,
            family: true,
          });
          this.saveNewRecord = true;
        }
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Die Gruppe konnte nicht erstellt werden',
        });
      }
    },
    async createGroupWithCheck(newGroupKey: 'newGroup' | 'newSubGroup') {
      if (!this[newGroupKey]?.name) {
        this.$notify({
          type: 'info',
          title: 'Kein Name',
          text: 'Bitte geben Sie einen Namen für die Gruppe an',
        });
        return;
      }
      await this.createGroup(newGroupKey);
    },
    expandAll() {
      this.values = this.reduceGroups();
    },
    addGroupToObject(group: Group, obj: {[key: string]: any} = this.modelValue) {
      if (group.parentId === null) {
        obj[group.id] = {};
        return true;
      } else if (Object.keys(obj).includes(group.parentId)) {
        obj[group.parentId] = {
          ...obj[group.parentId],
          [group.id]: {},
        }
        return true;
      }
      return Object.keys(obj).some((key) => this.addGroupToObject(group, obj[key]));
    },
    reduceGroups(values: Group[] = this.groups) {
      return values.reduce((result, group) => {
        result[group.id] = group.children?.length ? this.reduceGroups(group.children) : {};
        return result;
      }, {});
    },
    collapseAll() {
      this.values = {};
    },
  },
  computed: {
    projectId() {
      return this.$route.params.projectId ?? this.$router.push({
        name: Views.PROJECT_VIEW,
      });
    },
    groupStore() {
      return useGroupStore();
    },
    groups() {
      return this.groupStore.getters.groups;
    },
    modelValue: {
      get() {
        return this.values;
      },
      set(value: any) {
        this.values = value;
      },
    },
  },
});
</script>

<style scoped>

</style>
