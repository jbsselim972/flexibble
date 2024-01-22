import {
  ProjectInterface,
  UserWithProjects,
  UserProfile,
} from "@/common.types";
import { getUserProjects } from "@/lib/actions";
import { Project } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type Props = {
  userId: string;
  projectId: string;
};

const RelatedProjects = async ({ userId, projectId }: Props) => {
  const result = (await getUserProjects(userId)) as UserWithProjects;
  const filteredProjects = result?.projects?.filter(
    (project: Project) => project?.id !== projectId
  );

  if (filteredProjects?.length === 0) return null;

  return (
    <section className="flex flex-col mt-32 w-full">
      <div className="flexBetween">
        <p className="text-base font-bold">More by {result?.name}</p>
        <Link
          className="text-primary-purple text-base"
          href={`/profile/${result?.id}`}
        >
          View all
        </Link>
      </div>

      <div className="related_projects-grid">
        {filteredProjects?.map((project) => (
          <div
            className="flexCenter related_project-card drop-shadow-card"
            key={project?.id}
          >
            <Link
              className="flexCenter group relative h-full w-full"
              href={`/projects/${project?.id}`}
            >
              <Image
                src={project?.image}
                width={414}
                height={314}
                className="w-full h-full object-cover rounded-2xl"
                alt="project image"
              />

              <div className="hidden group-hover:flex related_project-card_title">
                <p className="w-full">{project?.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProjects;
