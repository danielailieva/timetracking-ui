import React from "react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { notify } from "react-notify-toast";

const PROJECTS_QUERY = gql`
  {
    allProjects {
      title
      content
      _id
      date
    }
  }
`;

const DELETE_PROJECT_QUERY = gql`
  mutation deleteProject($_id: ID!) {
    deleteProject(_id: $_id) {
      title
      content
      _id
      date
    }
  }
`;

const AllProjects = () => {
  const { loading, error, data } = useQuery(PROJECTS_QUERY);

  const [deleteProject] = useMutation(DELETE_PROJECT_QUERY, {
    update(
      cache,
      {
        data: { deleteProject }
      }
    ) {
      const { allProjects } = cache.readQuery({ query: PROJECTS_QUERY });
      const newProjects = allProjects.filter(project => project._id !== deleteProject._id);

      cache.writeQuery({
        query: PROJECTS_QUERY,
        data: { allProjects: newProjects }
      });
    }
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div className="column">
      <div className="allnotes-page">
        <div className="columns is-multiline">
          {data.allProjects.map(project => (
            <div className="column is-one-third" key={project._id}>
              <div className="card">
                <header className="card-header">
                  <p className="card-header-title">{project.title}</p>
                </header>
                <div className="card-content">
                  <div className="content">
                    <strong>Description:</strong> <br />
                    {project.content}
                    <br />
                  </div>
                </div>
                <footer className="card-footer navbar-end">
                  <Link to={`project/${project._id}`}>
                  <span className="has-text-info" title="Edit Project">
                  <i className="fa fa-edit fa-lg"></i>
                  </span>
                  </Link>
                  <Link to={`projectview/${project._id}`}>
                  <span className="has-text-info" title="View Project">
                  <i className="fa fa-eye fa-lg"></i>
                  </span>
                  </Link>
                  <span onClick={e => {
                      e.preventDefault();
                      deleteProject({ variables: { _id: project._id } });
                      notify.show("Project was deleted successfully", "success");
                    }} 
                    className="icon has-text-info" title="Delete Project">
                    <i className="fa fa-trash fa-lg"></i>
                  </span>
                </footer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProjects;