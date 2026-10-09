import {readFile} from "node:fs/promises";
import {Pool} from "pg";
import {emptyState} from "../src/lib/server/seed";

// Run explicitly with the ignored production environment, never from a build.
// This script creates schema/settings only; it does not create users or jobs.
async function main(){
 if(process.env.DARZI_SETUP_PRODUCTION!=="true"||process.env.DARZI_DEMO_DATA!=="false"||process.env.DARZI_LOCAL_PREVIEW!=="false"||process.env.NEON_PROJECT_ID!=="icy-grass-38018123"||process.env.NEON_BRANCH_ID!=="br-frosty-recipe-b39v7qnl"||!process.env.DATABASE_URL_UNPOOLED)throw new Error("Production setup requires explicit DARZI_SETUP_PRODUCTION=true, demo/local preview disabled, and the configured production project/branch.");
 const connection=new URL(process.env.DATABASE_URL_UNPOOLED);
 if(!["postgres:","postgresql:"].includes(connection.protocol)||connection.hostname!=="ep-polished-mode-b3qtipgu.c-4.ap-southeast-1.aws.neon.tech"||connection.pathname!=="/neondb")throw new Error("Production setup requires the verified direct production database connection.");
 const pool=new Pool({connectionString:connection.toString(),max:1,connectionTimeoutMillis:10000});
 try{
  const client=await pool.connect();
  try{
   await client.query("BEGIN");
   await client.query("SELECT pg_advisory_xact_lock(43417265)");
   await client.query(await readFile(new URL("./schema.sql",import.meta.url),"utf8"));
   await client.query("INSERT INTO darzi.settings (id,data) VALUES ('business',$1::jsonb) ON CONFLICT (id) DO NOTHING",[JSON.stringify(emptyState().settings)]);
   await client.query("COMMIT");
  }catch(error){await client.query("ROLLBACK");throw error;}finally{client.release();}
  console.log("DARZI production schema/settings ready. Existing records preserved; no demo data, users or credentials created.");
 }finally{await pool.end();}
}

main().catch(error=>{console.error(error instanceof Error?error.message:"Production setup failed.");process.exitCode=1;});
