import {
    type PanelSet,
} from '../types';

export type NullablePanelSet = {
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

export function initNewPanelSet () {
    return { ...defaultNewSet };
}

export function validatePanelSet (
    panelSet: NullablePanelSet,
    panelSets: Record<string, PanelSet>,
): asserts panelSet is PanelSet {
    for (const key of Object.keys(panelSet) as Array<keyof PanelSet>) {
        if (panelSet[key] === null) {
            throw new Error('All fields are required');
        }
    }
    if (Object.keys(panelSets).includes(panelSet.id!)) {
        throw new Error('Panel ID must be unique');
    }
    if (panelSet.material !== 'acrylic') {
        // FUTURE support other materials
        throw new Error('Only acrylic is supported at this time');
    }
}
