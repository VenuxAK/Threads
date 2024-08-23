<script lang="ts" setup>
definePageMeta({
  layout: "auth",
  middleware: "sanctum:guest",
});

const client = useSanctumClient();
const credentials = ref<Object | null>({
  fullname: "",
  email: "",
  password: "",
});
const error = ref<Object | null>(null);
let loading = ref<boolean>(false);

const onSignUp = async () => {
  try {
    loading.value = true;
    error.value = null;
    await client("/register", {
      method: "POST",
      body: credentials.value,
    });
    loading.value = false;
    const _user = await client("/api/user");
    navigateTo("/");
  } catch (err) {
    loading.value = false;
    const _error = useApiError(err);
    if (_error.isValidationError) {
      error.value = _error.bag;
    }
  }
};
</script>

<template>
  <div class="font-[sans-serif]">
    <div class="w-full sm:w-[400px] mx-auto">
      <form @submit.prevent="onSignUp" class="p-6 mx-auto auth-form">
        <div class="mb-12">
          <h3 class="form-title">Sign up</h3>
          <p class="text-gray-800 dark:text-white text-sm mt-6">
            Already have an account
            <NuxtLink
              href="/signin"
              class="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
              >Sign in here</NuxtLink
            >
          </p>
        </div>

        <!-- Name -->
        <div>
          <FormInput
            label="Name"
            v-model="credentials.fullname"
            placeholder="Enter your name"
            icon="bi:person"
          />
          <FormErrorMessage :error="error?.fullname?.[0]" />
        </div>

        <!-- Email -->
        <div class="my-3">
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
        <div class="">
          <FormInput
            v-model="credentials.password"
            label="Password"
            type="password"
            placeholder="Enter password"
          />
          <FormErrorMessage :error="error?.password?.[0]" />
        </div>

        <!-- Sign up button -->
        <div class="mt-8">
          <Button :loading="loading">Sign up</Button>
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

<style></style>
