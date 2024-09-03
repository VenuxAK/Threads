<script lang="ts" setup>
definePageMeta({
  middleware: "sanctum:auth",
});
</script>
<template>
  <div>
    <PostCard>
      <div class="content">
        <div class="content">
          <p>Post content</p>
          <!-- <div>post's images</div> -->
        </div>
      </div>
    </PostCard>
  </div>
</template>

<style></style>
