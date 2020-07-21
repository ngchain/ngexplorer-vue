<template>
  <div class="account">
    <v-container>
      <Address />
    </v-container>
  </div>
</template>

<script>
import Address from '../components/address/Address'

// @ is an alias to /src
export default {
  name: 'Home',
  components: {
    Address
  }
}
</script>
