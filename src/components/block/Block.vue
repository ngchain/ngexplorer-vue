<template>
  <v-sheet>
    <v-row>
      <v-col cols="12" md="6">
        <h2 class="text-justify">Block: #{{ block.height }}</h2>
        <v-card>
          <v-card-title>Body</v-card-title>
          <v-card-text>
            <div v-for="(v, k) in block" :key="k">
              <v-list-item v-if="k!= 'txs'">
                <v-list-item-content>
                  <v-list-item-title>{{ k }}</v-list-item-title>
                  <v-list-item-subtitle>{{ v }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <h2 class="text-justify">Txs</h2>
        <v-expansion-panels>
          <v-expansion-panel v-for="tx in block.txs" :key="tx.hash">
            <v-expansion-panel-header>{{ tx.hash}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-for="(v, k) in tx" :key="k">
                <v-list-item v-if="k!= 'txs'">
                  <v-list-item-content>
                    <v-list-item-title>{{ k }}</v-list-item-title>
                    <v-list-item-subtitle v-if="typeof(v) != 'object'">{{ v }}</v-list-item-subtitle>
                    <v-chip-group v-if="typeof(v) == 'object'">
                        <v-chip v-for="sub in v" :key="sub" > {{ sub }}</v-chip>
                    </v-chip-group>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-sheet>
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

    if (this.$route.params.txHash) {
      res = await this.axios.get(
        Config.backendAddr + '/tx/' + this.$route.params.txHash + '/block'
      )
      res = await this.axios.get(
        Config.backendAddr + '/block/' + res.data
      )
    }

    this.block = res.data
  }
}
</script>
