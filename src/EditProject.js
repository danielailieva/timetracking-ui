import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { notify } from "react-notify-toast";
import gql from "graphql-tag";

const PROJECT_QUERY = gql`
  query getProject($_id: ID!) {
    getProject(_id: $_id) {
      _id
      title
      content
      date
    }
  }
`;

const UPDATE_PROJECT = gql`
  mutation updateProject($_id: ID!, $title: String!, $content: String!) {
    updateProject(_id: $_id, input: { title: $title, content: $content }) {
      _id
      title
      content
    }
  }
`;

const EditProject = ({ match }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { loading, error, data } = useQuery(PROJECT_QUERY, {
    variables: {
      _id: match.params.id
    }
  });

  const [updateProject] = useMutation(UPDATE_PROJECT);

  if (loading) return <div>Fetching project</div>;
  if (error) return <div>Error fetching project</div>;

  // set the  result gotten from rhe GraphQL server into the project variable.
  const project = data;

  return (
    <div className="column is-11">
      <div className='editform'>
        <form
          onSubmit={e => {
            // Stop the form from submitting
            e.preventDefault();

            // set the title of the project to the title in the state, if not's available set to the original title gotten from the GraphQL server
            // set the content of the project to the content in the state, if not's available set to the original content gotten from the GraphQL server
            // pass the id, title and content as variables to the UPDATE_PROJECT mutation.
            updateProject({
              variables: {
                _id: project.getProject._id,
                title: title ? title : project.getProject.title,
                content: content ? content : project.getProject.content
              }
            });
            notify.show("Project was edited successfully", "success");

          }}
        >

          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Title</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control is-expanded">
                  <input
                    defaultValue={project.getProject.title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    class="input is-info" type="text" placeholder="Project title" />
                </p>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Description</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <textarea
                    defaultValue={project.getProject.content}
                    onChange={e => setContent(e.target.value)}
                    required
                    class="textarea is-link" placeholder="Describe project"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <button class="button is-success navbar-end">
                    <span class="icon is-small">
                      <i class="fa fa-check"></i>
                    </span>
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;