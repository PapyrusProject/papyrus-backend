export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number
      DATABASE_URL: string
      PROJECT_NAME: string
      PROJECT_VERSION: number
      JWT_SECRET: string
    }
  }
}
