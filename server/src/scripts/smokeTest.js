/**
 * End-to-end smoke test for the auth API.
 *
 * Boots the real Express app against a throwaway in-memory MongoDB,
 * then exercises signup → duplicate signup → login → protected route.
 *
 * Run:  npm run smoke   (from the server/ folder)
 */
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

process.env.JWT_SECRET = process.env.JWT_SECRET || "smoke-test-secret";
process.env.JWT_EXPIRES_IN = "1h";
process.env.NODE_ENV = "test";

const { default: app } = await import("../app.js");
const { protect } = await import("../middleware/authMiddleware.js");

// Separate probe app for testing the JWT middleware directly
// (routes can't be registered on `app` after its 404 handler).
const express = (await import("express")).default;
const probe = express();
probe.get("/api/me", protect, (req, res) => res.json({ user: req.user }));

const BASE = `http://127.0.0.1:${process.env.PORT || 5001}`;
let passed = 0;
let failed = 0;

const check = (name, cond, extra = "") => {
  if (cond) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.error(`  ❌ ${name} ${extra}`);
  }
};

const post = (path, body, token) =>
  fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

const get = (path, token) =>
  fetch(`${BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

const mongod = await MongoMemoryServer.create();
await mongoose.connect(mongod.getUri("marvel-smoke"));

const server = app.listen(process.env.PORT || 5001, () =>
  console.log(`\n🧪 Smoke test server on ${BASE}\n`)
);
await new Promise((r) => server.on("listening", r));

const probeServer = probe.listen(0);
await new Promise((r) => probeServer.on("listening", r));
const PROBE = `http://127.0.0.1:${probeServer.address().port}`;

const probeGet = (path, token) =>
  fetch(`${PROBE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

try {
  console.log("Health:");
  {
    const res = await get("/api/health");
    const json = await res.json();
    check("GET /api/health → 200, db connected", res.status === 200 && json.db === "connected");
  }

  console.log("\nSignup:");
  let token;
  {
    const res = await post("/api/auth/signup", {
      name: "Tony Stark",
      email: "Tony.Stark@Stark.com",
      password: "jarvis123",
      favouriteHero: "Iron Man",
    });
    const json = await res.json();
    token = json.token;
    check("valid signup → 201 + token + user payload", res.status === 201 && !!token && json.user?.name === "Tony Stark");
    check("password never echoed in response", !JSON.stringify(json).toLowerCase().includes("jarvis123"));
  }
  {
    const res = await post("/api/auth/signup", {
      name: "Tony Stark",
      email: "tony.stark@stark.com", // same email, different case
      password: "jarvis123",
      favouriteHero: "Iron Man",
    });
    check("duplicate email (case-insensitive) → 409", res.status === 409);
  }
  {
    const res = await post("/api/auth/signup", { name: "", email: "x@y.com", password: "123456", favouriteHero: "" });
    check("missing fields → 400", res.status === 400);
  }

  console.log("\nLogin:");
  {
    const res = await post("/api/auth/login", { email: "tony.stark@stark.com", password: "jarvis123" });
    const json = await res.json();
    check("valid credentials → 200 + token", res.status === 200 && !!json.token);
    check("user payload includes favouriteHero", json.user?.favouriteHero === "Iron Man");
  }
  {
    const res = await post("/api/auth/login", { email: "tony.stark@stark.com", password: "wrongpass" });
    const json = await res.json();
    check("wrong password → 401", res.status === 401);
    check('wrong password message is "Incorrect email or password"', json.message === "Incorrect email or password");
  }
  {
    const res = await post("/api/auth/login", { email: "nobody@nowhere.com", password: "whatever1" });
    const json = await res.json();
    check("unknown email → 401", res.status === 401);
    check('unknown email message is "Incorrect email or password"', json.message === "Incorrect email or password");
  }
  {
    // Any password that doesn't match the stored hash must be rejected
    const res = await post("/api/auth/login", { email: "tony.stark@stark.com", password: "" });
    check("empty password → rejected (400)", res.status === 400);
  }
  {
    const res = await post("/api/auth/login", { email: "tony.stark@stark.com", password: "jarvis1234" });
    check("similar-but-wrong password → 401", res.status === 401);
  }

  console.log("\nJWT protection:");
  {
    const res = await probeGet("/api/me", token);
    const json = await res.json();
    check("valid token → 200 + decoded user", res.status === 200 && json.user?.email === "tony.stark@stark.com");
  }
  {
    const res = await probeGet("/api/me");
    check("missing token → 401", res.status === 401);
  }
  {
    const res = await probeGet("/api/me", "not.a.real.jwt");
    check("garbage token → 401", res.status === 401);
  }

  console.log("\nCurrent user (GET /api/me on the real app):");
  {
    const res = await get("/api/me", token);
    const json = await res.json();
    check(
      "valid token → 200 + name/email/favouriteHero",
      res.status === 200 &&
        json.user?.name === "Tony Stark" &&
        json.user?.email === "tony.stark@stark.com" &&
        json.user?.favouriteHero === "Iron Man"
    );
    check("password never in payload", !JSON.stringify(json).toLowerCase().includes("jarvis123"));
  }
  {
    const res = await get("/api/me");
    check("missing token → 401", res.status === 401);
  }
} finally {
  await mongoose.disconnect();
  await mongod.stop();
  server.close();
  probeServer.close();
}

console.log(`\nResult: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
