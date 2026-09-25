import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import {
  getAddressesApi,
  createAddressApi,
  updateAddressApi,
  deleteAddressApi,
} from "../../api/addressesApi";
import type { Address } from "../../types/address";

const emptyForm = {
  recipient_name: "",
  phone: "",
  address_line: "",
  ward: "",
  district: "",
  province: "",
};

const AddressesTab = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const fetchAddresses = async () => {
    const res = await getAddressesApi();
    return res.data;
  };

  useEffect(() => {
    const load = async () => {
      setAddresses(await fetchAddresses());
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch data khi mount là use case hợp lệ, rule này báo false positive cho pattern async fetch
    load().finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (
      !form.recipient_name.trim() ||
      !form.phone.trim() ||
      !form.address_line.trim() ||
      !form.ward.trim() ||
      !form.district.trim() ||
      !form.province.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      await createAddressApi(form);
      setAddresses(await fetchAddresses());
      setForm(emptyForm);
      setError("");
      setShowForm(false);
    } catch {
      setError("Failed to save address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAddressApi(id);
      setAddresses(await fetchAddresses());
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id);
    try {
      await updateAddressApi(id, { is_default: true });
      setAddresses(await fetchAddresses());
    } finally {
      setSettingDefaultId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-neutral-400">Loading...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-medium">Saved addresses</p>
        <button
          onClick={() => setShowForm(true)}
          className="h-8 px-3.5 border border-neutral-300 rounded-lg text-xs font-medium hover:bg-neutral-50 flex items-center gap-1"
        >
          <PlusIcon size={14} /> Add new
        </button>
      </div>

      {addresses.length === 0 ? (
        <p className="text-sm text-neutral-400">No addresses yet</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="border border-neutral-200 rounded-lg p-3.5 flex justify-between items-start"
            >
              <div>
                <p className="text-sm font-medium mb-0.5 flex items-center gap-2">
                  {a.recipient_name}
                  {a.is_default && (
                    <span className="text-[11px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-[13px] text-neutral-500">{a.phone}</p>
                <p className="text-[13px] text-neutral-500">
                  {a.address_line}, {a.ward}, {a.district}, {a.province}
                </p>
                {!a.is_default && (
                  <button
                    onClick={() => handleSetDefault(a.id)}
                    disabled={settingDefaultId === a.id}
                    className="text-xs text-blue-600 underline mt-1 disabled:opacity-50"
                  >
                    Set as default
                  </button>
                )}
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                disabled={deletingId === a.id}
                aria-label="Xóa địa chỉ"
                className="p-1 text-neutral-400 hover:text-neutral-700 disabled:opacity-50"
              >
                <TrashIcon size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="mt-3.5 border border-neutral-300 rounded-lg p-3.5">
          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            <input
              placeholder="Recipient name"
              value={form.recipient_name}
              onChange={(e) =>
                setForm({ ...form, recipient_name: e.target.value })
              }
              className="h-9 px-3 border border-neutral-300 rounded-lg text-sm"
            />
            <input
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="h-9 px-3 border border-neutral-300 rounded-lg text-sm"
            />
          </div>
          <input
            placeholder="Address (house number, street)"
            value={form.address_line}
            onChange={(e) => setForm({ ...form, address_line: e.target.value })}
            className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm mb-2.5"
          />
          <div className="grid grid-cols-3 gap-2.5 mb-2.5">
            <input
              placeholder="Ward"
              value={form.ward}
              onChange={(e) => setForm({ ...form, ward: e.target.value })}
              className="h-9 px-3 border border-neutral-300 rounded-lg text-sm"
            />
            <input
              placeholder="District"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className="h-9 px-3 border border-neutral-300 rounded-lg text-sm"
            />
            <input
              placeholder="Province"
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
              className="h-9 px-3 border border-neutral-300 rounded-lg text-sm"
            />
          </div>
          {error && <p className="text-[13px] text-red-600 mb-2">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowForm(false);
                setForm(emptyForm);
                setError("");
              }}
              className="h-8 px-3.5 border border-neutral-300 rounded-lg text-xs font-medium hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={submitting}
              className="h-8 px-3.5 bg-black text-white rounded-lg text-xs font-medium hover:bg-neutral-800 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save address"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressesTab;
