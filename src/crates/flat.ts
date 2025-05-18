import { evaluateEquation } from "@/eq";
import { Dimensions, FlatCrate, separatorThicknessMap, UserInput } from "@/types";


/**
 * @note may be able to adapt for other crate types in the future?
 */
export function getFlatCrateFrameKind (opts: { innerHeight: number }): FlatCrate['wallKind'] {
    if (opts.innerHeight < 3.5) {
        return '2x4';
    }
    if (opts.innerHeight < 5.5) {
        return '2x6';
    }
    if (opts.innerHeight < 7) {
        return '2x4 + 2x4';
    }
    if (opts.innerHeight < 9) {
        return '2x4 + 2x6';
    }
    if (opts.innerHeight <= 11) {
        return '2x6 + 2x6';
    }
    // TODO - throw an error here?
}


export function inputsToFlatCrate (userInputs: UserInput): FlatCrate {
    const innerDimensionsWithFingerSpace: Dimensions = {
        length: userInputs.innerDimensions.length + 1,
        width: userInputs.innerDimensions.width + 1,
        height: userInputs.innerDimensions.height, // finger space does not affect height
    };

    return {
        kind: 'flat',
        innerDimensions: userInputs.innerDimensions,
        innerDimensionsWithFingerSpace: innerDimensionsWithFingerSpace,
        shortWallLength: evaluateEquation({
            name: 'short wall length',
            terms: [
                { name: 'inner width with finger space', value: innerDimensionsWithFingerSpace.width },
                { name: 'foam wall thickness', value: separatorThicknessMap['thick foam'], qty: 2 },
                { name: 'pinwheel (frame on its side)', value: 1.5 }
            ],
        }),
        longWallLength: evaluateEquation({
            name: 'long wall length',
            terms: [
                { name: 'inner length with finger space', value: innerDimensionsWithFingerSpace.length },
                { name: 'foam wall thickness', value: separatorThicknessMap['thick foam'], qty: 2 },
                { name: 'pinwheel (frame on its side)', value: 1.5 }
            ],
        }),
        wallKind: getFlatCrateFrameKind({ innerHeight: innerDimensionsWithFingerSpace.height }),
    };
}