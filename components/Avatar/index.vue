<script lang="ts" setup>
const props = defineProps<{
  src?: string;
  class?: string;
}>();

const avatarSrc = computed(() => {
  return props.src || '/avatar.png';
});
</script>

<template>
  <div>
    <img
      :src="avatarSrc"
      class="aspect-square overflow-hidden rounded-full w-[30px]"
      :class="props.class"
      alt="Avatar"
    />
  </div>
</template>

<style></style>
