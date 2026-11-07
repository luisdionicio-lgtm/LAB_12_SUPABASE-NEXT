import type {NextConfig} from 'next';
const config:NextConfig={devIndicators:false,outputFileTracingIncludes:{'/*':['./certs/supabase-ca.crt']}};
export default config;
