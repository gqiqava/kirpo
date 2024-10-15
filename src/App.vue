<script setup>
import { RouterView } from 'vue-router'
import RouteManager from './components/RouteManager.vue'
import { useLocationHandler } from '@/stores/location'
import { storeToRefs } from 'pinia'
import loader from '@/assets/ld.gif'

const store = useLocationHandler()
const { isLoading } = storeToRefs(store)
console.log(1, isLoading.value)

const token = localStorage.getItem('token')

</script>

<template>
  <div v-if="isLoading" class="check">
     <img :src="loader" alt="">
  </div>
  <div  class="landing">
  
   <div > <div style="display: flex" v-if="token">
      <RouteManager />
    </div>
    <div>
      <RouterView />
    </div></div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.landing {
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.check{
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  z-index: 999999999999;
}

.spinner {
  width: 80px;
  height: 80px;
  border: 10px solid rgba(255, 255, 255, 0.3);
  border-top: 10px solid #fff;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

body {
  font-family: 'Poppins', sans-serif;
  margin: 0px;
  background-color: #f9f9f9;
}

p {
  font-size: 18px;
  margin: 4px 0px;
}
input {
  border: none;
  border-bottom: 1px solid grey;
}
input:focus {
  border: none;
  border-bottom: 1px solid grey;
}

input::after {
  border: none;
  border-bottom: 1px solid grey;
}

input:focus,
select:focus,
textarea:focus,
button:focus {
  outline: none;
  border-bottom: 1px solid darkblue;
}

/* nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
} */
</style>
