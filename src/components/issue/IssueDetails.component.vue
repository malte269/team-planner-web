<template>
  <v-container fluid>
    <v-card :flat="flat">
      <v-card-text>
        <v-row v-if="activeIssue?.parentId" class="pl-3">
          <div class="mr-2">
            Übergeordnete Aufgabe:
          </div>
          <div
              class="my-link"
              @click="routeToIssueView({id: activeIssue.parentId, projectId: activeIssue.projectId})">
            {{ activeIssue.parent?.identifier ?? activeIssue.parentId }}
          </div>
        </v-row>
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-text-field
                    v-model="issueCopy.name"
                    hide-details
                    variant="outlined">
                  <template v-slot:prepend-inner>
                    <div class="d-flex align-center">
                      <div :class="issueCopy.type" class="issue-type"></div>
                      <div class=" ml-1 no-wrap">
                        {{ issueCopy.identifier }}
                      </div>
                    </div>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row class="mx-1" no-gutters>
              <v-col class="my-1">
                <v-tooltip location="bottom" text="Neuen Subtask erstellen">
                  <template v-slot:activator="{props}">
                    <v-btn
                        :disabled="createSubtaskDisabled"
                        color="lightGray"
                        flat
                        size="30"
                        v-bind="props"
                        @click="onCreateSubtask()">
                      <v-icon>mdi-checkbox-multiple-outline</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-textarea
                    v-model="issueCopy.description"
                    hide-details
                    label="Beschreibung"></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <IssueList
                    v-model:create-new-sub-issue-indicator="newSubIssue"
                    :issue="issueCopy"
                    @update:user="loadIssue"
                    @update:status="loadIssue"
                    @click:onRow="childRowClicked"></IssueList>
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row class="mb-0">
              <v-col>
                <v-select
                    v-model="issueCopy.status"
                    :items="statusItems"
                    density="compact"
                    hide-details
                    variant="filled"></v-select>
              </v-col>
              <v-col>
                <v-select
                    v-model="issueCopy.type"
                    :items="typeItems"
                    density="compact"
                    hide-details
                    label="Typ"></v-select>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-expansion-panels :model-value="0">
                  <v-expansion-panel title="Details">
                    <v-expansion-panel-text>
                      <v-row v-if="activeIssue && activeIssue.type !== IssueType.EPIC">
                        <v-col>
                          Übergeordneter Vorgang
                          <v-autocomplete
                              v-model="issueCopy.parentId"
                              :items="parentIssues"
                              density="compact"
                              hide-details
                              item-title="name"
                              item-value="id">
                            <template #item="{props, item}">
                              <v-list-item class="d-flex align-center" v-bind="props">
                                <template #prepend>
                                  <div :class="item.raw.type" class="issue-type"></div>
                                  <div class="mx-2">
                                    {{ item.raw.identifier }}
                                  </div>
                                </template>
                              </v-list-item>
                            </template>
                            <template #selection="{item}">
                              <div class="d-flex align-center">
                                <div :class="item.raw.type" class="issue-type"></div>
                                <div class="mx-2">
                                  {{ item.raw.identifier }}
                                </div>
                              </div>
                            </template>
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          Zugewiesene Person
                          <UserAvatar
                              v-model:user-id="issueCopy.userId"
                              @update:user-id="setUser"
                          ></UserAvatar>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          Benötigte Fähigkeiten
                          <v-autocomplete
                              v-model="issueCopy.skills"
                              :items="skills"
                              chips
                              closable-chips
                              density="compact"
                              hide-details
                              item-title="name"
                              item-value="name"
                              multiple
                          ></v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          Geschätzte Zeit
                          <v-row>
                            <v-col class="d-flex align-center">
                              <v-text-field
                                  v-model="issueCopy.duration"
                                  class="mr-2"
                                  density="compact"
                                  hide-details
                                  type="number">
                              </v-text-field>
                              PT
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          Sprint
                          <SelectIncrement
                              v-model:increment-id="issueCopy.incrementId"
                              @update:increment-id="onUpdateIncrement"></SelectIncrement>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          Phase
                          <SelectPhase
                              v-model:phase-id="issueCopy.phaseId"
                              :disabled="!issueCopy.incrementId"
                              :increment-id="issueCopy.incrementId"></SelectPhase>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          Modul
                          <SelectGroup
                              v-model:group-id="issueCopy.groupId"></SelectGroup>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          Vorangehende Aufgaben
                          <v-autocomplete
                              v-model="issueCopy.previous"
                              :items="allIssues"
                              chips
                              closable-chips
                              density="compact"
                              hide-details
                              item-title="name"
                              multiple
                              return-object>
                            <template #item="{props, item}">
                              <v-list-item class="d-flex align-center" v-bind="props">
                                <template #prepend>
                                  <div :class="item.raw.type" class="issue-type"></div>
                                  <div class="mx-2">
                                    {{ item.raw.identifier }}
                                  </div>
                                </template>
                              </v-list-item>
                            </template>
                            <template #selection="{item}">
                              <div class="d-flex align-center">
                                <div :class="item.raw.type" class="issue-type"></div>
                                <div class="mx-2">
                                  {{ item.raw.identifier }}
                                </div>
                              </div>
                            </template>
                          </v-autocomplete>
                        </v-col>
                        <v-col>
                          Nachgehende Aufgaben
                          <v-autocomplete
                              v-model="issueCopy.following"
                              :items="allIssues"
                              chips
                              closable-chips
                              density="compact"
                              hide-details
                              item-title="name"
                              multiple
                              return-object>
                            <template #item="{props, item}">
                              <v-list-item class="d-flex align-center" v-bind="props">
                                <template #prepend>
                                  <div :class="item.raw.type" class="issue-type"></div>
                                  <div class="mx-2">
                                    {{ item.raw.identifier }}
                                  </div>
                                </template>
                              </v-list-item>
                            </template>
                            <template #selection="{item}">
                              <div class="d-flex align-center">
                                <div :class="item.raw.type" class="issue-type"></div>
                                <div class="mx-2">
                                  {{ item.raw.identifier }}
                                </div>
                              </div>
                            </template>
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="d-flex align-center">
                          <v-text-field
                              v-model="issueCopy.startDateSoftIso"
                              hide-details
                              label="Frühestes Start-Datum"
                              type="date"></v-text-field>
                        </v-col>
                        <v-col class="d-flex align-center">
                          <v-text-field
                              v-model="issueCopy.endDateSoftIso"
                              hide-details
                              label="Frühestes End-Datum"
                              type="date"></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="d-flex align-center">
                          <v-text-field
                              v-model="issueCopy.startDateHardIso"
                              hide-details
                              label="Spätestes Start-Datum"
                              type="date"></v-text-field>
                        </v-col>
                        <v-col class="d-flex align-center">
                          <v-text-field
                              v-model="issueCopy.endDateHardIso"
                              hide-details
                              label="Spätestes End-Datum"
                              type="date"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" variant="flat" @click="updateIssue()">
          Speichern
        </v-btn>
        <v-btn color="primary" variant="flat" @click="clearChanges()">
          Änderungen verwerfen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Issue, { IssueStatus, IssueType } from '@/models/Issue';
