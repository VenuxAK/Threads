<script lang="ts" setup>
definePageMeta({
  middleware: "sanctum:auth",
});

const route = useRoute();
const router = useRouter();
const { search: searchUsersAndPosts } = usePost();
const search = ref<any>("");
const posts = ref<Array<any>>([]);
const users = ref<Array<Object>>([]);
const loading = ref(false);
const showPosts = ref(route.query.q ? true : false);
const regex = /^$/;

const onSearchSubmit = async () => {
  if (!regex.test(search.value)) {
    loading.value = true;
    const response = await searchUsersAndPosts(search.value);
    users.value = response?.users;
    // console.log(posts.value);
    loading.value = false;
  }
};

const onSearchPosts = async () => {
  showPosts.value = true;
  loading.value = true;
  const response = await searchUsersAndPosts(search.value, true);
  posts.value = response.posts;
  loading.value = false;
};

const onBack = () => {
  showPosts.value = false;
  posts.value = [];
  search.value = "";
  router.push("/search");
};

// watch(showPosts, async () => {
//   const response = await searchUsersAndPosts(search.value, true);
//   posts.value = response.posts;
//   // console.log(posts.value);
// });
</script>

<template>
  <div>
    <!-- User -->
    <div>
      <form
        v-if="!showPosts"
        @submit.prevent="onSearchSubmit"
        class="px-5 mx-auto mt-5"
      >
        <!-- v-if="!showPosts" -->
        <div class="relative">
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
          >
            <Icon
              name="mingcute:search-line"
              class="text-xl text-gray-500 dark:text-gray-400"
            />
          </div>
          <input
            type="search"
            id="default-search"
            class="block w-full px-4 py-3 ps-10 text-sm text-gray-900 border rounded-xl bg-gray-50 dark:bg-dark dark:border-darkGray dark:placeholder-gray-400 dark:text-white focus:outline-none"
            placeholder="Search"
            v-model="search"
          />
        </div>
      </form>
      <div v-else class="px-5 mt-5">
        <button @click="onBack">Back</button>
      </div>

      <!-- Posts -->
      <div>
        <div class="px-5 mt-5">
          <div>
            <NuxtLink
              v-if="search"
              :href="`?q=${search}`"
              class="flex items-center justify-between border-b dark:border-darkGray pb-4"
              @click="onSearchPosts"
            >
              <div class="flex items-center space-x-5">
                <Icon
                  name="mingcute:search-line"
                  class="text-xl text-gray-500 dark:text-gray-400"
                />
                <div>
                  <p>{{ search }}</p>
                </div>
              </div>
              <div>
                <button>
                  <Icon
                    name="line-md:chevron-right"
                    class="text-xl text-gray-500 dark:text-gray-400"
                  />
                </button>
              </div>
            </NuxtLink>
            <SearchPosts
              v-if="posts?.length"
              :posts="posts"
              :loading="loading"
            />
            <div v-else-if="!posts?.length && showPosts && !loading">
              <h3 class="dark:text-lightGray text-center mt-5">
                Posts not found
              </h3>
            </div>
          </div>
        </div>
      </div>

      <!-- User profile cards -->
      <div
        class="divide-y divide-gray-300 dark:divide-darkGray mt-5"
        v-if="users.length"
      >
        <!-- v-if="users.length && !posts.length && !showPosts" -->
        <ProfileCard v-for="user in users" :key="user.username" :user="user" />
      </div>
    </div>
  </div>
</template>

<style></style>
