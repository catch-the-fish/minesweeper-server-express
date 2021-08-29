import {
  DocumentType,
  getModelForClass,
  index,
  ModelOptions,
  mongoose,
  prop
} from '@typegoose/typegoose';
import {
  Severity,
  WhatIsIt
} from '@typegoose/typegoose/lib/internal/constants';

// todo: non-ref arrays must set the `type` option ..?
// https://typegoose.github.io/typegoose/docs/api/decorators/prop/#array-options

@ModelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW }
})
@index(
  { createdAt: 1 },
  {
    // delete temporary games after 1 day
    // expireAfterSeconds: 60 * 60 * 24,
    expireAfterSeconds: 60, //TODO: remove testing
    partialFilterExpression: { temp: true }
  }
)
class GameClass {
  //#region settings constants
  @prop({ required: true })
  public height!: number;
  @prop({ required: true })
  public width!: number;
  @prop({ required: true }) // maximum amount of lives
  public maxLives!: number;
  @prop({ required: true }) // bomb coordinates
  public bombLocations!: Array<[number, number]>;
  @prop({ required: true }) // solution board
  public solved!: Array<Array<string>>;
  // whether the game should be deleted automatically
  @prop({ required: true, default: true, index: true })
  public temp!: boolean;
  //#endregion

  //#region time in milliseconds elapsed since 1970/01/01, e.g. Date.now()
  @prop({ required: false }) // undefined until game starts
  public start?: number;
  @prop({ required: false }) // undefined until game ends
  public end?: number;
  //#endregion

  //#region player mapping
  // index of each player { 'User._id': Number }
  @prop({ required: true, default: new Map() }, WhatIsIt.MAP)
  public players!: mongoose.Types.Map<number>;
  //#endregion

  //#region mutable fields
  @prop({ required: true }) // gameplay unsolved board
  public unsolved!: Array<Array<string>>;
  @prop({ required: true, default: [] }) // flags by player index
  public flags!: Array<number>;
  @prop({ required: true, default: [] }) // explosions caused by player index
  public explosions!: Array<number>;
  @prop({ required: true, default: 0 }) // index of current turn player
  public turnIndex!: number;
  @prop({ required: true, default: 0 }) // amount of revealed blocks, including bombs
  public revealed!: number;
  //#endregion
}

const GameModel = getModelForClass(GameClass);
type GameDocument = DocumentType<GameClass>;

async function findGame(id: string | mongoose.Types.ObjectId | undefined) {
  if (!id) return null;
  try {
    return await GameModel.findById(id).exec();
  } catch (err) {
    console.error(Date());
    console.error(err);
    return null;
  }
}

export { GameClass, GameDocument, findGame };
export default GameModel;
