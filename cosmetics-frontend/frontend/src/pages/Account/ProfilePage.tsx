import React from "react";
import { ProfilePage as ProfileFeaturePage } from "../../features/users/pages/ProfilePage";
import { MetaTags } from "../../app/seo/MetaTags";

const ProfilePage: React.FC = () => {
  return (
    <>
      <MetaTags title="Мій профіль" />
      <ProfileFeaturePage />
    </>
  );
};

export default ProfilePage;
