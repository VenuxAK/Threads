<template>
  <div class="font-[sans-serif]">
    <div class="w-full sm:w-[400px] mx-auto">
      <form class="p-6 mx-auto auth-form">
        <div class="mb-12">
          <h3 class="text-gray-800 dark:text-white text-4xl font-extrabold">
            Sign in
          </h3>
          <p class="text-gray-800 dark:text-white text-sm mt-6">
            Don't have an account
            <NuxtLink
              href="/signup"
              class="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
              >Sign up here</NuxtLink
            >
          </p>
        </div>

        <!-- Email -->
        <div class="mt-8">
          <label class="form-label">Email</label>
          <div class="relative flex items-center">
            <input type="text" class="form-input" placeholder="Enter email" />
            <Icon name="lucide:mail" size="20" class="input-icon" />
          </div>
        </div>

        <!-- Password -->
        <div class="mt-8">
          <label class="form-label">Password</label>
          <div class="relative flex items-center">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="Enter password"
            />
            <Icon
              name="mingcute:eye-2-line"
              size="25"
              class="input-icon cursor-pointer"
              @click="togglePasswordHideShow"
            />
          </div>
        </div>

        <!-- Remember me and forgot password -->
        <div class="flex flex-wrap items-center justify-between gap-4 mt-6">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              for="remember-me"
              class="text-gray-800 dark:text-white ml-3 block text-sm"
            >
              Remember me
            </label>
          </div>
          <div>
            <NuxtLink
              href="/forgot-password"
              class="text-blue-600 text-sm font-semibold hover:underline"
            >
              Forgot Password?
            </NuxtLink>
          </div>
        </div>

        <!-- Sign in button -->
        <div class="mt-8">
          <button type="button" class="signin-btn">Sign in</button>
        </div>

        <div class="my-4 flex items-center gap-4">
          <hr class="w-full border-gray-300 dark:border-gray-600" />
          <p class="text-sm text-gray-800 dark:text-white text-center">or</p>
          <hr class="w-full border-gray-300 dark:border-gray-600" />
        </div>

        <!-- Sigin in with social account -->
        <div class="space-y-3">
          <button type="button" class="social-signin-btn">
            <Icon name="flat-color-icons:google" size="25" />
            Continue with Google
          </button>
          <button type="button" class="social-signin-btn">
            <Icon name="logos:facebook" size="25" />
            Continue with Facebook
          </button>
          <button type="button" class="social-signin-btn">
            <Icon name="skill-icons:instagram" size="25" />
            Continue with Instagram
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "auth",
});

let showPassword = ref(false);
const togglePasswordHideShow = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped></style>
