<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="8" offset-lg="2">
        <h2 class="text-justify">Account: #{{ account.num }}</h2>
        <v-card>
          <v-card-title>Body</v-card-title>
          <v-card-text>
            <div v-for="(v, k) in account" :key="k">
              <v-list-item>
                <v-list-item-content v-if="k=='owner'">
                  <v-list-item-title>{{ k }}</v-list-item-title>
                  <v-chip-group v-if="typeof(v) != 'object'" ><v-chip label :to="{ path: '/address/'+v }"> {{v}}</v-chip></v-chip-group>
                </v-list-item-content>
                <v-list-item-content v-if="k!='owner'">
                  <v-list-item-title>{{ k }}</v-list-item-title>
                  <v-chip-group v-if="typeof(v) != 'object'" ><v-chip label> {{v}}</v-chip></v-chip-group>
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
      account: {}
    }
  },
  async mounted () {
    let res
    if (this.$route.params.num) {
      res = await this.axios.get(
        Config.backendAddr + '/account/' + this.$route.params.num
      )
    }

    const account = res.data

    this.account = account
    console.log(account)
  }
}
</script>
