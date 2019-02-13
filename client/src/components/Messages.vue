<template>
  <div>
    <xmp>{{ messages }}</xmp>
    <hr>
    <xmp>{{ pendingMessages }}</xmp>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/store'

export default {
  name: 'Rooms',
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
