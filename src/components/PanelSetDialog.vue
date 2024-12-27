<template>
    <v-dialog
        :model-value="Boolean(mode)"
        @update:model-value="emit('update:mode', null)"
    >
        <template #activator="{ props }">
            <slot v-bind="{ props }"/>
        </template>
        <v-card
            max-width="6in"
            style="align-self: center"
        >
            <v-card-title class="d-flex">
                <span class="flex-grow-1">{{ mode === 'add' ? 'Add' : 'Edit' }} Panel Set</span>
                <v-btn
                    variant="text"
                    color="red"
                    @click="emit('update:mode', null)"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-autocomplete
                    :items="materialItems"
                    label="Material"
                    v-model="panelSet.material"
                />
                <v-text-field
                    label="Length (inches)"
                    type="number"
                    v-model.number="panelSet.length"
                />
                <v-text-field
                    label="Width (inches)"
                    type="number"
                    v-model.number="panelSet.width"
                />
                <v-text-field
                    label="Thiccness (inches)"
                    type="number"
                    v-model.number="panelSet.thickness"
                />
                <v-text-field
                    label="Qty"
                    type="number"
                    v-model.number="panelSet.qty"
                />
                <v-text-field
                    label="Panel ID"
                    v-model="panelSet.id"
                />
                <v-select
                    label="Z Clips"
                    v-model="panelSet.zClips"
                    :items="zOptionItems"
                />
                <v-select
                    label="Frame"
                    v-model="panelSet.frame"
                    :items="choiceItems"
                />
                <v-select
                    label="Lighting"
                    v-model="panelSet.lighting"
                    :items="choiceItems"
                />
            </v-card-text>

            <v-card-actions>
                <v-btn
                    color="success"
                    block
                    variant="outlined"
                    :disabled="Boolean(invalidError)"
                    @click="doneEditingPanelSet()"
                >
                    Ok
                </v-btn>
            </v-card-actions>
            <v-card-actions
                v-if="invalidError"
                class="mx-auto text-red"
            >
                {{ invalidError }}
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import {
    type PanelSet,
    materialOptions,
    zClipOptions,
    choiceOptions,
} from '../types';
import {
    type NullablePanelSet,
    validatePanelSet,
} from './panel-set-dialog-utils';

const materialItems = Object.entries(materialOptions).map(([ val, userLabel ]) => ({
    title: userLabel,
    value: val,
}));

const zOptionItems = Object.keys(zClipOptions);

const choiceItems = Object.keys(choiceOptions);

const props = defineProps<{
    mode: 'add' | 'edit' | null,
    panelSet: NullablePanelSet,
    panelSets: { [panelId: string]: PanelSet },
}>()
const emit = defineEmits<{
    (e: 'update:panel-sets', payload: { [panelId: string]: PanelSet; }): void,
    (e: 'update:mode', payload: null): void,
}>();

const invalidError = computed<string | null>(() => {
    if (!props.panelSet) {
        return 'No panel set';
    }
    try {
        validatePanelSet(props.panelSet, props.panelSets);
        return null;
    } catch (e) {
        return (e as Error).message;
    }
});

function doneEditingPanelSet () {
    if (!props.panelSet) {
        return;
    }
    validatePanelSet(props.panelSet, props.panelSets);
    const newPanelSets = { ...props.panelSets };
    newPanelSets[props.panelSet.id] = props.panelSet;

    emit('update:panel-sets', newPanelSets);
}
</script>