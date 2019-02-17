export default {
  namespaced: true,
  state: {
    pendingMessages: []
  },
  getters: {},

  mutations: {
    append: (state, message) => {
      message.timestamp = new Date()
      state.pendingMessages.push(message)
    },
    pop: (state) => {
      state.pendingMessages.shift()
    }
  },
  actions: {}
}
