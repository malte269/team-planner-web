<template>
  <v-container fluid>
    <v-row>
      <v-col class="align-center">
        <h1>
          Sprint Übersicht
        </h1>
      </v-col>
      <v-col align-self="center" cols="auto">
        <v-btn color="primary" @click="onCreateIncrement()">
          Neuer Sprint
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-for="(item) in items">
      <v-col>
        <v-card color="lightGray">
          <v-card-title>
            <v-expansion-panels>
              <v-expansion-panel :title="item.name">
                <v-expansion-panel-text>
                  <v-row>
                    <v-col>
                      <v-text-field
                          v-model="item.startDateSoftIso"
                          hide-details
                          label="Frühestes Start-Datum"
                          type="date"
                          @change="updateIncrement(item)"></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                          v-model="item.endDateSoftIso"
                          hide-details
                          label="Frühestes End-Datum"
                          type="date"
                          @change="updateIncrement(item)"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                          v-model="item.startDateHardIso"
                          hide-details
                          label="Spätestes Start-Datum"
                          type="date"
                          @change="updateIncrement(item)"></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                          v-model="item.endDateHardIso"
                          hide-details
                          label="Spätestes End-Datum"
                          type="date"
                          @change="updateIncrement(item)"></v-text-field>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-for="phase in item.phases">
                <v-row>
                  <v-col class="d-flex justify-center">
                    <div v-if="!!phase.id">
                      <input
                        :value='phase.name'
                        @keydown.enter='blurAny()'
                        @blur='savePhase($event, phase.id)'>
                    </div>
                    <v-text-field
                        v-else
                        ref="phase-name"
                        v-model="phase.name"
                        density="compact"
                        hide-details
                        variant="outlined"
                        @blur="addPhaseToIncrement(phase, item)"
                        @keydown.enter="blurAny()"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <PlainList
                        :items="item.issues.filter((i) => i.phaseId === phase.id && i.id)"
                        @click:row="openIssueDetails">
                      <template #prepend-item="{item}">
                        <div :class="item.type" class="issue-type mr-2"></div>
                        {{ item.identifier }}
                      </template>
                      <template #title="{item}">
                        {{ item.name }}
                      </template>
                    </PlainList>
                    <v-text-field
                        v-if="!!newIssue && newIssue.phaseId === phase.id"
                        ref="issue-name"
                        v-model="newIssue.name"
                        class="mb-2"
                        density="compact"
                        hide-details
                        variant="outlined"
                        @blur="addIssueToPhase(item)"
                        @keydown.enter="blurAny()"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col>
                    <v-btn
                        block
                        border="dashed"
                        color="primary"
                        variant="outlined"
                        @click="onAddIssue(item, phase)">
                      <v-icon>
                        mdi-plus
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <div class="pa-3">
                <v-btn class="fill-height" density="default" @click="onAddPhase(item)">
                  <v-icon>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </div>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <DefaultDialog v-model:show-dialog="showIssueDialog">
    <IssueDetailsComponent :issue-id="issueId" flat @click:update='closeDialog()'></IssueDetailsComponent>
  </DefaultDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import '@kyvg/vue3-notification';
import { IncrementActions, useIncrementStore } from '@/stores/increment.store';
import IssueDetailsComponent from '@/components/issue/IssueDetails.component.vue';
import Issue, { IssueType } from '@/models/Issue';
import DefaultDialog from '@/components/shared/DefaultDialog.vue';
import Increment from '@/models/Increment';
import PlainList from '@/components/shared/PlainList.component.vue';
import { PhaseActions, usePhaseStore } from '@/stores/phase.store';
import { IssueActions, useIssueStore } from '@/stores/issue.store';
import Phase from '@/models/Phase';

