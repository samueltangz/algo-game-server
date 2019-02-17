import Vue from 'vue'
import Vuex from 'vuex'

import games from './games'
import messages from './messages'
import users from './users'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    games,
    messages,
    users
  }
})
