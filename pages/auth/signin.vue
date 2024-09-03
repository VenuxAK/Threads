<script lang="ts" setup>
definePageMeta({
  layout: "auth",
  middleware: "sanctum:guest",
  alias: "/signin",
});

type SignInUser = {
  email: string;
  password: string;
};

const { signIn } = useAuth();
const credentials = ref<SignInUser>({
  email: "",
  password: "",
});
const error = ref<Object | null>(null);
let loading = ref<boolean>(false);

const onSignIn = async () => {
  try {
    loading.value = true;
    await signIn(credentials.value.email, credentials.value.password);
    loading.value = false;
    error.value = null;
  } catch (err: any) {
    loading.value = false;
    error.value = err;
  }
  // loading.value = true;
  // const { isPending, start, stop } = useTimeoutFn(() => {
  //   console.log(credentials.value);
  //   loading.value = false;
  // }, 3000);
};
</script>

<template>
  <div class="font-[sans-serif]">
    <div class="w-full sm:w-[400px] mx-auto">
      <form @submit.prevent="onSignIn" class="p-6 mx-auto auth-form">
        <div class="mb-12">
          <h3 class="form-title">Sign in</h3>
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
          <FormInput
            v-model="credentials.email"
            type="email"
            label="Email"
            placeholder="Enter email"
            icon="lucide:mail"
          />
          <FormErrorMessage :error="error?.email?.[0]" />
        </div>

        <!-- Password -->
        <div class="mt-4">
          <FormInput
            v-model="credentials.password"
            type="password"
            label="Password"
            placeholder="Enter password"
          />
          <FormErrorMessage :error="error?.password?.[0]" />
        </div>

        <!-- Remember me and forgot password -->
        <div class="flex flex-wrap items-center justify-between gap-4 mt-6">
          <div class="flex items-center">
            <input
              id="remember-me"
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
          <Button :loading="loading">Sign in</Button>
        </div>

        <div class="my-4 flex items-center gap-4">
          <hr class="w-full border-gray-300 dark:border-gray-600" />
          <p class="text-sm text-gray-800 dark:text-white text-center">or</p>
          <hr class="w-full border-gray-300 dark:border-gray-600" />
        </div>

        <!-- Connect with social account -->
        <div class="space-y-3">
          <FormSocialLink icon="flat-color-icons:google">
            Continue with Google
          </FormSocialLink>
          <FormSocialLink icon="logos:facebook">
            Continue with Facebook
          </FormSocialLink>
          <FormSocialLink icon="skill-icons:instagram">
            Continue with Instagram
          </FormSocialLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.form-title {
  @apply text-gray-800 dark:text-white text-4xl font-extrabold;
}
</style>
