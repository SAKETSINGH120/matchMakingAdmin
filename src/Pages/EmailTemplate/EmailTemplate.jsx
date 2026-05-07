import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import toast from "react-hot-toast";
import {
  getEmailTemplate,
  saveEmailTemplate,
} from "../../Services/emailTemplates";
import createMarkup from "../../utils/createMarkup";

const fieldClassName =
  "w-full rounded-lg border border-theme-light-border bg-white px-3 py-2 text-sm text-theme-light-textPrimary outline-none transition-colors duration-200 placeholder:text-theme-light-textSecondary focus:border-theme-light-primaryButton dark:border-theme-dark-border dark:bg-theme-dark-inputBg dark:text-theme-dark-textPrimary";

const EmailTemplate = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const editableRef = useRef(null);
  const [template, setTemplate] = useState({
    _id: "",
    name: "",
    subject: "",
    body: "",
    isActive: false,
    updatedBy: null,
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchTemplate = async () => {
      try {
        const response = await getEmailTemplate();
        const data = response?.data || response || {};

        if (!isMounted) return;

        setTemplate({
          _id: data._id || "",
          name: data.name || "",
          subject: data.subject || "",
          body: data.body || "",
          isActive: Boolean(data.isActive),
          updatedBy: data.updatedBy || null,
          createdAt: data.createdAt || "",
          updatedAt: data.updatedAt || "",
        });
      } catch (error) {
        toast.error(error?.message || "Failed to load email template");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTemplate();

    return () => {
      isMounted = false;
    };
  }, []);

  const previewMarkup = useMemo(
    () => createMarkup(template.body || ""),
    [template.body],
  );

  const updateField = (key) => (event) => {
    const value = event.target.value;
    setTemplate((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle contenteditable paste - allow only plain text
  const handleEditablePaste = useCallback((event) => {
    event.preventDefault();
    const plainText = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, plainText);
  }, []);

  // Make text nodes contenteditable and lock HTML structure
  const makeTextEditable = useCallback(
    (node) => {
      if (!node) return;

      node.childNodes.forEach((child) => {
        if (child.nodeType === 3) {
          // Text node - wrap it and make editable
          const span = document.createElement("span");
          span.contentEditable = true;
          span.textContent = child.textContent;
          span.style.color = "#f3f8fa";
          // span.style.backgroundColor = "rgba(32, 34, 33, 0.45)";
          // span.style.borderRadius = "4px";
          span.style.padding = "1px 4px";
          // span.style.outline = "1px solid rgba(100, 12, 12, 0.35)";
          // span.style.boxShadow = "0 0 0 2px rgba(230, 202, 90, 0.25)";
          span.style.caretColor = "#ffffff";
          span.addEventListener("paste", handleEditablePaste);
          node.replaceChild(span, child);
        } else if (child.nodeType === 1) {
          // Element node - make it non-interactive but keep structure
          child.style.pointerEvents = "none";
          child.style.opacity = "1";
          makeTextEditable(child);
        }
      });
    },
    [handleEditablePaste],
  );

  // Initialize editable content when template loads
  useEffect(() => {
    if (!loading && editableRef.current && template.body) {
      editableRef.current.innerHTML = template.body;
      makeTextEditable(editableRef.current);
    }
  }, [loading, template.body, makeTextEditable]);

  const handleSave = async (event) => {
    event.preventDefault();

    if (!template.subject.trim()) {
      toast.error("Subject is required");
      return;
    }

    // Capture the updated HTML from the editable container
    const updatedBody = editableRef.current?.innerHTML || template.body;
    if (!updatedBody?.trim()) {
      toast.error("Body is required");
      return;
    }

    setSaving(true);
    try {
      await saveEmailTemplate({
        subject: template.subject.trim(),
        body: updatedBody,
      });
      toast.success("Email template saved successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to save email template");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-theme-light-heading dark:text-theme-dark-textPrimary">
            Email Template
          </h1>
          <p className="mt-1 text-sm text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
            Update the subject and body from the template response.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPreview((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-lg bg-theme-light-primaryButton px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-theme-light-primaryButton/90 dark:bg-theme-dark-primaryButton dark:hover:bg-theme-dark-primaryButton/90"
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      {loading ? (
        <div className="rounded-lg border border-theme-light-border bg-white p-6 text-sm text-theme-light-textSecondary shadow-sm dark:border-theme-dark-border dark:bg-theme-dark-surface dark:text-theme-dark-textSecondary">
          Loading template...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <form
              onSubmit={handleSave}
              className="rounded-lg border border-theme-light-border bg-white p-5 shadow-sm dark:border-theme-dark-border dark:bg-theme-dark-surface"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
                    Template Name
                  </label>
                  <input
                    className={fieldClassName}
                    value={template.name}
                    readOnly
                    placeholder="Template name"
                  />
                </div>

                {/* <div>
									<label className="mb-1 block text-sm font-medium text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
										Status
									</label>
									<input
										className={fieldClassName}
										value={template.isActive ? "Active" : "Inactive"}
										readOnly
									/>
								</div> */}
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
                  Subject
                </label>
                <input
                  className={fieldClassName}
                  value={template.subject}
                  onChange={updateField("subject")}
                  placeholder="Enter subject"
                />
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
                  Body
                </label>
                <div
                  ref={editableRef}
                  className="rounded-lg border border-theme-light-border bg-white px-3 py-2 text-sm text-theme-light-textPrimary outline-none transition-colors duration-200 dark:border-theme-dark-border dark:bg-theme-dark-inputBg dark:text-theme-dark-textPrimary min-h-[420px] font-mono text-sm leading-6 overflow-auto"
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                  onPaste={handleEditablePaste}
                >
                  Loading content...
                </div>
                <p className="mt-2 text-xs text-theme-light-textSecondary dark:text-theme-dark-textSecondary ">
                  Edit text content only. HTML structure is locked. Plain text
                  only.
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-lg bg-theme-light-primaryButton px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-theme-light-primaryButton/90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-theme-dark-primaryButton dark:hover:bg-theme-dark-primaryButton/90"
                >
                  {saving ? "Saving..." : "Save Template"}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6 xl:col-span-1">
            {/* <div className="rounded-lg border border-theme-light-border bg-white p-5 shadow-sm dark:border-theme-dark-border dark:bg-theme-dark-surface">
							<h2 className="text-sm font-semibold uppercase tracking-wide text-theme-light-heading dark:text-theme-dark-textPrimary">
								Template Info
							</h2>

							<dl className="mt-4 space-y-3 text-sm">
								<div>
									<dt className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary">Name</dt>
									<dd className="font-medium text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
										{template.name || "-"}
									</dd>
								</div>

								<div>
									<dt className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary">Created At</dt>
									<dd className="font-medium text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
										{template.createdAt ? new Date(template.createdAt).toLocaleString() : "-"}
									</dd>
								</div>

								<div>
									<dt className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary">Updated At</dt>
									<dd className="font-medium text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
										{template.updatedAt ? new Date(template.updatedAt).toLocaleString() : "-"}
									</dd>
								</div>

								<div>
									<dt className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary">Updated By</dt>
									<dd className="font-medium text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
										{template.updatedBy?.name || template.updatedBy?.email || "-"}
									</dd>
								</div>
							</dl>
						</div> */}

            {showPreview && (
              <div className="rounded-lg border border-theme-light-border bg-white p-5 shadow-sm dark:border-theme-dark-border dark:bg-theme-dark-surface">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-theme-light-heading dark:text-theme-dark-textPrimary">
                  Preview
                </h2>
                <div className="mt-4 max-h-[640px] overflow-auto rounded-lg border border-theme-light-border bg-theme-light-surface p-4 dark:border-theme-dark-border dark:bg-theme-dark-inputBg">
                  <div dangerouslySetInnerHTML={previewMarkup} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplate;
