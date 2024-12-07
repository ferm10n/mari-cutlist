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
    /** not sure why this is needed */
    id: string;
    zClips: ZClip;
    /** if yes, add 5" */
    lighting: Choice;
}

export type Job = {
    panelSets: PanelSet[];
    /** dimensions for any extra accessories */
    accessories: {
        width: number;
        length: number;
        height: number;
    } | null;
}


/** units in inches */
function stabilityWallReinforcements (width: number, height: number) {
    const meh = height * height + (width * width)/2;
    return Math.sqrt(meh) - (1.75 * meh) / (.5 * width * height);
}

// export type Crate = {
//     kind: 'lightweight' | 'flat' | 'box' | 'a-frame';
//     /** inches */
//     width: number;
//     /** inches */
//     length: number;
//     /** inches */
//     height: number;
// }

type FlatCrate = {
    kind: 'flat';
    shortWallLength: number;
    longWallLength: number;
    plywoodWidth: number;
    plywoodLength: number;
    frame: FrameKind;
}

// type LightweightCrate = {
//     kind: 'lightweight';
// }

// type BoxCrate = {
//     kind: 'box';
// }

// type AFrameCrate = {
//     kind: 'a-frame';
// }

export type FrameKind = '2x4' | '2x6' | '2x4 + 2x4' | '2x6 + 2x6' | '2x4 + 2x6';

export type Cutlist = {
    crates: FlatCrate[];
    // length: number;
    // qty: number;
};

export type Equation = {
    name: string;
    terms: {
        value: number;
        /** where the value comes from */
        name: string;
        /** multiplier */
        qty?: number;
    }[],
};
