import { getSiteSettings } from "@/lib/site-settings";
import { updateThemeSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function AppearancePage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8 lg:p-12">
      <div>
        <h1 className="font-serif text-4xl text-white">Appearance Settings</h1>
        <p className="mt-2 text-white/50">
          Customize the global colors and styling of the website. Changes are immediately reflected across all pages.
        </p>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-[#121216] p-8 shadow-2xl">
        <form action={updateThemeSettings} className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Primary Color */}
            <div className="space-y-3">
              <label htmlFor="theme_primary_color" className="text-sm font-medium text-white/80">Primary Accent Color</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  id="theme_primary_color"
                  name="theme_primary_color"
                  defaultValue={settings.theme_primary_color || "#d4145a"}
                  className="h-12 w-14 cursor-pointer rounded-lg bg-transparent p-0 border-0"
                />
                <input
                  type="text"
                  defaultValue={settings.theme_primary_color || "#d4145a"}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#d4145a]"
                  readOnly
                />
              </div>
              <p className="text-xs text-white/40">Used for buttons, hover states, and neon glows.</p>
            </div>

            {/* Background Color */}
            <div className="space-y-3">
              <label htmlFor="theme_background_color" className="text-sm font-medium text-white/80">Global Background Color</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  id="theme_background_color"
                  name="theme_background_color"
                  defaultValue={settings.theme_background_color || "#08080a"}
                  className="h-12 w-14 cursor-pointer rounded-lg bg-transparent p-0 border-0"
                />
                <input
                  type="text"
                  defaultValue={settings.theme_background_color || "#08080a"}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#d4145a]"
                  readOnly
                />
              </div>
            </div>

            {/* Glassmorphism Background */}
            <div className="col-span-full space-y-3">
              <label htmlFor="theme_glass_bg" className="text-sm font-medium text-white/80">Glass Card Overlay (RGBA)</label>
              <input
                type="text"
                id="theme_glass_bg"
                name="theme_glass_bg"
                defaultValue={settings.theme_glass_bg || "rgba(20, 20, 24, 0.6)"}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#d4145a]"
              />
              <p className="text-xs text-white/40">The semi-transparent background color used for floating glass cards. Must be an RGBA value for transparency.</p>
            </div>

          </div>

          <div className="flex justify-end border-t border-white/10 pt-8">
            <button
              type="submit"
              className="rounded-full bg-[#d4145a] px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black"
            >
              Save Appearance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
