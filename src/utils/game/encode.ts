// encoding to render cells to buttons
const RENDER_ENCODER = {
  0: `<strong class='fa-stack-2x'></strong>`,
  1: `<strong class='fa-stack-2x'>1</strong>`,
  2: `<strong class='fa-stack-2x'>2</strong>`,
  3: `<strong class='fa-stack-2x'>3</strong>`,
  4: `<strong class='fa-stack-2x'>4</strong>`,
  5: `<strong class='fa-stack-2x'>5</strong>`,
  6: `<strong class='fa-stack-2x'>6</strong>`,
  7: `<strong class='fa-stack-2x'>7</strong>`,
  8: `<strong class='fa-stack-2x'>8</strong>`,
  9: `<strong class='fa-stack-2x'>9</strong>`,
  x: `<i class='fas fa-bomb fa-stack-2x fa-inverse'></i>`,
  '!': `<i class='fas fa-flag fa-stack-2x fa-inverse'></i>`,
  '?': `<i class='far fa-square fa-stack-2x'></i>`
  // todo: test monospace icons
  // 0: `<strong class='fa-stack-2x fa-fw'></strong>`,
  // 1: `<strong class='fa-stack-2x fa-fw'>1</strong>`,
  // 2: `<strong class='fa-stack-2x fa-fw'>2</strong>`,
  // 3: `<strong class='fa-stack-2x fa-fw'>3</strong>`,
  // 4: `<strong class='fa-stack-2x fa-fw'>4</strong>`,
  // 5: `<strong class='fa-stack-2x fa-fw'>5</strong>`,
  // 6: `<strong class='fa-stack-2x fa-fw'>6</strong>`,
  // 7: `<strong class='fa-stack-2x fa-fw'>7</strong>`,
  // 8: `<strong class='fa-stack-2x fa-fw'>8</strong>`,
  // 9: `<strong class='fa-stack-2x fa-fw'>9</strong>`,
  // x: `<i class='fas fa-bomb fa-stack-2x fa-inverse fa-fw'></i>`,
  // '!': `<i class='fas fa-flag fa-stack-2x fa-inverse fa-fw'></i>`,
  // '?': `<i class='far fa-square fa-stack-2x fa-fw'></i>`
} as const;

// encoding to translate english to cells
const CELLS_ENCODER = {
  0: '0',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  bomb: 'x',
  flag: '!',
  unknown: '?'
} as const;

export { RENDER_ENCODER, CELLS_ENCODER };
