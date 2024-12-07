import { Cutlist, Equation, FrameKind, Job } from "./types";

const job: Job = {
    panelSets: [
        {
            width: 10,
            length: 30,
            thickness: 0.625,
            id: 'A',
            zClips: 'none',
            material: 'acrylic',
            lighting: 'No',
            qty: 1,
        },
        {
            width: 10,
            length: 30,
            thickness: 1.125,
            id: 'B',
            zClips: 'none',
            material: 'acrylic',
            lighting: 'No',
            qty: 1,
        },
        {
            width: 10,
            length: 20,
            thickness: 1.125,
            id: 'C',
            zClips: 'none',
            material: 'acrylic',
            lighting: 'No',
            qty: 1,
        },
    ],
    accessories: null,
};

const stackedHeight: Equation = {
    name: 'stacked height',
    terms: [
        { value: .75, name: 'bottom foam padding' },
        { value: 0.625, name: 'panel A thickness' },
        { value: 0.125, name: 'cardboard separator' },
        { value: 1.125, name: 'panel B thickness' },
        { value: 0.75, name: 'top foam padding' },
    ],
};

export function getStackedHeight (job: Job): Equation {
    const eq: Equation = {
        name: 'stacked height (bottom up)',
        terms: [],
    };
    eq.terms.push({ value: .75, name: 'bottom foam padding' });

    /** ordering the panel sets to put the largest at the bottom */
    const sortedPanelSets = job.panelSets.sort((a, b) => {
        return a.length * a.width - b.length * b.width;
    });

    for (let i = 0; i < sortedPanelSets.length; i++) {
        const panelSet = sortedPanelSets[i];
        eq.terms.push({ value: panelSet.thickness, name: `panel ${panelSet.id} thickness` });
        if (i < sortedPanelSets.length - 1) {
            eq.terms.push({ value: 0.125, name: 'cardboard separator' });
        }
    }

    eq.terms.push({ value: 0.75, name: 'top foam padding' });

    return eq;
}

export function evaluateEquation (eq: Equation): number {
    let sum = 0;
    for (const term of eq.terms) {
        sum += term.value * (term.qty || 1);
    }
    return sum;
}

/**
 * @note may be able to adapt for other crate types in the future?
 */
export function getFlatCrateFrameKind (args: { stackedHeight: number }): FrameKind {
    if (args.stackedHeight < 3.5) {
        return '2x4';
    }
    if (args.stackedHeight < 5.5) {
        return '2x6';
    }
    if (args.stackedHeight < 7) {
        return '2x4 + 2x4';
    }
    if (args.stackedHeight < 9) {
        return '2x4 + 2x6';
    }
    if (args.stackedHeight <= 11) {
        return '2x6 + 2x6';
    }
    throw new Error('stacked height too large for flat crate');
}

export function getCutlist (job: Job) {
    const cutlist: Cutlist = {
        crates: [],
    };

    const stackedHeightEq = getStackedHeight(job);
    const stackedHeight = evaluateEquation(stackedHeightEq);
    const frame = getFlatCrateFrameKind({ stackedHeight });

    cutlist.crates.push({
        kind: 'flat',
        frame,
        shortWallLength: 0,
        longWallLength: 0,
        plywoodLength: 0,
        plywoodWidth: 0,
    });

    return {
        cutlist,
        stackedHeight,
        stackedHeightEq,
    };
}

console.log(getCutlist(job));
// // @ts-expect-error i know wat im doin
// window.getCutlist = getCutlist;