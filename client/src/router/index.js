import Vue from 'vue'
import Router from 'vue-router'

import Rooms from '@/views/Rooms'
import Room from '@/views/Room'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/rooms',
    name: 'Rooms',
    component: Rooms
  }, {
    path: '/room/:roomId(\\d+)',
    name: 'Room',
    component: Room,
    props: function (route) {
      return {
        roomId: parseInt(route.params.roomId, 10)
      }
    }
  }]
})
