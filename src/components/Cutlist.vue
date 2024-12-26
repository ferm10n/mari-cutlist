<template>
    <div>
        <template v-for="(crate, crateIdx) of cutlist.crates">
            <h1>Crate #{{ crateIdx + 1 }} - {{ crate.kind }}</h1>
            <template v-if="crate.kind === 'flat'">
                <ul>
                    <li>Short wall length: {{ crate.shortWallLength }}</li>
                    <li>Long wall length: {{ crate.longWallLength }}</li>
                    <li>Plywood width: {{ crate.plywoodWidth }}</li>
                    <li>Plywood length: {{ crate.plywoodLength }}</li>
                    <li>Frame: {{ crate.frame }}</li>
                    <li>
                        <h2>Stacking (bottom up)</h2>
                        <ul>
                            <li v-for="stackItem of crate.stacking">
                                Panel: {{ stackItem.panelId }}, separator: {{ stackItem.separator }}
                            </li>
                        </ul>
                    </li>
                </ul>
            </template>
        </template>
        <i v-if="cutlist.crates.length === 0">No crates for cutlist yet. Add a panel!</i>
    </div>
</template>

<script setup lang="ts">
import { Cutlist } from '@/types';

defineProps<{
    cutlist: Cutlist;
}>();

</script>

<style>
ul {
    margin-left: 1em;
}
</style>