export type BaseSuccessResponse<T = void> = {
  message: string;
  data?: T;
};

export type BaseErrorResponse = {
  message: string;
};
