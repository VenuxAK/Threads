<template>
  <div class="w-full p-3 h-[80vh] flex items-center justify-center">
    <div
      class="w-full sm:w-[450px] p-6 mx-auto bg-white dark:bg-darkGray border dark:border-white/10 shadow-lg rounded-lg"
    >
      <div>
        <div class="flex items-center flex-col space-y-5">
          <Logo />

          <h3 class="text-gray-700 dark:text-gray-300 text-xl font-bold">
            Reset password
          </h3>
        </div>
        <div class="mt-5">
          <form>
            <div>
              <label for="password" class="form-label">New password</label>
              <input
                id="password"
                type="text"
                class="reset-password-input"
                placeholder="*********"
              />
            </div>
            <div class="mt-5">
              <label for="confirm_password" class="form-label"
                >Confirm new password</label
              >
              <input
                id="confirm_password"
                type="text"
                class="reset-password-input"
                placeholder="*********"
              />
            </div>
            <div>
              <button class="mt-5 signin-btn">Reset password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <main id="content" role="main" class="w-full h-screen max-w-xl p-6 mx-auto">
    <div
      class="py-12 bg-white dark:bg-darkGray border dark:border-white/20 shadow-lg mt-7 rounded-xl"
    >
      <div class="p-4 sm:p-7">
        <div class="text-center">
          <div class="flex items-end justify-center mb-12 text-2xl font-bold">
            <Logo />
          </div>
          <h1
            class="block mb-2 text-xl font-bold text-gray-800 dark:text-white/90"
          >
            Successful Password Reset!
          </h1>
          <p class="mb-12 text-gray-800 dark:text-white">
            You can now use your new password to <br />
            sign in to your account! 🙌
          </p>
        </div>

        <div class="px-4 mx-auto text-center sm:px-7">
          <NuxtLink href="/signin" class="signin-btn"> Sign in </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "auth",
});
</script>

<style lang="scss" scoped>
.form-label {
  @apply text-sm text-gray-800 dark:text-gray-400 mb-1 block font-semibold;
}
.reset-password-input {
  @apply bg-transparent block w-full px-3 py-1 border dark:border-white/10 rounded focus:outline-none focus:ring;
}
</style>
