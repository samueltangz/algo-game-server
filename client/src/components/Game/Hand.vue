<template>
  <div>
    <card
      v-for="(card, index) in cards"
      :key="`card-${card.id}`"
      :card="card"
      :position="{
        x: 400 + (index - cards.length / 2) * 109,
        y: 0
      }"/>
  </div>
</template>

<script>
import Card from '@/components/Game/Card.vue'

export default {
  name: 'Hand',
  components: {
    Card
  },

  props: {
    cards: {
      type: Array,
      required: true
    },
    position: {
      type: String,
      default: 'south',
      validator: function (value) {
        return ['north', 'east', 'south', 'west'].includes(value)
      }
    }
  },
  data: () => ({}),

  computed: {
    configLayer () {
      return {}
    }
  },
  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {}
}
</script>
