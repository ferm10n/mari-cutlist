import { evaluateEquation } from "@/eq";
import { UserInput, BoxCrate, separatorThicknessMap, CutlistItem } from "@/types";

export function inputsToBoxCrate (userInput: UserInput): BoxCrate {
    const {
        innerDimensions: dimensions,
        needsMiddleRunner,
        weight,
    } = userInput;

    const adjustedLength = evaluateEquation({
        name: 'adjusted length',
        terms: [
            { name: 'inner length', value: dimensions.length },
            { name: 'foam thickness', value: separatorThicknessMap['thick foam'], qty: 2 },
            { name: 'finger space', value: 1.5 },
        ],
    });
    const adjustedWidth = evaluateEquation({
        name: 'adjusted width',
        terms: [
            { name: 'inner width', value: dimensions.width },
            { name: 'foam thickness', value: separatorThicknessMap['thick foam'], qty: 2 },
            { name: 'finger space', value: 1.5 },
        ],
    });
    
    let seams = 0;
    if (adjustedLength > 96 || adjustedWidth > 48) {
        seams = 1;
    }
    if (adjustedLength > 96 && adjustedWidth > 48) {
        seams = 2;
    }

    return {
        adjustedInnerDimensions: {
            length: adjustedLength,
            width: adjustedWidth,
            height: evaluateEquation({
                name: 'adjusted height',
                terms: [
                    { name: 'inner height', value: dimensions.height },
                    { name: 'foam thickness', value: separatorThicknessMap['thick foam'], qty: 3 },
                    { name: 'finger space', value: 1.75 },
                ],
            }),
        },
        seams,
        needsMiddleRunner,
        weight,
    };
}

