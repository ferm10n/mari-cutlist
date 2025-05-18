// holds the application state, which can be exported/imported as a file
import { computed, ref } from 'vue';
import { CrateKind, CutlistItem, userInputSchema } from './types';
import z from 'zod';
import { inputsToBoxCrate, boxCrateToCutlist } from './crates/box';
import { inputsToFlatCrate } from './crates/flat';


const storeSchema = z.object({
    version: z.literal(2),
    jobNumber: z.string(),
    jobName: z.string(),
    userInputs: userInputSchema,
});
export type Store = z.infer<typeof storeSchema>;

export const store = ref<Store>({
    version: 2,
    userInputs: {
        innerDimensions: {
            length: import.meta.env.DEV ? 96 : 0,
            width: import.meta.env.DEV ? 48 : 0,
            height: import.meta.env.DEV ? 4 : 0,
        },
        needsMiddleRunner: false,
        weight: import.meta.env.DEV ? 350 : 0,
        materials: {
            acrylic: true,
            glass: false,
            terrazzo: false,
        },
        panelsOnEdge: false,
        overrideCrateKind: null,
    },
    jobNumber: import.meta.env.DEV ? '12345' : '', // required. but should be changed after initial prompt
    jobName: import.meta.env.DEV ? 'Sample Job' : '',
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

export const crateKind = computed<CrateKind | null>(() => {
    const {
        innerDimensions,
        weight,
        materials,
        panelsOnEdge,
        overrideCrateKind,
    } = store.value.userInputs;

    if (overrideCrateKind !== null) { // if the override is selected
        return overrideCrateKind; // use the override
    }

    if (!panelsOnEdge && !materials.glass && !materials.terrazzo) {
        // TODO need additional dimension check...
        if (innerDimensions.height <= 8.75) {
            return 'flat';
        }
    }

    if (innerDimensions.height > 40) {
        return 'a-frame';
    } else if (weight > 3000 && innerDimensions.width < 15) {
        return 'a-frame';
    } else if (innerDimensions.height > (3 * innerDimensions.width)) {
        return 'a-frame';
    }

    if (innerDimensions.width > innerDimensions.height) {
        return 'box';
    } else if (innerDimensions.width > 25 && innerDimensions.height > 8.75 && innerDimensions.height < 36) {
        return 'box';
    }

    return null;
});

export const cutlist = computed<CutlistItem[]>(() => {
    if (crateKind.value === 'flat') {
        const flatCrate = inputsToFlatCrate(store.value.userInputs);
        return flatCrateToCutlist(flatCrate);
    } else if (crateKind.value === 'box') {
        const boxCrate = inputsToBoxCrate(store.value.userInputs);
        return boxCrateToCutlist(boxCrate);
    }

    return [];
});
