export default {
  namespaced: true,
  state: {
    boardState: {},
    boardStateUpdate: new Date()
  },
  getters: {},

  mutations: {
    setBoardState: (state, boardState) => {
      state.boardState = boardState
      state.boardStateUpdate = new Date()
    }
  },
  actions: {}
}
