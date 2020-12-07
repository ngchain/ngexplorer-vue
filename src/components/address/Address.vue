<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="8" offset-lg="2">
        <h2 class="d-inline-block text-truncate">Address: #{{ this.$route.params.addr }}</h2>
        <v-card>
          <v-card-title>Body</v-card-title>
          <v-card-text>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Balance</v-list-item-title>
                  <v-chip-group ><v-chip label> {{ balance }}</v-chip></v-chip-group>
                </v-list-item-content>
              </v-list-item>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Config from '@/config'

export default {
  data: () => {
    return {
      address: '',
      balance: 0
    }
  },
  async mounted () {
    let res
    if (this.$route.params.addr) {
      res = await this.axios.get(
        Config.backendAddr + '/address/' + this.$route.params.addr
      )
    }

    this.address = this.$route.params.addr
    this.balance = res.data / 1_000_000_000_000_000_000 + ' NG'
  }
}
</script>
