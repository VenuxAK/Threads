export const useAuth = () => {
  const client = useSanctumClient();
  const { refreshIdentity, login } = useSanctumAuth();
  const router = useRouter();
  const route = useRoute();

  // Sign up new user
  const signUp = async (
    fullname: string,
    email: string,
    password: string
  ): Promise<any> => {
    try {
      await client("/register", {
        method: "post",
        body: {
          fullname,
          email,
          password,
        },
      });
      await refreshIdentity();
    } catch (err) {
      const _err = useApiError(err);
      if (_err.isValidationError) {
        throw _err.bag;
      }
    }
  };

  // Sign in user
  type SignInCredentials = {
    email: string;
    password: string;
  };
  const signIn = async (credentials: Object | any): Promise<any> => {
    try {
      const { email, password }: SignInCredentials = credentials;
      await login({ email, password });
    } catch (err) {
      const _err = useApiError(err);
      if (_err.isValidationError) {
        throw _err.bag;
      }
    }
  };

  // Forgot password
  const forgotPassword = async (email: string): Promise<any> => {
    try {
      await client("/forgot-password", {
        method: "POST",
        body: {
          email,
        },
      });
    } catch (err) {
      const _err = useApiError(err);
      if (_err.isValidationError) {
        throw _err.bag;
      }
    }
  };

  // Reset password
  const resetPassword = async (
    password: string,
    password_confirmation: string
  ): Promise<any> => {
    const email: any = route.query.email;
    const token: string | string[] = route.params.token;
    try {
      await client("/reset-password", {
        method: "POST",
        body: {
          email,
          token,
          password,
          password_confirmation,
        },
      });
    } catch (err) {
      const _err = useApiError(err);
      if (_err.isValidationError) {
        throw _err.bag;
      }
    }
  };

  return { signUp, signIn, forgotPassword, resetPassword };
};
