<template>
  <div>
    <h1 class="page-title">Index page</h1>
    <p v-for="i in 20" :key="i">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
      laborum nam accusantium voluptatum suscipit recusandae atque? Facilis
      perspiciatis officiis maiores nemo consequatur voluptate explicabo eum
      beatae amet velit. Eos, distinctio?
    </p>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.page-title {
  @apply text-purple-600 text-center font-bold text-3xl;
}
</style>
