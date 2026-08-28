import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

const AddressesTab = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: "Nguyễn Văn A",
      phone: "0901 234 567",
      address: "123 Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM",
      isDefault: true,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ name: "", phone: "", address: "" });
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (
      !newAddr.name.trim() ||
      !newAddr.phone.trim() ||
      !newAddr.address.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }
    // TODO: gọi API POST /users/me/addresses
    setAddresses([
      ...addresses,
      { id: Date.now(), ...newAddr, isDefault: false },
    ]);
    setNewAddr({ name: "", phone: "", address: "" });
    setError("");
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    // TODO: gọi API DELETE /users/me/addresses/:id
    setAddresses(addresses.filter((a) => a.id !== id));
  };

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

      <div className="flex flex-col gap-2.5">
        {addresses.map((a) => (
          <div
            key={a.id}
            className="border border-neutral-200 rounded-lg p-3.5 flex justify-between items-start"
          >
            <div>
              <p className="text-sm font-medium mb-0.5 flex items-center gap-2">
                {a.name}
                {a.isDefault && (
                  <span className="text-[11px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </p>
              <p className="text-[13px] text-neutral-500">{a.phone}</p>
              <p className="text-[13px] text-neutral-500">{a.address}</p>
            </div>
            <button
              onClick={() => handleDelete(a.id)}
              aria-label="Xóa địa chỉ"
              className="p-1 text-neutral-400 hover:text-neutral-700"
            >
              <TrashIcon size={16} />
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="mt-3.5 border border-neutral-300 rounded-lg p-3.5">
          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            <input
              placeholder="Recipient name"
              value={newAddr.name}
              onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
              className="h-9 px-3 border border-neutral-300 rounded-lg text-sm"
            />
            <input
              placeholder="Phone number"
              value={newAddr.phone}
              onChange={(e) =>
                setNewAddr({ ...newAddr, phone: e.target.value })
              }
              className="h-9 px-3 border border-neutral-300 rounded-lg text-sm"
            />
          </div>
          <input
            placeholder="Full address"
            value={newAddr.address}
            onChange={(e) =>
              setNewAddr({ ...newAddr, address: e.target.value })
            }
            className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm mb-2.5"
          />
          {error && <p className="text-[13px] text-red-600 mb-2">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="h-8 px-3.5 border border-neutral-300 rounded-lg text-xs font-medium hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="h-8 px-3.5 bg-black text-white rounded-lg text-xs font-medium hover:bg-neutral-800"
            >
              Save address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressesTab;
