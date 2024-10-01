<script lang="ts" setup>
const { showReplied, post } = defineProps({
  post: {
    required: true,
    type: Object,
  },
  showReplied: {
    default: false,
  },
});

// Computed property to format hashtags and preserve line breaks
const formattedCaption = computed(() => {
  return formatHashtagsAndLineBreaks(post.content);
});

// Function to extract hashtags
const formatHashtagsAndLineBreaks = (caption: string) => {
  // First, extract all hashtags in the text
  const hashtags = extractHashtags(caption);

  // Replace line breaks (\n) with <br> for HTML rendering
  let formattedText = caption.replace(/\n/g, "<br>");

  // Loop over each hashtag and replace them with custom style
  hashtags.forEach((tag) => {
    const tagRegex = new RegExp(`#${tag}`, "g"); // Regex to match hashtags like #tag
    formattedText = formattedText.replace(
      tagRegex,
      `<span style='color: #1da1f2;'>#${tag}</span>`
    );
  });

  return formattedText;
};

// Function to extract hashtags from the caption text
const extractHashtags = (caption: string) => {
  // Regex to find all hashtags in the caption
  const hashtagRegex = /#(\w+)/g;
  const tags = [];
  let match;

  // Loop through all matches and add hashtags to the array
  while ((match = hashtagRegex.exec(caption)) !== null) {
    tags.push(match[1]); // match[1] is the hashtag without the #
  }

  return tags; // Return the array of hashtags
};
</script>

<template>
  <Card class="post-card" v-if="post">
    <PostHeader :post="post" />
    <div class="card-content">
      <NuxtLink :href="`/@${post.author.username}/posts/${post.id}`">
        <div v-html="formattedCaption"></div>
      </NuxtLink>
    </div>
    <PostFooter />
    <PostReplied v-if="showReplied" />
  </Card>
</template>

<style lang="scss" scoped>
.post-card {
  .card-content {
    @apply text-sm text-darkGray dark:text-white/90;
  }
}
</style>
