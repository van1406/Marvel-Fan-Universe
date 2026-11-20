import { useState } from "react";
  
export default function LoginForm({ onSwitch, onLoginSuccess, onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      const users = JSON.parse(localStorage.getItem("marvel_users") || "{}");
      const found = users[form.email.toLowerCase()];
      if (!found) {
        setErrors({ email: "No account found with this email" });
      } else if (found.password !== form.password) {
        setErrors({ password: "Incorrect email or password" });
      } else if (onLogin) {
        onLogin(found);
      }
    }
  };

  const handleChange = (field) => (ev) => {
    setForm((p) => ({ ...p, [field]: ev.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {/* Email */}
      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
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
        <label htmlFor="login-password">Password</label>
        <div className="password-row">
          <input
            id="login-password"
            type={showPwd ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange("password")}
            autoComplete="current-password"
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

      {/* Submit */}
      <button type="submit" className="auth-btn auth-btn--primary">
        Sign In
      </button>

      <div className="auth-divider">or</div>

      {/* Switch to Sign Up */}
      <div className="auth-footer">
        Don&apos;t have an account?{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
          Create one
        </a>
      </div>
    </form>
  );
}
