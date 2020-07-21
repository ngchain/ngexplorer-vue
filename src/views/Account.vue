<template>
  <div class="account">
    <v-container>
      <Account />
    </v-container>
  </div>
</template>

<script>
import Account from '../components/account/Account'

// @ is an alias to /src
export default {
  name: 'Home',
  components: {
    Account
  }
}
</script>
