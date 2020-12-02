<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="8" offset-lg="2">
        <h2 class="text-justify">Block: #{{ block.height }}</h2>
        <v-card>
          <v-card-title>Body</v-card-title>
          <v-card-text>
            <div v-for="(v, k) in block" :key="k">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ k }}</v-list-item-title>
                  <v-chip-group column v-if="typeof(v) != 'object'" ><v-chip label> {{v}}</v-chip></v-chip-group>
                  <div v-if="k=='txs'"> <v-chip-group column v-for="(tx) in v" :key="tx"> <v-chip label class="hash" :to="{ path: '/tx/'+tx }"> {{tx}}</v-chip></v-chip-group></div>
                </v-list-item-content>
              </v-list-item>
            </div>
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
      block: {}
    }
  },
  async mounted () {
    let res
    if (this.$route.params.hashOrHeight) {
      res = await this.axios.get(
        Config.backendAddr + '/block/' + this.$route.params.hashOrHeight
      )
    }

    const block = res.data
    switch (block.network) {
      case 1:
        block.network = 'TESTNET'
        break
      case 2:
        block.network = 'MAINNET'
        break
    }

    this.block = block
    console.log(block)
  }
}
</script>
