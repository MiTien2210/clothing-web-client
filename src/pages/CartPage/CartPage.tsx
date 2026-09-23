import { useEffect, useState } from "react";
import type { CartItem } from "../../types/cart";
import {
  getCartApi,
  removeCartItemApi,
  updateCartItemApi,
} from "../../api/cartApi";
import { Link } from "react-router-dom";
import { TrashIcon } from "@phosphor-icons/react";
import QuantityStepper from "../../components/QuantityStepper";

const FREE_SHIPPING_THRESHOLD = 1200000;
const FLAT_SHIPPING_FEE = 30000;

const formatPrice = (n: number) => n.toLocaleString("vi-VN") + "₫";

const CartPage = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherMsg, setVoucherMsg] = useState<{
    text: string;
    ok: boolean;
  } | null>(null);
  const [discountRate, setDiscountRate] = useState(0);

  const fetchCart = async () => {
    const res = await getCartApi();
    return res.data;
  };

  useEffect(() => {
    const load = async () => {
      setItems(await fetchCart());
    };
    load().finally(() => setLoading(false));
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.productVariant.price * item.quantity,
    0,
  );

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : FLAT_SHIPPING_FEE;

  const discount = Math.round(subtotal * discountRate);
  const total = subtotal + shipping - discount;

  const handleChangeQuantity = async (id: string, quantity: number) => {
    await updateCartItemApi(id, { quantity });
    setItems(await fetchCart());
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await removeCartItemApi(id);
      setItems(await fetchCart());
    } finally {
      setRemovingId(null);
    }
  };

  const handleApplyVoucher = () => {
    // Chưa có hệ thống mã giảm giá thật ở backend — tạm mock client-side
    const code = voucherInput.trim().toUpperCase();
    if (code === "SALE10") {
      setDiscountRate(0.1);
      setVoucherMsg({ text: "Voucher applied: 10% off", ok: true });
    } else {
      setDiscountRate(0);
      setVoucherMsg({ text: "Invalid voucher code", ok: false });
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-12">
        <p className="text-sm text-neutral-400">Loading...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-10">
        <h1 className="font-serif text-2xl mb-6">Shopping cart</h1>
        <p className="text-center text-sm text-neutral-400 py-12">
          Your cart is empty.{" "}
          <Link to="/" className="underline hover:text-black">
            Continue shopping
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-6 md:py-8">
      <h1 className="font-serif text-2xl mb-5">Shopping cart</h1>

      <div className="flex gap-8 items-start flex-col md:flex-row">
        <div className="flex-1 w-full flex flex-col gap-3.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3.5 border border-neutral-200 rounded-xl p-3 items-center"
            >
              <div className="w-[70px] h-[88px] bg-neutral-50 rounded-lg shrink-0" />

              <div className="flex-1 min-w-0">
                <p className="text-sm mb-0.5 truncate">
                  {item.productVariant.product.name}
                </p>
                <p className="text-xs text-neutral-400 mb-2">
                  {item.productVariant.size} / {item.productVariant.color}
                </p>
                <QuantityStepper
                  value={item.quantity}
                  min={1}
                  max={item.productVariant.stock_quantity}
                  onChange={(value) => handleChangeQuantity(item.id, value)}
                />
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-medium mb-2.5">
                  {formatPrice(item.productVariant.price * item.quantity)}
                </p>
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={removingId === item.id}
                  aria-label="Remove item"
                  className="disabled:opacity-40"
                >
                  <TrashIcon size={16} className="text-neutral-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full md:w-[280px] shrink-0 bg-neutral-50 rounded-xl p-6">
          <p className="text-sm font-medium mb-4">Order summary</p>

          <div className="flex gap-2 mb-1">
            <input
              value={voucherInput}
              onChange={(e) => setVoucherInput(e.target.value)}
              placeholder="Voucher code"
              className="flex-1 h-9 px-2.5 border border-neutral-300 rounded-md text-xs"
            />
            <button
              onClick={handleApplyVoucher}
              className="h-9 px-3.5 border border-neutral-300 rounded-md text-xs font-semibold hover:bg-white"
            >
              Apply
            </button>
          </div>
          {voucherMsg && (
            <p
              className={`text-xs mb-3.5 ${
                voucherMsg.ok ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {voucherMsg.text}
            </p>
          )}

          <div className="flex justify-between text-[13px] mb-2 mt-3">
            <span className="text-neutral-500">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[13px] mb-2">
            <span className="text-neutral-500">Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-[13px] mb-2 text-emerald-600">
              <span>Discount</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="border-t border-neutral-200 mt-3 pt-3 flex justify-between text-[15px] font-medium">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button
            disabled
            title="Coming soon"
            className="w-full h-11 bg-black text-white rounded-lg text-sm font-semibold mt-4 disabled:opacity-40"
          >
            Checkout
          </button>
          <p className="text-[11px] text-neutral-400 text-center mt-2.5">
            Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
          </p>
        </div>
      </div>
    </div>
  );
};
export default CartPage;
