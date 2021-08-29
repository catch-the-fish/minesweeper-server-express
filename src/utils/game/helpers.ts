function isInBounds(
  [row, col]: [number, number],
  [height, width]: [number, number]
): boolean {
  return 0 <= row && row < height && 0 <= col && col < width;
}

function isInteger(i: string | number) {
  return /^-?\d+$/.test(`${i}`);
}

function pairStrsToInt(i: string, j: string): [boolean, number, number] {
  if (isInteger(i) && isInteger(j)) {
    return [true, parseInt(i), parseInt(j)];
  } else {
    return [false, 0, 0];
  }
}

function pairsIsElementOf<T>(item: [T, T], a: Array<[T, T]>): boolean {
  for (const i of a) {
    if (i[0] === item[0] && i[1] === item[1]) {
      return true;
    }
  }
  return false;
}

function pairsArrayUnion<T>(a: Array<[T, T]>, b: Array<[T, T]>) {
  for (let i of b) if (!pairsIsElementOf(i, a)) a.push(i);
}

function arraySum(array: Array<number>): number {
  // https://stackoverflow.com/a/43363105
  return array.reduce((a, b) => a + b, 0);
}

// return whether there are any dead players in the game
function playerHasDied(maxLives: number, playerExplosions: number): boolean {
  return maxLives - playerExplosions <= 0;
}

export {
  isInBounds,
  isInteger,
  pairStrsToInt,
  pairsIsElementOf,
  pairsArrayUnion,
  arraySum,
  playerHasDied
};
