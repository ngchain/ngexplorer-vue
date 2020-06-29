<template>
  <div class="block">
    <v-container>
      <Block />
    </v-container>
  </div>
</template>

<script>
import Block from '../components/block/Block'

// @ is an alias to /src
export default {
  name: 'Home',
  components: {
    // TableList,
    Block
  }
}
</script>
