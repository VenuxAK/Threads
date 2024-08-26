<template>
  <label v-if="label" class="form-label">{{ label }}</label>
  <div class="relative flex items-center" v-if="type !== 'password'">
    <input
      :value="modelValue"
      :type="type"
      class="form-input"
      :placeholder="placeholder"
      @input="updateValue"
    />
    <Icon :name="icon" size="25" class="input-icon" />
  </div>
  <div class="relative flex items-center" v-else>
    <input
      :value="modelValue"
      :type="password ? 'password' : 'text'"
      class="form-input"
      :placeholder="placeholder"
      @input="updateValue"
    />
    <Icon
      :name="password ? 'mingcute:eye-2-line' : 'tabler:eye-off'"
      size="25"
      class="input-icon cursor-pointer"
      @click="() => (password = !password)"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: false,
  },
  modelValue: {
    type: String,
    required: true,
  },
  type: {
    type: String as PropType<"text" | "email" | "password" | "number">,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

const password = ref<boolean>(true);
</script>

<style scoped lang="scss"></style>
