class AppError extends Error {
  public readonly status: "error" | "fail";
  public readonly success: boolean;

  constructor(
    public readonly message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";
    this.success = false;
    Error.captureStackTrace(this, AppError);
  }
}

export default AppError;