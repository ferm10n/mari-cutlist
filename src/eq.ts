
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


export function evaluateEquation (eq: Equation): number {
    let sum = 0;
    for (const term of eq.terms) {
        sum += term.value * (term.qty || 1);
    }
    return sum;
}
