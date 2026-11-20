import { useState } from "react";

const MARVEL_HEROES = [
  "Iron Man",
  "Spider-Man",
  "Captain America",
  "Thor",
  "Black Panther",
  "Doctor Strange",
  "Black Widow",
  "Hulk",
  "Wolverine",
  "Scarlet Witch",
  "Deadpool",
  "Ant-Man",
  "Captain Marvel",
  "Storm",
  "Daredevil",
  "Punisher",
  "Luke Cage",
  "Jessica Jones",
  "Moon Knight",
  "Shang-Chi",
];

export default function SignUpForm({ onSwitch, onSignUp }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    favouriteHero: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm password";
    else if (form.confirmPassword !== form.password)
      e.confirmPassword = "Passwords do not match";
    if (!form.favouriteHero) e.favouriteHero = "Choose a superhero";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      const users = JSON.parse(localStorage.getItem("marvel_users") || "{}");
      const key = form.email.toLowerCase();
      if (users[key]) {
        setErrors({ email: "Email is already registered. Try signing in." });
        return;
      }
      const user = {
        name: form.name,
        email: form.email,
        password: form.password,
        favouriteHero: form.favouriteHero,
      };
      users[key] = user;
      localStorage.setItem("marvel_users", JSON.stringify(users));
      if (onSignUp) onSignUp(user);
    }
  };

  const handleChange = (field) => (ev) => {
    setForm((p) => ({ ...p, [field]: ev.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {/* Name */}
      <div className="form-group">
        <label htmlFor="signup-name">Full Name</label>
        <input
          id="signup-name"
          type="text"
          placeholder="Tony Stark"
          value={form.name}
          onChange={handleChange("name")}
          autoComplete="name"
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          placeholder="tony.stark@starkindustries.com"
          value={form.email}
          onChange={handleChange("email")}
          autoComplete="email"
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      {/* Password */}
      <div className="form-group">
        <label htmlFor="signup-password">Password</label>
        <div className="password-row">
          <input
            id="signup-password"
            type={showPwd ? "text" : "password"}
            placeholder="Create a strong password"
            value={form.password}
            onChange={handleChange("password")}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPwd((v) => !v)}
            aria-label={showPwd ? "Hide password" : "Show password"}
          >
            {showPwd ? "🙈" : "👁"}
          </button>
        </div>
        {errors.password && (
          <span className="field-error">{errors.password}</span>
        )}
      </div>

      {/* Confirm Password */}
      <div className="form-group">
        <label htmlFor="signup-confirm">Confirm Password</label>
        <div className="password-row">
          <input
            id="signup-confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? "🙈" : "👁"}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className="field-error">{errors.confirmPassword}</span>
        )}
      </div>

      {/* Favourite Superhero */}
      <div className="form-group">
        <label htmlFor="signup-hero">Favourite Marvel Superhero</label>
        <select
          id="signup-hero"
          value={form.favouriteHero}
          onChange={handleChange("favouriteHero")}
        >
          <option value="">— Choose your hero —</option>
          {MARVEL_HEROES.map((hero) => (
            <option key={hero} value={hero}>
              {hero}
            </option>
          ))}
        </select>
        {errors.favouriteHero && (
          <span className="field-error">{errors.favouriteHero}</span>
        )}
      </div>

      {/* Submit */}
      <button type="submit" className="auth-btn auth-btn--primary">
        Create Account
      </button>

      <div className="auth-divider">or</div>

      {/* Switch to Login */}
      <div className="auth-footer">
        Already have an account?{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
          Sign in
        </a>
      </div>
    </form>
  );
}
