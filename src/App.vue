<template>
  <div id="app">
    <header>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand @click="goToRoute('/')" href="#">Carteira digital</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav v-if="!user">
            <b-nav-item :active="isRouteRegister" href="/register">Cadastre-se</b-nav-item>
            <b-nav-item :active="isRouteLogin" href="/login">Login</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav v-if="user" class="ml-auto">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>{{user.name}}</em>
              </template>
              <b-dropdown-item href="/logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>
    <main>
      <img v-if="currentRoute == '/'" src="https://play-lh.googleusercontent.com/94p0FnTL8n0GbiVeiRhWA4F7bA6jMOllJFfldKluIXjMQkZVtJRBrBBUQaG9w3KXcQ" alt="Vue.js PWA">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import emmiter from './services/emmiter'
import router from './router'

export default {
  name: 'app',
  data () {
    return {
      currentRoute: router.currentRoute.path,
      user: false,
      isloaded: false
    }
  },
  mounted () {
    console.log(process.env)
    emmiter.on('logged', () => {
      this.user = JSON.parse(localStorage.getItem('user'))
      this.currentRoute = router.currentRoute.path
    })

    this.isloaded = true
  },
  methods: {
    goToRoute (path) {
      this.currentRoute = path
      this.$router.push(path)
    }
  },

  computed: {
    isRouteRegister () {
      return this.currentRoute === '/register'
    },
    isRouteLogin () {
      return this.currentRoute === '/login'
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
  margin-top: 15px;
}

.bg-info {
    background-color: #28a745!important;
}

/* header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #008000c9;
  color: #ffffff;
} */

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

.btn-primary, .disabled {
    color: white;
    background-color: #80148e!important;
    border: none;
}

.btn-primary:hover {
    color: white;
    background-color: #4d148e;
}
</style>
