import { useNavigate } from "react-router-dom";

function ChangePasswordTab() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-10">
      <p className="text-sm text-neutral-500 mb-4">
        To change your password, we'll send a verification code to your email.
      </p>
      <button
        onClick={() => navigate("/forgot-password")}
        className="h-9 px-5 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800"
      >
        Change password
      </button>
    </div>
  );
}
export default ChangePasswordTab;
