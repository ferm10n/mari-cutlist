<template>
    <div class="cutlist-container">
        <div v-if="cutlist.length === 0" class="empty-list">
            No items in the cutlist
        </div>
        <div v-else>
            <!-- Group by item kind -->
            <div class="cutlist-group" v-for="(group, groupName) in groupedItems" :key="groupName">
                <h3>{{ groupName }}</h3>
                <table class="cutlist-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Qty</th>
                            <th v-if="groupName === 'Wood'">Wood Type</th>
                            <th v-if="groupName === 'Wood'">Length</th>
                            <th v-if="groupName === 'Plywood'">Width</th>
                            <th v-if="groupName === 'Plywood'">Length</th>
                            <th v-if="groupName === 'Plywood'">Thickness</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in group" :key="index">
                            <td>{{ item.name }}</td>
                            <td>{{ item.qty }}</td>
                            <td v-if="item.kind === 'wood'">{{ item.woodKind }}</td>
                            <td v-if="item.kind === 'wood'">{{ formatDimension(item.length) }}</td>
                            <td v-if="item.kind === 'plywood'">{{ formatDimension(item.width) }}</td>
                            <td v-if="item.kind === 'plywood'">{{ formatDimension(item.length) }}</td>
                            <td v-if="item.kind === 'plywood'">{{ item.thickness }}</td>
                            <td>{{ item.notes || '' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CutlistItem } from '@/types';
import { computed } from 'vue';

const props = defineProps<{
    cutlist: CutlistItem[];
}>();

// Group cutlist items by their kind
const groupedItems = computed(() => {
    const groups: Record<string, CutlistItem[]> = {};
    
    props.cutlist.forEach(item => {
        // Capitalize the first letter of the kind
        const groupName = item.kind.toLocaleUpperCase();
        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(item);
    });
    
    return groups;
});

// Format dimensions to include units
const formatDimension = (value: number) => {
    return `${value.toFixed(2)}"`;
};
</script>

<style>
.cutlist-container {
    margin: 1rem 0;
}

.cutlist-group {
    margin-bottom: 2rem;
}

.cutlist-group h3 {
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #ccc;
    padding-bottom: 0.25rem;
}

.cutlist-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
}

.cutlist-table th, 
.cutlist-table td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.cutlist-table th {
    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.1)
}

.empty-list {
    font-style: italic;
    color: #666;
    padding: 1rem 0;
}

ul {
    margin-left: 1em;
}
</style>