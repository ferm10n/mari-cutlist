<template>
    <v-app>
        <v-main>
            <div class="pa-4">
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
                            <th>Accessories</th>
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
                            <td>{{ panelSet.accessories }}</td>
                            <td>{{ panelSet.lighting }}</td>
                            <td>
                                <v-btn variant="text" color="red" icon @click="delete panelSets[panelSet.id]">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
                
                <AddPanelSet
                    v-model:panel-sets="panelSets"
                    color="success"
                />
            </div>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import {
    computed,
    ref,
    reactive,
} from 'vue';
import type {
    PanelSet,
    Material,
} from './types';
import AddPanelSet from '@/components/AddPanelSet.vue'

/** inches */
const width = ref(1);
/** inches */
const length = ref(1);
/** inches */
const thickness = ref(1);

const panelQty = ref(1);


const materialOptions: Material[] = [
    'glass',
    'acrylic',
    'terrazzo',
];
const materials = ref<Material[]>([]);


type ZClipOption = '1/8"' | '1/2"';
/** only used with glass & acryllic */
const zclips = ref<ZClipOption>('1/8"');


/**
 * keyed by panel id
 */
const panelSets = ref<Record<string, PanelSet>>({});

// const weight = computed(() => {
//     // return the calculated weight
//     if ()
// });

// material weight cannot exceed 2500lbs, otherwise additional crates are required


// crate 

// function deleteSet (id: string) {

// }
</script>
