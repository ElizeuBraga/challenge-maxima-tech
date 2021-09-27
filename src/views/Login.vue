<template>
  <div>
    <center>
      <b-card title="Login" style="max-width: 30rem; border-color: green" class="mb-2">
        <b-card-text>
          <b-form-group id="fieldset-1" label="Usuário" label-for="input-1" :invalid-feedback="invalidFeedbackUser">
            <b-form-input id="input-1" v-model="user" :state="stateUser" trim></b-form-input>
          </b-form-group>

          <b-form-group id="fieldset-2" label="Senha" label-for="input-2" :invalid-feedback="invalidFeedbackPassword">
            <b-form-input id="input-2" v-model="password" :state="statePassword" trim type="password"></b-form-input>
          </b-form-group>
        </b-card-text>

        <b-button style="background-color: #28a745!important" :disabled="(!stateUser || !statePassword)" @click="login()" variant="primary">Entrar</b-button>
      </b-card>
    </center>
  </div>
</template>

<script>
/* eslint-disable no-useless-return */
import axios from 'axios'
import Swal from 'sweetalert2'
export default {
  name: 'login',
  data () {
    return {
      user: '',
      password: ''
    }
  },
  mounted () {
    console.log('Login montado')
  },
  methods: {
    checkEmail () {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(this.user).toLowerCase())
    },
    login () {
      axios.post(process.env.NODE_APP_HOST + 'api/auth/login', {email: this.user, password: this.password}).then((response) => {
        if (response.data.icon) {
          Swal.fire({
            text: response.data.text,
            icon: response.data.icon
          })
        }

        if (response.data.email && response.data.email !== '') {
          localStorage.removeItem('user')
          localStorage.setItem('user', JSON.stringify(response.data))
          this.$router.push('/conta')
        }
      }).catch((error) => {
        if (!error.response) {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Não foi possivel contatar API'
          })
        }
      })
    }
  },
  computed: {
    stateUser () {
      if (this.user.length > 0) {
        return this.checkEmail()
      }
    },
    statePassword () {
      if (this.password.length >= 4) {
        return true
      } else if (this.password.length > 0 && this.password.length < 4) {
        return false
      }
    },
    invalidFeedbackUser () {
      if (!this.checkEmail()) {
        return 'Digite um e-mail válido'
      }
    },
    invalidFeedbackPassword () {
      if (this.password.length < 4) {
        return 'Senha deve conter no mínimo 4 caracteres'
      }
    }
  }
}
</script>

<style>

</style>
