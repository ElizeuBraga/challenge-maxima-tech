<template>
  <div>
    <center>
      <b-row>
        <b-col sm="12" md="6" lg="6">
          <b-card title="Última transação" class="mb-1 h-100">
            <b-card-text>
              <span v-if="!data.movements.lastSent" class="font-italic">Nenhuma transação efetuada</span>
              <span v-else><b>{{data.movements.lastSent.value_transferred}}</b> enviados para <b>{{data.movements.lastSent.name}}</b></span>
            </b-card-text>
          </b-card>
        </b-col>
        <b-col sm="12" md="6" lg="6">
          <b-card title="Saldo" class="mb-1 h-100">
            <b-card-text>
              {{formatMoney(data.balance)}}<br><br>
              <b-button variant="success" @click="transfer">Trasferir</b-button>
            </b-card-text>
          </b-card>
        </b-col>
        <b-col sm="12" md="6" lg="6">
          <b-card title="Valores enviados" style="color:red" class="mb-1 h-100">
            <b-card-text>
              <b-table striped hover :items="data.movements.sent" :fields="fields" show-empty>
                <template #empty="scope">
                    <center><tr class="text-danger font-italic">Nada por aqui</tr></center>
                </template>
              </b-table>
            </b-card-text>
          </b-card>
        </b-col>
        <b-col sm="12" md="6" lg="6">
          <b-card title="Valores recebidos" style="color:green" class="mb-1">
            <b-card-text>
              <b-table striped hover :items="data.movements.received" :fields="fields" show-empty>
                <template #empty="scope">
                    <center><tr class="text-danger font-italic">Nada por aqui</tr></center>
                </template>
              </b-table>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </center>
  </div>
</template>

<script>
/* eslint-disable no-useless-return */
import axios from 'axios'
import Swal from 'sweetalert2'
import emmiter from '../services/emmiter'
export default {
  name: 'conta',
  data () {
    return {
      user: JSON.parse(localStorage.getItem('user')),
      data: {
        balance: 0,
        movements: []
      },
      fields: [
        {
          key: 'name',
          sortable: true,
          label: 'Nome'
        },
        {
          key: 'value_transferred',
          sortable: true,
          label: 'Valor'
        },
        {
          key: 'date_transaction',
          label: 'Data',
          sortable: true
          // Variant applies to the whole column, including the header and footer
          // variant: 'danger'
        }
      ]
    }
  },
  async mounted () {
    axios.defaults.headers.common = {'Authorization': `bearer ${this.user.token}`}
    setTimeout(() => {
      emmiter.emit('logged', true)
    }, 200)
    await this.loadDataAcount()
  },
  methods: {
    checkEmail () {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(this.user).toLowerCase())
    },
    login () {
      alert('Login')
    },

    async transfer () {
      Swal.fire({
        title: 'Transferir',
        html:
          '<form autocomplete="off">' +
          '<input autocomplete="off" name="hidden" type="text" style="display:none;">' +
          '<input autocomplete="off" id="swal-input1" name="swal-input1" placeholder="Email do destinatário" class="swal2-input">' +
          '<input autocomplete="new-email" id="swal-input2" type="number" name="swal-input2" placeholder="Valor para transferência" class="swal2-input">' +
          '<input autocomplete="new-password" id="swal-input3" type="password" name="swal-input3" placeholder="Senha" class="swal2-input">' +
          '</form>',
        focusConfirm: false,
        confirmButtonText: 'Confirmar',
        confirmButtonColor: 'green',
        preConfirm: async () => {
          const input1 = document.getElementById('swal-input1').value
          const input2 = document.getElementById('swal-input2').value
          const input3 = document.getElementById('swal-input3').value

          if (input1 === '' || input2 === '' || input3 === '') {
            Swal.showValidationMessage('Preencha os campos para realizar a transferência')
            return
          }

          if (this.user.email === input1) {
            Swal.showValidationMessage('Não é possível tranferir para você mesmo')
            return
          }

          let response2 = false
          await axios.post(process.env.NODE_APP_HOST + 'api/user/transfer', {email: this.user.email, password: input3, user_email_destination: input1, value_transferred: input2}).then((response) => {
            response2 = response.data
            this.loadDataAcount()
          })

          if (response2.status === false) {
            Swal.showValidationMessage(response2.text)
            return
          } else {
            Swal.fire({
              title: 'Sucesso!',
              icon: response2.icon,
              text: response2.text,
              confirmButtonColor: 'green'
            })
          }
          return
        }
      })
    },

    formatMoney (amount) {
      if (amount && amount > 0) {
        return 'R$ ' + parseFloat(amount).toFixed(2).replace('.', ',')
      } else {
        return 'R$ ' + parseFloat('0.00').toFixed(2).replace('.', ',')
      }
    },

    async loadDataAcount () {
      axios.post(process.env.NODE_APP_HOST + 'api/user/getAcountData', {}).then((response) => {
        this.data = response.data
      }).catch(() => {
        this.$router.push('/login')
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
  .h-100{
    margin-bottom: 2px!important;
  }
</style>
