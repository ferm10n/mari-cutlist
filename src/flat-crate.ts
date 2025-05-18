import { Cutlist, Equation, FrameKind, Job, PanelSet, SeparatorKind, separatorThicknessMap } from "./types";

export function getSeparator (panelSet: PanelSet): SeparatorKind {
    if (panelSet.zClips !== 'none') {
        return 'thick foam';
    }
    if (panelSet.frame === 'Yes') {
        return 'thin foam';
    }
    return 'cardboard';
}

export function getStackedHeight (job: Job): {
    equation: Equation,
    sortedPanelSets: PanelSet[],
} {
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
        eq.terms.push({ value: panelSet.thickness, name: `panel ${panelSet.id}`, qty: panelSet.qty });

        const separator = getSeparator(panelSet);
        const separatorThickness = separatorThicknessMap[separator];

        eq.terms.push({
            value: separatorThickness,
            name: `${separator} separator for panel set ${panelSet.id}`, qty: panelSet.qty - 1,
        });
    }

    eq.terms.push({ value: 0.75, name: 'top foam padding' });

    return {
        equation: eq,
        sortedPanelSets,
    };
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

export function getFlatCutlist (job: Job): Cutlist {
    const cutlist: Cutlist = {
        crates: [],
    };

    if (job.panelSets.length === 0) {
        return cutlist;
    }

    const { equation: stackedHeightEq, sortedPanelSets } = getStackedHeight(job);
    const stackedHeight = evaluateEquation(stackedHeightEq);
    const frame = getFlatCrateFrameKind({ stackedHeight });

    const shortWallLengthEq: Equation = {
        name: 'short wall length',
        terms: [
            {
                name: 'maximum width of all panels',
                value: Math.max(...job.panelSets.map((panelSet) => panelSet.width)),
            },
            { name: 'wiggle room', value: 1 },
            { name: 'thick foam walls', value: separatorThicknessMap['thick foam'], qty: 2 },
            { name: 'frame wall thickness', value: 1.5 },
        ],
    };

    const longWallLengthEq: Equation = {
        name: 'long wall length',
        terms: [
            {
                name: 'maximum length of all panels',
                value: Math.max(...job.panelSets.map((panelSet) => panelSet.length)),
            },
            { name: 'wiggle room', value: 1 },
            { name: 'thick foam walls', value: separatorThicknessMap['thick foam'], qty: 2 },
            { name: 'frame wall thickness', value: 1.5 },
        ],
    };

    const plywoodLengthEq: Equation = {
        name: 'plywood length',
        terms: [
            { name: 'long wall length', value: evaluateEquation(longWallLengthEq) },
            { name: 'frame wall thickness', value: 1.5 },
        ],
    };

    const plywoodWidthEq: Equation = {
        name: 'plywood width',
        terms: [
            { name: 'short wall length', value: evaluateEquation(shortWallLengthEq) },
            { name: 'frame wall thickness', value: 1.5 },
        ],
    };

    cutlist.crates.push({
        kind: 'flat',
        frame,
        shortWallLength: evaluateEquation(shortWallLengthEq),
        longWallLength: evaluateEquation(longWallLengthEq),
        plywoodLength: evaluateEquation(plywoodLengthEq),
        plywoodWidth: evaluateEquation(plywoodWidthEq),
        stacking: sortedPanelSets.map(panelSet => ({
            panelId: panelSet.id,
            separator: getSeparator(panelSet),
        })),
    });

    // TODO plywood type?

    return cutlist;
}
