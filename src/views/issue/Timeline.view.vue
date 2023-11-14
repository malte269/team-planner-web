<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1>
          Zeitleiste
        </h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="onCreateNewEpic()">
          Neuer Epic
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <ExpandableList v-model:values="selectedIssues" :items="allIssues">
        <template #prepend-title="{item}">
          <div class="d-flex align-center">
            <div :class="item.type" class="issue-type"></div>
            <div class="mx-2">
              {{ item.identifier }}
            </div>
          </div>
        </template>
        <template #actions="{item}">
          <div>
            <v-tooltip text="Details anzeigen">
              <template v-slot:activator="{props}">
                <v-btn class="mr-3" color="lightGray" flat size="25" v-bind="props"
                       @click.stop="openIssueDialog(item)">
                  <v-icon>
                    mdi-clipboard-edit-outline
                  </v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Neue untergeordnete Aufgabe erstellen">
              <template v-slot:activator="{props}">
                <v-btn color="lightGray" flat size="25" v-bind="props" @click.stop="onCreateNewSubIssue(item)">
                  <v-icon>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
        <template #text="{item}">
          <IssueList
              :issue="item"
              @click:onRow="openIssueDialog($event)"></IssueList>
        </template>
      </ExpandableList>
    </v-row>
    <v-row v-if="!!newEpic">
      <v-col align-self="center" cols="auto">
        <div :class="newEpic.type" class="issue-type">
        </div>
      </v-col>
      <v-col>
        <v-text-field
            ref="epicName"
            v-model="newEpic.name"
            density="compact"
            hide-details
            variant="outlined"
            @keydown.enter="createNewEpic()"></v-text-field>
      </v-col>
    </v-row>
    <DefaultDialog v-model:show-dialog="showIssueDialog">
      <IssueDetailsComponent :issue-id="issueDetailsId" flat @click:update='closeDialog()'></IssueDetailsComponent>
    </DefaultDialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IssueActions, useIssueStore } from '@/stores/issue.store';
import IssueList from '@/components/issue/IssueList.component.vue';
import DefaultDialog from '@/components/shared/DefaultDialog.vue';
import IssueDetailsComponent from '@/components/issue/IssueDetails.component.vue';
import Issue, { IssueType } from '@/models/Issue';
import { Views } from '@/views';
import ExpandableList from '@/components/shared/ExpandableList.vue';
import UserAvatar from '@/components/user/UserAvatar.component.vue';

export default defineComponent({
  name: 'Timeline.view',
  components: { UserAvatar, ExpandableList, IssueDetailsComponent, DefaultDialog, IssueList },
  data() {
    return {
      showIssueDialog: false,
      issueDetailsId: '',
      selectedIssues: new Array<string>(),
      newEpic: null as Issue | null,
    };
  },
  async beforeMount() {
    await this.issueStore.dispatch(IssueActions.FIND_ALL, {
      projectId: this.projectId,
      groupBy: 'family',
      sort: 'createdAt+ASC',
    });
  },
  methods: {
    closeDialog() {
      this.showIssueDialog = false;
    },
    onCreateNewSubIssue(parent: Issue) {
      if (!this.selectedIssues.includes(parent.id)) {
        this.selectedIssues.push(parent.id);
      }
      if (parent.children && !parent.children[parent.children.length - 1]?.id) {
        parent.children!.pop();
      }
      parent.children!.push(new Issue({
        tenantId: parent.tenantId,
        projectId: parent.projectId,
        parentId: parent.id,
        type: Issue.parseDefaultSubType(parent.type),
      }));
    },
    openIssueDialog(issue: Issue) {
      this.issueDetailsId = issue.id;
      this.showIssueDialog = true;
    },
    async onCreateNewEpic() {
      this.newEpic = new Issue({
        projectId: this.projectId,
        type: IssueType.EPIC,
      });
      await this.$nextTick(() => (this.$refs.epicName as HTMLElement)?.focus());
    },
    async createNewEpic() {
      if (!(this.newEpic && this.newEpic.name)) {
        this.$notify({
          type: 'info',
          title: 'Fehlender',
          text: 'Bitte geben Sie einen Namen ein',
        });
        return;
      }
      try {
        await this.issueStore.dispatch(IssueActions.CREATE_ISSUE, this.newEpic);
        this.newEpic = null;
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Die Aufgabe konnte nicht erstellt werden',
        });
      }
    },
  },
  computed: {
    issueStore() {
      return useIssueStore();
    },
    allIssues() {
      return this.issueStore.getters.issues;
    },
    projectId(): string {
      return this.$route.params.projectId as string ?? this.$router.push({
        name: Views.PROJECT_VIEW,
      });
    },
  },
});
</script>


<style scoped>

</style>
