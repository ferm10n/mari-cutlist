<template>
    <v-dialog
        v-model="showDialog"
        persistent
    >
        <v-card>
            <v-card-title>
                Enter Job Number
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model.number.lazy="job"
                    label="Job Number"
                    type="number"
                    @keydown.enter="onOk"
                />
            </v-card-text>
            <v-card-actions>
                <v-btn
                    color="success"
                    :disabled="job === null"
                    block
                    @click="onOk"
                >
                    OK
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import {
    store,
} from '../store';
import {
    ref,
} from 'vue';

const showDialog = ref(true);
const job = ref<number | null>(null);

function onOk () {
    if (job.value === null) {
        return;
    }
    store.value = { ...store.value, job: String(job.value) };
    showDialog.value = false;
}
</script>