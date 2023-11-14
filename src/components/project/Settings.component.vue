<template>
  <v-container fluid>
    <v-row>
      <v-col class="font-weight-bold">
        Steuerungs-Konstanten
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Penalties:
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
            v-model="settings.estimatedAvailability"
            density="compact"
            hide-details
            label="Geschätzte Verfügbarkeit"
            type="number">
          <template #append-inner>
            <InfoComponent text="Geschätze durchschnittliche verfügbare Zeit der Mitarbeiter"></InfoComponent>
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="settings.tacticalUnderload"
            density="compact"
            hide-details
            label="Taktische unterzuweisung"
            type="number">
          <template #append-inner>
            <InfoComponent text="Taktische unterzuweisung, um Engpässe zu vermeiden"></InfoComponent>
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="settings.incrementPenaltyConstant"
            density="compact"
            hide-details
            label="Sprint Penalty"
            type="number">
          <template #append-inner>
            <InfoComponent
                text="Diese Konstante wird mit den Kosten der Bewertungsfunktion verrechnet, wenn ein Mitarbeiter einer Komponente in einem Sprint zugewiesen wird, obwohl er im vorherigen Sprint nicht dabei war"></InfoComponent>
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="settings.timePenalty"
            density="compact"
            hide-details
            label="Zeit Penalty"
            type="number">
          <template #append-inner>
            <InfoComponent
                text="Droht eine Komponente nicht in einem Sprint fertigzustellen, also wenn die Mitarbeiter nicht in der Lage sind, den Workload in der gegebenen Zeit zu schaffen, werden zusätzliche Kosten für jeden Tag hinzuaddiert"></InfoComponent>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
            v-model="settings.novicePenaltyConstant"
            density="compact"
            hide-details
            label="Novizen Penalty"
            type="number">
          <template #append-inner>
            <InfoComponent
                text="Diese Konstante wird mit den Kosten der Bewertungsfunktion verrechnet, wenn ein Team nicht genügend Experten zum Anleiten von weniger erfahrenen Teammitgliedern besitzt"></InfoComponent>
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="settings.sharedDeveloperPenalty"
            density="compact"
            hide-details
            label="Geteilte Entwickler-Penallty"
            type="number">
          <template #append-inner>
            <InfoComponent
                text="Diese Konstante wird mit den Kosten der Bewertungsfunktion verrechnet, wenn ein Entwickler zwischen Modulen der gleichen Ebene geteilt werden"></InfoComponent>
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="settings.skillPenaltyConstant"
            density="compact"
            hide-details
            label="Fähigkeiten Penalty"
            type="number">
          <template #append-inner>
            <InfoComponent
                text="Diese Konstante wird mit den Kosten der Bewertungsfunktion verrechnet, wenn nicht alle Fähigkeiten einer Komponente abgedeckt sind"></InfoComponent>
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="settings.teamSizePenaltyConstant"
            density="compact"
            hide-details
            label="Team-Größen Penalty"
            type="number">
          <template #append-inner>
            <InfoComponent
                text="Diese Konstante wird bei der Berechnung der Kosten der Bewertungsfunktion mit der Team-Effizienz verrechnet"></InfoComponent>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Abbruchkriterien und Steuerungskonstanten:
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
            v-model="settings.similarResultCount"
            density="compact"
            hide-details
            label="Anzahl ähnlicher Ergebnisse"
            type="number">
          <template #append-inner>
            <InfoComponent
                text="Gibt an, wie oft ein gleichwertiges Ergebnis nach der 'inner loop' gefunden werden darf, bevor die Optimierung abgebrochen wird"></InfoComponent>
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="settings.worseResultCount"
            density="compact"
            hide-details
            label="Anzahl schlechterer Ergebnisse"
            type="number">
          <template #append-inner>
            <InfoComponent
                text="Gibt an, wie oft in der inner loop keine Verbesserung erzielt werden darf, bevor nach der inner loop abgebrochen wird"></InfoComponent>
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="settings.innerLoopCount"
            density="compact"
            hide-details
            label="Anzahl Schleifendurchläufe"
            type="number">
          <template #append-inner>
            <InfoComponent
                text="Gibt an, wie oft ein Ergebnis am Stück verändert werden soll"></InfoComponent>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
            v-model="settings.randomness"
            density="compact"
            hide-details
            label="Zufälligkeit"
            type="number">
          <template #append-inner>
            <InfoComponent
                text="Prozentuale Wahrscheinlichkeit, mit der ein Mitarbeiter mit einem anderen, unabhängig von der Modulhierarchie, getauscht wird"></InfoComponent>
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="settings.alpha"
            density="compact"
            hide-details
            label="Kühlungs-Faktor"
            type="number">
          <template #append-inner>
            <InfoComponent
                text="Gibt an, um welchen Faktor die Temperatur nach dem Finden einer besseren Lösung verändert werden soll (Multiplikation)"></InfoComponent>
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="settings.initialTemperature"
            density="compact"
            hide-details
            label="Initiale Temperatur"
            type="number">
          <template #append-inner>
            <InfoComponent
                text="Gibt die initiale Temperatur an. Je höher die Temperatur, desto eher werden schlechtere Ergebnisse vorübergehend akzeptiert"></InfoComponent>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SettingsEntity from '@/models/SettingsEntity';
import InfoComponent from '@/components/shared/InfoComponent.vue';

export default defineComponent({
  name: 'Settings',
  components: { InfoComponent },
  props: {
    settings: {
      type: SettingsEntity,
      required: true,
    },
  },
});
</script>

<style scoped>

</style>