export function boxCrateToCutlist (crate: BoxCrate): CutlistItem[] {
    const boxCrateCutlist: CutlistItem[] = [];

    // plywood base
    boxCrateCutlist.push({
        kind: 'plywood',
        name: 'base',
        thickness: 0.625,

        // these might not be correct, if the adj inner dims are larger than the plywood sheets. in that case, figure it out.
        qty: 1,
        width: crate.adjustedInnerDimensions.width,
        length: crate.adjustedInnerDimensions.length,
    });

    // base frame short
    boxCrateCutlist.push({
        name: 'base frame short',
        kind: 'wood',
        woodKind: '2x6',
        length: crate.adjustedInnerDimensions.width,
        qty: 2,
    });

    // base frame long
    boxCrateCutlist.push({
        name: 'base frame long',
        kind: 'wood',
        woodKind: '2x6',
        length: evaluateEquation({
            name: 'base frame long length',
            terms: [
                { name: 'inner length', value: crate.adjustedInnerDimensions.length },
                { name: 'remove width of "base frame short"', value: 5.5, qty: -2 },
            ],
        }),
        qty: 2,
    });

    if (crate.seams) {
        boxCrateCutlist.push({
            name: 'base frame seam',
            kind: 'wood',
            woodKind: '2x6',
            length: evaluateEquation({
                name: 'base frame seam length',
                terms: [
                    { name: 'base frame short length', value: crate.adjustedInnerDimensions.width },
                    { name: 'remove width of "base frame short"', value: 5.5, qty: -2 },
                ],
            }),
            qty: crate.seams, // depends on the seam length
        });
    }

    // feet
    const needsEdgeRunners = crate.adjustedInnerDimensions.length > 130 || crate.weight > 2000 || crate.needsMiddleRunner;
    if (needsEdgeRunners) {
        const feetLength = evaluateEquation({
            name: 'feet length',
            terms: [
                { name: 'inner length', value: crate.adjustedInnerDimensions.length },
                { name: 'offset on either side', value: 2.125, qty: 2 },
            ],
        })
        
        // need to use full length runners
        boxCrateCutlist.push({
            name: 'feet edge runner',
            kind: 'wood',
            woodKind: '2x6',
            length: feetLength,
            qty: 4,
        });

        const spaceBetweenEdgeRunners = evaluateEquation({
            name: 'space between edge runners',
            terms: [
                { name: 'inner width', value: crate.adjustedInnerDimensions.width },
            ],
        });

        if (spaceBetweenEdgeRunners > 20) { // under 20 should be supported enough by the edge runners
            boxCrateCutlist.push({
                name: 'feet middle runner',
                kind: 'wood',
                woodKind: spaceBetweenEdgeRunners < 35
                    ? '2x4'
                    : '2x6',
                length: feetLength,
                qty: 2,
            });
        }

        // extra base tip prevention
        if (crate.adjustedInnerDimensions.length > 130) {
            boxCrateCutlist.push({
                name: 'base tip prevention',
                kind: 'wood',
                woodKind: '2x4',
                length: evaluateEquation({
                    name: 'base tip prevention length',
                    terms: [
                        { name: 'inner width', value: crate.adjustedInnerDimensions.length },
                        { name: 'extend for feet edge runners', value: 2.125, qty: 2 },
                    ],
                }),
                qty: 3,
                notes: 'this must be strapped down after crate is completed',
            });
        }
    } else {
        // need to use corners (and maybe middles)
        boxCrateCutlist.push({
            name: 'corner feet',
            kind: 'wood',
            woodKind: '2x6',
            length: evaluateEquation({
                name: 'corner feet length',
                terms: [
                    { name: 'quarter of length', value: crate.adjustedInnerDimensions.length * 0.25 },
                    { name: 'offset on either side', value: 2.125, qty: 2 },
                ],
            }),
            qty: 8,
        });

        if (crate.seams > 0) {
            const middleFeetLength = evaluateEquation({
                name: 'middle feet length',
                terms: [
                    { name: 'adjusted length', value: crate.adjustedInnerDimensions.length },
                    { name: 'subtract two plywood sheet widths', value: 48, qty: -2 },
                    { name: 'seam offset', value: 1, qty: 2 },
                ],
            });
            if (middleFeetLength > 11 && middleFeetLength < 24) { // TODO - 24 might need to be changed, check with actual forklift
                boxCrateCutlist.push({
                    name: 'middle feet',
                    kind: 'wood',
                    woodKind: '2x6',
                    length: middleFeetLength,
                    qty: 4,
                });
            }
        }
    }

    // small walls
    boxCrateCutlist.push({
        name: 'small wall',
        kind: 'plywood',
        width: crate.adjustedInnerDimensions.width,
        length: evaluateEquation({
            name: 'small wall length',
            terms: [
                { name: 'adj inner height', value: crate.adjustedInnerDimensions.height },
                { name: 'base plywood thickness', value: 0.625 },
                { name: 'base frame thickness', value: 1.5 },
            ],
        }),
        thickness: 0.625,
        qty: 2,
    });
    boxCrateCutlist.push({
        name: 'small wall horizontal 2x4',
        kind: 'wood',
        woodKind: '2x4',
        length: crate.adjustedInnerDimensions.width,
        qty: 4,
    });
    const verticalWall2x4Length = evaluateEquation({
        name: 'small wall vertical 2x4 length',
        terms: [
            { name: 'adj inner height', value: crate.adjustedInnerDimensions.height },
            { name: 'subtract horizontal 2x4 thickness', value: -3.5, qty: 2 },
        ],
    });
    boxCrateCutlist.push({
        name: 'small wall vertical 2x4',
        kind: 'wood',
        woodKind: '2x4',
        length: verticalWall2x4Length,
        qty: 4,
    });
    if (crate.seams > 0) {
        boxCrateCutlist.push({
            name: 'small wall vertical 2x4 (middle)',
            kind: 'wood',
            woodKind: '2x4',
            length: verticalWall2x4Length,
            qty: 2,
        });
    }

    // large walls
    boxCrateCutlist.push({
        name: 'large wall plywood',
        kind: 'plywood',
        length: evaluateEquation({
            name: 'large wall plywood length',
            terms: [
                { name: 'adj inner length', value: crate.adjustedInnerDimensions.length },
                { name: 'offset for feet / runners', value: 2.125, qty: 2 },
            ],
        }),
        width: evaluateEquation({
            name: 'height of the large wall',
            terms: [
                { name: 'adj inner height', value: crate.adjustedInnerDimensions.height },
                { name: 'base plywood thickness', value: 0.625 },
                { name: 'base frame thickness', value: 1.5 },
            ],
        }),
        thickness: 0.625,
        qty: 2,
    });
    boxCrateCutlist.push({
        name: 'large wall horizontal 2x4',
        kind: 'wood',
        woodKind: '2x4',
        length: evaluateEquation({
            name: 'large wall horizontal 2x4 length',
            terms: [
                { name: 'adj inner length', value: crate.adjustedInnerDimensions.length },
                { name: 'offset for feet / runners', value: 2.125, qty: 2 },
            ],
        }),
        qty: 4,
    });
    boxCrateCutlist.push({
        name: 'large wall vertical 2x4',
        kind: 'wood',
        woodKind: '2x4',
        length: verticalWall2x4Length,
        qty: 4,
    });
    if (crate.seams > 0) {
        boxCrateCutlist.push({
            name: 'large wall vertical 2x4 (middle)',
            kind: 'wood',
            woodKind: '2x4',
            length: verticalWall2x4Length,
            qty: 2,
            notes: 'increase qty as needed',
        });
    }

    // top
    boxCrateCutlist.push({
        name: 'top',
        kind: 'plywood',
        length: crate.adjustedInnerDimensions.length,
        width: crate.adjustedInnerDimensions.width,
        thickness: 0.625,
        qty: 1,
    });
    if (crate.seams > 0) {
        boxCrateCutlist.push({
            name: 'top seam',
            kind: 'wood',
            woodKind: '2x4', // always use 2x4 for top seams
            length: crate.adjustedInnerDimensions.width,
            qty: crate.seams,
        });
    }

    return boxCrateCutlist;
}
