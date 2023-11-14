<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1>
          Backlog
        </h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="onCreateNewIssue()">
          Neue Aufgabe
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="issue?.children?.length">
      <v-col>
        <IssueList
            :issue="issue"
            :load-users="false"
            :users="users"
            @update:user="saveIssue"
            @click:onRow="openDetails">
        </IssueList>
      </v-col>
    </v-row>
    <v-row v-else-if="loading" justify="center">
      <v-col align-self="center" cols="auto">
        <v-progress-circular
            indeterminate
            size="40">
        </v-progress-circular>
      </v-col>
    </v-row>
    <v-row v-else-if="!newIssue" justify="center">
      <v-col align-self="center" cols="auto">
        Hier werden Aufgaben angezeigt, die keinem Sprint zugeordnet sind
      </v-col>
    </v-row>
    <v-row v-if="newIssue" no-gutters>
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
            ref="issueName"
            v-model="newIssue.name"
            density="compact"
            hide-details
            variant="outlined"
            @keydown.enter="createNewIssue()"></v-text-field>
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
    <DefaultDialog v-model:show-dialog="showDialog">
      <IssueDetails :issue-id="issueId" @click:update='closeDialog()'></IssueDetails>
    </DefaultDialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IssueList from '@/components/issue/IssueList.component.vue';
import { IssueActions, IssueMutations, useIssueStore } from '@/stores/issue.store';
import { Views } from '@/views';
import Issue, { issueStatusItems, IssueType } from '@/models/Issue';
import UserAvatar from '@/components/user/UserAvatar.component.vue';
import DefaultDialog from '@/components/shared/DefaultDialog.vue';
import IssueDetails from '@/components/issue/IssueDetails.component.vue';
import { UserActions, useUserStore } from '@/stores/user.store';

export default defineComponent({
  name: 'Backlog.view',
  components: { IssueDetails, DefaultDialog, UserAvatar, IssueList },
  data() {
    return {
      newIssue: null as Issue | null,
      showDialog: false,
      issueId: null as string | null,
      loading: true,
    };
  },
  async created() {
    console.log(!!this.issueStore, !!this.userStore);
    await Promise.all([this.issueStore.dispatch(IssueActions.FIND_ALL, {
      incrementId: null,
      projectId: this.projectId,
      sort: 'createdAt+ASC',
    }), this.userStore.dispatch(UserActions.FIND_ALL)]);/**/
    this.loading = false;
  },
  methods: {
    closeDialog() {
      this.showDialog = false;
    },
    async onCreateNewIssue() {
      this.newIssue = new Issue({
        projectId: this.projectId,
        type: IssueType.TASK,
      });
      await this.$nextTick(() => (this.$refs.issueName as HTMLElement)?.focus());
    },
    async createNewIssue() {
      if (!this.newIssue?.name) {
        this.$notify({
          type: 'info',
          text: 'Bitte geben Sie einen Namen ein',
        });
        return;
      }
      try {
        await this.issueStore.dispatch(IssueActions.CREATE_ISSUE, this.newIssue);
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Die Aufgabe konnte nicht erstellt werden',
        });
      }
      this.newIssue = null;
    },
    saveIssue(issue: Issue) {
      this.issueStore.commit(IssueMutations.SAVE_ISSUE, issue);
    },
    async openDetails(issue: Issue) {
      this.issueId = issue.id;
      this.showDialog = true;
    },
  },
  computed: {
    issueStore() {
      return useIssueStore();
    },
    issue() {
      return Issue.parseFromObject({
        children: this.issueStore.getters.issues,
      });
    },
    userStore() {
      return useUserStore();
    },
    users() {
      return this.userStore.getters.users;
    },
    projectId() {
      return this.$route.params.projectId as string ?? this.$router.push({
        name: Views.PROJECT_VIEW,
      });
    },
    typeItems() {
      return Object.values(IssueType);
    },
    statusItems() {
      return issueStatusItems;
    },
  },
});
</script>

<style scoped>

</style>
