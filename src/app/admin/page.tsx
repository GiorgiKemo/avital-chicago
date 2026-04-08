import Link from "next/link";
import { Palette, ImageIcon } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8 lg:p-12">
      <div>
        <h1 className="font-serif text-4xl text-white">Dashboard Overview</h1>
        <p className="mt-2 text-white/50">
          Welcome to the Avital Chicago admin workspace. Select an area below to manage the site.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link 
          href="/admin/appearance" 
          className="group rounded-[24px] border border-white/10 bg-[#121216] p-8 transition-all hover:bg-white/5 hover:border-[#d4145a]"
        >
          <Palette className="h-10 w-10 text-[#d4145a] mb-6" />
          <h2 className="text-xl font-serif text-white group-hover:text-[#d4145a] transition-colors">Appearance Settings</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/50">Customize the site&apos;s primary colors, background tones, and glasscard opacities instantly without needing developers.</p>
        </Link>

        <Link 
          href="/admin/media" 
          className="group rounded-[24px] border border-white/10 bg-[#121216] p-8 transition-all hover:bg-white/5 hover:border-[#d4145a]"
        >
          <ImageIcon className="h-10 w-10 text-[#d4145a] mb-6" />
          <h2 className="text-xl font-serif text-white group-hover:text-[#d4145a] transition-colors">Media Studio</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/50">Upload new high-resolution images, manage the master gallery, and override default vehicle preview photos globally.</p>
        </Link>
      </div>
    </div>
  );
}
