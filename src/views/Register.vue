<template>
  <div>
    <center>
      <b-card title="Novo usuario" style="max-width: 30rem; border-color: green" class="mb-2">
        <b-card-text>
          <b-form-group id="fieldset-name" label="Informe seu nome" label-for="name">
            <b-form-input id="name" v-model="name" trim></b-form-input>
          </b-form-group>

          <b-form-group id="fieldset-email" label="E-mail" label-for="email" :invalid-feedback="invalidFeedbackEmail">
            <b-form-input id="email" v-model="email" :state="stateEmail" trim></b-form-input>
          </b-form-group>

          <b-form-group id="fieldset-emailConfirm" label="Confirme o e-mail" label-for="emailConfirm" :invalid-feedback="invalidFeedbackEmailConfirm">
            <b-form-input id="emailConfirm" v-model="emailConfirm" :state="stateEmailConfirm" trim></b-form-input>
          </b-form-group>

          <b-form-group id="fieldset-3" label="Senha" label-for="password" :invalid-feedback="invalidFeedbackPassword">
            <b-form-input id="password" v-model="password" trim type="password" max="4" :state="statePassword"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="fieldset-passwordConfirm" label="Confirme a senha" label-for="passwordConfirm" :invalid-feedback="invalidFeedbackPasswordConfirm">
            <b-form-input id="passwordConfirm" v-model="passwordConfirm" trim type="password" :max="4" :state="statePasswordConfirm"
            ></b-form-input>
          </b-form-group>
        </b-card-text>

        <b-button style="background-color: #28a745!important" :disabled="disableButton" @click="register()" variant="primary">Cadastrar</b-button>
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
      name: '',
      email: '',
      emailConfirm: '',
      password: '',
      passwordConfirm: ''
    }
  },
  mounted () {
    console.log('Register')
  },
  methods: {
    checkEmail () {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(this.email).toLowerCase())
    },
    register () {
      axios.post(process.env.NODE_APP_HOST + 'api/auth/register', {name: this.name, email: this.email, password: this.password}).then((response) => {
        if (response.data.email && response.data.email !== '') {
          localStorage.removeItem('user')
          localStorage.setItem('user', JSON.stringify(response.data))
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Cadastro realizado com sucesso!',
            confirmButtonColor: 'green'
          }).then(() => {
            this.$router.push({ name: 'Conta', params: { user: response.data } })
          })
        } else {
          Swal.fire({
            icon: response.data.icon,
            title: 'Erro!',
            text: response.data.text,
            confirmButtonColor: 'green'
          })
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
    },

    clearForm () {
      this.name = ''
      this.email = ''
      this.emailConfirm = ''
      this.password = ''
      this.passwordConfirm = ''
    }
  },
  computed: {
    stateEmail () {
      if (this.email.length > 0) {
        if (this.checkEmail()) {
          return true
        }

        return false
      }
    },

    invalidFeedbackEmail () {
      if (!this.checkEmail()) {
        return 'Digite um e-mail válido'
      }
    },

    stateEmailConfirm () {
      if (this.emailConfirm.length > 0) {
        if (this.checkEmail() && this.email === this.emailConfirm) {
          return true
        }
        return false
      }
    },

    invalidFeedbackEmailConfirm () {
      if (!this.checkEmail()) {
        return 'Digite um e-mail válido'
      }
      if (this.email !== this.emailConfirm) {
        return 'E-mails não conferem'
      }
    },

    invalidFeedbackPassword () {
      if ((this.password.length < 4 || this.password.length > 4) && this.password.length > 0) {
        return 'Senha deve conter 4 caracteres'
      }
    },

    statePassword () {
      if (this.password.length > 0) {
        if (this.password.length === 4) {
          return true
        } else {
          return false
        }
      }
    },

    invalidFeedbackPasswordConfirm () {
      if (this.passwordConfirm.length < 4 && this.passwordConfirm.length > 0) {
        return 'Senha deve conter 4 caracteres'
      } else if (this.passwordConfirm !== this.password) {
        return 'Senhas não conferem'
      }
    },

    statePasswordConfirm () {
      if (this.passwordConfirm.length > 0) {
        if (this.passwordConfirm.length === 4 && this.passwordConfirm === this.password) {
          return true
        } else {
          return false
        }
      }
    },

    disableButton () {
      return (!this.stateEmail || !this.stateEmailConfirm || !this.statePassword || !this.statePasswordConfirm)
    }
  }
}
</script>

<style>

</style>
