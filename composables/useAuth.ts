export const useAuth = () => {
  const client = useSanctumClient();
  const { login, logout, refreshIdentity } = useSanctumAuth();

  const signUp = async (name: string, email: string, password: string) => {
    try {
      await client("/auth/register", {
        method: "POST",
        body: { name, email, password, password_confirmation: password },
      });
      await refreshIdentity();
      navigateTo("/");
    } catch (err) {
      const error = useApiError(err);
      if (error.isValidationError) {
        throw error.bag;
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await login({ email, password });
      navigateTo("/");
    } catch (err) {
      const error = useApiError(err);
      if (error.isValidationError) {
        throw error.bag;
      }
    }
  };

  const signOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await client("/auth/forgot-password", {
        method: "POST",
        body: {
          email,
        },
      });
    } catch (err) {
      const error = useApiError(err);
      if (error.isValidationError) {
        throw error.bag;
      }
    }
  };

  //   http://localhost:3000/password-reset/{token}?email={email_address}
  const resetPassword = async (
    email: string | null,
    password: string,
    password_confirmation: string,
    token: string
  ) => {
    try {
      const response = await client("/auth/reset-password", {
        method: "POST",
        body: { email, password, password_confirmation, token },
      });
      console.log(response);
    } catch (err) {
      const error = useApiError(err);
      if (error.isValidationError) {
        throw error.bag;
      }
    }
  };

  const verifyEmail = async () => {};
  const notifyEmailVerification = async () => {};

  return { signUp, signIn, signOut, forgotPassword, resetPassword };
};
