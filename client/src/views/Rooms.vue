<template>
  <v-layout row wrap>
    <v-flex xs4>
      <h3 class="display-1">
        Room Lobby
      </h3>
    </v-flex>
    <v-flex
      xs8
      text-xs-right>
      <v-btn
        flat
        color="primary"
        @click="createRoom">
        Create room
      </v-btn>
    </v-flex>
    <v-flex
      v-for="room in rooms.rooms"
      :key="room.id"
      xs3
      px-2
      py-2>
      <v-card>
        <v-card-title>
          <div>
            <h3 class="headline">
              Room #{{ room.id }}
              <v-chip v-if="room.status === 'waiting'">
                Waiting
              </v-chip>
              <v-chip v-else-if="room.status === 'prepare'">
                Prepare
              </v-chip>
              <v-chip v-else>
                Playing
              </v-chip>
            </h3>
          </div>
        </v-card-title>
        <v-card-text>
          {{ room }}
          <v-flex text-xs-center>
            <v-avatar
              v-for="index in [0, 1, 2, 3]"
              :key="index"
              :color="index < room.userCount ? 'green lighten-4' : 'grey lighten-4'"
              class="mx-2">
              <v-icon large>account_circle</v-icon>
            </v-avatar>
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :disabled="room.status !== 'waiting' || room.userCount === 4"
            block
            flat
            color="orange"
            @click="joinRoom(room['id'])">
            Join room
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import router from '@/router'
import roomsAPI from '@/api/rooms.js'

export default {
  name: 'Rooms',
  components: {},

  props: {},
  data: () => ({
    rooms: {}
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
  mounted () {
    this.listRooms()
  },
  updated () {},
  destroyed () {},

  methods: {
    async listRooms () {
      this.rooms = await roomsAPI.listRooms()
    },
    async createRoom () {
      const room = await roomsAPI.createRoom(this.authnToken)
      router.push({
        name: 'Room',
        params: {
          roomId: room.room['id']
        }
      })
    },
    async joinRoom (roomId) {
      await roomsAPI.joinRoom(this.authnToken, roomId)
      router.push({
        name: 'Room',
        params: {
          roomId: roomId
        }
      })
    }
  }
}
</script>
