<script setup>
const props = defineProps({
  isOpen: {
    required: true,
    default: true,
  },
});
const emit = defineEmits(["closeModal", "openModal"]);
const user = useSanctumUser();
const content = ref("");

function closeModal() {
  emit("closeModal");
}
function openModal() {
  emit("openModal");
}
const { createPost } = usePost();
const error = ref(null);
const onCreatePost = async () => {
  try {
    await createPost(content.value);
    error.value = null;
    emit("closeModal");
  } catch (err) {
    error.value = err;
  }
};
</script>

<template>
  <Teleport to="#teleports">
    <HeadlessTransitionRoot appear :show="isOpen" as="template">
      <HeadlessDialog as="div" @close="closeModal" class="relative z-[100]">
        <HeadlessTransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/70" />
        </HeadlessTransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center md:p-4">
            <HeadlessTransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <HeadlessDialogPanel
                class="relative w-full h-screen md:h-auto md:max-w-lg transform overflow-hidden md:rounded-2xl bg-white dark:bg-darkGray md:border md:dark:border-gray-700 p-6 text-left align-middle md:shadow-xl transition-all"
              >
                <div class="md:hidden absolute top-3 right-3">
                  <button @click="() => emit('closeModal')">close</button>
                </div>
                <div class="flex flex-col space-y-6">
                  <div class="flex space-x-5 items-start">
                    <div class="">
                      <NuxtLink :href="`/@${user.username}`">
                        <Avatar class="w-10" />
                      </NuxtLink>
                    </div>
                    <div class="flex-1">
                      <NuxtLink
                        :href="`/@${user.username}`"
                        class="font-bold text-sm"
                      >
                        <p>{{ user.username }}</p>
                      </NuxtLink>
                      <div>
                        <form class="">
                          <div>
                            <textarea
                              type="text"
                              class="bg-transparent w-full text-sm text-gray-800 dark:text-white pr-2 pb-2 outline-none"
                              placeholder="Start a thread..."
                              v-model="content"
                            />
                          </div>
                          <p class="text-red-600 font-semibold text-sm">
                            {{ error?.content?.[0] }}
                          </p>
                        </form>
                      </div>
                      <div class="flex space-x-6 mt-4">
                        <div>
                          <label for="upload">
                            <!-- class="flex flex-col items-center gap-2 cursor-pointer" -->
                            <Icon
                              name="ph:file-image-bold"
                              class="cursor-pointer"
                            />
                            <!-- class="h-10 w-10 fill-white stroke-indigo-500" -->
                          </label>
                          <input id="upload" type="file" class="hidden" />
                        </div>
                        <div>
                          <label for="upload">
                            <!-- class="flex flex-col items-center gap-2 cursor-pointer" -->
                            <Icon name="fa:smile-o" class="cursor-pointer" />
                            <!-- class="h-10 w-10 fill-white stroke-indigo-500" -->
                          </label>
                          <input id="upload" type="file" class="hidden" />
                        </div>
                        <div>
                          <label for="upload">
                            <!-- class="flex flex-col items-center gap-2 cursor-pointer" -->
                            <Icon name="ph:hash-bold" class="cursor-pointer" />
                            <!-- class="h-10 w-10 fill-white stroke-indigo-500" -->
                          </label>
                          <input id="upload" type="file" class="hidden" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <p>Anyone can reply</p>
                    </div>
                    <div>
                      <button @click="onCreatePost" class="btn-create">
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </HeadlessDialogPanel>
            </HeadlessTransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </HeadlessTransitionRoot>
  </Teleport>
</template>
