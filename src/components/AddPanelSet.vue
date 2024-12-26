<template>
    <v-dialog>
        <template #activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                color="success"
            >
                <v-icon>mdi-plus-thick</v-icon> Add
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
                        v-model.number="newSet.length"
                    />
                    <v-text-field
                        label="Width (inches)"
                        type="number"
                        v-model.number="newSet.width"
                    />
                    <v-text-field
                        label="Thiccness (inches)"
                        type="number"
                        v-model.number="newSet.thickness"
                    />
                    <v-text-field
                        label="Qty"
                        type="number"
                        v-model.number="newSet.qty"
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
                        label="Frame"
                        v-model="newSet.frame"
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
                        variant="outlined"
                        :disabled="Boolean(invalidError)"
                        @click="isActive.value = false; addPanelSet()"
                    >
                        Add
                    </v-btn>
                </v-card-actions>
                <v-card-actions
                    v-if="invalidError"
                    class="mx-auto text-red"
                >
                    {{ invalidError }}
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

const props = defineProps<{ panelSets: { [panelId: string]: PanelSet; } }>()
const emit = defineEmits<{
    (e: 'update:panel-sets', payload: { [panelId: string]: PanelSet; }): void,
}>()

type NullablePanelSet = {
    [K in keyof PanelSet]: PanelSet[K] | null;
};

const defaultNewSet: NullablePanelSet = {
    length: null,
    material: null,
    qty: null,
    id: null,
    thickness: null,
    width: null,
    zClips: null,
    frame: null,
    lighting: null,
}

const newSet = ref<NullablePanelSet>({ ...defaultNewSet })

function validatePanelSet (panelSet: NullablePanelSet): asserts panelSet is PanelSet {
    for (const key of Object.keys(panelSet) as Array<keyof PanelSet>) {
        if (panelSet[key] === null) {
            throw new Error('All fields are required');
        }
    }
    if (Object.keys(props.panelSets).includes(panelSet.id!)) {
        throw new Error('Panel ID must be unique');
    }
    if (panelSet.material !== 'acrylic') {
        // FUTURE support other materials
        throw new Error('Only acrylic is supported at this time');
    }
}

const invalidError = computed<string | null>(() => {
    try {
        validatePanelSet(newSet.value);
        return null;
    } catch (e) {
        return (e as Error).message;
    }
});

function addPanelSet () {
    validatePanelSet(newSet.value);
    emit('update:panel-sets', {
        ...props.panelSets,
        [newSet.value.id]: newSet.value,
    })
    newSet.value = { ...defaultNewSet }
}
</script>