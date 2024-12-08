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

const defaultNewSet: PanelSet = {
    length: 1,
    material: 'acrylic',
    qty: 1,
    id: '',
    thickness: 1,
    width: 1,
    zClips: 'none',
    frame: 'No',
    lighting: 'No',
}

const newSet = ref<PanelSet>({ ...defaultNewSet })

const invalidError = computed<string | null>(() => {
    if (!newSet.value.id) {
        return 'Panel ID is required'
    }
    if (Object.keys(props.panelSets).includes(newSet.value.id)) {
        return 'Panel ID must be unique'
    }
    if (newSet.value.material !== 'acrylic') {
        // FUTURE support other materials
        return 'Only acrylic is supported at this time'
    }
    return null;
});

function addPanelSet () {
    emit('update:panel-sets', {
        ...props.panelSets,
        [newSet.value.id]: newSet.value,
    })
    newSet.value = { ...defaultNewSet }
}
</script>