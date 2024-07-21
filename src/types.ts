export type Material = 'glass' | 'acrylic' | 'terrazzo';

/** maps internal value to user selected value */
export const materialOptions: {
    [m in Material]: string;
} = {
    glass: 'Glass',
    acrylic: 'Acrylic',
    terrazzo: 'Terrazzo',
};

type ZClip = '1/8"' | '1/2"' | 'none';

/** maps user selected option to thicknessValue */
export const zClipOptions: {
    [z in ZClip]: number;
} = {
    '1/8"': 0.125,
    '1/2"': 0.5,
    'none': 0,
};

export type Choice = 'Yes' | 'No';
/** maps user selected option to boolean */
export const choiceOptions: {
    [a in Choice]: boolean;
} = {
    'Yes': true,
    'No': false,
};

export type PanelSet = {
    qty: number;
    material: Material;
    width: number;
    length: number;
    thickness: number;
    id: string;
    zClips: ZClip;
    accessories: Choice;
    lighting: Choice;
}

/** units in inches */
function stabilityWallReinforcements (width: number, height: number) {
    const meh = height * height + (width * width)/2;
    return Math.sqrt(meh) - (1.75 * meh) / (.5 * width * height);
}

export type Crate = {
    type: 'lightweight' | 'flat' | 'box' | 'a-frame';
    /** inches */
    width: number;
    /** inches */
    length: number;
    /** inches */
    height: number;
}

// type FlatCrate = {
//     type: 'flat';
// }

// type LightweightCrate = {
//     type: 'lightweight';
// }

// type BoxCrate = {
//     type: 'box';
// }

// type AFrameCrate = {
//     type: 'a-frame';
// }

export type Cutlist = {
    type: '2x4';
    length: number;
    qty: number;
}[];