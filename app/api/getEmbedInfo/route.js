import { NextResponse } from "next/server";
import { getReportsById } from "../reports/reports";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          status: 400,
          error: "Missing report ID parameter",
        },
        { status: 400 }
      );
    }

    const report = await getReportsById(id);

    if (!report || report.length === 0) {
      return NextResponse.json(
        {
          status: 404,
          error: "Report not found",
        },
        { status: 404 }
      );
    }

    const { workspaceId, reportId, clientId, clientSecret, tenantId } =
      report[0];

    // Validate required credentials
    if (!workspaceId || !reportId || !clientId || !clientSecret || !tenantId) {
      return NextResponse.json(
        {
          status: 400,
          error: "Missing required Power BI credentials",
        },
        { status: 400 }
      );
    }

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

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Azure AD token error:", errorData);
      return NextResponse.json(
        {
          status: 401,
          error: "Failed to authenticate with Azure AD",
        },
        { status: 401 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json(
        {
          status: 401,
          error: "No access token received from Azure AD",
        },
        { status: 401 }
      );
    }

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

    if (!embedResponse.ok) {
      const errorData = await embedResponse.text();
      console.error("Power BI embed token error:", errorData);
      return NextResponse.json(
        {
          status: 500,
          error: "Failed to generate Power BI embed token",
        },
        { status: 500 }
      );
    }

    const embedData = await embedResponse.json();

    if (!embedData.token) {
      return NextResponse.json(
        {
          status: 500,
          error: "No embed token received from Power BI",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 200,
      accessToken: embedData.token,
      embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${workspaceId}`,
    });
  } catch (error) {
    console.error("Error in getEmbedInfo:", error);
    return NextResponse.json(
      {
        status: 500,
        error: "Error al obtener la información de embedding",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
