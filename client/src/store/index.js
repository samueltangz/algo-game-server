import Vue from 'vue'
import Vuex from 'vuex'

import messages from './messages'
import users from './users'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    messages,
    users
  }
})
