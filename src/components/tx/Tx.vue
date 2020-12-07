<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="8" offset-lg="2">
        <h4>Tx#{{ tx.hash }}</h4>
        <v-card>
          <v-card-title>Body</v-card-title>
          <v-card-text>
            <div v-for="(v, k) in tx" :key="k">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ k }}</v-list-item-title>
                  <v-chip-group column v-if="typeof(v) == 'number'">
                    <v-chip label :to="{ path: '/account/'+v }">{{v}}</v-chip>
                  </v-chip-group>
                  <v-chip-group column v-if="typeof(v) == 'string'">
                    <v-chip label>{{v}}</v-chip>
                  </v-chip-group>
                  <div v-if="typeof(v) == 'object'">
                    <v-chip-group column v-for="(vv) in v" :key="vv">
                      <v-chip label v-if="k == 'participants'" class="hash" :to="{ path: '/address/'+ vv }">{{vv}}</v-chip>
                      <v-chip label v-if="k != 'participants'">{{vv}}</v-chip>
                    </v-chip-group>
                  </div>
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
      tx: {}
    }
  },
  async mounted() {
    let res
    if (this.$route.params.txHash) {
      res = await this.axios.get(
        Config.backendAddr + '/tx/' + this.$route.params.txHash
      )
    }

    const tx = res.data
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
    tx.fee = tx.fee / 1_000_000_000_000_000_000 + ' NG'
    const values = []
    tx.values.forEach(v => {
      v = v / 1_000_000_000_000_000_000 + ' NG'
      values.push(v)
    })
    tx.values = values

    this.tx = tx
    console.log(tx)
  }
}
</script>
