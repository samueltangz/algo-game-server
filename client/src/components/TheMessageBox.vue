<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>
        <v-icon class="mr-1">
          chat
        </v-icon>
        Messages
      </v-toolbar-title>
    </v-toolbar>
    <div
      class="scroll-y"
      style="height: calc(100vh - 220px);">
      <v-list
      two-line
        style="min-height: calc(100vh - 220px);">
        <template
          v-for="(message, index) in messages">
          <v-divider
            v-if="index > 0"
            :key="`divider-${index}`"/>
          <v-list-tile
            :key="`message-${index}`">
            <v-list-tile-avatar>
              <img src="https://avatars0.githubusercontent.com/u/10565444?s=460&v=4">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ message.type }} {{ message.timestamp }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ message.content }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/store'

export default {
  name: 'MessageBox',
  components: {},

  props: {},
  data: () => ({
    messages: []
  }),

  computed: {
    ...mapState('messages', [ 'pendingMessages' ])
  },
  watch: {
    pendingMessages () {
      const { pendingMessages } = this
      if (pendingMessages.length === 0) return
      this.messages.push(pendingMessages[0])
      store.commit('messages/pop')
    }
  },

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {}
}
</script>
