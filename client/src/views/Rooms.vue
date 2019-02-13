<template>
  <div>
    asd
    <hr>
    <xmp>{{ me }}</xmp>
    <hr>
    <xmp>{{ rooms }}</xmp>
    <hr>
    <messages />
    <hr>
    {{ isInRoom }} / {{ isInGame }}
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import Messages from '@/components/Messages.vue'

import router from '@/router'
import usersAPI from '@/api/users.js'
import roomsAPI from '@/api/rooms.js'

export default {
  name: 'Rooms',
  components: {
    Messages
  },

  props: {},
  data: () => ({
    me: {},
    rooms: {}
  }),

  computed: {
    ...mapState('users', [
      'user'
    ]),
    ...mapGetters('users', [
      'isInRoom',
      'isInGame'
    ])
  },
  watch: {},

  created () {},
  mounted () {
    this.getMe()
    this.listRooms()
  },
  updated () {
    if (this.isInGame) {
      router.push({
        name: 'Game',
        params: { gameId: this.user.gameId }
      })
    } else if (this.isInRoom) {
      router.push({
        name: 'Room',
        params: { roomId: this.user.roomId }
      })
    }
  },
  destroyed () {},

  methods: {
    async getMe () {
      this.me = await usersAPI.me('xCYZnHjSfm62W5Mg9XfPt2KCucwlfexXIwyqZNkDZ-8')
    },
    async listRooms () {
      this.rooms = await roomsAPI.listRooms()
    }
  }
}
</script>
