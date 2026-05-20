import axios from "axios";

type BackendErrorResponse = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | string> | string[] | string | null;
};

function formatFieldName(fieldName: string) {
  return fieldName
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function getApiErrorMessage(error: unknown) {
  if (!axios.isAxiosError<BackendErrorResponse>(error)) {
    return "Something went wrong. Please try again.";
  }

  const responseData = error.response?.data;

  if (!responseData) {
    return "Could not connect to the server. Please try again.";
  }

  const { message, errors } = responseData;

  if (!errors) {
    return message || "Something went wrong. Please try again.";
  }

  if (typeof errors === "string") {
    return errors;
  }

  if (Array.isArray(errors)) {
    return errors.join(" ");
  }

  const fieldMessages = Object.entries(errors).flatMap(
    ([fieldName, fieldErrors]) => {
      const readableFieldName = formatFieldName(fieldName);

      if (Array.isArray(fieldErrors)) {
        return fieldErrors.map((fieldError) => {
          return `${readableFieldName}: ${fieldError}`;
        });
      }

      return `${readableFieldName}: ${fieldErrors}`;
    },
  );

  if (fieldMessages.length > 0) {
    return fieldMessages.join("\n");
  }

  return message || "Something went wrong. Please try again.";
}