"use client";

import { UserButton, useUser } from "@stackframe/stack";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  ArrowLeft, 
  Home, 
  Clock, 
  MessageSquare,
  User,
  Settings
} from "lucide-react";
import { ModeToggle } from "@/app/components/mode-toggle";

export function DashboardNavbar() {
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const isDiscussionRoom = pathname?.includes('/discussion-room/');
  const isProfile = pathname?.includes('/profile');
  const isDashboard = pathname === '/dashboard';

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {(isDiscussionRoom || isProfile) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            )}

            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
                AI Coach
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                isDashboard 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <Link 
              href="/dashboard/history" 
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                pathname?.includes('/history')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>History</span>
            </Link>

            {isDiscussionRoom && (
              <div className="flex items-center gap-2 px-3 py-2 text-blue-600 dark:text-blue-400">
                <MessageSquare className="h-4 w-4" />
                <span className="font-medium">Interview Session</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            
            <Link href="/dashboard/profile">
              <Button 
                variant={isProfile ? "default" : "ghost"}
                size="sm"
                className={isProfile ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" : ""}
              >
                <User className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </Link>

            <UserButton />
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-gray-200 dark:border-gray-800 px-4 py-2">
        <div className="flex items-center justify-around">
          <Link 
            href="/dashboard" 
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
              isDashboard 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          <Link 
            href="/dashboard/history" 
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
              pathname?.includes('/history')
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Clock className="h-5 w-5" />
            <span className="text-xs font-medium">History</span>
          </Link>

          {isDiscussionRoom && (
            <div className="flex flex-col items-center gap-1 px-3 py-2 text-blue-600 dark:text-blue-400">
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs font-medium">Session</span>
            </div>
          )}

          <Link 
            href="/dashboard/profile" 
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
              isProfile
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function ProfilePage() {
  const user = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <DashboardNavbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 -mt-16">
              <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-800 p-2 shadow-xl">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt={user.displayName || "User"} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                    {user?.displayName?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left mt-4 sm:mt-16">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user?.displayName || "User"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {user?.primaryEmail || "No email provided"}
                </p>
              </div>

              <div className="mt-4 sm:mt-16">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Achievements</div>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Display Name</div>
                    <div className="font-medium text-gray-900 dark:text-white mt-1">
                      {user?.displayName || "Not set"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                    <div className="font-medium text-gray-900 dark:text-white mt-1">
                      {user?.primaryEmail || "Not set"}
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                    Verified
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Member Since</div>
                    <div className="font-medium text-gray-900 dark:text-white mt-1">
                      {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 border-2 border-red-200 dark:border-red-800 rounded-2xl">
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}