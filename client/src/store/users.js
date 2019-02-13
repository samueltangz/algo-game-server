import _ from 'lodash'

import usersAPI from '@/api/users.js'

export default {
  namespaced: true,
  state: {
    authnToken: '',
    user: {}
  },
  getters: {
    isLoggedIn: state => state.user.id !== undefined,
    isInRoom: state => state.user.roomId !== undefined,
    isInGame: state => state.user.gameId !== undefined
  },

  mutations: {
    setUser: (state, user) => {
      if (user === undefined) {
        state.user = {}
      } else {
        state.user = _.cloneDeep(user)
      }
    },
    setAuthnToken: (state, authnToken) => {
      state.authnToken = authnToken
    },
    setRoomId: (state, roomId) => {
      if (roomId === null) {
        state.user.roomId = undefined
        return
      }
      state.user.roomId = roomId
    },
    setGameId: (state, gameId) => {
      if (gameId === null) {
        state.user.gameId = undefined
        return
      }
      state.user.gameId = gameId
    }
  },
  actions: {
    update: async ({ commit }, authnToken) => {
      try {
        const user = await usersAPI.me(authnToken)
        commit('setUser', user)
        commit('setAuthnToken', authnToken)
      } catch (err) {
        commit('setUser', {})
        commit('setAuthnToken', undefined)
      }
    }
  }
}
