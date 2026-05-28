import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserById } from "../../Services/userServices";
import Breaker from "../../compoents/Breaker";
import { FaUser, FaBriefcase, FaHeart, FaLanguage, FaGlobe, FaEye } from "react-icons/fa";
import attachUrl from "../../utils/attachUrl";

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        toast.error("No user ID provided");
        navigate("/users");
        return;
      }

      try {
        setLoading(true);
        const result = await getUserById(id);

        if (result?.success) {
          setUser(result.data);
        } else {
          toast.error(result?.message || "Failed to load user details");
          navigate("/users");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        toast.error("Could not fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="theme-page flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-lg text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
          Loading user profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="theme-page flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-theme-light-danger dark:text-theme-dark-danger">
          User not found
        </p>
      </div>
    );
  }

  return (
    <div className="theme-page p-6">
      <Breaker />

      <div className="max-w-8xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
          <button
            onClick={() => navigate(-1)}
            className="theme-btn-secondary py-2 px-4"
          >
            ← Back
          </button>
          
          <button
            onClick={() => navigate(`/Home/user/edit/${id}`)}
            className="theme-btn-primary py-2 px-6"
          >
            Edit Profile
          </button>
        </div>

        {/* Profile Header with Primary Image */}
        <div className="flex items-center gap-6 rounded-2xl bg-theme-light-primaryButton p-6 text-white shadow-lg transition-colors duration-200 dark:bg-theme-dark-primaryButton">
          <img
            className="h-24 w-24 rounded-full bg-white ring-4 ring-white/40 object-cover object-center shrink-0"
            src={
              user.primaryImage
                ? attachUrl(user.primaryImage)
                : "/images/userDefaultLogo.jpg"
            }
            alt={user.name || "User"}
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{user.name || "—"}</h1>
            <p className="opacity-80">{user.number || "—"}</p>
            <p className="text-xs opacity-60 mt-1">User ID: {user.userID || "—"}</p>

            <div className="flex gap-3 mt-3">
              {user.isVerified && (
                <span className="px-3 py-1 text-xs bg-green-500 rounded-full font-semibold">
                  Verified
                </span>
              )}

              {user.isPremium && (
                <span className="px-3 py-1 text-xs bg-yellow-400 text-black rounded-full font-semibold">
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Images (Gallery) */}
        <Card title="Gallery Images">
          {user.secondaryImages?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {user.secondaryImages.map((imgPath, index) => (
                <img
                  key={`${imgPath}-${index}`}
                  src={attachUrl(imgPath)}
                  alt={`Secondary ${index + 1}`}
                  className="h-28 w-full rounded-xl border border-theme-light-border object-cover dark:border-theme-dark-border"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
              No secondary images uploaded
            </p>
          )}
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Basic Info" icon={<FaUser />}>
            <Row label="Email Address" value={user.email} />
            <Row label="Gender" value={user.gender} />
            <Row label="Date of Birth" value={formatDate(user.dob)} />
            <Row label="Age" value={calculateAge(user.dob)} />
            <Row
              label="Height"
              value={user.heightCm ? `${user.heightCm} cm` : "—"}
            />
            <Row label="Profession" value={user.profession} />
            <Row label="Company" value={user.company} />
            <Row label="Education" value={user.education} />
          </Card>

          <Card title="Preferences" icon={<FaHeart />}>
            <Row label="Interested In" value={user.preferences?.interestedIn} />
            <Row
              label="Age Range"
              value={
                user.preferences?.minAge && user.preferences?.maxAge
                  ? `${user.preferences.minAge} – ${user.preferences.maxAge}`
                  : "—"
              }
            />
            <Row
              label="Max Distance"
              value={
                user.preferences?.maxDistanceKm
                  ? `${user.preferences.maxDistanceKm} km`
                  : "—"
              }
            />
          </Card>

          <Card title="Lifestyle" icon={<FaBriefcase />}>
            <Row label="Drinking" value={user.lifestyle?.drinking} />
            <Row label="Smoking" value={user.lifestyle?.smoking} />
            <Row label="Workout" value={user.lifestyle?.workout} />
            <Row label="Diet" value={user.lifestyle?.diet} />
          </Card>

          <Card title="Relationship & Location" icon={<FaGlobe />}>
            <Row label="Relationship Goal" value={user.relationshipGoal} />
            <Row label="City" value={user.location?.city} />
            <Row label="Country" value={user.location?.country} />
            <Row
              label="Coordinates (Lon, Lat)"
              value={
                user.location?.coordinates?.length === 2
                  ? `${user.location.coordinates[0]}, ${user.location.coordinates[1]}`
                  : "—"
              }
            />
          </Card>

          <Card title="Privacy Settings" icon={<FaEye />}>
            <Row label="Show Age" value={user.privacy?.showAge ? "Yes" : "No"} />
            <Row label="Show Distance" value={user.privacy?.showDistance ? "Yes" : "No"} />
          </Card>

          <Card title="Account Details" icon={<FaUser />}>
            <Row label="Status" value={user.status} />
            {user.statusReason && (
              <Row label="Status Reason" value={user.statusReason} />
            )}
            <Row label="Premium Member" value={user.isPremium ? "Yes" : "No"} />
            <Row label="Verified Profile" value={user.isVerified ? "Yes" : "No"} />
            <Row label="Profile Completion" value={user.profileCompletionPercent ? `${user.profileCompletionPercent}%` : "0%"} />
            <Row label="Activity Score" value={user.activityScore ?? "0"} />
            <Row label="Joined" value={formatDateTime(user.createdAt)} />
            <Row label="Last Active" value={formatDateTime(user.lastActiveAt)} />
            <Row label="Last Updated" value={formatDateTime(user.updatedAt)} />
          </Card>
        </div>

        {/* Interests & Languages */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Interests" icon={<FaHeart />}>
            <TagList items={user.interests} />
          </Card>

          <Card title="Languages" icon={<FaLanguage />}>
            <TagList items={user.languages} />
          </Card>
        </div>

        {/* Bio Card */}
        <Card title="Bio Details">
          <p className="leading-relaxed whitespace-pre-line text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
            {user.bio || "No bio provided."}
          </p>
        </Card>
      </div>
    </div>
  );
}

/* Internal Presentation Components */

function Card({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-theme-light-border bg-theme-light-surface p-6 shadow-md transition hover:shadow-xl dark:border-theme-dark-border dark:bg-theme-dark-surface">
      <div className="mb-4 flex items-center gap-2 text-theme-light-primaryButton dark:text-theme-dark-primaryButton">
        {icon}
        <h3 className="text-lg font-semibold text-theme-light-heading dark:text-theme-dark-textPrimary">
          {title}
        </h3>
      </div>

      <div className="space-y-3 text-sm text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-theme-light-border pb-1 dark:border-theme-dark-border">
      <span className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary font-medium">
        {label}:
      </span>
      <span className="font-semibold text-theme-light-textPrimary dark:text-theme-dark-textPrimary capitalize">
        {value === true ? "Yes" : value === false ? "No" : value || "—"}
      </span>
    </div>
  );
}

function TagList({ items }) {
  if (!items?.length)
    return (
      <p className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary italic">
        None listed
      </p>
    );

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className="rounded-full bg-theme-light-surfaceAlt px-3 py-1 text-xs text-theme-light-textPrimary transition-colors hover:bg-theme-light-border dark:bg-theme-dark-inputBg dark:text-theme-dark-textPrimary dark:hover:bg-theme-dark-border"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/* Helper Date/Time formatting functions */

function formatDate(dateString) {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch (e) {
    return dateString;
  }
}

function formatDateTime(dateString) {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  } catch (e) {
    return dateString;
  }
}

function calculateAge(dob) {
  if (!dob) return "—";
  try {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
    const m = today.getUTCMonth() - birthDate.getUTCMonth();
    if (m < 0 || (m === 0 && today.getUTCDate() < birthDate.getUTCDate())) {
      age--;
    }
    return age;
  } catch (e) {
    return "—";
  }
}
