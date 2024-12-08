# Cutlist

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

- [ ] Make panel sets editable
- [ ] accessories dimensions input
- [ ] support more materials / crate types
- [ ] 3D packing visualizer?