"use client";

import { useUser } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Mail,
  Calendar,
  BarChart3,
  Clock,
  Trophy,
} from "lucide-react";

export default function ProfilePage() {
  const user = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700" />
          <div className="px-8 pb-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-24">
              <div className="w-36 h-36 rounded-full bg-white dark:bg-slate-700 p-2 shadow-2xl ring-4 ring-white dark:ring-slate-900">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.displayName || "User"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-5xl font-bold">
                    {user?.displayName?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left sm:mb-4">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {user?.displayName || "User"}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <Mail className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  {user?.primaryEmail || "No email provided"}
                </p>
              </div>
              <div className="sm:mb-4">
                <Button className="rounded-full bg-cyan-600 hover:bg-cyan-700 text-white px-6 shadow-sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              {[
                { label: "Sessions", value: "0", icon: <Clock className="h-5 w-5" /> },
                { label: "Hours", value: "0", icon: <BarChart3 className="h-5 w-5" /> },
                { label: "Achievements", value: "0", icon: <Trophy className="h-5 w-5" /> },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-sm p-5 flex flex-col items-center hover:shadow-md transition"
                >
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-indigo-600 text-white rounded-lg mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-2xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-cyan-700 dark:text-cyan-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Activity</h3>
              </div>
              <div className="space-y-4">
                {["This Week", "This Month", "Total Time"].map((label, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">0 hrs</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-2xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Trophy className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Achievements</h3>
              </div>
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Start practicing to earn your first achievement
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-2xl shadow-md p-8 hover:shadow-lg transition">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Account Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-2">
                     Name
                  </label>
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                    <p className="text-slate-900 dark:text-white">
                      {user?.displayName || "Not set"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-2">
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-between">
                    <p className="text-slate-900 dark:text-white">
                      {user?.primaryEmail || "Not set"}
                    </p>
                    <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                      ✅ Verified
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-2  items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </label>
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                    <p className="text-slate-900 dark:text-white">
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Preferences
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3">
                    <span className="text-slate-700 dark:text-slate-300">
                      Email Notifications
                    </span>
                    <button
                      className="group relative inline-flex h-7 w-12 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition hover:bg-slate-300 dark:hover:bg-slate-600"
                      aria-label="Toggle email notifications"
                    >
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-300 transition translate-x-1 group-hover:translate-x-2 shadow" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-slate-700 dark:text-slate-300">
                      Session Reminders
                    </span>
                    <button
                      className="group relative inline-flex h-7 w-12 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition hover:bg-slate-300 dark:hover:bg-slate-600"
                      aria-label="Toggle session reminders"
                    >
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-300 transition translate-x-1 group-hover:translate-x-2 shadow" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800 p-6">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
                Delete Account
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-400 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive" className="w-full sm:w-auto">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
