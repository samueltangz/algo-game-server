<template>
  <div>
    You are in room #{{ roomId }}
    {{ isInRoom }}
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import router from '@/router'

export default {
  name: 'Rooms',
  components: {},

  props: {
    roomId: {
      type: Number,
      required: true
    }
  },
  data: () => ({}),

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
  mounted () {},
  updated () {
    if (this.isInGame) {
      router.push({
        name: 'Game',
        params: { gameId: this.user.gameId }
      })
    } else if (!this.isInRoom) {
      router.push({
        name: 'Rooms'
      })
    } else if (this.roomId !== this.user.roomId) {
      router.push({
        name: 'Room',
        params: { roomId: this.user.roomId }
      })
    }
  },
  destroyed () {},

  methods: {}
}
</script>
