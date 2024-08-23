<template>
  <div class="card-header">
    <div class="flex items-center space-x-2">
      <div>
        <NuxtLink href="/@profile">
          <Avatar />
        </NuxtLink>
      </div>
      <div class="">
        <NuxtLink href="/@profile" class="space-x-2">
          <span class="text-sm font-semibold hover:underline">username</span>
          <span class="text-xs text-dark/60">3h</span>
        </NuxtLink>
      </div>
    </div>
    <div>
      <button>
        <Icon name="solar:menu-dots-bold" size="20px" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.card-header {
  @apply flex justify-between items-center mb-2;
}
</style>
