// holds the application state, which can be exported/imported as a file
import { ref } from 'vue';
import { panelSetSchema } from './types';
import z from 'zod';

const storeSchema = z.object({
    version: z.literal(1),
    /** keyed by panel id */
    panelSets: z.record(panelSetSchema),
    jobNumber: z.string(),
    jobName: z.string(),
});
export type Store = z.infer<typeof storeSchema>;

export const store = ref<Store>({
    version: 1,
    panelSets: {},
    jobNumber: '', // required. but should be changed after initial prompt
    jobName: '',
});

export function exportStore () {
    const data = JSON.stringify(store.value, null, 2);

    const jobNumber = store.value.jobNumber;
    if (!jobNumber?.match(/^[0-9]+$/mugi)) {
        alert('Job number must be a number');
        return;
    }
    const fileName = `job-${jobNumber}.json`;
    const file = new File([
        new Blob([ data ], { type: 'application/json' }),
    ], fileName);

    // FUTURE - can we do this without creating an anchor element?
    const tmpAnchor = document.createElement('a');
    const url = URL.createObjectURL(file);
    tmpAnchor.setAttribute('href', url);
    tmpAnchor.setAttribute('download', fileName);
    document.body.appendChild(tmpAnchor);
    tmpAnchor.click();

    window.open(url);
    setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(tmpAnchor);
    });
}

export function importStore (fileText: string) {
    try {
        const data = JSON.parse(fileText);
        const storeData = storeSchema.parse(data);
        store.value = storeData;
    } catch (e) {
        alert('Selected file does not seem like a valid cutlist');
        console.error(e);
    }
}