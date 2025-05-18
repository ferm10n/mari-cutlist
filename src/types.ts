import z from 'zod';
import { evaluateEquation } from './eq';

const materialSchema = z.enum(['glass', 'acrylic', 'terrazzo']);
export type Material = z.infer<typeof materialSchema>;

/** maps inner value to user selected value */
export const materialOptions: {
    [m in Material]: string;
} = {
    glass: 'Glass',
    acrylic: 'Acrylic',
    terrazzo: 'Terrazzo',
};

export type SeparatorKind = 'cardboard' | 'thin foam' | 'thick foam';

export const separatorThicknessMap: {
    [s in SeparatorKind]: number;
} = {
    cardboard: 0.125,
    'thin foam': 0.375,
    'thick foam': 0.75,
}

const crateKindSchema = z.enum(['flat', 'lightweight', 'box', 'a-frame']);
export type CrateKind = z.infer<typeof crateKindSchema>;

export type FrameKind = '2x4' | '2x6' | '2x4 + 2x4' | '2x6 + 2x6' | '2x4 + 2x6';

const cutlistItemBaseSchema = z.object({
    qty: z.number(),
    name: z.string(),
    kind: z.string(),
    notes: z.string().optional(),
});
type CutlistItemBase = z.infer<typeof cutlistItemBaseSchema>;

const cutlistItemWoodSchema = cutlistItemBaseSchema.extend({
    kind: z.literal('wood'),
    woodKind: z.enum(['2x4', '2x6', '1x4']),
    length: z.number(),
});
type CutlistItemWood = z.infer<typeof cutlistItemWoodSchema>;

const cutlistItemPlywoodSchema = cutlistItemBaseSchema.extend({
    kind: z.literal('plywood'),
    width: z.number(),
    length: z.number(),
    thickness: z.literal(0.625),
});
type CutlistItemPlywood = z.infer<typeof cutlistItemPlywoodSchema>;

const cutlistItem = z.discriminatedUnion('kind', [
    cutlistItemWoodSchema,
    cutlistItemPlywoodSchema,
]);
export type CutlistItem = z.infer<typeof cutlistItem>;

const dimensionsSchema = z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
});
export type Dimensions = z.infer<typeof dimensionsSchema>;

const boxCrateSchema = z.object({
    adjustedInnerDimensions: dimensionsSchema,
    seams: z.number(),
    needsMiddleRunner: z.boolean(),
    weight: z.number(),
});
export type BoxCrate = z.infer<typeof boxCrateSchema>;

const flatCrateSchema = z.object({
    kind: z.literal('flat'),
    shortWallLength: z.number(),
    longWallLength: z.number(),
    innerDimensions: dimensionsSchema,
    innerDimensionsWithFingerSpace: dimensionsSchema,
    wallKind: z.enum([
        '2x4',
        '2x6',
        '2x4 + 2x4',
        '2x4 + 2x6',
        '2x6 + 2x6',
    ]),
});
export type FlatCrate = z.infer<typeof flatCrateSchema>;

export const userInputSchema = z.object({
    innerDimensions: dimensionsSchema,
    needsMiddleRunner: z.boolean(),
    weight: z.number(),
    materials: z.object({
        acrylic: z.boolean(),
        glass: z.boolean(),
        terrazzo: z.boolean(),
    }),
    panelsOnEdge: z.boolean(),
    overrideCrateKind: crateKindSchema.nullable(),
});
export type UserInput = z.infer<typeof userInputSchema>;
