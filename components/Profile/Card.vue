<script setup lang="ts">
import type { User } from '~/types';

defineProps<{ user: User }>();

const followUser = () => {
  console.log("Following");
};
</script>

<template>
  <Card>
    <div class="flex items-center space-x-2">
      <div>
         <NuxtLink :href="user?.username ? `/@${user.username}` : ''">
          <Avatar :src="user.avatar" />
        </NuxtLink>
      </div>
      <div class="flex-1 flex justify-between">
        <div>
          <NuxtLink :href="user?.username ? `/@${user.username}` : ''">
            <p class="text-sm font-bold">{{ user.username }}</p>
            <p class="text-sm font-light">{{ user.name }}</p>
          </NuxtLink>
        </div>
        <div>
          <button @click="followUser" class="btn-follow">Follow</button>
        </div>
      </div>
    </div>
    <p class="ml-9 text-sm dark:text-lightGray/60">
      <NuxtLink href="#" class="hover:underline"> Followers {{ user.followers ?? 0 }} </NuxtLink>
    </p>
  </Card>
</template>

<style scoped lang="scss">
.btn-follow {
  @apply py-1.5 px-5 border border-darkGray rounded-xl dark:text-white font-bold;
}
</style>
