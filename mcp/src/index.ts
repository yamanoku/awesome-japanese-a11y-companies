import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";
import { DataLoader } from "./data-loader.js";
import PackageJSON from "../package.json";

export class A11yJaCompaniesMCPServer extends McpAgent<Cloudflare.Env> {
  private dataLoader: DataLoader;
  server = new McpServer({
    name: PackageJSON.name,
    version: PackageJSON.version,
  });

  constructor(ctx: DurableObjectState, env: Cloudflare.Env) {
    super(ctx, env);
    this.dataLoader = new DataLoader();
  }

  async init(): Promise<void> {
    this.server.tool(
      "search_companies",
      "Search for Japanese companies with accessibility initiatives",
      {
        query: z.string().describe("Search query for company names or accessibility content"),
      },
      async ({ query }: { query: string }) => {
        const results = await this.dataLoader.searchCompanies(query);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      },
    );

    this.server.tool(
      "search_cases",
      "Search for specific accessibility cases across all companies",
      {
        query: z.string().describe("Search query for accessibility cases"),
      },
      async ({ query }: { query: string }) => {
        const results = await this.dataLoader.searchCases(query);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      },
    );

    this.server.tool(
      "list_all_companies",
      "List all companies with accessibility initiatives",
      {},
      async () => {
        const companies = await this.dataLoader.getAllCompanies();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                companies.map((c) => c.name),
                null,
                2,
              ),
            },
          ],
        };
      },
    );
  }
}

export default {
  fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      // @ts-ignore
      return A11yJaCompaniesMCPServer.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      // @ts-ignore
      return A11yJaCompaniesMCPServer.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};
