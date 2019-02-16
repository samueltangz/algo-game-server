<template>
  <v-toolbar
    app
    fixed>
    <v-toolbar-title>Algo Game</v-toolbar-title>
    <v-spacer />
    <v-menu
      v-if="isLoggedIn"
      offset-y>
      <v-btn
        icon
        slot="activator">
        <v-icon>more_vert</v-icon>
      </v-btn>
      <v-list densed>
        <v-subheader>
          {{ user.username }}
        </v-subheader>
        <v-list-tile @click="logout">
          <v-list-tile-action>
            <v-icon>directions_run</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-menu
      v-else
      offset-y>
      <v-btn
        icon
        slot="activator">
        <v-icon>more_vert</v-icon>
      </v-btn>
      <v-list densed>
        <v-list-tile
          router
          to="/register">
          <v-list-tile-action>
            <v-icon>person_add</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Register</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          router
          to="/login">
          <v-list-tile-action>
            <v-icon>vpn_key</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Login</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
export default {
  name: 'NavigationBar',
  components: {},

  props: {},

  data: () => ({}),

  computed: {},

  watch: {},

  created () {},
  mounted () {},
  updated () {},
  destroyed () {},

  methods: {}
}
</script>
