<script setup>
import { RouterLink, RouterView } from 'vue-router'
import RouteManager from './components/RouteManager.vue'
</script>

<template>
  <div class="landing">
    <div>
      <RouteManager />
    </div>

    <!-- <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink> -->

    <div>
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.landing {
  display: flex;
  justify-content: start;
}

nav a.router-link-exact-active {
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
}
</style>
