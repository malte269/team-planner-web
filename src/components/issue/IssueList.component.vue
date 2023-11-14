<template>
  <v-list>
    <v-list-item v-for="child in issue.children!.filter((child1) => child1.id)" @click="onRowClicked(child)">
      <v-list-item-title>
        <v-row class="align-center" no-gutters>
          <v-col class="d-flex align-center">
            <div :class="child.type" class="issue-type"></div>
            <div class="ml-1 no-wrap">
              {{ child.identifier }}
            </div>
            <div class="ml-2">
              {{ child.name }}
            </div>
          </v-col>
          <v-col cols="2">
            <div @click.stop>
              <UserAvatar
                  v-model:user-id="child.userId"
                  :initials-only="true"
                  :load-users="loadUsers"
                  :users="users"
                  class="mx-2"
                  @update:user-id="setUser($event, child.id)"></UserAvatar>
            </div>
          </v-col>
          <v-col cols="4">
            <div @click.stop>
              <v-select
                  v-model="child.status"
                  :items="statusItems"
                  density="compact"
                  hide-details
                  variant="filled"
                  @update:modelValue="setStatus($event, child.id)"></v-select>
            </div>
          </v-col>
        </v-row>
      </v-list-item-title>
    </v-list-item>
    <v-list-item v-if="newIssue && !newIssue.id">
      <v-row class="d-flex" no-gutters>
        <v-col cols="1">
          <v-select
              v-model="newIssue.type"
              :class="newIssue.type"
              :items="typeItems"
              class="mr-1"
              density="compact"
              hide-details
              hide-selected
              single-line
              variant="outlined">
            <template v-slot:selection="{item}">
              <div :class="item.title" class="issue-type">
              </div>
            </template>
          </v-select>
        </v-col>
        <v-col>
          <v-text-field
              :ref="'issueName-' + issue.id"
              v-model="newIssue.name"
              density="compact"
              hide-details
              variant="outlined"
              @keydown.enter="createNewSubtask()"></v-text-field>
        </v-col>
        <v-col cols="2">
          <UserAvatar
              v-model:user-id="newIssue.userId"
              :initials-only="true"
              class="mx-2"></UserAvatar>
        </v-col>
        <v-col cols="4">
          <v-select
              v-model="newIssue.status"
              :items="statusItems"
              density="compact"
              hide-details
              variant="filled"></v-select>
        </v-col>
      </v-row>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import UserAvatar from '@/components/user/UserAvatar.component.vue';
import Issue, { issueStatusItems } from '@/models/Issue';
import { IssueActions, useIssueStore } from '@/stores/issue.store';
import DefaultDialog from '@/components/shared/DefaultDialog.vue';

export default defineComponent({
  name: 'IssueList.component',
  emits: ['click:onRow', 'update:user', 'update:status'],
  components: { DefaultDialog, UserAvatar },
  props: {
    issue: {
      type: Issue,
      required: true,
    },
    loadUsers: {
      type: Boolean,
      default: true,
    },
    users: {
      type: Array,
      default: null,
    },
  },
  mounted() {
    // without accessing the store in mounted, it would be undefined
    console.log(!!this.issueStore);
  },
  methods: {
    async setUser(userId: string, issueId: string) {
      try {
        const updatedIssue = await this.issueStore.dispatch(IssueActions.UPDATE_ISSUE, {
          body: { id: issueId, userId },
          save: false,
        });
        this.$emit('update:user', updatedIssue);
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Der Mitarbeiter konnte nicht zugewiesen werden',
        });
      }
    },
    onRowClicked(issue: Issue) {
      this.$emit('click:onRow', issue);
    },
    async setStatus(status: string, issueId: string) {
      try {
        await this.issueStore.dispatch(IssueActions.UPDATE_ISSUE, { body: { id: issueId, status }, save: false });
        this.$emit('update:status');
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Der Status konnte nicht geändert werden',
        });
      }
    },
    async createNewSubtask() {
      if (!this.newIssue) {
        return;
      }
      if (!this.newIssue.name) {
        this.$notify({
          type: 'info',
          title: 'Fehlender Name',
          text: 'Bitte geben Sie einen Namen für die Aufgabe an',
        });
        return;
      }
      try {
        this.newIssue = await this.issueStore.dispatch(IssueActions.CREATE_ISSUE, {
          body: this.newIssue,
          save: false,
        });
      } catch (e) {
        console.log('error', e);
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Die Aufgabe konnte nicht erstellt werden',
        });
        return;
      }
    },
  },
  computed: {
    issueStore() {
      return useIssueStore();
    },
    statusItems() {
      return issueStatusItems;
    },
    typeItems() {
      return Issue.getAllowedSubTypes(this.issue.type);
    },
    newIssue: {
      get() {
        const lastChild = this.issue.children?.[this.issue.children.length - 1];
        if (lastChild && !lastChild.id) {
          this.$nextTick(() => this.$refs['issueName-' + this.issue.id]?.focus());
        }
        return lastChild;
      },
      set(issue: Issue | null) {
        this.issue.children?.pop();
        if (issue) {
          this.issue.children?.push(issue);
        }
      },
    },
  },
});
</script>


<style scoped>
.no-wrap {
  white-space: nowrap;
}
</style>