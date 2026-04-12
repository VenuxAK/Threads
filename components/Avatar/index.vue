<script lang="ts" setup>
const props = defineProps<{
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}>();

const sizeClasses = {
  sm: 'w-[24px]',
  md: 'w-[30px]',
  lg: 'w-[40px]',
};

const avatarSrc = computed(() => {
  return props.src || '/avatar.png';
});
</script>

<template>
  <div>
    <img
      :src="avatarSrc"
      class="aspect-square overflow-hidden rounded-full"
      :class="[sizeClasses[size || 'md'], props.class]"
      alt="Avatar"
    />
  </div>
</template>

<style></style>
