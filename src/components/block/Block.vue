<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="6">
        <h2 class="text-justify">Block: #{{ block.height }}</h2>
        <v-card>
          <v-card-title>Body</v-card-title>
          <v-card-text>
            <div v-for="(v, k) in block" :key="k">
              <v-list-item v-if="k!= 'txs'">
                <v-list-item-content>
                  <v-list-item-title>{{ k }}</v-list-item-title>
                  <v-chip-group v-if="typeof(v) != 'object'" ><v-chip label> {{v}}</v-chip></v-chip-group>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="6">
        <h2 class="text-justify">Txs</h2>
        <v-expansion-panels>
          <v-expansion-panel v-for="tx in txs" :key="tx.hash">
            <v-expansion-panel-header >
              <span>{{ tx.hash }}</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-for="(v, k) in tx" :key="k">
                <v-list-item v-if="k!= 'txs'">
                  <v-list-item-content outlined tile>
                    <v-list-item-title class="d-inline-block text-truncate">{{ k }}</v-list-item-title>
                    <v-chip-group v-if="typeof(v) != 'object'" ><v-chip label> {{v}}</v-chip></v-chip-group>
                    <v-chip-group v-if="typeof(v) == 'object'">
                        <v-chip label v-for="sub in v" :key="sub" > {{ sub }}</v-chip>
                    </v-chip-group>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Config from '@/config'

export default {
  data: () => {
    return {
      block: {},
      txs: []
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
    const block = res.data
    switch (block.network) {
      case 1:
        block.network = 'TESTNET'
        break
      case 2:
        block.network = 'MAINNET'
        break
    }
    block.txs.forEach(tx => {
      switch (tx.network) {
        case 1:
          tx.network = 'TESTNET'
          break
        case 2:
          tx.network = 'MAINNET'
          break
      }

      switch (tx.type) {
        case 1:
          tx.type = 'GenerateTx'
          break
        case 2:
          tx.type = 'RegisterTx'
          break
        case 3:
          tx.type = 'LogoutTx'
          break
        case 10:
          tx.type = 'TransactionTx'
          break
        case 20:
          tx.type = 'AssignTx'
          break
        case 21:
          tx.type = 'AppendTx'
          break
      }

      tx.fee = (tx.fee / 1000000) + ' NG'
      const values = []
      tx.values.forEach(v => {
        v = (v / 1000000) + ' NG'
        values.push(v)
      })
      tx.values = values
      this.txs.push(tx)
    })
    delete block.txs
    this.block = block
  }
}
</script>
