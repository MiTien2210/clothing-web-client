import { useNavigate } from "react-router-dom";
type OrderStatus = "delivered" | "shipping" | "processing" | "cancelled";
interface Order {
  id: string;
  date: string;
  items: string;
  total: string;
  status: OrderStatus;
}
const orders: Order[] = [
  {
    id: "DH2810",
    date: "20/08/2026",
    items: "Áo thun oversize, Quần jean ống rộng",
    total: "890,000₫",
    status: "delivered",
  },
  {
    id: "DH2793",
    date: "12/08/2026",
    items: "Váy hoa nhí",
    total: "450,000₫",
    status: "shipping",
  },
  {
    id: "DH2771",
    date: "02/08/2026",
    items: "Áo khoác denim",
    total: "620,000₫",
    status: "processing",
  },
  {
    id: "DH2750",
    date: "25/07/2026",
    items: "Set đồ thể thao",
    total: "780,000₫",
    status: "cancelled",
  },
];

const statusStyles: Record<OrderStatus, { label: string; className: string }> =
  {
    delivered: {
      label: "Delivered",
      className: "bg-emerald-100 text-emerald-700",
    },
    shipping: { label: "Shipping", className: "bg-blue-100 text-blue-700" },
    processing: {
      label: "Processing",
      className: "bg-amber-100 text-amber-700",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-neutral-100 text-neutral-500",
    },
  };
const OrderHistoryTab = () => {
  const navigate = useNavigate();

  return (
    <div>
      <p className="text-sm font-medium mb-4">Order history</p>
      <div className="flex flex-col gap-2.5">
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => navigate(`/orders/${order.id}`)}
            className="w-full text-left border border-neutral-200 rounded-lg p-3.5 flex justify-between
                       items-center hover:bg-neutral-50 transition-colors"
          >
            <div>
              <p className="text-sm font-medium mb-0.5">
                {order.id}{" "}
                <span className="text-xs text-neutral-400 font-normal">
                  · {order.date}
                </span>
              </p>
              <p className="text-[13px] text-neutral-500">{order.items}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium mb-1">{order.total}</p>
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full inline-block ${statusStyles[order.status].className}`}
              >
                {statusStyles[order.status].label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryTab;
