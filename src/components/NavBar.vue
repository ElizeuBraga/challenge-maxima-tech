<template>
    <header>
      <b-row>
        <b-col><span>Digital Wallet</span></b-col>
        <b-col><button v-if="currentRoute != '/login'" @click="goToLogin()" style="float:right; margin-top: 9px" class="btn btn-primary">Login</button></b-col>
      </b-row>
    </header>
</template>

<script>
import router from '../router'
export default {
  data () {
    return {
      currentRoute: router.currentRoute.path
    }
  },
  mounted () {
    this.currentRoute = router.currentRoute.path
  },
  methods: {
    goToLogin () {
      router.push('/login')
      this.currentRoute = router.currentRoute.path
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
</style>
