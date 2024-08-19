<template>
  <div v-if="isApperenceOpen" ref="target" class="apperence-menu">
    <HeadlessTabGroup>
      <div class="px-1 py-1 mb-1 flex space-x-6 items-center">
        <button
          @click="$emit('closeApperence')"
          class="text-dark dark:text-white hover:text-dark/80 dark:hover:text-lightGray"
        >
          <!-- <Icon name="ph:arrow-left-bold" size="20px" /> -->
          <Icon name="maki:cross" size="20px" />
        </button>
        <h5>Apperence</h5>
      </div>
      <HeadlessTabList
        class="flex space-x-1 rounded-xl border bg-white dark:bg-dark dark:border-dark/40 px-2 py-1"
      >
        <HeadlessTab
          v-for="(theme, id) in themes"
          as="template"
          :key="id"
          v-slot="{ selected }"
        >
          <button
            @click="handleApperence(theme.name)"
            :class="[
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
              'ring-white/60 focus:outline-none',
              'text-dark hover:bg-dark/10 dark:text-white dark:hover:bg-darkGray',
              theme.name == $colorMode.preference
                ? 'bg-dark/10 dark:bg-darkGray'
                : '',
            ]"
          >
            <Icon v-if="theme.icon" :name="theme.icon" size="20px" />
            <span v-else>{{ theme.name.toUpperCase() }}</span>
          </button>
        </HeadlessTab>
      </HeadlessTabList>
    </HeadlessTabGroup>
  </div>
</template>

<script lang="ts" setup>
const colorMode = useColorMode();
const target = ref(null);
const props = defineProps(["isApperenceOpen"]);
const emit = defineEmits(["closeApperence"]);

const themes = ref([
  {
    name: "light",
    icon: "ph:sun-bold",
  },
  {
    name: "dark",
    icon: "ph:moon-bold",
  },
  {
    name: "system",
  },
]);

onClickOutside(target, (event) => {
  emit("closeApperence");
});

const handleApperence = (theme) => {
  colorMode.preference = theme;
};
</script>

<style lang="scss" scoped>
.apperence-menu {
  @apply absolute right-0 sm:left-12 sm:-top-20 z-50 bg-white border dark:border-dark/10 dark:bg-darkGray w-[250px] p-2 rounded-lg;
}
</style>
