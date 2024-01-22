import { getUserProjects } from "@/lib/actions";
import type { UserWithProjects } from "@/common.types";
import ProfilePage from "@/components/ProfilePage";

type Props = {
  params: {
    id: string;
  };
};

const UserProfile = async ({ params: { id } }: Props) => {
  const userProjects = (await getUserProjects(id, 100)) as UserWithProjects;
  if (!userProjects)
    return <p className="no-result-text">Failed to fetch user info</p>;

  return <ProfilePage user={userProjects} />;
};

export default UserProfile;
