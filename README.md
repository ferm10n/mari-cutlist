# Cutlist

## Getting started

- nodejs is required
- `yarn` to install dependencies
- `yarn dev` to start the development server
- pushes to the `master` branch will automatically deploy to https://ferm10n.github.io/mari-cutlist/

## Notes

- > WIP doing a big tearup for inputs and generating the cutlist. lots of types have changed. Working towards entering inputs, calculating crate kind and running the correct cutlist generation function.
    - each crate kind will have a `inputsTo<CRATE_KIND>` function. The output of this is intended to be used with the "renderer"
        - **this was the original intent, but now we realize we only need the renderer for the flat crate, topdown**
    - then, the crate object will be passed through a `<CRATE_KIND>CrateToCutlist` fn to generate the cutlist.
    - another way to think about a crate type is it represents the logical choices made for construction. where as the "crate type to cutlist" fns give just the cutlist.
    - *WIP stack*
        - finish generator functions for flate crate `getFlatCrateFrameKind()`
            - how to handle errors? like when invalid inputs are detected.
        - create a `flatCrateToCutlist` fn from the old `flat-crate.ts`
        - call the appropriate generator function in the `cutlist` computed in store.ts
        

- user input: inner crate dimensions
    - inner crate dimensions will be determined by grasshopper 🦗
- program output: external crate dimensions and ordered cutlist
    - cutlist is a list of items to be cut, specifying their dimensions, material, qty
- crate types
    - flat
    - a-frame
    - lightweight
    - box
    - combination - *rare, maybe later*
- flate crate
    - **outputs**
        - plywood sheet base and lid
            - qty
            - dimensions
        - feet
            - 2x4 or 2x6
            - lengths for each pair
        - walls
            - 2x4 or 2x6 (which combination of these)
            - qty
            - lengths
        - seam joiner
            - conditional
    - use if all are true
        - inner height <= 10.25
    - plywood sheets as base and lid
        - **output**: dimensions of plywood sheets
        - 2D dimension are dependent on:
            - wall thickness - always 1.5"
            - foam separators - always .75" all around
            - wiggle room - 1" if trimmed, 2" if untrimmed.
                - *wiggle room is distributed across all sides*
            - inner crate dimensions
    - crate walls - stacking one or two 2x4 or 2x6 on the base around the edge
        - the wall type (2x4 or 2x6) depends on how high the walls need to be according to the inner crate dimensions (just height really):
            - height < 3.5": 2x4
            - height < 5.5": 2x6
            - height < 7": 2x4, 2x4
            - height < 9": 2x4, 2x6
            - height <= 11": 2x6, 2x6
            - height > 11": *don't use a flate crate*
    - feet
        - ...
    - ...
- a-frame
    - when it must be used:
        - if inner height > 40"
        - if weight >= 3000 and inner width < 15"
        - if height > 3 * width
    - when it cannot be used:
        - if width > 40" 
        - W/H >= 0.66
- box
    - when true
        - (?) height < 40 and width is at least 3/4ths of height
        - width > height 


*example cutlists*

```ts

const flatCrateCutlist: CutlistItem[] = [
    {
        name: 'base',
        kind: 'plywood',
        qty: 1,
        width: 33.5,
        length: 75.5,
        thickness: 0.625,
    },
    {
        name: 'corner feet',
        kind: 'wood',
        woodKind: '2x6',
        length: 11,
        qty: 8,
    },
    {
        name: 'center feet',
        kind: 'wood',
        woodKind: '2x6',
        length: 11,
        qty: 4,
    },
    {
        name: 'long wall',
        kind: 'wood',
        woodKind: '2x4',
        length: 74,
        qty: 2,
    },
    {
        name: 'short wall',
        kind: 'wood',
        woodKind: '2x4',
        length: 32,
        qty: 2,
    },
    {
        name: 'top',
        kind: 'plywood',
        qty: 1,
        width: 33.5,
        length: 75.5,
        thickness: 0.625,
    },
];
```

### Box crate

