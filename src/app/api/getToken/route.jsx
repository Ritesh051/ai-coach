// app/api/getToken/route.js
import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

const assemblyAi = new AssemblyAI({
  apiKey: process.env.NEXT_PUBLIC_ASSEMBLY_API_KEY || '3a63230166d9487086481a0b0c94cf8c'
});

export async function GET(req) {
  try {
    const tokenResponse = await assemblyAi.streaming.createTemporaryToken({ 
      expires_in_seconds: 600 
    });
    
    console.log("Temporary token created for v3 streaming");
    return NextResponse.json({ token: tokenResponse });
  } catch (error) {
    console.error("Error creating token:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}