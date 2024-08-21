<script lang="ts" setup>
const route = useRoute();

let tab = ref("posts");
const toggleTab = (_tab: string) => {
  if (_tab == "posts") {
    tab.value = "posts";
  } else if (_tab == "reposts") {
    tab.value = "reposts";
  }
};
</script>

<template>
  <div class="sm:p-6">
    <div class="p-3 sm:p-0">
      <!-- User name and avatar -->
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-bold text-lg sm:text-xl">Full name</h3>
          <h5 class="dark:text-white/70">username</h5>
        </div>
        <div>
          <button>
            <Avatar class="w-[75px]" />
          </button>
        </div>
      </div>

      <!-- Bio, follower, following and social link buttons -->
      <div class="mt-6 space-y-3">
        <div class="flex justify-between items-center">
          <div class="space-y-2">
            <div>
              <p>bio...</p>
            </div>
            <div class="flex items-center space-x-3 text-sm">
              <div>
                <button class="hover:underline">12k followers</button>
              </div>
              <div>
                <button class="hover:underline">205 following</button>
              </div>
            </div>
          </div>
          <div>
            <div class="space-x-1 flex justify-end items-center">
              <button class="social-btn">
                <!-- <Icon name="mdi:instagram" size="20" /> -->
                <Icon name="skill-icons:instagram" size="20" />
              </button>
              <button class="social-btn text-blue-600">
                <Icon name="mdi:facebook" size="20" />
              </button>
              <button class="social-btn">
                <Icon name="prime:twitter" size="20" />
              </button>
              <button class="social-btn bg-black/5 dark:bg-white/10">
                <Icon name="fa6-solid:plus" size="20" class="" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit profile button -->
      <div class="my-4">
        <div>
          <button class="w-full border dark:border-darkGray py-1.5 rounded-lg">
            Edit profile
          </button>
        </div>
      </div>
    </div>

    <div>
      <div class="border-b dark:border-white/10 mt-8">
        <div class="btn-tabs">
          <button
            :class="['tab-btn', tab == 'posts' ? 'active-tab' : '']"
            @click="toggleTab('posts')"
          >
            Posts
          </button>
          <button
            :class="['tab-btn', tab == 'reposts' ? 'active-tab' : '']"
            @click="toggleTab('reposts')"
          >
            Reposts
          </button>
        </div>
      </div>

      <div class="mt-6">
        <ProfilePostsList v-if="tab == 'posts'" v-for="i in 5" :key="i" />
        <ProfileRepostsList v-if="tab == 'reposts'" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.social-btn {
  @apply hover:bg-black/5 dark:hover:bg-white/10 p-2 rounded-full flex items-center;
}
.btn-tabs {
  @apply flex;
}
.tab-btn {
  @apply block w-[50%] py-5 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5 text-center;
}
.active-tab {
  @apply border-b-2 border-b-black/60 dark:border-b-white/50;
}
</style>
