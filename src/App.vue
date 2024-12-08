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
                            <AddPanelSet
                                v-model:panel-sets="panelSetsNormal"
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
                                    v-for="panelSet of Object.values(panelSetsNormal)"
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
                                            @click="delete panelSetsNormal[panelSet.id]"
                                        >
                                            <v-icon>mdi-close</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </template>
                </v-expansion-panel>
                <!-- <v-expansion-panel>
                    <template #title>
                        <div class="d-flex flex-row flex-grow-1 justify-center align-center mr-2">
                            <b class="flex-grow-1">Accessories</b>
                            <v-btn
                                color="success"
                            >
                                <v-icon>mdi-plus-thick</v-icon> Add
                            </v-btn>
                        </div>
                    </template>
                    <template #text>
                        stuff goes here
                    </template>
                </v-expansion-panel> -->
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
            </v-expansion-panels>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import {
    computed,
    ref,
} from 'vue';
import type {
    PanelSet,
    Job,
    Cutlist as CutlistType,
} from './types';
import AddPanelSet from '@/components/AddPanelSet.vue'
import {
    getFlatCutlist,
} from './flat-crate';
import {
    useLocalStorage,
} from '@vueuse/core';
import Cutlist from './components/Cutlist.vue';

const openSections = ref([0])

const panelSets = useLocalStorage<{
    [panelId: string]: PanelSet;
}>('panelSets', {});

/** angry typescript noises */
const panelSetsNormal = computed({
    get: () => panelSets.value,
    set: val => panelSets.value = val,
});

const job = computed<Job>(() => {
    return {
        panelSets: Object.values(panelSets.value),
        accessories: null,
    };
});

const cutlist = computed<CutlistType>(() => getFlatCutlist(job.value));

// const result = computed(() => {
//     // if all the panels are acryllic, and total depth < 10", use acryllic
//     const panelSetList = Object.values(panelSets.value);

//     // ensure all the materials are the same. otherwise return null because we aren't gonna be calculating that
//     let material: Material | null = null;
//     for (const panelSet of panelSetList) {
//         if (material === null) {
//             // initial material
//             material = panelSet.material;
//         } else if (material !== panelSet.material) {
//             // this is a different material from the initial material, abort
//             return null;
//         }
//     }
    
//     if (material === 'acrylic') {
//         let combinedPanelThickness = 0;
        
//         for (const panelSet of panelSetList) {
//             /** use foam if there's zclips */
//             const separator: 'foam' | 'cardboard' = panelSet.zClips === 'none' ? 'cardboard' : 'foam';
//             /**
//              * - if there are no z-clips, use cardboard separators with a thickness of .125"
//              * - else, the foam thickness will be .75"
//              */
//             const separatorThickness = separator === 'cardboard' ? .125 : .75;
//             combinedPanelThickness += panelSet.thickness * panelSet.qty + separatorThickness * panelSet.qty;
//         }

//         return {
//             combinedPanelThickness,
//         };
//     } else if (material === 'glass') {

//     } else if (material === 'terrazzo') {

//     }

//     // not sure how we get here
//     return null;
    
//     // const hasAcrylic = panelSetList.some(panelSet => panelSet.material === 'acrylic');
//     // const hasGlass = panelSetList.some(panelSet => panelSet.material === 'glass');
//     // const hasTz = panelSetList.some(panelSet => panelSet.material === 'terrazzo');

//     // let separator: 'foam' | 'cardboard' = 'cardboard';

//     // // use foam if material is glass or terrazzo
//     // if (hasGlass || hasTz) {
//     //     separator = 'foam';
//     // }

//     // // use foam if zclips are used
//     // if (panelSetList.some(panelSet => panelSet.zClips !== 'none')) {
//     //     separator = 'foam';
//     // }

//     // if (hasAcrylic)
//     // if combined thickness of separator and acrylic panels < 10", use a flat crate

// });
</script>
