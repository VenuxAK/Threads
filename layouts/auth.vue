<script lang="ts" setup>
const colorMode = useColorMode();

const handleApperence = () => {
  const theme = colorMode.value;
  if (theme == "dark") {
    colorMode.preference = "light";
  } else {
    colorMode.preference = "dark";
  }
};
</script>

<template>
  <div class="relative">
    <div class="absolute top-5 right-5">
      <button @click="handleApperence">
        <Icon id="a-p" size="25" name="ph:sun-bold" />
        <!-- :name="
            colorMode.value == 'dark' || colorMode.value == 'system'
              ? 'ph:sun-bold'
              : 'ph:moon-bold'
          " -->
      </button>
    </div>
    <slot />
  </div>
</template>

<style></style>
