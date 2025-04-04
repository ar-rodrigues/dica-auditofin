import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Replace these with your actual Power BI credentials
    const workspaceId = process.env.POWER_BI_WORKSPACE_ID;
    const reportId = process.env.POWER_BI_REPORT_ID;
    const clientId = process.env.POWER_BI_CLIENT_ID;
    const clientSecret = process.env.POWER_BI_CLIENT_SECRET;
    const tenantId = process.env.POWER_BI_TENANT_ID;

    // Get access token from Azure AD
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
          resource: "https://analysis.windows.net/powerbi/api",
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get embed token
    const embedResponse = await fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessLevel: "View",
          allowSaveAs: false,
        }),
      }
    );

    const embedData = await embedResponse.json();

    return NextResponse.json({
      status: 200,
      accessToken: embedData.token,
      embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${workspaceId}`,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        status: 500,
        error: "Error al obtener la información de embedding",
      },
      { status: 500 }
    );
  }
}
