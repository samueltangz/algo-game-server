<template>
  <v-layout row wrap>
    <v-flex xs12>
      <h3 class="display-1">
        Game {{ gameId }}
      </h3>
    </v-flex>
    <v-flex
      xs12
      ref="game-container">
      <table style="border: 1px #000000 solid; border-collapse: collapse;">
        <tr>
          <th style="border: 1px #000000 solid;">
            User ID
          </th>
          <th style="border: 1px #000000 solid;">
            Score
          </th>
          <th style="border: 1px #000000 solid;">
            Cards
          </th>
          <th style="border: 1px #000000 solid;">
            Steps
          </th>
        </tr>
        <tr
          v-for="index in [0, 1, 2, 3]"
          :key="`pos-${index}`"
          style="border: 1px #000000 solid;">
          <td
            v-if="index < boardState.players.length"
            style="border: 1px #000000 solid;">
            {{ boardState.players[index] }}
          </td>
          <td
            v-if="index < boardState.players.length"
            style="border: 1px #000000 solid;">
            {{ boardState.scores[index] }}
          </td>
          <td
            v-if="index < boardState.players.length"
            style="border: 1px #000000 solid;">
            <div v-if="boardState.players[index] === user.id">
              <span
                v-for="(card, cardIndex) in boardState.hands[index]"
                :key="`card-${card.id}`">
                <span v-if="cardIndex > 0"> | </span>
                <span
                  :style="{
                    fontWeight: card.isPicked ? 'bold' : undefined,
                    textDecoration: card.isRevealed ? 'line-through' : undefined
                  }"
                  @click="preparePick(card)">
                  [#{{ card.id }} - {{ card.color === 'black' ? 'B' : 'W' }}{{ card.value }}]
                </span>
              </span>
            </div>
            <div v-else>
              <span
                v-for="(card, cardIndex) in boardState.hands[index]"
                :key="`card-${card.id}`">
                <span v-if="cardIndex > 0"> | </span>
                <span
                  :style="{
                    fontWeight: card.isPicked || isCurrentPickedId === card.id ? 'bold' : undefined,
                    textDecoration: card.isRevealed ? 'line-through' : undefined
                  }"
                  @click="prepareAttack(card)">
                  [#{{ card.id }} - {{ card.color === 'black' ? 'B' : 'W' }}{{ card.value === undefined ? '?' : card.value }}]
                </span>
              </span>
            </div>
          </td>
          <td
            v-if="index < boardState.players.length"
            style="border: 1px #000000 solid;">
            {{ boardState.metadata.currentTurn === index + 1 ? 'CURRENT' : '' }}
          </td>
        </tr>
      </table>
      {{ boardState.metadata }}
    </v-flex>
    <v-flex
      xs3>
      <v-text-field
        v-model="attackValue"
        label="Attack value" />
    </v-flex>
    <v-flex xs9>
      <v-btn
        :disabled="isCurrentPickedId === undefined || !(parseInt(attackValue, 10) >= 0 && parseInt(attackValue, 10) <= 11)"
        color="warning"
        flat
        @click="preattack">
        Attack
      </v-btn>
      <v-btn
        :disabled="boardState.metadata === undefined || boardState.metadata.attackCount === 0"
        color="warning"
        flat
        @click="keep">
        Keep
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

// import router from '@/router'
import gamesAPI from '@/api/games.js'

import Hand from '@/components/Game/Hand.vue'

export default {
  name: 'Game',
  components: {
    Hand
  },

  props: {
    gameId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    boardState: {
      players: []
    },
    isCurrentPickedId: undefined,
    attackValue: ''
  }),

  computed: {
    ...mapState('users', [
      'user',
      'authnToken'
    ]),
    ...mapState('games', [
      'boardStateUpdate'
    ]),
    ...mapGetters('users', [
      'isInRoom',
      'isInGame'
    ])
  },
  watch: {
    authnToken () {
      this.getBoardState()
    },
    boardStateUpdate () {
      this.boardState = this.$store.state.games.boardState
    }
  },

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {
    async getBoardState () {
      this.boardState = await gamesAPI.getBoardState(this.authnToken)
    },
    getCardsByRelativePosition (relativePosition) {
      // relative position (0 <= n < m) is a number that
      // the n-th turn after the current player
      // m is the number of players in the game
      const { user } = this
      const playerCount = this.boardState.players.length
      const currentPlayerIndex = this.boardState.players.findIndex(
        playerId => playerId === user.id
      )
      return this.boardState.hands[(currentPlayerIndex + relativePosition) % playerCount]
    },
    getScoreByRelativePosition (relativePosition) {
      const { user } = this
      const playerCount = this.boardState.players.length
      const currentPlayerIndex = this.boardState.players.findIndex(
        playerId => playerId === user.id
      )
      return this.boardState.scores[(currentPlayerIndex + relativePosition) % playerCount]
    },

    async attack (cardId, value) {
      await gamesAPI.attack(this.authnToken, cardId, value)
      await this.getBoardState()
    },
    async pick (cardId) {
      await gamesAPI.pick(this.authnToken, cardId)
      await this.getBoardState()
    },
    async keep () {
      await gamesAPI.keep(this.authnToken)
      await this.getBoardState()
    },

    // Technical debts
    parseSelfTemporary (cards) {
      return cards.map(card => {
        const color = card.color === 'black' ? 'B' : 'W'
        return `[#${card.id}]${color}${card.value}${card.isRevealed ? '!' : ''}${card.isPicked ? '*' : ''}`
      }).join(' ')
    },
    parseOthersTemporary (cards) {
      return cards.map(card => {
        const color = card.color === 'black' ? 'B' : 'W'
        const value = card.value === undefined ? '?' : card.value
        return `[#${card.id}]${color}${value}${card.isRevealed ? '!' : ''}${card.isPicked ? '*' : ''}`
      }).join(' ')
    },
    prepareAttack (card) {
      this.isCurrentPickedId = card.id
    },
    async preattack () {
      const attackValue = parseInt(this.attackValue, 10)
      if (attackValue >= 0 && attackValue <= 11) {
        await this.attack(this.isCurrentPickedId, attackValue)
        this.isCurrentPickedId = undefined
      } else {
        throw new Error('Invalid value')
      }
    },
    async preparePick (card) {
      await this.pick(card.id)
    }
  }
}
</script>
