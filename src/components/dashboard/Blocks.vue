<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <v-card>
          <v-data-table :headers="headers" :items="items" class="elevation-1">
            <template v-slot:item="{item}">
              <tr>
                <td>
                  <v-chip color="primary" :to="{ path: '/block/'+item.height}">{{ item.height }}</v-chip>
                </td>
                <td>{{ timestampReadable(item.timestamp) }}</td>
                <td>
                  <v-chip label :to="{ path: '/block/'+item.hash}"> {{ item.hash }}</v-chip>
                </td>
                <td class="text-xs-right">{{ item.txn }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { timestampReadable } from '@/utils/converter'
import Config from '@/config'

export default {
  data: () => ({
    timer: null,
    headers: [
      {
        sortable: false,
        text: 'Height',
        value: 'height'
      },
      {
        sortable: false,
        text: 'Time',
        value: 'timestamp'
      },
      {
        sortable: false,
        text: 'Hash',
        value: 'hash'
      },
      {
        sortable: false,
        text: 'Txn',
        value: 'txn'
      }
    ],
    items: []
  }),
  async created () {
    this.timer = setInterval(this.update, 10000)
  },
  async mounted () {
    this.update()
  },
  methods: {
    timestampReadable: timestampReadable,
    async update() {
      const res = await this.axios.get(Config.backendAddr + '/blocks')
      this.items = res.data
      // await Promise.all(
      //   this.items.map(async item => {
      //     item.timestamp = timestampReadable(item.timestamp)
      //   })
      // )
    }
  }
}
</script>
