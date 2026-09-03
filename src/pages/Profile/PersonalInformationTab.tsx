import { CheckIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { useState } from "react";
import type { UserProfile } from "../../types/user";
import { updateProfileApi } from "../../api/authApi";
import { getInitials } from "../../utils/format";

type PersonalInformationTabProps = {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
};

const PersonalInformationTab = ({
  user,
  onUpdate,
}: PersonalInformationTabProps) => {
  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: user.full_name,
    phone: user.phone ?? "",
  });

  const initials = getInitials(user.full_name);

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [field]: e.target.value });

  const handleCancel = () => {
    setForm({ fullName: user.full_name, phone: user.phone ?? "" });
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfileApi({
        full_name: form.fullName,
        phone: form.phone,
      });
      onUpdate(res.data);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (isEditing: boolean) =>
    `w-full h-9 px-3 border rounded-lg text-sm transition-colors ${
      isEditing
        ? "border-neutral-900 bg-white"
        : "border-neutral-300 bg-neutral-50 text-neutral-500 cursor-default"
    }`;

  return (
    <div>
      {/* Avatar */}
      <div className="flex items-center gap-3.5 mb-6">
        <div className="w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center text-lg font-medium flex-shrink-0">
          {initials}
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            className="h-8 px-3.5 border border-neutral-300 rounded-lg text-xs font-medium hover:bg-neutral-50 w-fit"
          >
            Change photo
          </button>
          <span className="text-[11px] text-neutral-400">
            JPG or PNG, up to 5MB
          </span>
        </div>
      </div>

      {/* Full name + Phone + Email */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">
        <div>
          <label className="block text-xs text-neutral-400 mb-1">
            Full name
          </label>
          <input
            value={form.fullName}
            onChange={handleChange("fullName")}
            disabled={!editing}
            className={inputClass(editing)}
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 mb-1">
            Phone number
          </label>
          <input
            value={form.phone}
            onChange={handleChange("phone")}
            disabled={!editing}
            className={inputClass(editing)}
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 mb-1">
            Email address
          </label>
          <div className="flex items-center justify-between h-9 px-3 border border-neutral-200 rounded-lg bg-neutral-50">
            <span className="text-sm text-neutral-500 truncate">
              {user.email}
            </span>
            <span className="text-[11px] text-neutral-400 flex items-center gap-1 flex-shrink-0 ml-2">
              <CheckIcon size={13} /> Verified
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5">
        {editing ? (
          <>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="h-9 px-4 border border-neutral-300 rounded-lg text-[13px] font-medium hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-9 px-4 bg-black text-white rounded-lg text-[13px] font-medium hover:bg-neutral-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="h-9 px-4 border border-neutral-300 rounded-lg text-[13px] font-medium hover:bg-neutral-50 flex items-center gap-1.5"
          >
            <PencilSimpleIcon size={14} /> Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default PersonalInformationTab;
