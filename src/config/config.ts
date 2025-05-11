import dotenv from "dotenv";

dotenv.config();
interface Config {
  port: number;
  nodeEnv?: string;
  supabase_url?: string;
  supabase_key?: string;
  jwt: {
    secret?: string;
    expiresIn?: string;
  };
}

const config: Config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  supabase_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  jwt: {
    secret: process.env.SECRET_JWT,
    expiresIn: process.env.EXPIRES_IN,
  },
};

export default config;
