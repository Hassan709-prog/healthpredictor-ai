import { createFileRoute } from "@tanstack/react-router";
import { UserLayout } from "@/components/layouts/UserLayout";
import { Camera, KeyRound, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: "My Profile — HealthPredictor" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <UserLayout title="My Profile" breadcrumb={["Dashboard", "My Profile"]}>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft text-center">
          <div className="relative mx-auto h-28 w-28">
            <div className="h-28 w-28 rounded-full bg-gradient-hero text-primary-foreground grid place-items-center text-3xl font-bold">
              SJ
            </div>
            <button className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-card border border-border grid place-items-center shadow-soft">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <h2 className="mt-4 text-xl font-semibold">Sarah Johnson</h2>
          <p className="text-sm text-muted-foreground">sarah@example.com</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted/40 rounded-xl p-3">
              <div className="text-xs text-muted-foreground">Age</div>
              <div className="font-semibold">32</div>
            </div>
            <div className="bg-muted/40 rounded-xl p-3">
              <div className="text-xs text-muted-foreground">Gender</div>
              <div className="font-semibold">Female</div>
            </div>
          </div>
          <Button variant="outline" className="mt-6 w-full"><KeyRound className="h-4 w-4" /> Change Password</Button>
        </div>

        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-soft">
          <h3 className="font-semibold">Edit Profile</h3>
          <p className="text-sm text-muted-foreground mt-1">Update your personal information.</p>

          <form className="mt-6 grid sm:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="sm:col-span-2"><Label className="mb-1.5 block">Full Name</Label><Input defaultValue="Sarah Johnson" /></div>
            <div className="sm:col-span-2"><Label className="mb-1.5 block">Email</Label><Input type="email" defaultValue="sarah@example.com" /></div>
            <div><Label className="mb-1.5 block">Age</Label><Input type="number" defaultValue={32} /></div>
            <div><Label className="mb-1.5 block">Gender</Label><Input defaultValue="Female" /></div>
            <div className="sm:col-span-2"><Label className="mb-1.5 block">Phone</Label><Input defaultValue="+1 (555) 234-5678" /></div>

            <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
              <Button variant="outline" type="button">Cancel</Button>
              <Button type="submit"><Save className="h-4 w-4" /> Save Changes</Button>
            </div>
          </form>
        </div>
      </div>
    </UserLayout>
  );
}
