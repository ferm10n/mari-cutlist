<template>
    <v-app>
        <v-main>
            <v-banner
                class="mb-4 bg-teal-accent-3"
                elevation="2"
                v-if="jobNumber || jobName"
            >
                <template #prepend>
                    <v-icon color="white">mdi-briefcase</v-icon>
                </template>
                <v-banner-text>
                    <span class="white--text font-weight-bold">
                        Job #{{ jobNumber }}<span v-if="jobName">: {{ jobName }}</span>
                    </span>
                    <v-btn
                        color="white"
                        variant="text"
                        class="ml-auto"
                        @click="showJobPrompt = true"
                    >
                        <v-icon left>mdi-pencil</v-icon>
                        Edit
                    </v-btn>
                </v-banner-text>
            </v-banner>
            <v-expansion-panels
                tile
                multiple
                class="px-3"
                v-model="openSections"
            >
                <v-expansion-panel>
                    <template #title>
                        Inputs
                    </template>
                    <template #text>
                        <CutlistInputs />
                    </template>
                </v-expansion-panel>
                <v-expansion-panel>
                    <template #title>
                        <span v-if="crateKind !== null">
                            {{ crateKind.toLocaleUpperCase() }} - Cutlist
                        </span>
                        <span v-else>
                            Unable to determine crate kind.
                        </span>
                    </template>

                    <template #text>
                        <Cutlist :cutlist="cutlist" />
                    </template>
                </v-expansion-panel>
            </v-expansion-panels>
            <JobPrompt v-model:show-modal="showJobPrompt" />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import {
    computed,
    ref,
} from 'vue';
import type {
    CutlistItem,
} from './types';
import PanelSetDialog from '@/components/PanelSetDialog.vue'
import {
    getFlatCutlist,
} from './flat-crate';
import Cutlist from './components/Cutlist.vue';
import {
    exportStore,
    importStore,
    store,
    crateKind,
} from './store';
import JobPrompt, {
    type Job,
} from './components/JobPrompt.vue';
import {
    type NullablePanelSet,
    initNewPanelSet,
} from './components/panel-set-dialog-utils';
import CutlistInputs from './components/CutlistInputs.vue';

const openSections = ref([0, 1, 2]);

const showJobPrompt = ref(false);
if (!store.value.jobNumber || !store.value.jobName) {
    showJobPrompt.value = true;
}

const jobNumber = computed(() => store.value.jobNumber);
const jobName = computed(() => store.value.jobName);

const cutlist = computed<CutlistItem[]>(() => {
    const flatCrateCutlist: CutlistItem[] = [
        {
            name: 'base',
            kind: 'plywood',
            qty: 1,
            width: 33.5,
            length: 75.5,
            thickness: 0.625,
        },
        {
            name: 'corner feet',
            kind: 'wood',
            woodKind: '2x6',
            length: 11,
            qty: 8,
        },
        {
            name: 'center feet',
            kind: 'wood',
            woodKind: '2x6',
            length: 11,
            qty: 4,
        },
        {
            name: 'long wall',
            kind: 'wood',
            woodKind: '2x4',
            length: 74,
            qty: 2,
        },
        {
            name: 'short wall',
            kind: 'wood',
            woodKind: '2x4',
            length: 32,
            qty: 2,
        },
        {
            name: 'top',
            kind: 'plywood',
            qty: 1,
            width: 33.5,
            length: 75.5,
            thickness: 0.625,
        },
    ];
    return flatCrateCutlist;
});

async function onFileSelectedForImport (file: File[] | File) {
    if (file instanceof Array) {
        alert('Please select only one file');
        return;
    }

    const fileText = await file.text();
    importStore(fileText);
}
</script>
