<template>
  <v-item-group>
    <v-container>
      <v-row>
        <v-col v-for="n in items" :key="n.name" cols="12" md="4">
          <v-item>
            <v-container>
              <v-card>
                <v-card-title>
                  <v-icon large left color="primary" > {{ n.icon }} </v-icon>
                  <span class="title font-weight-light">{{ n.name }}</span>
                </v-card-title>
                <v-card-text class="headline font-weight-bold">{{n.value}}</v-card-text>
              </v-card>
            </v-container>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>

<script>
import Config from '@/config'
import { formatHashrates } from '@/utils/converter'

export default {
  name: 'Dashboard',
  data: () => {
    return {
      items: {
        network: {
          icon: 'mdi-wan',
          name: 'Network',
          value: 'Unknown'
        },
        hashrate: {
          icon: 'mdi-speedometer',
          name: 'Hashrate',
          value: '0 h/s'
        },
        difficulty: {
          icon: 'mdi-message-alert',
          name: 'Difficulty',
          value: 0
        },
        peers: {
          icon: 'mdi-account-group',
          name: 'Peers',
          value: 0
        },
        price: {
          icon: 'mdi-cash',
          name: 'Price',
          value: '∞'
        },
        height: {
          icon: 'mdi-image-filter-hdr',
          name: 'Height',
          value: 0
        }
      }
    }
  },
  async mounted () {
    const res = await this.axios.get(Config.backendAddr + '/dashboard')
    this.items.network.value = res.data.network
    this.items.hashrate.value = formatHashrates(res.data.hashrate)
    this.items.difficulty.value = res.data.difficulty
    this.items.peers.value = res.data.peers.length
    this.items.height.value = res.data.height
  }
}
</script>
