<template>
  <v-app-bar app clipped-left>
    <div class="d-flex align-center">
      <router-link :to="{ path: '/'}">
        <v-img
          alt="NGIN Logo"
          class="shrink mr-2"
          contain
          :src="require('@/assets/NG.svg')"
          transition="scale-transition"
          width="40"
        />
      </router-link>
    </div>
    <div class="d-flex align-center">
      <h1>Explorer</h1>
    </div>

    <v-spacer></v-spacer>

    <v-text-field
      prepend-icon="mdi-magnify"
      v-model="searchText"
      solo
      append-icon="mdi-arrow-right"
      hide-details
      single-line
      v-on:keyup="search"
    ></v-text-field>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppBar',

  components: {},

  data: () => ({
    searchText: null
  }),
  methods: {
    search: function (e) {
      if (e.keyCode === 13) {
        if (this.searchText.length === 64) {
          this.router.push('/block/' + this.searchText)
        } if (this.searchText.length === 65) {
          this.router.push('/block/' + this.searchText.substr(1))
        } else if (this.searchText.length === 66) {
          this.router.push('/tx/' + this.searchText.substr(2))
        } else if (this.searchText.length === 48) {
          this.router.push('/address/' + this.searchText)
        } else if (this.searchText === 'help') {
          this.$root.$confirm('help', 'Gotcha!')
        } else {
          if (this.searchText[0] === 'b') {
            if (isNaN(parseInt(this.searchText.substr(1)))) {
              this.$root.$confirm('Invalid input', 'You can try searching "help" to get some examples', { color: 'red' })
            } else {
              this.router.push('/block/' + this.searchText.substr(1))
            }
          } else if (this.searchText[0] === 'a') {
            if (isNaN(parseInt(this.searchText.substr(1)))) {
              this.$root.$confirm('Invalid input', 'You can try searching "help" to get some examples', { color: 'red' })
            } else {
              this.router.push('/account/' + this.searchText.substr(1))
            }
          } else {
            this.$root.$confirm('Invalid input', 'You can try searching "help" to get some examples', { color: 'red' })
          }
        }
      }
    }
  }
}
</script>
