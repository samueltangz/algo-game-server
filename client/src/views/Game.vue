<template>
  <v-layout row wrap>
    <v-flex xs12>
      <h3 class="display-1">
        Game {{ gameId }}
      </h3>
    </v-flex>
    <v-flex>
      ...
    </v-flex>
  </v-layout>
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

  methods: {}
}
</script>
