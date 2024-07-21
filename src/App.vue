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
            {{ result }}
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
    Crate,
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

const result = computed(() => {
    // if all the panels are acryllic, and total depth < 10", use acryllic
    const panelSetList = Object.values(panelSets.value);

    // ensure all the materials are the same. otherwise return null because we aren't gonna be calculating that
    let material: Material | null = null;
    for (const panelSet of panelSetList) {
        if (material === null) {
            // initial material
            material = panelSet.material;
        } else if (material !== panelSet.material) {
            // this is a different material from the initial material, abort
            return null;
        }
    }
    
    if (material === 'acrylic') {
        let combinedPanelThickness = 0;
        
        for (const panelSet of panelSetList) {
            /** use foam if there's zclips */
            const separator: 'foam' | 'cardboard' = panelSet.zClips === 'none' ? 'cardboard' : 'foam';
            /**
             * - if there are no z-clips, use cardboard separators with a thickness of .125"
             * - else, the foam thickness will be .75"
             */
            const separatorThickness = separator === 'cardboard' ? .125 : .75;
            combinedPanelThickness += panelSet.thickness * panelSet.qty + separatorThickness * panelSet.qty;
        }

        return {
            combinedPanelThickness,
        };
    } else if (material === 'glass') {

    } else if (material === 'terrazzo') {

    }

    // not sure how we get here
    return null;
    
    // const hasAcrylic = panelSetList.some(panelSet => panelSet.material === 'acrylic');
    // const hasGlass = panelSetList.some(panelSet => panelSet.material === 'glass');
    // const hasTz = panelSetList.some(panelSet => panelSet.material === 'terrazzo');

    // let separator: 'foam' | 'cardboard' = 'cardboard';

    // // use foam if material is glass or terrazzo
    // if (hasGlass || hasTz) {
    //     separator = 'foam';
    // }

    // // use foam if zclips are used
    // if (panelSetList.some(panelSet => panelSet.zClips !== 'none')) {
    //     separator = 'foam';
    // }

    // if (hasAcrylic)
    // if combined thickness of separator and acrylic panels < 10", use a flat crate

});
</script>
