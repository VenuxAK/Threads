<template>
  <div>
    <img
      src="~/assets/img/avatar.png"
      class="aspect-square overflow-hidden rounded-full w-[30px]"
      :class="class"
      alt="Avatar"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["class"]);
</script>

<style></style>
