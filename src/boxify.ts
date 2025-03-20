import type {
    Crate,
    Box,
} from './types';

const plywoodThickness = 0.625;

export function boxify (crate: Crate): Record<string, Box> {
    const boxMap: Record<string, Box> = {};

    // plywood
    boxMap.plywood = {
        id: 'plywood',
        label: 'Plywood base',
        size: {
            x: crate.plywoodWidth,
            y: crate.plywoodLength,
            z: plywoodThickness,
        },
        pos: {
            x: 0,
            y: 0,
            z: 0,
        },
    };

    return boxMap;
}
