import {
  LockIcon,
  MapPinIcon,
  PackageIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import PersonalInformationTab from "./PersonalInformationTab";
import AddressesTab from "./AddressesTab";
import ChangePasswordTab from "./ChangePasswordTab";
import OrderHistoryTab from "./OrderHistoryTab";
import type { UserProfile } from "../../types/user";
import { getMeApi } from "../../api/authApi";
import { getInitials } from "../../utils/format";

type TabKey = "information" | "addresses" | "password" | "orders";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  {
    key: "information",
    label: "Personal information",
    icon: <UserCircleIcon size={20} weight="fill" />,
  },
  {
    key: "addresses",
    label: "Addresses",
    icon: <MapPinIcon size={20} weight="fill" />,
  },
  {
    key: "password",
    label: "Change password",
    icon: <LockIcon size={20} weight="fill" />,
  },
  {
    key: "orders",
    label: "Order history",
    icon: <PackageIcon size={20} weight="fill" />,
  },
];

const ProfileSkeleton = () => (
  <div className="w-full px-6 md:px-10 lg:px-14 py-8 animate-pulse">
    <div className="h-7 w-40 bg-neutral-200 rounded-md mb-5" />
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="w-full md:w-[200px] flex-shrink-0">
        <div className="hidden md:flex items-center gap-2.5 p-3 bg-neutral-50 rounded-xl mb-3.5">
          <div className="w-[38px] h-[38px] rounded-full bg-neutral-200 flex-shrink-0" />
          <div className="h-3.5 w-24 bg-neutral-200 rounded" />
        </div>
        <div className="flex md:flex-col gap-1 md:gap-0.5">
          {tabs.map((t) => (
            <div
              key={t.key}
              className="h-10 w-full bg-neutral-100 rounded-lg"
            />
          ))}
        </div>
      </div>
      <div className="w-full flex-1 bg-white border border-neutral-200 rounded-xl p-5 md:p-7 min-h-[380px]">
        <div className="w-14 h-14 rounded-full bg-neutral-200 mb-6" />
        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
          <div className="h-9 bg-neutral-100 rounded-lg" />
          <div className="h-9 bg-neutral-100 rounded-lg" />
        </div>
        <div className="h-9 bg-neutral-100 rounded-lg" />
      </div>
    </div>
  </div>
);

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("information");
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    getMeApi().then((res) => setUser(res.data));
  }, []);

  if (!user) {
    return <ProfileSkeleton />;
  }

  const initials = getInitials(user.full_name);

  return (
    <div className="w-full px-6 md:px-10 lg:px-14 py-8">
      <h1 className="font-serif text-2xl tracking-wide mb-5">My account</h1>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar */}
        <div className="w-full md:w-[220px] flex-shrink-0">
          {/* Mini user card - always visible, keeps identity anchored even on mobile */}
          <div className="flex items-center gap-2.5 p-3 bg-neutral-50 rounded-xl mb-3.5">
            <div className="w-[38px] h-[38px] rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-[13px] font-medium truncate">
                {user.full_name}
              </p>
            </div>
          </div>

          {/* Tabs: dọc trên desktop, cuộn ngang trên mobile */}
          <div className="flex md:flex-col gap-1 md:gap-0.5 overflow-x-auto md:overflow-visible pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left whitespace-nowrap transition-colors border-l-2 ${
                  activeTab === t.key
                    ? "bg-neutral-100 font-medium text-black border-black"
                    : "text-neutral-500 hover:bg-neutral-50 border-transparent"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="w-full flex-1 bg-white border border-neutral-200 rounded-xl p-5 md:p-7 min-h-[380px]">
          {activeTab === "information" && (
            <PersonalInformationTab user={user} onUpdate={setUser} />
          )}
          {activeTab === "addresses" && <AddressesTab />}
          {activeTab === "password" && <ChangePasswordTab />}
          {activeTab === "orders" && <OrderHistoryTab />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
