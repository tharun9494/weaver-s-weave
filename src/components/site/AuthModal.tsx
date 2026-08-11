import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Mail, Lock, User, Phone, MapPin, Loader2, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export function AuthModal() {
  const {
    user,
    profile,
    isAuthModalOpen,
    closeAuthModal,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    updateProfile,
    skipProfileCompletion,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Profile completion fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // Automatically close modal when login and profile completion are both finished
  useEffect(() => {
    if (user && profile && profile.profileCompleted && isAuthModalOpen) {
      closeAuthModal();
      // Reset form fields
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
      setPhone("");
      setAddress("");
    }
  }, [user, profile, isAuthModalOpen, closeAuthModal]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      if (activeTab === "login") {
        await signInWithEmail(email, password);
        toast.success("Welcome back!");
      } else {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setSubmitting(false);
          return;
        }
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setSubmitting(false);
          return;
        }
        await signUpWithEmail(email, password);
        toast.success("Account created successfully!");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Authentication failed. Please check details.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
      toast.success("Successfully logged in!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      toast.error("Please fill out all profile fields or click Skip");
      return;
    }

    setSubmitting(true);
    try {
      await updateProfile({
        name: fullName,
        phone,
        address,
      });
      toast.success("Profile saved! Welcome to Sahaana.");
      closeAuthModal();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkipProfile = async () => {
    setSubmitting(true);
    try {
      await skipProfileCompletion();
      toast.info("Profile setup skipped. You can update it anytime in your dashboard.");
      closeAuthModal();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={closeAuthModal}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md rounded-3xl border border-accent/25 bg-card p-6 shadow-luxe sm:p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeAuthModal}
              className="absolute right-5 top-5 rounded-full border border-border p-1.5 text-foreground hover:bg-secondary cursor-pointer"
              aria-label="Close modal"
            >
              <X className="size-4" />
            </button>

            {/* Profile Completion Panel */}
            {user && profile && !profile.profileCompleted ? (
              <div>
                <p className="eyebrow">Welcome to Sahaana</p>
                <h3 className="mt-3 font-display text-3xl text-foreground">Complete profile</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Please share your coordinates for shipping direct from loom clusters.
                </p>

                <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="modalFullName"
                      className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      Full Name
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-4 flex items-center text-muted-foreground/60">
                        <User className="size-4" strokeWidth={1.5} />
                      </span>
                      <input
                        id="modalFullName"
                        type="text"
                        required
                        placeholder="Anya Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-full border border-border bg-transparent py-2.5 pl-10 pr-4 text-xs transition-all focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="modalPhone"
                      className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      Phone Number
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-4 flex items-center text-muted-foreground/60">
                        <Phone className="size-4" strokeWidth={1.5} />
                      </span>
                      <input
                        id="modalPhone"
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-full border border-border bg-transparent py-2.5 pl-10 pr-4 text-xs transition-all focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="modalAddress"
                      className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      Delivery Address
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute left-4 top-3 text-muted-foreground/60">
                        <MapPin className="size-4" strokeWidth={1.5} />
                      </span>
                      <textarea
                        id="modalAddress"
                        required
                        rows={2}
                        placeholder="Street, Landmark, City, State - Zipcode"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full rounded-xl border border-border bg-transparent py-2 pl-10 pr-4 text-xs transition-all focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-[10px] uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/95 disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <>
                          Save & Finish <ArrowRight className="size-3" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleSkipProfile}
                      className="w-full rounded-full border border-border bg-transparent py-3 text-[10px] uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                    >
                      Skip details
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* TABBED SIGN IN / SIGN UP */
              <div>
                <p className="eyebrow">The Loom Network</p>
                <h3 className="mt-3 font-display text-3xl text-foreground">Sahaana Account</h3>

                {/* Tabs */}
                <div className="mt-6 flex border-b border-border/60">
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className={`flex-1 pb-3 text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === "login"
                        ? "border-b-2 border-accent font-semibold text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className={`flex-1 pb-3 text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === "register"
                        ? "border-b-2 border-accent font-semibold text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Google Sign In */}
                <div className="mt-6">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-card py-3 text-[11px] font-medium text-foreground shadow-soft transition-all hover:bg-secondary cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <svg className="size-3.5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.8-2.6 3l1.83 1.4c3.08-2.85 4.86-7.05 4.86-11.25z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.82-2.13-6.78-5.01L1.3 15.65c2.01 4 6.16 6.35 10.7 6.35z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.22 14.24c-.25-.72-.39-1.5-.39-2.24s.14-1.52.39-2.24L1.3 6.76C.47 8.4.01 10.16.01 12s.46 3.6 1.29 5.24l3.92-3z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 7.46 0 3.31 2.35 1.3 6.35l3.92 3.04c.96-2.88 3.63-5.01 6.78-5.01z"
                          />
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </button>
                </div>

                <div className="relative mt-6 flex items-center justify-center">
                  <span className="absolute w-full border-t border-border/60"></span>
                  <span className="relative bg-card px-3 text-[9px] uppercase tracking-widest text-muted-foreground">
                    or use email
                  </span>
                </div>

                {/* Email Sign In / Sign Up Form */}
                <form onSubmit={handleAuthSubmit} className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="modalEmail"
                      className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      Email Address
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-4 flex items-center text-muted-foreground/60">
                        <Mail className="size-4" strokeWidth={1.5} />
                      </span>
                      <input
                        id="modalEmail"
                        type="email"
                        required
                        placeholder="anya@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-full border border-border bg-transparent py-2.5 pl-10 pr-4 text-xs transition-all focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="modalPassword"
                      className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      Password
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-4 flex items-center text-muted-foreground/60">
                        <Lock className="size-4" strokeWidth={1.5} />
                      </span>
                      <input
                        id="modalPassword"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-full border border-border bg-transparent py-2.5 pl-10 pr-4 text-xs transition-all focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  {activeTab === "register" && (
                    <div>
                      <label
                        htmlFor="modalConfirmPassword"
                        className="block text-[10px] uppercase tracking-wider text-muted-foreground"
                      >
                        Confirm Password
                      </label>
                      <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-4 flex items-center text-muted-foreground/60">
                          <Lock className="size-4" strokeWidth={1.5} />
                        </span>
                        <input
                          id="modalConfirmPassword"
                          type="password"
                          required
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full rounded-full border border-border bg-transparent py-2.5 pl-10 pr-4 text-xs transition-all focus:border-accent focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-[10px] uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/95 disabled:opacity-50 cursor-pointer pt-2.5"
                  >
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : activeTab === "login" ? (
                      "Sign In"
                    ) : (
                      "Register & Continue"
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
