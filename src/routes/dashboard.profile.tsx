import { createFileRoute } from "@tanstack/react-router";
import { UserLayout } from "@/components/layouts/UserLayout";
import { KeyRound, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: "My Profile — HealthPredictor" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [age, setAge] = useState(String(user?.age ?? ""));
  const [gender, setGender] = useState(user?.gender ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const initials = user?.name
    ? user.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess(false);
    try {
      const { api } = await import("@/lib/api");
      await api.auth.updateMe({
        name: name || undefined,
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
      });
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <UserLayout title="My Profile" breadcrumb={["Dashboard", "My Profile"]}>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft text-center">
          <div className="relative mx-auto h-28 w-28">
            <div className="h-28 w-28 rounded-full bg-gradient-hero text-primary-foreground grid place-items-center text-3xl font-bold">
              {initials}
            </div>
          </div>
          <h2 className="mt-4 text-xl font-semibold">{user?.name ?? "—"}</h2>
          <p className="text-sm text-muted-foreground">{user?.email ?? "—"}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted/40 rounded-xl p-3">
              <div className="text-xs text-muted-foreground">Age</div>
              <div className="font-semibold">{user?.age ?? "—"}</div>
            </div>
            <div className="bg-muted/40 rounded-xl p-3">
              <div className="text-xs text-muted-foreground">Gender</div>
              <div className="font-semibold">{user?.gender ?? "—"}</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Role: <span className="font-semibold capitalize">{user?.role}</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
          </div>
          <Button variant="outline" className="mt-6 w-full"><KeyRound className="h-4 w-4" /> Change Password</Button>
        </div>

        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-soft">
          <h3 className="font-semibold">Edit Profile</h3>
          <p className="text-sm text-muted-foreground mt-1">Update your personal information.</p>

          <form className="mt-6 grid sm:grid-cols-2 gap-4" onSubmit={handleSave}>
            <div className="sm:col-span-2">
              <Label className="mb-1.5 block">Full Name</Label>
              <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-1.5 block">Email</Label>
              <Input type="email" value={user?.email ?? ""} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
            </div>
            <div>
              <Label className="mb-1.5 block">Age</Label>
              <Input id="profile-age" type="number" value={age} onChange={(e) => setAge(e.target.value)} min={1} max={120} />
            </div>
            <div>
              <Label className="mb-1.5 block">Gender</Label>
              <Input id="profile-gender" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Male / Female / Other" />
            </div>

            {error && <div className="sm:col-span-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}
            {success && <div className="sm:col-span-2 rounded-lg bg-success/10 border border-success/20 px-4 py-3 text-sm text-success">Profile updated successfully!</div>}

            <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> Save Changes</>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </UserLayout>
  );
}
