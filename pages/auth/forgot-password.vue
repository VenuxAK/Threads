<script lang="ts" setup>
definePageMeta({
  layout: "auth",
  middleware: "sanctum:guest",
});

const { forgotPassword } = useAuth();
const email = ref<string>("");
const error = ref<Object | null>(null);
const success = ref<string>("");
const loading = ref<boolean>(false);

const onForgotPasswordSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;
    await forgotPassword(email.value);
    loading.value = false;
    success.value =
      "We have sent a link to reset password. Please check your mail box";
  } catch (err: any) {
    loading.value = false;
    error.value = err;
  }
};
</script>

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

        <form
          @submit.prevent="onForgotPasswordSubmit"
          class="mt-4 space-y-4 lg:mt-5 md:space-y-5 auth-form"
        >
          <div>
            <FormInput
              v-model="email"
              type="email"
              label="Your email"
              placeholder="Enter your email"
              icon="lucide:mail"
            />
            <FormErrorMessage :error="error?.email?.[0]" />
          </div>
          <p v-if="success" :class="['text-green-600 font-bold text-sm']">
            {{ success }}
          </p>

          <Button v-if="!success" :loading="loading"> Reset password </Button>
          <Button v-else href="/signin">Back</Button>
        </form>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.forgot-password-input {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring focus:ring-dark/5 rounded-lg block w-full p-2.5 dark:bg-darkGray dark:border-white/20 dark:placeholder-gray-400 dark:text-white;
}
.forgot-password-checkbox {
  @apply h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded;
}
</style>
