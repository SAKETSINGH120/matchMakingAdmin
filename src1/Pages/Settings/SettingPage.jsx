import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getSettings, updateSettings } from "../../Services/settingServices";
import attachUrl from "../../utils/attachUrl";
import RichTextEditor from "../../compoents/richtext-editor";
import Breaker from "../../compoents/Breaker";

const initialState = {
  brandName: "",
  logo: null,
  email: "",
  mobile: "",
  address: "",
  gst: "",
  googleMapApiKey: "",
  razorpayKeyId: "",
  razorpayKeySecret: "",
  agreement: "",
  termAndConditions: "",
  privacyPolicy: "",
  refundPolicy: "",
  appPaymentMethods: [],
  localBaseurl: "",
  liveBaseUrl: "",
  appColourCode: "",
  extraChargePerPerson: "",
};

export default function SettingsPage() {
  const [form, setForm] = useState(initialState);
  const [logoPreview, setLogoPreview] = useState(null);
  const [settingId, setSettingId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then((res) => {
        const data = res.data;
        setSettingId(data._id);

        setForm({
          ...initialState,
          ...data,
          logo: null,
        });

        setLogoPreview(data.logo ? attachUrl(data.logo) : null);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load settings");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    if (e.target) {
      const { name, value } = e.target;
      if (name && value) setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, logo: file }));
    setLogoPreview(URL.createObjectURL(file));
  };

  const handlePaymentChange = (index, field, value) => {
    const updated = [...form.appPaymentMethods];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, appPaymentMethods: updated }));
  };

  const addPaymentMethod = () => {
    setForm((prev) => ({
      ...prev,
      appPaymentMethods: [
        ...prev.appPaymentMethods,
        { name: "", status: "active" },
      ],
    }));
  };

  const removePaymentMethod = (index) => {
    const updated = form.appPaymentMethods.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, appPaymentMethods: updated }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "logo") {
          if (value) formData.append("logo", value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value ?? "");
        }
      });

      await updateSettings(settingId, formData);
      toast.success("Settings updated successfully");
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <>
      {/* Added Breaker before the form */}
      <div className="mb-6">
        <Breaker />
      </div>
    <div className="max-h-[calc(100vh-140px)] overflow-y-auto px-6 pb-10">
      <form onSubmit={onSubmit} className="space-y-8 py-8 px-6">
        <Section title="Brand Information">
          <div className="col-span-2">
            <label className="label">Logo</label>

            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="h-24 mb-3 border rounded"
              />
            )}

            <input type="file" accept="image/*" onChange={handleLogoChange} />
          </div>

          <Input
            name="brandName"
            label="Brand Name"
            value={form.brandName}
            onChange={handleChange}
          />
          <Input
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            name="mobile"
            label="Mobile"
            value={form.mobile}
            onChange={handleChange}
          />
          <Input
            name="address"
            label="Address"
            value={form.address}
            onChange={handleChange}
          />
          <Input
            name="gst"
            label="GST Number"
            value={form.gst}
            onChange={handleChange}
          />
        </Section>

        {/* API & Keys */}
        <Section title="API & Keys">
          <Input
            name="googleMapApiKey"
            label="Google Map API Key"
            value={form.googleMapApiKey}
            // onChange={handleChange}
            readOnly
          />
          <Input
            name="razorpayKeyId"
            label="Razorpay Key ID"
            value={form.razorpayKeyId}
            // onChange={handleChange}
            readOnly
          />
          <Input
            name="razorpayKeySecret"
            label="Razorpay Key Secret"
            type="password"
            value={form.razorpayKeySecret}
            // 
            readOnly
          />
        </Section>

        {/* App Config */}
        {/* <Section title="App Configuration">
          <Input
            name="localBaseurl"
            label="Local Base URL"
            value={form.localBaseurl}
            onChange={handleChange}
          />
          <Input
            name="liveBaseUrl"
            label="Live Base URL"
            value={form.liveBaseUrl}
            onChange={handleChange}
          />
          <Input
            name="appColourCode"
            label="App Colour Code"
            value={form.appColourCode}
            onChange={handleChange}
          />
          <Input
            name="extraChargePerPerson"
            label="Extra Charge Per Person"
            value={form.extraChargePerPerson}
            onChange={handleChange}
          />
        </Section> */}

        {/* Policies */}
        <Section title="Policies & Agreement">
          <Textarea
            name="agreement"
            label="Agreement"
            value={form.agreement}
            onChange={handleChange}
            initialValue={form.agreement}
          />
          <Textarea
            name="termAndConditions"
            label="Terms & Conditions"
            value={form.termAndConditions}
            onChange={handleChange}
            initialValue={form.termAndConditions}
          />
          <Textarea
            name="privacyPolicy"
            label="Privacy Policy"
            value={form.privacyPolicy}
            onChange={handleChange}
            initialValue={form.privacyPolicy}
          />
          <Textarea
            name="refundPolicy"
            label="Refund Policy"
            value={form.refundPolicy}
            onChange={handleChange}
            initialValue={form.refundPolicy}
          />
        </Section>

        {/* Payment Methods */}
        {/* <Section title="App Payment Methods">
          {form.appPaymentMethods.map((pm, index) => (
            <div key={index} className="flex gap-4 items-center mb-2">
              <input
                value={pm.name}
                onChange={(e) =>
                  handlePaymentChange(index, "name", e.target.value)
                }
                placeholder="Payment Method Name"
                className="input"
              />

              <select
                value={pm.status}
                onChange={(e) =>
                  handlePaymentChange(index, "status", e.target.value)
                }
                className="input"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                type="button"
                onClick={() => removePaymentMethod(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          <button type="button" onClick={addPaymentMethod} className="btn">
            + Add Payment Method
          </button>
        </Section> */}

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            Save Settings
          </button>
        </div>
      </form>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="card">
      <h2 className="section-title">{title}</h2>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input {...props} className="input" />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="col-span-2">
      <label className="label">{label}</label>
      {/* <textarea {...props} rows={4} className="input" /> */}
      <RichTextEditor {...props} className="input" />
    </div>
  );
}