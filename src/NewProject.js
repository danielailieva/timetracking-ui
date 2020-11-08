import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const NEW_PROJECT = gql`
  mutation createProject($title: String!, $content: String!) {
    createProject(input: { title: $title, content: $content }) {
      _id
      title
      content
      date
    }
  }
`;

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

const NewProject = withRouter(({ history }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [createProject] = useMutation(NEW_PROJECT, {
    update(
      cache,
      {
        data: { createProject }
      }
    ) {
      const { allProjects } = cache.readQuery({ query: PROJECTS_QUERY });

      cache.writeQuery({
        query: PROJECTS_QUERY,
        data: { allProjects: allProjects.concat([createProject]) }
      });
    }
  });

  return (
    <div className="column is-half is-offset-one-quarter">

      <div className="newnote-page m-t-20">
        <form
          onSubmit={e => {
            e.preventDefault();

            createProject({
              variables: {
                title,
                content,
                date: Date.now()
              }
            });
            history.push("/");
          }}
        >
          <div className="field">
            <label className="label">Project Title</label>
            <div className="control">
              <input
                className="input is-info is-rounded"
                name="title"
                type="text"
                placeholder="Project Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Project Content</label>
            <div className="control">
              <textarea
                className="textarea is-info"
                name="content"
                rows="10"
                placeholder="Project Content here..."
                value={content}
                onChange={e => setContent(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="field">
            <div className="control">
              <button class="button is-success navbar-end">
                <span class="icon is-small">
                  <i class="fa fa-check"></i>
                </span>
                <span>Save</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

export default NewProject;