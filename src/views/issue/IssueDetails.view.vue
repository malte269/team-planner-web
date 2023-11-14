<template>
  <v-container fluid>
    <v-row class="px-3 my-3">
      <h1>
        Aufgaben Details
      </h1>
    </v-row>
    <v-row>
      <IssueDetails
          :handle-click-event="false"
          :issue-id="$route.params.issueId"
          flat
          @click:onRow="onRowClicked"></IssueDetails>
    </v-row>
    <DefaultDialog v-model:show-dialog="showDialog">
      <IssueDetails :issue-id="issueId" @click:update='closeDialog()'></IssueDetails>
    </DefaultDialog>
  </v-container>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import IssueDetails from '@/components/issue/IssueDetails.component.vue';
import DefaultDialog from '@/components/shared/DefaultDialog.vue';
import Issue from '@/models/Issue';

export default defineComponent({
  name: 'IssueDetails.view',
  components: { DefaultDialog, IssueDetails },
  data() {
    return {
      showDialog: false,
      issueId: null,
    };
  },
  methods: {
    closeDialog() {
      this.showDialog = false;
    },
    onRowClicked(issue: Issue) {
      this.issueId = issue.id;
      this.showDialog = true;
    },
  },
});
</script>


<style scoped>

</style>
