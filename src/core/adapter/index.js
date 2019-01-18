/**
 * Created by whincwu on 23/06/2017.
 */

const adaptors = {
  get ProfitAdapter () { return require('./ProfitAdapter').default },
  get TypeAdapter () { return require('./TypeAdapter').default },
  get FriendTransferAdapter () { return require('./FriendTransferAdapter').default },
  get RetCodeAdapter () { return require('./RetCodeAdapter').default },
  get RelationAdapter () { return require('./RelationAdapter').default },
  get PlanAdapter () { return require('./PlanAdapter').default },
  get LoginAdapter () { return require('./LoginAdapter').default },
  get TransferLimitAdapter () { return require('./TransferLimitAdapter').default },
  get WebankTokenAdapter () { return require('./WebankTokenAdapter').default }
}
module.exports = adaptors
