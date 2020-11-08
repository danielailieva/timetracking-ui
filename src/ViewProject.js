import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import AmountTime from "./AmountTime";

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


const ViewProject = ({ match }) => {

  // view current project.
  const { loading, error, data } = useQuery(PROJECT_QUERY, {
    variables: {
      _id: match.params.id
    }
  });


  if (loading) return <div>Fetching project</div>;
  if (error) return <div>Error fetching project</div>;

  // set the  result gotten from rhe GraphQL server into the project variable.
  const project = data;

  return (
    <div className="column">
      <div className='viewProject'>
        <article class="message is-info">
          <div class="message-body">
            <p>
              <strong>Project summary</strong>
              <br /><br />
              <strong>Project Name:</strong>
              {project.getProject.title}
              <br />
              <strong>Description:</strong>
              <br />
              {project.getProject.content}
              <br />
            </p>
          </div>
        </article>
      </div>
      <AmountTime />
    </div>
  );
};

export default ViewProject;