import { ref } from "vue";

interface RateLimitState {
  isRateLimited: boolean;
  resetTime: number | null;
  remainingRequests: number | null;
  message: string;
}

export const useRateLimit = () => {
  const state = ref<RateLimitState>({
    isRateLimited: false,
    resetTime: null,
    remainingRequests: null,
    message: "",
  });

  const checkRateLimit = (error: any) => {
    // Check if error is a rate limit error (429)
    if (error.response?.status === 429) {
      const resetTimeHeader = error.response?.headers.get("x-ratelimit-reset");
      const remainingHeader = error.response?.headers.get("x-ratelimit-remaining");
      
      state.value.isRateLimited = true;
      state.value.resetTime = resetTimeHeader ? parseInt(resetTimeHeader) * 1000 : null;
      state.value.remainingRequests = remainingHeader ? parseInt(remainingHeader) : null;
      
      // Try to get message from response body
      state.value.message = error.response?._data?.message 
        || "Too many requests. Please try again later.";
      
      return true;
    }
    
    return false;
  };

  const reset = () => {
    state.value = {
      isRateLimited: false,
      resetTime: null,
      remainingRequests: null,
      message: "",
    };
  };

  return {
    state,
    checkRateLimit,
    reset,
  };
};