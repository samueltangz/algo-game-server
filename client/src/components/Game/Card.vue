<template>
  <v-layer :config="configLayer">
    <v-rect :config="configCard" />
    <v-text :config="configCardText" />
  </v-layer>
</template>

<script>
export default {
  name: 'Card',
  components: {},

  props: {
    card: {
      type: Object,
      required: true
    },
    position: {
      type: Object,
      required: true
    }
  },
  data: () => ({}),

  computed: {
    configLayer () {
      return this.position
    },
    configCard () {
      return {
        x: 0,
        y: this.card.isPicked ? -50 : 0,
        height: 147,
        width: 105,
        fill: this.card.color
      }
    },
    configCardText () {
      return {
        x: 0,
        y: this.card.isPicked ? -10 : 40,
        fontSize: 67,
        width: 105,
        text: this.card.value.toString(),
        fill: this.card.color === 'black' ? 'white' : 'black',
        align: 'center'
      }
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
