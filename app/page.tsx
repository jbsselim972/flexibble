import { ProjectInterface } from "@/common.types";
import Categories from "@/components/Categories";
import LoadMore from "@/components/LoadMore";
import ProjectCard from "@/components/ProjectCard";
import { fetchAllProjects } from "@/lib/actions";
import { Project, User } from "@prisma/client";

type ProjectsSearch = {
  projectSearch: {
    edges: { node: ProjectInterface }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
};

type Props = {
  searchParams: {
    category?: string;
    endcursor?: string;
  };
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const Home = async ({ searchParams: { category, endcursor } }: Props) => {
  const data = await fetchAllProjects(category, endcursor);
  // const pagination = data?.projectSearch?.pageInfo;
  const projectsToDisplay = data || [];
  if (projectsToDisplay.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <Categories />
        <p className="no-result-text text-center">
          No projects found, go create some first.
        </p>
      </section>
    );
  }

  return (
    <section className="flex-start flex-col paddings mb-16">
      <Categories />
      <section className="projects-grid">
        {projectsToDisplay.map(
          (project) =>
            project && (
              <ProjectCard
                key={project?.id}
                id={project?.id}
                image={project?.image}
                title={project?.title}
                name={project?.createdBy?.name}
                avatarUrl={project?.createdBy?.avatarUrl}
                userId={project?.createdBy?.id}
              />
            )
        )}
      </section>
      {/* <LoadMore
        startCursor={pagination.startCursor}
        endCursor={pagination.endCursor}
        hasPreviousPage={pagination.hasPreviousPage}
        hasNextPage={pagination.hasNextPage}
      /> */}
    </section>
  );
};

export default Home;
