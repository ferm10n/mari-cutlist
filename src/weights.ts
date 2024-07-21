type TerrazzoThicknessOption = '5/8"' | '7/8"' | '1-1/4"' | '1-9/16"' | '2-3/8"';

/** units are  */
export const terrazzoThicknessOptionsMap: {
    [t in TerrazzoThicknessOption]: number;
} = {
    '1-1/4"': 1.25,
    '1-9/16"': 1 + 9/16,
    '2-3/8"': 2 + 3/8,
    '5/8"': 5/8,
    '7/8"': 7/8,
};

export function getTerrazzoWeight (opts: {
    /** inches */
    thickness: TerrazzoThicknessOption;
    /** inches */
    length: number;
    /** inches */
    width: number;
}) {

}