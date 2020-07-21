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
        this.router.push('/item/' + this.searchText)
      }
    }
  }
}
</script>
