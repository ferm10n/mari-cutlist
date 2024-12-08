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
    frame: Choice;
}

export type Job = {
    panelSets: PanelSet[];
    /** dimensions for any extra accessories */
    accessories: {
        width: number;
        length: number;
        height: number;
    } | null;
    tmpAccessories: {
        smallBox: boolean;
        largeBox: boolean;
    };
}


/** units in inches */
export function stabilityWallReinforcements (width: number, height: number) {
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

export type SeparatorKind = 'cardboard' | 'thin foam' | 'thick foam';

export const separatorThicknessMap: {
    [s in SeparatorKind]: number;
} = {
    cardboard: 0.125,
    'thin foam': 0.375,
    'thick foam': 0.75,
}

type FlatCrate = {
    kind: 'flat';
    shortWallLength: number;
    longWallLength: number;
    plywoodWidth: number;
    plywoodLength: number;
    frame: FrameKind;
    stacking: {
        panelId: string;
        separator: SeparatorKind;
    }[];
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
    /** terms get added together */
    terms: {
        value: number;
        /** where the value comes from */
        name: string;
        /** multiplier */
        qty?: number;
    }[],
};
