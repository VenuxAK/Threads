import { FetchError } from "ofetch";

const UNKNOWN_ERROR_CODE = 400;
const UNAUTHORIZE_ERROR_CODE = 401;
const FORBIDDEN_ERROR_CODE = 403;
const NOT_FOUND_ERROR_CODE = 404;
const VALIDATION_ERROR_CODE = 422;
const SERVER_ERROR_CODE = 500;

export const useApiError = (error: any) => {
  const isFetchError = error instanceof FetchError;
  const isUnknownError =
    isFetchError && error.response?.status === UNKNOWN_ERROR_CODE;
  const isUnauthorizeError =
    isFetchError && error.response?.status === UNAUTHORIZE_ERROR_CODE;
  const isForbiddenError =
    isFetchError && error.response?.status === FORBIDDEN_ERROR_CODE;
  const isNotFoundError =
    isFetchError && error.response?.status === NOT_FOUND_ERROR_CODE;
  const isValidationError =
    isFetchError && error.response?.status === VALIDATION_ERROR_CODE;

  const code = isFetchError ? error.response?.status : SERVER_ERROR_CODE;
  const bag: Record<string, string[]> = isValidationError
    ? error.response?._data.errors
    : {};

  return {
    isValidationError,
    isNotFoundError,
    isUnauthorizeError,
    isUnknownError,
    isForbiddenError,
    code,
    bag,
  };
};