import { IssueActions, useIssueStore } from '@/stores/issue.store';
import '@kyvg/vue3-notification';
import UserAvatar from '@/components/user/UserAvatar.component.vue';
import Increment from '@/models/Increment';
import Group from '@/models/Group';
import SelectIncrement from '@/components/increment/SelectIncrement.component.vue';
import SelectGroup from '@/components/group/SelectGroup.component.vue';
import SelectPhase from '@/components/phase/SelectPhase.component.vue';
import IssueList from '@/components/issue/IssueList.component.vue';
import { Views } from '@/views';
import { SkillActions, useSkillStore } from '@/stores/skill.store';

export default defineComponent({
  name: 'IssueDetails.component',
  components: { IssueList, SelectPhase, SelectIncrement, SelectGroup, UserAvatar },
  emits: ['click:onRow', 'click:update'],
  props: {
    issueId: {
      type: String,
      required: true,
    },
    flat: {
      type: Boolean,
      required: false,
      default: true,
    },
    handleClickEvent: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      issueCopy: new Issue(),
      edit: Boolean(false),
      description: '',
      increments: new Array<Increment>(),
      groups: new Array<Group>(),
      allIssues: new Array<Issue>(),
      activeIssue: new Issue(),
    };
  },
  async beforeMount() {
    console.log(!!this.issueStore, !!this.skillStore);

    await Promise.all([
      this.loadIssue(),
      this.skillStore.dispatch(SkillActions.FIND_ALL),
    ]);
    this.allIssues = await this.issueStore.dispatch(IssueActions.FIND_ALL, {
      save: false, query: {
        projectId: this.projectId,
      },
    });
    this.clearChanges();
  },
  methods: {
    async loadIssue() {
      this.activeIssue = await this.issueStore.dispatch(IssueActions.FIND_ONE, this.issueId);
    },
    async updateIssue() {
      if (this.issueCopy.incrementId && !this.issueCopy.phaseId) {
        this.$notify({
          type: 'info',
          text: 'Bitte wählen Sie eine Phase aus',
        });
        return;
      }
      try {
        await this.issueStore.dispatch(IssueActions.UPDATE_ISSUE, this.issueCopy);
        this.$notify({
          type: 'success',
          title: 'Erfolg',
          text: 'Die Änderungen konnten erfolgreich gespeichert werden',
        });
        this.$emit('click:update');
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Die Änderungen konnten nicht gespeichert werden',
        });
      }
    },
    async setUser(userId: string, issueId: string = this.activeIssue.id) {
      try {
        await this.issueStore.dispatch(IssueActions.UPDATE_ISSUE, { id: issueId, userId });
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Der Mitarbeiter konnte nicht zugewiesen werden',
        });
      }
    },
    clearChanges() {
      this.issueCopy = this.activeIssue!.copy();
    },
    onCreateSubtask() {
      if (this.issueCopy.children && !this.issueCopy.children[this.issueCopy.children.length - 1]?.id) {
        this.issueCopy.children!.pop();
      }
      this.issueCopy.children!.push(new Issue({
        tenantId: this.issueCopy.tenantId,
        projectId: this.issueCopy.projectId,
        parentId: this.issueCopy.id,
        type: Issue.parseDefaultSubType(this.issueCopy.type),
      }));
    },
    onUpdateIncrement(incrementId: string | null) {
      if (!incrementId) {
        this.issueCopy.phaseId = null;
      }
    },
    async childRowClicked(issue: Issue) {
      if (this.handleClickEvent) {
        await this.routeToIssueView(issue);
      } else {
        this.$emit('click:onRow', issue);
      }
    },
    async routeToIssueView(issue: Pick<Issue, 'projectId' | 'id'>) {
      await this.$router.push({
        name: Views.ISSUE_DETAILS,
        params: {
          projectId: issue.projectId,
          issueId: issue.id,
        },
      });
    },
  },
  computed: {
    parentIssues(): Issue[] {
      return this.allIssues.filter(
          (issue: Issue) => Issue.getAllowedParentTypes(this.activeIssue?.type).includes(issue.type),
      );
    },
    projectId(): string {
      return this.$route.params.projectId as string;
    },
    IssueType() {
      return IssueType;
    },
    issueStore() {
      return useIssueStore();
    },
    skillStore() {
      return useSkillStore();
    },
    skills() {
      return this.skillStore.getters.skills;
    },
    createSubtaskDisabled() {
      return this.activeIssue ? this.activeIssue.type === IssueType.SUB_TASK || this.activeIssue.type === IssueType.BUG : true;
    },
    statusItems() {
      return [{
        value: IssueStatus.UNTOUCHED,
        title: 'Zu erledigen',
      }, {
        value: IssueStatus.IN_PROGRESS,
        title: 'In Arbeit',
      }, {
        value: IssueStatus.FINISHED,
        title: 'Fertig',
      }];
    },
    typeItems() {
      return [{
        value: IssueType.EPIC,
        title: 'Epic',
      }, {
        value: IssueType.USER_STORY,
        title: 'UserStory',
      }, {
        value: IssueType.TASK,
        title: 'Task',
      }, {
        value: IssueType.SUB_TASK,
        title: 'SubTask',
      }, {
        value: IssueType.BUG,
        title: 'Bug',
      }];
    },
  },
});
</script>

<style scoped>
.my-link {
  color: blue;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}

.no-wrap {
  white-space: nowrap;
}
</style>
