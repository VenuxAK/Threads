<template>
  <div class="space-y-6">
    <Card class="hidden sm:block border-none">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div>
            <NuxtLink href="/">
              <Avatar />
            </NuxtLink>
          </div>
          <div>
            <button
              class="cursor-pointer text-sm font-medium text-lightGray dark:text-lightGray/70"
            >
              Start a thread...
            </button>
          </div>
        </div>
        <div>
          <button
            class="text-[12px] font-bold border dark:text-white/80 dark:border-lightGray/40 rounded-md py-[3px] px-[10px]"
          >
            Post
          </button>
        </div>
      </div>
    </Card>
    <div class="w-full">
      <!-- Post card -->
      <PostCard v-for="i in 10" :key="i">
        <div class="content">
          <NuxtLink href="/@username/posts/post-test-slug">
            <p>Post content</p>
          </NuxtLink>
          <!-- <div>post's images</div> -->
        </div>
      </PostCard>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.page-title {
  @apply text-purple-600 text-center font-bold text-3xl;
}
</style>
