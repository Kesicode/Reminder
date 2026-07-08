import { NextRequest, NextResponse } from "next/server";
import { getApps, cert } from "firebase-admin/app";

export async function GET(req: NextRequest) {
  try {
    const logs: string[] = [];
    
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    logs.push(`projectId: ${projectId ? "present" : "MISSING"}`);
    logs.push(`clientEmail: ${clientEmail ? "present" : "MISSING"}`);
    logs.push(`rawPrivateKey: ${rawPrivateKey ? "present" : "MISSING"}`);
    
    if (clientEmail) {
      logs.push(`clientEmail starts with quote: ${clientEmail.startsWith('"')}`);
      logs.push(`clientEmail ends with quote: ${clientEmail.endsWith('"')}`);
    }
    
    if (rawPrivateKey) {
      logs.push(`rawPrivateKey length: ${rawPrivateKey.length}`);
      logs.push(`rawPrivateKey starts with quote: ${rawPrivateKey.startsWith('"')}`);
      logs.push(`rawPrivateKey ends with quote: ${rawPrivateKey.endsWith('"')}`);
      logs.push(`rawPrivateKey starts with: ${rawPrivateKey.slice(0, 30)}`);
      logs.push(`rawPrivateKey ends with: ${rawPrivateKey.slice(-30)}`);
      logs.push(`rawPrivateKey contains literal \\n: ${rawPrivateKey.includes("\\n")}`);
      logs.push(`rawPrivateKey contains actual newlines: ${rawPrivateKey.includes("\n")}`);
    }

    let parseSuccess = false;
    let parseError = "";
    
    try {
      let privateKey = rawPrivateKey;
      if (privateKey) {
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
          privateKey = privateKey.slice(1, -1);
        }
        privateKey = privateKey.replace(/\\n/g, "\n");
        
        // Try calling cert()
        if (clientEmail) {
          cert({
            projectId,
            clientEmail,
            privateKey,
          });
          parseSuccess = true;
          logs.push("cert() parsing succeeded ✓");
        } else {
          parseError = "clientEmail is missing, cannot call cert()";
        }
      } else {
        parseError = "privateKey is missing, cannot call cert()";
      }
    } catch (e: any) {
      parseError = e?.message || String(e);
      logs.push(`cert() parsing failed: ${parseError}`);
    }
    
    return NextResponse.json({
      success: parseSuccess,
      error: parseError,
      logs,
      existingApps: getApps().map(app => app.name),
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error?.message || "Diagnostics failed",
    }, { status: 500 });
  }
}
