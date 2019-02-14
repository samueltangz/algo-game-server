<template>
  <div>
    You are in game #{{ gameId }} / {{ isInGame }}, {{ isInRoom }}
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import router from '@/router'

export default {
  name: 'Game',
  components: {},

  props: {
    gameId: {
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
    if (!this.isInGame && !this.isInRoom) {
      router.push({
        name: 'Rooms'
      })
    } else if (!this.isInGame && this.isInRoom) {
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
