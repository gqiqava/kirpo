<script setup>
import mainLogo from '../assets/sakpatent.png'
import { login } from '../api/api'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const formData = ref({
  username: null,
  password: null
})
const stateValid = ref(true)

// defineProps({
//   msg: {
//     type: String,
//     required: true
//   }
// })
const router = useRouter()

// if (localStorage.getItem('token')) {
//   router.push('/content')
// }

const loginUser = async () => {
  if (Object.values(formData.value).some((el) => el === null || el.length < 3)) {
    stateValid.value = false
    return
  }
  const resposne = await login(formData.value)
  console.log(resposne)
  router.push('/content')
}
</script>
<template>
  <div class="login">
    <h1 style="margin-top: 10%; letter-spacing: 1.5px; margin-bottom: 40px">
      საქპატენტის ელექტრონული არქივი
    </h1>
    <img :src="mainLogo" alt="logo" style="width: 30%; margin-bottom: 20px" />
    <p>მომხმარებელი</p>
    <input
      type="text"
      name="usrnm"
      id=""
      v-model="formData.username"
      :class="stateValid ? null : 'errorTheme'"
    />
    <p>პაროლი</p>
    <input
      type="password"
      name="pswrd"
      id=""
      v-model="formData.password"
      :class="stateValid ? null : 'errorTheme'"
    />
    <button class="button-4" role="button" style="margin-top: 20px" @click="loginUser">
      შესვლა
    </button>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100vh;
}
.errorTheme {
  border-bottom: 2px solid red;
}
p {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 1.5px;
}
input {
  font-size: 22px;
  background-color: #f9f9f9;
}

/* CSS */
.button-4 {
  appearance: none;
  background-color: #fafbfc;
  border: 1px solid rgba(27, 31, 35, 0.15);
  border-radius: 6px;
  box-shadow:
    rgba(27, 31, 35, 0.04) 0 1px 0,
    rgba(255, 255, 255, 0.25) 0 1px 0 inset;
  box-sizing: border-box;
  color: #24292e;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system, system-ui, 'Segoe UI', Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji';
  font-size: 18px;
  font-weight: 500;
  line-height: 20px;
  list-style: none;
  padding: 6px 16px;
  position: relative;
  transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
  word-wrap: break-word;
}

.button-4:hover {
  background-color: #f3f4f6;
  text-decoration: none;
  transition-duration: 0.1s;
}

.button-4:disabled {
  background-color: #fafbfc;
  border-color: rgba(27, 31, 35, 0.15);
  color: #959da5;
  cursor: default;
}

.button-4:active {
  background-color: #edeff2;
  box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
  transition: none 0s;
}

.button-4:focus {
  outline: 1px transparent;
}

.button-4:before {
  display: none;
}

.button-4:-webkit-details-marker {
  display: none;
}
</style>
