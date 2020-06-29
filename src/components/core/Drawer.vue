<template>
  <v-navigation-drawer app permanent clipped fixed>
    <v-list>
      <v-list-item v-for="item in items" :key="item.title" link>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    items: [
      { title: 'Dashboard', icon: 'mdi-home-city' },
      { title: 'Blocks', icon: 'mdi-account' },
      { title: 'Accounts', icon: 'mdi-account-group-outline' }
    ]
  })
}
</script>
