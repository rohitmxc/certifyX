import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // In a real app, you'd extract the wallet address from a session/token.
    // For now, we will fetch all templates or based on an organizationId if passed
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("organizationId");

    let templates;
    if (orgId) {
      templates = await prisma.template.findMany({ where: { organizationId: orgId } });
    } else {
      templates = await prisma.template.findMany();
    }

    return NextResponse.json(templates, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, designJson, theme, customFields, organizationId } = body;

    if (!name || !designJson) {
      return NextResponse.json({ error: "Name and designJson are required" }, { status: 400 });
    }

    // Since we don't have auth fully wired, if no organizationId is passed,
    // let's create or find a default organization for demo purposes.
    let targetOrgId = organizationId;
    if (!targetOrgId) {
      let defaultOrg = await prisma.organization.findFirst({ where: { name: "Default Org" } });
      if (!defaultOrg) {
        defaultOrg = await prisma.organization.create({
          data: { name: "Default Org" }
        });
      }
      targetOrgId = defaultOrg.id;
    }

    const template = await prisma.template.create({
      data: {
        name,
        designJson,
        theme: theme || "light",
        customFields: JSON.stringify(customFields || []),
        organizationId: targetOrgId,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Failed to create template:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}
