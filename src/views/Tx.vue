<template>
  <div class="tx">
    <v-container>
      <Tx />
    </v-container>
  </div>
</template>

<script>
import Tx from '../components/tx/Tx'

// @ is an alias to /src
export default {
  name: 'Home',
  components: {
    // TableList,
    Tx
  }
}
</script>
