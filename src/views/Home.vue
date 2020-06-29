<template>
  <div class="home">
    <Dashboard />
    <!-- <TableList /> -->
    <v-container>
      <Blocks />
    </v-container>
  </div>
</template>

<script>
import Dashboard from '../components/dashboard/Dashboard'
import Blocks from '../components/dashboard/Blocks'

// @ is an alias to /src
export default {
  name: 'Home',
  components: {
    // TableList,
    Blocks,
    Dashboard
  }
}
</script>
