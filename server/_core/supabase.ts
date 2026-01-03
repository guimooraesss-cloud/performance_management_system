import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase environment variables not set. Some features may not work."
  );
}

// Client-side client (limited access)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role (full access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Get authenticated user from Supabase
 */
export async function getSupabaseUser(token: string) {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) throw error;
    return user;
  } catch (error) {
    console.error("Error getting Supabase user:", error);
    return null;
  }
}

/**
 * Get user session from token
 */
export async function verifySupabaseToken(token: string) {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split("@")[0],
      role: (user.user_metadata?.role as "admin" | "user" | "leader") || "user",
    };
  } catch (error) {
    console.error("Error verifying Supabase token:", error);
    return null;
  }
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Users
  async getUser(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  async createUser(user: {
    id: string;
    email: string;
    name: string;
    role: "admin" | "user" | "leader";
  }) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert([user])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUser(
    userId: string,
    updates: Partial<{
      name: string;
      role: string;
      department: string;
    }>
  ) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Evaluations
  async getEvaluation(evaluationId: string) {
    const { data, error } = await supabaseAdmin
      .from("evaluations")
      .select("*")
      .eq("id", evaluationId)
      .single();

    if (error) throw error;
    return data;
  },

  async createEvaluation(evaluation: {
    employee_id: string;
    evaluator_id: string;
    cycle_id: string;
    status: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from("evaluations")
      .insert([evaluation])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEvaluation(
    evaluationId: string,
    updates: Partial<{
      status: string;
      overall_score: number;
      feedback: string;
      submitted_at: string;
    }>
  ) {
    const { data, error } = await supabaseAdmin
      .from("evaluations")
      .update(updates)
      .eq("id", evaluationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Competencies
  async getCompetencies() {
    const { data, error } = await supabaseAdmin
      .from("competencies")
      .select("*");

    if (error) throw error;
    return data;
  },

  async getCompetenciesByCategory(category: string) {
    const { data, error } = await supabaseAdmin
      .from("competencies")
      .select("*")
      .eq("category", category);

    if (error) throw error;
    return data;
  },

  async createCompetency(competency: {
    name: string;
    description: string;
    category: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from("competencies")
      .insert([competency])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Cycles
  async getCycles() {
    const { data, error } = await supabaseAdmin
      .from("cycles")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getActiveCycle() {
    const { data, error } = await supabaseAdmin
      .from("cycles")
      .select("*")
      .eq("status", "active")
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  async createCycle(cycle: {
    name: string;
    start_date: string;
    end_date: string;
    status: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from("cycles")
      .insert([cycle])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Positions
  async getPositions() {
    const { data, error } = await supabaseAdmin
      .from("positions")
      .select("*");

    if (error) throw error;
    return data;
  },

  async getPosition(positionId: string) {
    const { data, error } = await supabaseAdmin
      .from("positions")
      .select("*")
      .eq("id", positionId)
      .single();

    if (error) throw error;
    return data;
  },

  async createPosition(position: {
    name: string;
    description: string;
    department: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from("positions")
      .insert([position])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Position Competencies (Weights)
  async getPositionCompetencies(positionId: string) {
    const { data, error } = await supabaseAdmin
      .from("position_competencies")
      .select("*, competencies(*)")
      .eq("position_id", positionId);

    if (error) throw error;
    return data;
  },

  async updatePositionCompetencyWeight(
    positionId: string,
    competencyId: string,
    weight: number
  ) {
    const { data, error } = await supabaseAdmin
      .from("position_competencies")
      .update({ weight })
      .eq("position_id", positionId)
      .eq("competency_id", competencyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Authorizations
  async getAuthorizations(evaluatorId: string) {
    const { data, error } = await supabaseAdmin
      .from("authorizations")
      .select("*")
      .eq("evaluator_id", evaluatorId);

    if (error) throw error;
    return data;
  },

  async createAuthorization(authorization: {
    evaluator_id: string;
    employee_id: string;
    cycle_id: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from("authorizations")
      .insert([authorization])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async approveAuthorization(authorizationId: string) {
    const { data, error } = await supabaseAdmin
      .from("authorizations")
      .update({ status: "approved" })
      .eq("id", authorizationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async rejectAuthorization(authorizationId: string) {
    const { data, error } = await supabaseAdmin
      .from("authorizations")
      .update({ status: "rejected" })
      .eq("id", authorizationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
