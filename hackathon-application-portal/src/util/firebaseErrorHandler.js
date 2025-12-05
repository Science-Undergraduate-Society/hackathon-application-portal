// utils/getFirebaseErrorMessage.js

export function getFirebaseErrorMessage(error) {
  const code = typeof error === "string" ? error : error?.code;

  switch (code) {
    case "auth/network-request-failed":
      return "You're offline or your connection is unstable.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a bit and try again.";
    case "auth/internal-error":
      return "Something went wrong. Please try again.";
    case "auth/timeout":
      return "The request took too long. Please try again.";

    case "auth/user-not-found":
      return "No account found with that email.";
    case "auth/wrong-password":
      return "Incorrect password. Try again.";
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/user-disabled":
      return "This account has been disabled.";

    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/weak-password":
      return "Password is too weak. Try something stronger.";
    case "auth/invalid-email":
      return "Please enter a valid email.";

    case "auth/expired-action-code":
    case "auth/code-expired":
      return "This link has expired. Request a new one.";
    case "auth/invalid-action-code":
      return "This link is invalid. Request a new one.";

    case "auth/popup-blocked":
      return "Your browser blocked the sign-in popup.";
    case "auth/popup-closed-by-user":
      return "You closed the popup before finishing.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with a different sign-in method.";

    // --- MFA ---
    case "auth/multi-factor-auth-required":
      return "You need to complete multi-factor authentication.";

    default:
      return "Something went wrong. Please try again.";
  }
}
