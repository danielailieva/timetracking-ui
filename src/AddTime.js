import React from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const NEW_TIME = gql`
  mutation createTime( $description: String!) {
    createTime(input: { description: $description }) {
      _id
      description
    }
  }
`;

const TIMES_QUERY = gql`
query allTime{
    allTime {
      description
      _id
    }
  }
`;


const AddTime = (() => {

  let input;
  const [createTime] = useMutation(NEW_TIME, {
    update(
      cache,
      {
        data: { createTime }
      }
    ) {
      const { allTime } = cache.readQuery({ query: TIMES_QUERY });

      cache.writeQuery({
        query: TIMES_QUERY,
        data: { allTime: allTime.concat([createTime]) }
      });
    }
  });

  return (
    <div className='editform'>
      <hr />
      <form
        onSubmit={e => {
          e.preventDefault();

          createTime({ variables: { description: input.value } });
          input.value = '';
        }}>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label className="label">Add Time</label>
          </div>
          <p class="control has-icons-left has-icons-right">
            <input
              class="input is-link"
              type="text"
              name="time"
              placeholder="Hours"
              ref={node => { input = node; }}
              required />
            <span class="icon is-small is-left">
              <i class="fa fa-hourglass-end "></i>
            </span>
            <span class="icon is-small is-right">
              <i class="fa fa-check"></i>
            </span>
          </p>
          <p class="control">
            <button class="button is-info">
              + Add
    </button>
          </p>
        </div>
      </form>
    </div>
  );
});
export default AddTime;