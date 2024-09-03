<template>
  <div v-if="posts">
    <div>
      <PostCard>
        <div class="content">
          <h1>My first thread</h1>
        </div>
      </PostCard>
    </div>
  </div>
  <LoaderSkeleton v-for="i in 2" :loading="false" />
</template>

<script lang="ts" setup>
const props = defineProps(["posts"]);
</script>

<style></style>
