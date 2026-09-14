import { useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-neutral-50 rounded-xl px-7 py-8 text-center mb-5.5">
      <p className="text-xs tracking-widest text-neutral-500 mb-2">
        FALL COLLECTION 2026
      </p>
      <h1 className="font-serif text-2xl mb-3.5">Quiet luxury, everyday</h1>
      <button
        onClick={() => navigate("/search")}
        className="bg-black text-white px-5 h-9.5 rounded-lg text-[13px] font-semibold"
      >
        Shop the collection
      </button>
    </div>
  );
};

export default HeroBanner;
