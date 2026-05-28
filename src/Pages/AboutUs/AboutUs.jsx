import React, { useState } from "react";
import { useEffect } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import toast from "react-hot-toast";
import { updatePrivacyPolicy, getCmsPage } from "../../Services/AboutUsApi";

export default function AboutUs() {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  // ────────────────────────────────────────────────
  //              Update Privacy Policy
  // ────────────────────────────────────────────────

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const fetchPrivacyPolicy = async () => {
      try {
        const result = await getCmsPage("about-us");

        console.log("CMS GET RESPONSE:", result);

        if (result?.success) {
          // 👇 Yaha important line hai
          setContent(result.data.content);
        } else {
          toast.error(result?.message || "Failed to load data");
        }
      } catch (error) {
        console.error("Error fetching CMS page:", error);
        toast.error("Error loading Aboutus");
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
        toast.success("Aboutus Updated Successfully");
      } else {
        toast.error(result?.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating AboutUs:", error);
      toast.error("Error updating Aboutus");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="theme-page min-h-screen w-full px-4 py-6">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-theme-light-border bg-white p-6 shadow-xl transition-colors duration-200 dark:border-theme-dark-border dark:bg-theme-dark-surface sm:p-8">
        <h2 className="mb-6 text-center text-2xl font-semibold text-theme-light-heading dark:text-theme-dark-textPrimary">
          AboutUs
        </h2>

        <div className="cms-editor">
          <CKEditor
            editor={ClassicEditor}
            data={content}
            config={{
              placeholder: "Write your AboutUs here...",
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setContent(data);
            }}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="rounded-lg px-8 py-3 text-lg text-white shadow-lg transition hover:opacity-90"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            {saving ? "Updating..." : "Update AboutUs"}
          </button>
        </div>
      </div>
    </div>
  );
}
