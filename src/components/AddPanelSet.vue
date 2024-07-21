<template>
    <v-dialog>
        <template #activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                block
            >
                Add to Material Set
            </v-btn>
        </template>

        <template #default="{ isActive }">
            <v-card
                max-width="6in"
                style="align-self: center"
            >
                <v-card-text>
                    <v-autocomplete
                        :items="materialItems"
                        label="Material"
                        v-model="newSet.material"
                    />
                    <v-text-field
                        label="Length (inches)"
                        type="number"
                        v-model="newSet.length"
                    />
                    <v-text-field
                        label="Width (inches)"
                        type="number"
                        v-model="newSet.width"
                    />
                    <v-text-field
                        label="Thiccness (inches)"
                        type="number"
                        v-model="newSet.thickness"
                    />
                    <v-text-field
                        label="Qty"
                        type="number"
                        v-model="newSet.qty"
                    />
                    <v-text-field
                        label="Panel ID"
                        v-model="newSet.id"
                    />
                    <v-select
                        label="Z Clips"
                        v-model="newSet.zClips"
                        :items="zOptionItems"
                    />
                    <v-select
                        label="Accessories"
                        v-model="newSet.accessories"
                        :items="choiceItems"
                    />
                    <v-select
                        label="Lighting"
                        v-model="newSet.lighting"
                        :items="choiceItems"
                    />
                </v-card-text>

                <v-card-actions>
                    <v-btn
                        color="success"
                        block
                        :disabled="!canAdd"
                        @click="isActive.value = false; addPanelSet()"
                    >
                        Add Panel Set
                    </v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import {
    type PanelSet,
    materialOptions,
    zClipOptions,
    choiceOptions,
} from '../types';

const materialItems = Object.entries(materialOptions).map(([ val, userLabel ]) => ({
    title: userLabel,
    value: val,
}));

const zOptionItems = Object.keys(zClipOptions);

const choiceItems = Object.keys(choiceOptions);

const props = defineProps<{ panelSets: Record<string, PanelSet> }>()
const emit = defineEmits<{
    (e: 'update:panel-sets', payload: Record<string, PanelSet>): void,
}>()

const defaultNewSet: PanelSet = {
    length: 1,
    material: 'acrylic',
    qty: 1,
    id: '',
    thickness: 1,
    width: 1,
    zClips: 'none',
    accessories: 'No',
    lighting: 'No',
}

const newSet = ref<PanelSet>({ ...defaultNewSet })

// TODO ensure the same ID isn't used more than once

const canAdd = computed<boolean>(() => {
    const allIds = Object.keys(props.panelSets)
    return Boolean(newSet.value.id && !allIds.includes(newSet.value.id))
})

function addPanelSet () {
    emit('update:panel-sets', {
        ...props.panelSets,
        [newSet.value.id]: newSet.value,
    })
    newSet.value = { ...defaultNewSet }
}
</script>