- given inner dimensions
- calculate "adjusted" inner dimensions, for foam and finger spacing (these are fixed amounts)
- base
    - dimensions of plywood
- base frame long
    - aligns with the length dimension / removable wall side
- base frame short
    - the other sides
- base frame seam
    - only use if base length is > 96", or width > 48"
    - length is `base frame short - 11"`
    - use 1, unless length > 96", then you need to use 2 and add the note about using scrap / centering
-  feet
    - might be corners and maybe middles, or might be full length runners
        - which one chosen depends on weight
            - anything over...
    - full length runners
        - use if weight if over 2000lb
        - middle runner might need to use 2x4 to fit between the edge 2x6s, if there isn't enough from for a 2x6 middle runner.

## Old Notes

> Unless stated otherwise, all units are in inches.

- user input: materials (panels, accessories, components) to put in crates
- program output: how the materials should be packaged
    - which crate(s) should be used
    - where 
- materials are packaged into one or more crates
- crate types
    - flat
    - a-frame
    - lightweight
    - box
    - combination - *rare, maybe later*
- accessory components
    - always 5x11.5x15.5
- flat crate
    - plywood sheets as base and lid
        - you might need extra space added to the length/depth to fit additional components
        - 2D dimension are dependent on:
            - wall thickness - always 1.5"
            - foam separators - always .75" all around
            - wiggle room - 1" if trimmed, 2" if untrimmed.
                - *wiggle room is distributed across all sides*
            - panel dimensions
    - components (usually z-clips) can add to the depth or length. if the component is longer than the width of the crate, add it to the depth instead of the length (ie put the component on top of the panels)
    - crate walls - stacking one or two 2x4 or 2x6 on the base
        - the wall type (2x4 or 2x6) depends on how much space you need over the base (the depth):
            - depth < 3.5": 2x4
            - depth < 5.5": 2x6
            - depth < 7": 2x4, 2x4
            - depth < 9": 2x4, 2x6
            - depth < 11": 2x6, 2x6
    - depth - dependent on panel thickness and separators used
    - feet (corner thingies)
    - acrylic panels only
    - separators
        - always .75" separator on top and bottom of panel stack
        - choices, in order of asc cost and preference to use
            - 0.125" cardboard
            - 0.375" foam
            - 0.75" foam
        - a separator goes inbetween each panel
        - if panels are untrimmed -> cardboard
        - if panels do not have channel or lighting -> cardboard
        - if panels have channels or lighting < .125" thick -> .375" foam
        - if z-clips -> .75" foam
    - foam padding around panels (between panels and crate walls) is always .75" foam

- > probably need a prompt for extra component dimensions

## Examples

- panels
    - A: 1 panel, acrylic, 0.625" thick, length: 30, width: 10
    - B: 1 panel, acrylic, 1.125" thick, length: 30, width: 10
    - trimmed
- cutlist
    - specified wood type: 2x4
        - 2x4 because: stacked material height (1.125" panel + 0.625" panel + 0.125" cardboard separator + .75" for bottom foam + .75 for top foam) < 3.5
        - cardboard separator because: no channel or lighting
    - length of long wall: `length of panels 30" + 1" for wiggle room + 0.75"*2 (1.5") for foam walls + 1.5"*1 of wall thickness`
    - length of short wall: `width of panels 10" + 1" for wiggle room + 0.75"*2 (1.5") for foam walls + 1.5"*1 of wall thickness`
    - plywood length: `length of long wall + 1.5" of wall thickness`
    - plywood width: `length of short wall + 1.5" of wall thickness`

## TODOs

- [x] saving / loading cutlist app state to a file
- [x] prompt for job number at the start
- [x] require inputs for new panel sets, and start blank
- [x] Make panel sets editable
- [ ] accessory box needs to affect the height of the frame
- [ ] minimum dimension for feet / base
- [ ] accessories dimensions input
- [ ] support more materials / crate types
- [ ] ~~3D packing visualizer? <-- **current wip**~~
    - *maybe one day*
- [ ] material cost