export default defineComponent({
  components: {
    PlainList,
    DefaultDialog,
    IssueDetailsComponent,
  },
  data() {
    const newIssue: Issue = null;
    return {
      issueId: '',
      showIssueDialog: Boolean(false),
      newIssue,
    };
  },
  async mounted() {
    console.log(!!this.incrementStore);
    console.log(!!this.phaseStore);
    console.log(!!this.issueStore);
    await this.incrementStore.dispatch(IncrementActions.FIND_ALL, {
      projectId: this.$route.params.projectId,
    });
  },
  methods: {
    closeDialog() {
      this.showIssueDialog = false;
    },
    async onCreateIncrement() {
      // if previous increment has no endDate, show notification to set one
      if (!(this.lastItem.endDateSoft || this.lastItem.endDateHard)) {
        this.$notify({
          type: 'info',
          title: 'Fehlendes Datum',
          text: 'Der vorherige Sprint hat kein Ende. Bitte setzen Sie eins für den letzten Sprint',
        });
        return;
      }
      try {
        await this.incrementStore.dispatch(IncrementActions.CREATE_INCREMENT, {
          name: `Sprint ${ this.items.length + 1 }`,
          startDateSoft: this.lastItem.endDateSoft ?? this.lastItem.endDateHard,
          startDateHard: this.lastItem.endDateHard,
          incrementNumber: this.items.length,
          projectId: this.$route.params.projectId,
        });
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Es konnte kein neuer Sprint angelegt werden konnte nicht erstellt werden',
        });
      }
    },
    async updateIncrement(inc: Increment) {
      try {
        await this.incrementStore.dispatch(IncrementActions.UPDATE_INCREMENT, {
          id: inc.id,
          startDateSoft: inc.startDateSoft,
          startDateHard: inc.startDateHard,
          endDateSoft: inc.endDateSoft,
          endDateHard: inc.endDateHard,
        });
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Der Sprint konnte nicht aktualisiert werden',
        });
      }
    },
    openIssueDetails(issue: Issue) {
      this.issueId = issue.id;
      this.showIssueDialog = true;
    },
    onAddPhase(inc: Increment) {
      inc.phases?.push(new Phase({
        incrementId: inc.id,
      }));
      this.$nextTick(() => {
        // refs is an array because of v-for of increments. The index is the order of adding the ref. Because there is
        // always only one, it is index 0
        this.$refs['phase-name']?.[0]?.focus();
      });
    },
    async blurAny() {
      (document.activeElement as HTMLElement)?.blur();
    },
    async addPhaseToIncrement(phase: Phase, inc: Increment) {
      if (!phase.name) {
        inc.phases?.pop();
        return;
      }
      try {
        const newPhase = await this.phaseStore.dispatch(PhaseActions.CREATE, phase);
        inc.phases?.pop();
        inc.phases?.push(newPhase);
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Die Phase konnte nicht erstellt werden',
        });
      }
    },
    onAddIssue(inc: Increment, phase: Phase) {
      this.newIssue = new Issue({
        incrementId: inc.id,
        phaseId: phase.id,
        projectId: inc.projectId,
        type: IssueType.TASK,
      });
      this.$nextTick(() => {
        // refs is an array because of v-for of increments. The index is the order of adding the ref. Because there is
        // always only one, it is index 0
        this.$refs['issue-name']?.[0]?.focus();
      });
    },
    async addIssueToPhase(inc: Increment) {
      if (!this.newIssue?.name) {
        this.newIssue = null;
        return;
      }
      try {
        await this.issueStore.dispatch(IssueActions.CREATE_ISSUE, this.newIssue);
        this.newIssue = null;
        await this.incrementStore.dispatch(IncrementActions.FIND_ONE, inc.id);
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Die Phase konnte nicht erstellt werden',
        });
      }
    },
    async savePhase(event: any, phaseId: string) {
      const newName = (event.target as HTMLElement).value;
      if (!newName) {
        this.$notify({
          title: 'Kein Name',
          type: 'info',
          text: 'Bitte vergeben Sie einen Namen'
        });
        return;
      }
      try {
        await this.phaseStore.dispatch(PhaseActions.UPDATE, {
          id: phaseId,
          name: newName,
        });
      } catch (e) {
        this.$notify({
          title: 'Fehler',
          type: 'error',
          text: 'Der Name der Phase konnte nicht aktualisiert werden'
        });
      }
    }
  },
  computed: {
    incrementStore() {
      return useIncrementStore();
    },
    items() {
      return this.incrementStore.getters.increments;
    },
    phaseStore() {
      return usePhaseStore();
    },
    issueStore() {
      return useIssueStore();
    },
    lastItem() {
      return this.items[this.items.length - 1];
    },
  },
});
</script>

<style scoped>

</style>
