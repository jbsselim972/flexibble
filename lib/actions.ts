"use server";

import { ProjectForm, ProjectWithUserInfo } from "@/common.types";
import { db } from "./db";
import { Project, User } from "@prisma/client";

const isProduction = process.env.NODE_ENV === "production";
// const apiUrl = isProduction
//   ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || ""
//   : "http://127.0.0.1:4000/graphql";
// const apiKey = isProduction
//   ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || ""
//   : "letmein";
const serverUrl = isProduction
  ? process.env.NEXT_PUBLIC_SERVER_URL
  : "http://localhost:3000";

export const getUser = async (email: string | null | undefined) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email: email || undefined,
      },
    });

    return user;
  } catch (error) {
    console.error("[DB_ERROR]:", error);
    return null;
  }
};

export const createUser = async (
  name: string,
  email: string,
  avatarUrl: string
) => {
  const variables = {
    input: {
      name,
      email,
      avatarUrl,
    },
  };

  console.log("variables:", variables);
  await db.user.create({
    data: {
      name,
      email,
      avatarUrl,
    },
  });
};

export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`);
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      body: JSON.stringify({ path: imagePath }),
    });
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const createNewProject = async (
  form: ProjectForm,
  creatorId: string,
  token: string
) => {
  const imageUrl = await uploadImage(form.image);
  if (imageUrl.url) {
    // client.setHeader("Authorization", `Bearer ${token}`);

    await db.project.create({
      data: {
        ...form,
        image: imageUrl.url,
        user_id: creatorId,
      },
    });
    // return makeGraphQLRequest(createProjectMutation, variables);
  }
};

export const fetchAllProjects = async (
  category?: string,
  endCursor?: string
): Promise<ProjectWithUserInfo[] | null | undefined> => {
  // client.setHeader("x-api-key", apiKey);
  try {
    const projects = await db.project.findMany({
      where: {
        category: category || undefined,
      },
      include: {
        createdBy: true,
      },
    });

    // console.log("projects", projects);
    return projects;
  } catch (error) {
    console.error("[DB_FETCH_ALL_PROJECTS]:", error);
  }
  // return makeGraphQLRequest(projectsQuery, { category, endCursor });
};

export const getProjectDetails = async (id: string) => {
  // client.setHeader("x-api-key", apiKey);
  try {
    const project = await db.project.findUnique({
      where: {
        id: id,
      },
      include: {
        createdBy: true,
      },
    });
    return project;
  } catch (error) {
    return null;
  }
  // return makeGraphQLRequest(getProjectByIdQuery, { id });
};

export const getUserProjects = async (id: string, last?: number) => {
  // client.setHeader("x-api-key", apiKey);

  try {
    const userProjects = await db.user.findUnique({
      where: {
        id,
      },
      include: {
        projects: true,
      },
    });

    return userProjects;
  } catch (error) {
    return null;
  }
  // return makeGraphQLRequest(getProjectsOfUserQuery, { id, last });
};

export const deleteProject = async (id: string, token: string) => {
  await db.project.delete({
    where: {
      id,
    },
  });
  // return makeGraphQLRequest(deleteProjectMutation, { id });
};

export const updateProject = async (
  form: ProjectForm,
  projectId: string,
  token: string
) => {
  function isBase64DataUrl(value: string) {
    const base64Regex = /^data:image\/[a-z]+;base64,/;
    return base64Regex.test(value);
  }

  let updatedForm = { ...form };
  const isUploadingNewImage = isBase64DataUrl(form.image);
  if (isUploadingNewImage) {
    const imageUrl = await uploadImage(form.image);
    updatedForm = { ...form, image: imageUrl.url };
  }

  // client.setHeader("Authorization", `Bearer ${token}`);

  await db.project.update({
    where: {
      id: projectId,
    },
    data: {
      ...updatedForm,
    },
  });
  // return makeGraphQLRequest(updateProjectMutation, variables);
};
