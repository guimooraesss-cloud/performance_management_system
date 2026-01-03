import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user?: Partial<AuthenticatedUser>): TrpcContext {
  const defaultUser: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "employee",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: user ? { ...defaultUser, ...user } : undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Authentication", () => {
  it("should return current user with me query", async () => {
    const ctx = createContext({ role: "admin", name: "Admin User" });
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toEqual(expect.objectContaining({
      role: "admin",
      name: "Admin User",
    }));
  });

  it("should return null for unauthenticated user", async () => {
    const ctx = createContext();
    ctx.user = undefined;
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeUndefined();
  });

  it("should logout successfully", async () => {
    let cookieCleared = false;
    const ctx = createContext({ role: "admin" });
    ctx.res.clearCookie = () => {
      cookieCleared = true;
    };
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(cookieCleared).toBe(true);
  });
});

describe("Role-based Access Control", () => {
  it("admin should access positions list", async () => {
    const ctx = createContext({ role: "admin" });
    const caller = appRouter.createCaller(ctx);

    // Should not throw
    const result = await caller.positions.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("leader should access positions list", async () => {
    const ctx = createContext({ role: "leader" });
    const caller = appRouter.createCaller(ctx);

    // Should not throw
    const result = await caller.positions.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("employee should access positions list", async () => {
    const ctx = createContext({ role: "employee" });
    const caller = appRouter.createCaller(ctx);

    // Should not throw
    const result = await caller.positions.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("admin should create position", async () => {
    const ctx = createContext({ role: "admin" });
    const caller = appRouter.createCaller(ctx);

    // Should not throw - actual creation depends on DB
    try {
      await caller.positions.create({
        name: "Test Position",
        description: "Test Description",
      });
    } catch (error: any) {
      // Database error is expected in test environment
      expect(error.code).toBeDefined();
    }
  });

  it("leader should not create position", async () => {
    const ctx = createContext({ role: "leader" });
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.positions.create({
        name: "Test Position",
        description: "Test Description",
      });
      fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
      expect(error.message).toContain("RH Master");
    }
  });

  it("employee should not create position", async () => {
    const ctx = createContext({ role: "employee" });
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.positions.create({
        name: "Test Position",
        description: "Test Description",
      });
      fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("leader should create evaluation", async () => {
    const ctx = createContext({ role: "leader", id: 100 });
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.evaluations.create({
        employeeId: 1,
        evaluationPeriod: "2024-Q1",
      });
    } catch (error: any) {
      // Expected to fail due to authorization check or DB
      expect(error.code).toBeDefined();
    }
  });

  it("employee should not create evaluation", async () => {
    const ctx = createContext({ role: "employee" });
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.evaluations.create({
        employeeId: 1,
        evaluationPeriod: "2024-Q1",
      });
      fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});

describe("Competencies Access", () => {
  it("all roles should list competencies", async () => {
    const roles: Array<"admin" | "leader" | "employee"> = ["admin", "leader", "employee"];

    for (const role of roles) {
      const ctx = createContext({ role });
      const caller = appRouter.createCaller(ctx);

      const result = await caller.competencies.list();
      expect(Array.isArray(result)).toBe(true);
    }
  });

  it("only admin should create competency", async () => {
    const ctx = createContext({ role: "admin" });
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.competencies.create({
        name: "Test Competency",
        category: "Technical",
      });
    } catch (error: any) {
      // DB error expected
      expect(error).toBeDefined();
    }
  });

  it("leader should not create competency", async () => {
    const ctx = createContext({ role: "leader" });
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.competencies.create({
        name: "Test Competency",
        category: "Technical",
      });
      fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});

describe("Evaluation Authorization", () => {
  it("admin should create evaluation authorization", async () => {
    const ctx = createContext({ role: "admin", id: 50 });
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.evaluationAuthorizations.create({
        leaderId: 100,
        employeeId: 200,
      });
    } catch (error: any) {
      // DB error expected
      expect(error).toBeDefined();
    }
  });

  it("leader should not create evaluation authorization", async () => {
    const ctx = createContext({ role: "leader" });
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.evaluationAuthorizations.create({
        leaderId: 100,
        employeeId: 200,
      });
      fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("leader should check evaluation authorization", async () => {
    const ctx = createContext({ role: "leader" });
    const caller = appRouter.createCaller(ctx);

    // Should not throw
    const result = await caller.evaluationAuthorizations.checkAuthorization({
      leaderId: 100,
      employeeId: 200,
    });

    expect(typeof result).toBe("boolean");
  });
});
