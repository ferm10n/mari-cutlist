<template>
    <v-row>
        <v-col cols="12">
            <v-text-field
                label="Length (inches)"
                type="number"
                min="0"
                step="0.01"
                append-icon="mdi-units"
                hide-details
                v-model.number="userInputs.innerDimensions.length"
            />
        </v-col>
        <v-col cols="12">
            <v-text-field
                label="Width (inches)"
                type="number"
                min="0"
                step="0.01"
                append-icon="mdi-units"
                hide-details
                v-model.number="userInputs.innerDimensions.width"
            />
        </v-col>
        <v-col cols="12">
            <v-text-field
                label="Height (inches)"
                type="number"
                min="0"
                step="0.01"
                append-icon="mdi-units"
                hide-details
                v-model.number="userInputs.innerDimensions.height"
            />
        </v-col>
        <v-col cols="12">
            <v-switch
                label="Needs Middle Runner"
                v-model="userInputs.needsMiddleRunner"
                hide-details
                color="primary"
            />
        </v-col>
        <v-col cols="12">
            <v-text-field
                label="Weight (lbs)"
                type="number"
                min="0"
                step="1"
                append-icon="mdi-weight"
                hide-details
                v-model.number="userInputs.weight"
            />
        </v-col>
        <v-col cols="12">
            <v-autocomplete
                label="Materials"
                :items="materialItems"
                v-model="selectedMaterials"
                multiple
                chips
                hide-details
                clearable
            />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { store } from '../store';
import { computed } from 'vue';
import { materialOptions, Material } from '../types';

const userInputs = computed({
    get: () => store.value.userInputs,
    set: val => store.value.userInputs = val,
});

const materialItems = Object.entries(materialOptions).map(([value, label]) => ({
    title: label,
    value,
}));

// Convert userInputs.materials (record) <-> array for v-autocomplete
const selectedMaterials = computed<string[]>({
    get: () => Object.entries(userInputs.value.materials || {})
        .filter(([_, v]) => v)
        .map(([k]) => k),
    set: (arr) => {
        const rec: Record<Material, boolean> = {
            glass: false,
            acrylic: false,
            terrazzo: false,
        };
        for (const key of arr) {
            rec[key as Material] = true;
        }
        userInputs.value.materials = rec;
    }
});
</script>