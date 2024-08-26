<script lang="ts" setup>
definePageMeta({
  layout: "auth",
});

type UserCredentials = {
  password: string;
  password_confirmation: string;
};

const credentials = ref<UserCredentials>({
  password: "",
  password_confirmation: "",
});
const error = ref<any>(null);
const loading = ref<boolean>(false);
const isReset = ref<boolean>(false);

const onResetPassword = async () => {
  loading.value = true;
  const { isPending, start, stop } = useTimeoutFn(() => {
    console.log(credentials.value);
    loading.value = false;
    isReset.value = true;
  }, 3000);
};
</script>

<template>
  <div
    v-if="!isReset"
    class="w-full p-3 h-[100vh] flex items-center justify-center"
    id="reset-password-form-wrapper"
  >
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
          <form @submit.prevent="onResetPassword" class="auth-form">
            <FormErrorMessage :error="error" />
            <div>
              <FormInput
                v-model="credentials.password"
                type="password"
                label="New password"
                placeholder="********"
              />
              <FormErrorMessage :error="error" />
            </div>
            <div class="mt-5">
              <FormInput
                v-model="credentials.password_confirmation"
                type="password"
                label="Confirm new password"
                placeholder="********"
              />
              <FormErrorMessage :error="error" />
            </div>
            <div>
              <Button :loading="loading">Reset Password</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <main
    v-else
    id="content"
    role="main"
    class="w-full h-screen max-w-xl p-6 mx-auto"
  >
    <div
      class="py-12 bg-white dark:bg-darkGray border dark:border-white/20 shadow-lg mt-7 rounded-xl"
    >
      <div class="p-4 sm:p-7">
        <div class="text-center">
          <div class="flex items-end justify-center mb-12 text-2xl font-bold">
            <Logo />
          </div>
          <h1 class="block mb-2 text-xl font-bold text-green-600">
            You Have Successfully Reset Password!
          </h1>
          <p class="mb-12 text-gray-800 dark:text-white">
            You can now use your new password to <br />
            sign in to your account! 🙌
          </p>
        </div>

        <div class="px-4 mx-auto text-center sm:px-7">
          <NuxtLink href="/signin" class="signin-btn">
            Go back sign in
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped></style>
