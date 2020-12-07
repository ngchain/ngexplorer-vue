<template>
  <v-app>
    <AppBar />

    <v-main>
      <router-view></router-view>
    </v-main>
    <Confirm ref="confirm"></Confirm>
  </v-app>
</template>

<script>
import AppBar from './components/core/AppBar'
import Confirm from './components/core/Confirm'

export default {
  name: 'App',

  components: {
    AppBar, Confirm
  },

  data: () => ({}),
  mounted() {
    this.$root.$confirm = this.$refs.confirm.open
  }
}
</script>
