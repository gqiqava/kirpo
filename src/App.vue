<script setup>
import { RouterLink, RouterView } from 'vue-router'
import RouteManager from './components/RouteManager.vue'

const folders = []
</script>

<template>
  <div class="landing">
    <div style="display: flex">
      <RouteManager />
      <!-- <RouteManager /> -->
    </div>

    <!-- <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink> -->

    <div>
      <RouterView />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.landing {
  display: flex;
  flex-direction: column;
  justify-content: start;
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
