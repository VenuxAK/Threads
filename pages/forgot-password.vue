<template>
  <section class="">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0"
    >
      <NuxtLink
        href="/signin"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <Logo />
        Threads
      </NuxtLink>
      <div
        class="w-full p-6 bg-lightGray/10 rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-darkGray dark:border-gray-700 sm:p-8"
      >
        <h1
          class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
        >
          Forgot your password?
        </h1>

        <form class="mt-4 space-y-4 lg:mt-5 md:space-y-5">
          <div>
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Your email</label
            >
            <input
              type="email"
              id="email"
              class="forgot-password-input"
              placeholder="name@company.com"
            />
          </div>
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                aria-describedby="terms"
                type="checkbox"
                class="forgot-password-checkbox"
              />
            </div>
            <div class="ml-3 text-sm">
              <label
                for="terms"
                class="font-light text-gray-500 dark:text-gray-300"
                >I accept the
                <a
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  href="#"
                  >Terms and Conditions</a
                ></label
              >
            </div>
          </div>
          <button type="submit" class="signin-btn">Reset password</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "auth",
});
</script>

<style lang="scss" scoped>
.forgot-password-input {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring focus:ring-dark/5 rounded-lg block w-full p-2.5 dark:bg-darkGray dark:border-white/20 dark:placeholder-gray-400 dark:text-white;
}
.forgot-password-checkbox {
  @apply h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded;
}
</style>
