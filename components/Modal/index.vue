<template>
  <!-- <div class="fixed inset-0 flex items-center justify-center">
    <button
      type="button"
      @click="openModal"
      class="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
    >
      Open dialog
    </button>
  </div> -->
  <HeadlessTransitionRoot appear :show="isOpen" as="template">
    <HeadlessDialog as="div" @close="closeModal" class="relative z-30">
      <HeadlessTransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </HeadlessTransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <HeadlessTransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <HeadlessDialogPanel class="modal-box">
              <HeadlessDialogTitle
                v-if="title"
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                {{ title }}
              </HeadlessDialogTitle>
              <div class="">
                <slot />
              </div>

              <div class="absolute top-2 right-2">
                <!-- class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" -->
                <button type="button" @click="closeModal">
                  <Icon name="maki:cross" size="25" />
                </button>
              </div>
            </HeadlessDialogPanel>
          </HeadlessTransitionChild>
        </div>
      </div>
    </HeadlessDialog>
  </HeadlessTransitionRoot>
</template>

<script lang="ts" setup>
const props = defineProps<{
  isOpen: boolean;
  title?: string;
}>();
// const props = defineProps(["isOpen"]);

const emit = defineEmits(["openModal", "closeModal"]);
// const isOpen = ref(true);

function closeModal() {
  emit("closeModal");
}
function openModal() {
  emit("openModal");
}
</script>

<style lang="scss" scoped>
.modal-box {
  @apply w-full max-w-md transform overflow-hidden rounded-xl dark:bg-darkGray p-6 text-left align-middle shadow-xl transition-all;
}
</style>
