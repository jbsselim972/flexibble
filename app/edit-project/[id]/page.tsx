import { ProjectInterface, ProjectWithUserInfo } from "@/common.types";
import Modal from "@/components/Modal";
import ProjectForm from "@/components/ProjectForm";
import { getProjectDetails } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";

const EditProject = async ({ params: { id } }: { params: { id: string } }) => {
  const session = await getCurrentUser();
  if (!session?.user) redirect("/");
  const result = (await getProjectDetails(id)) as ProjectWithUserInfo;
  return (
    <Modal>
      <h3 className="modal-head-text">Edit project</h3>
      <ProjectForm type="edit" session={session} project={result} />
    </Modal>
  );
};

export default EditProject;
