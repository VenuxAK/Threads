<template>
  <Card>
    <PostHeader />
    <div class="content pl-10">
      <Card class="border border-lightGray/20 rounded-md">
        <!-- Repost header -->
        <div class="flex items-center space-x-3">
          <div>
            <NuxtLink href="/@profile" class="font-bold hover:underline">
              <Avatar />
            </NuxtLink>
          </div>
          <div class="flex items-center text-sm space-x-1">
            <NuxtLink href="/@profile" class="font-bold hover:underline"
              >Username</NuxtLink
            >
            <span>.</span>
            <p>12h</p>
          </div>
        </div>

        <!-- Repost content -->
        <div class="content text-sm sm:text-base mt-2">
          <!-- post content -->
          <NuxtLink href="/@username/posts/post-slug">
            <p>hello, there</p>
          </NuxtLink>
          <!-- post images -->
          <div></div>
        </div>
      </Card>
    </div>
    <PostFooter />
  </Card>
</template>

<script lang="ts" setup></script>

<style></style>
