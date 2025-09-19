'use server';
import { currentUser } from "@clerk/nextjs/server";
// Initialize Schematic SDK
import { SchematicClient } from "@schematichq/schematic-typescript-node";
const apiKey = process.env.SCHEMATIC_API_KEY;
const client = new SchematicClient({ apiKey }); 

// Function to get a temporary access token for the current user
export async function getTemporaryAccessToken() {
    console.log("Generating temporary access token for user...");
  const user = await currentUser();
  if (!user) {
    console.log("No user is currently logged in.");
    return null;
  }

  console.log("Current user ID:", user.id);
  const resp = await client.accesstokens.issueTemporaryAccessToken({
    resourceType: "company",
    lookup: {id:user.id }, // The lookup will vary depending on how you have configured your company keys
  });
  return resp.data?.token;
  
}