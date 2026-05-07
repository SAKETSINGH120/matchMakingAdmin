import React, { useState } from "react";
import { useEffect } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import toast from "react-hot-toast";
import Breaker from "../../compoents/Breaker";
import { updatePrivacyPolicy,getCmsPage } from "../../Services/TermsAndConditionsApi";

export default function TermsAndConditions() {
  const [content, setContent] = useState("");  
  const [saving, setSaving] = useState(false);

  // ────────────────────────────────────────────────
  //              Update Privacy Policy
  // ────────────────────────────────────────────────

  useEffect(() => {
  document.body.style.overflow = "hidden";
  const fetchPrivacyPolicy = async () => {
    try {
      const result = await getCmsPage("terms-and-conditions");

      console.log("CMS GET RESPONSE:", result);

      if (result?.success) {
        // 👇 Yaha important line hai
        setContent(result.data.content);
      } else {
        toast.error(result?.message || "Failed to load data");
      }
    } catch (error) {
      console.error("Error fetching CMS page:", error);
      toast.error("Error loading privacy policy");
    }
  };

  fetchPrivacyPolicy();

  return () => {
    document.body.style.overflow = "auto";
  };
}, []);
  const handleUpdate = async () => {
    if (!content.trim()) {
      toast.error("Content cannot be empty");
      return;
    }

    try {
      setSaving(true);

      const result = await updatePrivacyPolicy(content);

      if (result?.success) {
        toast.success("Term&Condition Updated Successfully");
      } else {
        toast.error(result?.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating Terms&Conditions:", error);
      toast.error("Error updating Terms&Conditions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className=" w-full bg-gray-100 flex items-center justify-center overflow-hidden">

      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8">

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Term&Condition
        </h2>

        <CKEditor
          editor={ClassicEditor}
          data={content}
          config={{
            placeholder: "Write your Terms&Conditions here...",
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
        />

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="px-8 py-3 bg-[var(--primary-color)] text-white rounded-lg shadow-lg hover:opacity-90 transition text-lg"
          >
            {saving ? "Updating..." : "Update Terms&Condition"}
          </button>
        </div>

      </div>
    </div>
  );
}