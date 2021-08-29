import {
  DocumentType,
  getModelForClass,
  index,
  ModelOptions,
  mongoose,
  prop,
  Ref
} from '@typegoose/typegoose';
import {
  Severity,
  WhatIsIt
} from '@typegoose/typegoose/lib/internal/constants';
import { UserClass } from 'models/user';

@ModelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW }
})
@index(
  { createdAt: 1 },
  {
    // delete temporary lobbies after 2 days
    expireAfterSeconds: 60 * 60 * 24 * 2,
    partialFilterExpression: { temp: true }
  }
)
class LobbyClass {
  // delete lobby if it is temporary
  @prop({ required: true, default: true, index: true })
  public temp!: boolean;

  @prop({ required: true })
  public lobbyType!: 'solo' | 'versus' | 'coop';

  // game of each player { 'User._id': 'Game._id' }
  @prop({ required: true, default: new Map(), ref: 'GameClass' }, WhatIsIt.MAP)
  public playerToGame!: mongoose.Types.Map<mongoose.Types.ObjectId>;

  // ['User._id'] of spectators, mongodb does not support Set right now
  @prop({ required: true, default: [], ref: 'UserClass' })
  public spectators!: Ref<UserClass>[];
}

const LobbyModel = getModelForClass(LobbyClass);
type LobbyDocument = DocumentType<LobbyClass>;

async function findLobby(id: string | mongoose.Types.ObjectId | undefined) {
  if (!id) return null;
  try {
    return await LobbyModel.findById(id).exec();
  } catch (err) {
    console.error(Date());
    console.error(err);
    return null;
  }
}

export { LobbyClass, LobbyDocument, findLobby };
export default LobbyModel;
