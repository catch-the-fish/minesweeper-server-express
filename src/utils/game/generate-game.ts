import { CELLS_ENCODER } from 'utils/game/encode';
import { isInBounds, isInteger } from 'utils/game/helpers';

// https://dash.harvard.edu/bitstream/handle/1/14398552/BECERRA-SENIORTHESIS-2015.pdf
const DEFAULT_DIFFICULTIES = new Map([
  [
    'easy',
    {
      height: 10,
      width: 10,
      bombCount: 10,
      maxLives: 3
    } as const
  ],
  [
    'intermediate',
    {
      height: 16,
      width: 16,
      bombCount: 40,
      maxLives: 2
    } as const
  ],
  [
    'expert',
    {
      height: 30,
      width: 16,
      bombCount: 99,
      maxLives: 1
    } as const
  ]
]);

interface GameSettings {
  // String 'easy' | 'intermediate' | 'expert' | 'custom'
  difficulty: string;
  // Number that is in [2, 50]
  height: string;
  // Number that is in [2, 50]
  width: string;
  // Number that is [1, width*height-3]
  bombCount: string;
  // Number that is [1, bombCount)
  maxLives: string;
}

function generateGame(settings: GameSettings) {
  // parse difficulty settings
  const diff = parseDifficulty(settings);
  if (!diff) return null;

  // generate bomb locations
  let bombLocations = generateBombLocations(
    diff.height,
    diff.width,
    diff.bombCount
  );
  if (!bombLocations) return null;

  // generate solution and unsolved board
  let solved = generateNewBoard(diff.height, diff.width, bombLocations);
  let unsolved = generateUnknownBoard(diff.height, diff.width);
  if (!unsolved || !solved) return null;

  let game = new Map<string, any>([
    ['height', diff.height],
    ['width', diff.width],
    ['maxLives', diff.maxLives], // give all players these lives
    ['bombLocations', bombLocations],
    ['solved', solved],
    ['unsolved', unsolved]
  ]);

  return game;
}

function parseDifficulty(settings: GameSettings) {
  // check if difficulty is easy, intermediate, or expert
  const diff = DEFAULT_DIFFICULTIES.get(settings.difficulty);
  if (diff) return diff;
  // note: interesting ts flow analysis workaround (avoiding `diff.has()`)
  // https://github.com/microsoft/TypeScript/issues/13086#issuecomment-268461298

  // check if height, width, bombCount, maxLives all exist as integers
  if (
    !(settings.height && isInteger(settings.height)) ||
    !(settings.width && isInteger(settings.width)) ||
    !(settings.bombCount && isInteger(settings.bombCount)) ||
    !(settings.maxLives && isInteger(settings.maxLives))
  )
    return null;

  const intHeight = parseInt(settings.height);
  const intWidth = parseInt(settings.width);
  const intBombCount = parseInt(settings.bombCount);
  const intMaxLives = parseInt(settings.maxLives);

  // check if board dimensions are invalid
  if (
    !(2 <= intHeight && intHeight <= 50) ||
    !(2 <= intWidth && intWidth <= 50) ||
    !(1 <= intBombCount && intBombCount <= intHeight * intWidth - 3) ||
    !(1 <= intMaxLives && intMaxLives < intBombCount)
  )
    return null;

  return {
    height: intHeight,
    width: intWidth,
    bombCount: intBombCount,
    maxLives: intMaxLives
  } as const;
}

function shuffleArray<Type>(array: Array<Array<Type>>) {
  // https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function generateUnknownBoard(
  height: number,
  width: number
): Array<Array<string>> {
  // https://stackoverflow.com/a/38213067
  return [...Array(height)].map(() =>
    Array(width).fill(CELLS_ENCODER['unknown'])
  );
}

function generateBombLocations(
  height: number,
  width: number,
  bombCount: number
) {
  // height must be in [2, 50]
  // width must be in [2, 50]
  // there must be 3 empty blocks
  // return null if settings are invalid
  if (
    !(2 <= height && height <= 50) ||
    !(2 <= width && width <= 50) ||
    !(height * width - 3 >= bombCount)
  )
    return null;

  // generate array of possible bomb locations
  let possibilities: Array<[number, number]> = [];
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (
        !(r === 0 && c === 0) &&
        !(r === 0 && c === 1) &&
        !(r === 1 && c === 0)
      ) {
        possibilities.push([r, c]);
      }
    }
  }

  // shuffle possibilities
  shuffleArray(possibilities);

  // take bombCount amount of possible bomb locations
  let bombLocations: Array<[number, number]> = [];
  for (let i = 0; i < bombCount; i++) {
    bombLocations.push(possibilities[i]);
  }

  return bombLocations;
}

function generateNewBoard(
  height: number,
  width: number,
  bombLocs: Array<[number, number]>
): Array<Array<string>> {
  // init board with unknowns
  let newBoard = generateUnknownBoard(height, width);

  // place bombs
  for (let i = 0; i < bombLocs.length; i++)
    newBoard[bombLocs[i][0]][bombLocs[i][1]] = CELLS_ENCODER['bomb'];

  // calculate numbers
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (newBoard[r][c] !== CELLS_ENCODER['unknown']) continue;
      let bombCount = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          let r2 = r + dr;
          let c2 = c + dc;

          if ((dc === 0 && dr === 0) || !isInBounds([r2, c2], [height, width]))
            continue;

          if (newBoard[r2][c2] === CELLS_ENCODER['bomb']) bombCount++;
        }
      }
      newBoard[r][c] = `${bombCount}`;
    }
  }

  return newBoard;
}

export default generateGame;
