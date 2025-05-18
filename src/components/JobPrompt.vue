<template>
    <v-dialog
        v-model="showDialog"
        persistent
    >
        <v-card>
            <v-card-title>
                Enter Job Number and Name
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model.number.lazy="jobNumber"
                    label="Job Number"
                    type="number"
                    @keydown.enter="onOk"
                />
                <v-text-field
                    v-model="jobName"
                    label="Job Name"
                    @keydown.enter="onOk"
                />
            </v-card-text>
            <v-card-actions>
                <v-btn
                    color="success"
                    :disabled="jobNumber === null || !jobName"
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
    computed,
    ref,
} from 'vue';

const props = defineProps<{
    showModal: boolean;
}>();
const emit = defineEmits<{
    (e: 'update:showModal', value: boolean): void
}>();
const showDialog = computed({
    get: () => props.showModal,
    set: val => emit('update:showModal', val),
});
const jobNumber = computed({
    get: () => store.value.jobNumber,
    set: val => store.value.jobNumber = val,
});
const jobName = computed({
    get: () => store.value.jobName,
    set: val => store.value.jobName = val,
});
function onOk () {
    if (jobNumber.value === null || !jobName.value) {
        return;
    }

    emit('update:showModal', false);
}
</script>