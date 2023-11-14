<template>
  <v-expansion-panels>
    <v-expansion-panel title='Informationen zur Steuerung'>
      <v-expansion-panel-text>
        <v-row>
          <v-col>
            Der zur Optimierung genutzte Algorithmus ist eine Variante des Simulated Annealing (SA), das Accelerated Simulated Annealing (ASA). Dieser besteht aus 2 Loops, der Inner- und Outer-Loop.
          </v-col>
        </v-row>
        <v-row>
          <v-col>
           In der Inner-Loop wird das Ergebnis verändert und anschließend durch eine Kostenfunktion bewertet. Ist das Ergebnis besser ist, wird es für den nächsten Schleifendurchlauf verwendet, ansonsten wird es mit einer gewissen Wahrscheinlichkeit übernommen. Hier gilt, je höher die aktuelle "Temperatur" und je niedriger der Unterschied zur vorherigen Lösung, desto wahrscheinlicher der Austausch. Die Temperatur wird nach der die Inner-Loop verändert, nämlich dann, wenn eine neue beste Lösung gefunden wurde, oder die Kosten des letzten Inner-Loop durchlaufs geringer waren als die des davoriegen.
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            Die Outer-Loop bricht unter 2 Kriterien ab:
            <v-list>
              <v-list-item>
                <v-icon>
                  mdi-circle-small
                </v-icon>
                entweder wenn nach Abschluss der Inner-Loop die Kosten der aktuellen Lösung wiederholt gleichwertig zu denen der Lösung vor Betreten der Inner-Loop sind,
              </v-list-item>
              <v-list-item>
                <v-icon>
                  mdi-circle-small
                </v-icon>
                oder wenn in der Inner-Loop wiederholt keine bessere Lösung gefunden wurde
              </v-list-item>
            </v-list>
            Somit besteht die Möglichkeit der Steuerung der Optimierung.
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                Die Kostenfunktion benutzt die folgenden Kriterien:
              </v-col>
            </v-row>
            <v-row class='pl-10'>
              <v-col>
                <h4 class='mb-4'>
                  Länge von Aufgaben
                </h4>
                <v-row>
                  <v-col class='ml-4'>
                    Die Länge der Aufgaben geben den Arbeitsaufwand der einzelnen Aufgabengruppen an, die für die Teamzusammenstellung verwendet werden. Es wird davon ausgegangen, dass Aufgabengruppen parallel bearbeitet werden
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang='ts'>

</script>


<style scoped>

</style>
