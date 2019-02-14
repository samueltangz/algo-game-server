<template>
  <div>
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
import roomsAPI from '@/api/rooms.js'

export default {
  name: 'Rooms',
  components: {
    Messages
  },

  props: {},
  data: () => ({
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
    this.listRooms()
  },
  updated () {
    this.updatePlayerRoomAndGame()
  },
  destroyed () {},

  methods: {
    async listRooms () {
      this.rooms = await roomsAPI.listRooms()
    },
    updatePlayerRoomAndGame () {
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
    }
  }
}
</script>
