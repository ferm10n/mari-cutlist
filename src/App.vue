<template>
    <v-app>
        <v-main>
            <v-expansion-panels
                tile
                multiple
                v-model="openSections"
            >
                <v-expansion-panel>
                    <template #title>
                        <div class="d-flex flex-row flex-grow-1 justify-center align-center mr-2">
                            <b class="flex-grow-1">Panels</b>
                            <v-file-input
                                density="compact"
                                accept="application/json"
                                label="Import"
                                hide-details
                                class="mr-2"
                                style="max-width: 2in"
                                @update:model-value="onFileSelectedForImport"
                            />
                            <v-btn
                                color="info"
                                class="mr-2"
                                @click="exportStore"
                            >
                                <v-icon>mdi-content-save</v-icon>
                                Export
                            </v-btn>
                            <AddPanelSet
                                v-model:panel-sets="panelSets"
                                color="success"
                            />
                        </div>
                    </template>
                    <template #text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th>Panel ID</th>
                                    <th>Material</th>
                                    <th>Qty</th>
                                    <th>Width</th>
                                    <th>Length</th>
                                    <th>Thiccness</th>
                                    <th>Z Clips</th>
                                    <th>Frame</th>
                                    <th>Lighting</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="panelSet of Object.values(panelSets)"
                                >
                                    <td>{{ panelSet.id }}</td>
                                    <td>{{ panelSet.material }}</td>
                                    <td>{{ panelSet.qty }}</td>
                                    <td>{{ panelSet.width }}</td>
                                    <td>{{ panelSet.length }}</td>
                                    <td>{{ panelSet.thickness }}</td>
                                    <td>{{ panelSet.zClips }}</td>
                                    <td>{{ panelSet.frame }}</td>
                                    <td>{{ panelSet.lighting }}</td>
                                    <td>
                                        <v-btn
                                            variant="text"
                                            color="red"
                                            icon
                                            @click="deletePanelSet(panelSet.id)"
                                        >
                                            <v-icon>mdi-close</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </template>
                </v-expansion-panel>
                <v-expansion-panel>
                    <template #title>
                        <div class="d-flex flex-row flex-grow-1 justify-center align-center mr-2">
                            <b class="flex-grow-1">Cutlist</b>
                        </div>
                    </template>
                    <template #text>
                        <Cutlist
                            class="pa-4"
                            :cutlist="cutlist"
                        />
                    </template>
                </v-expansion-panel>
                <v-expansion-panel>
                    <template #title>
                        <div class="d-flex flex-row flex-grow-1 justify-center align-center mr-2">
                            <b class="flex-grow-1">Accessories</b>
                        </div>
                    </template>
                    <template #text>
                        <v-checkbox
                            label="Small Box"
                            v-model="smallBox"
                        />
                        <v-checkbox
                            label="Large Box"
                            v-model="largeBox"
                        />
                    </template>
                </v-expansion-panel>
            </v-expansion-panels>
            <JobPrompt />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import {
    computed,
    ref,
} from 'vue';
import type {
    Job,
    Cutlist as CutlistType,
} from './types';
import AddPanelSet from '@/components/AddPanelSet.vue'
import {
    getFlatCutlist,
} from './flat-crate';
import Cutlist from './components/Cutlist.vue';
import {
    exportStore,
    importStore,
    store,
} from './store';
import JobPrompt from './components/JobPrompt.vue';

const openSections = ref([0, 1, 2])

const panelSets = computed({
    get: () => store.value.panelSets,
    set: val => store.value.panelSets = val,
});
function deletePanelSet (id: string) {
    delete panelSets.value[id];
    panelSets.value = { ...panelSets.value };
}

const smallBox = computed({
    get: () => store.value.smallBox,
    set: val => store.value = { ...store.value, smallBox: val },
});
const largeBox = computed({
    get: () => store.value.largeBox,
    set: val => store.value = { ...store.value, largeBox: val },
});

const job = computed<Job>(() => {
    return {
        panelSets: Object.values(panelSets.value),
        accessories: null,
        tmpAccessories: {
            smallBox: smallBox.value,
            largeBox: largeBox.value,
        },
    };
});

const cutlist = computed<CutlistType>(() => getFlatCutlist(job.value));

async function onFileSelectedForImport (file: File[] | File) {
    if (file instanceof Array) {
        alert('Please select only one file');
        return;
    }

    const fileText = await file.text();
    importStore(fileText);
}
</script>
