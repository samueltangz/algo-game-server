<template>
  <v-layout row wrap>
    <v-flex xs4>
      <h3 class="display-1">
        Room {{ roomId }}
      </h3>
    </v-flex>
    <v-flex
      xs8
      text-xs-right>
      <v-btn
        :disabled="isReady"
        flat
        color="warning"
        @click="leaveRoom">
        Leave room
      </v-btn>
      <v-btn
        v-if="!isReady"
        color="success"
        @click="ready">
        Ready
      </v-btn>
      <v-btn
        v-else
        color="error"
        @click="unready">
        Unready
      </v-btn>
    </v-flex>
    <!-- TODO: Un-hardcode -->
    <v-flex
      v-for="index in [0, 1, 2]"
      :key="`player-${index}`"
      xs3
      px-2
      py-2>
      <v-card>
        <v-img
          src="https://avatars0.githubusercontent.com/u/10565444?s=460&v=4"
          aspect-ratio="1" />
        <v-card-title>
          <div>
            <h3 class="headline">
              Samuel
              <v-chip
                v-if="Math.random() < 0.5"
                color="success">
                Ready
              </v-chip>
              <v-chip
                v-else
                color="error">
                Not ready
              </v-chip>
            </h3>
            <div>Rating: 1500</div>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
    <v-flex
      xs3
      px-2
      py-2>
      <v-card>
        <v-img
          src="https://www.chymfm.com/wp-content/uploads/sites/8/2016/04/question-mark-face.jpg"
          aspect-ratio="0.77" />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import router from '@/router'
import roomsAPI from '@/api/rooms.js'

export default {
  name: 'Room',
  components: {},

  props: {
    roomId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    isReady: false
  }),

  computed: {
    ...mapState('users', [
      'user',
      'authnToken'
    ]),
    ...mapGetters('users', [
      'isInRoom',
      'isInGame'
    ])
  },
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    async leaveRoom () {
      await roomsAPI.leaveRoom(this.authnToken)
      router.push({
        name: 'Rooms'
      })
    },
    async ready () {
      await roomsAPI.readyRoom(this.authnToken)
      this.isReady = true
    },
    async unready () {
      await roomsAPI.unreadyRoom(this.authnToken)
      this.isReady = false
    }
  }
}
</script>
