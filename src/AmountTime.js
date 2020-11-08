import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import AddTime from './AddTime'

const TIMES_QUERY = gql`
query allTime{
    allTime {
      description
      _id
    }
  }
`;

const DELETE_TIME_QUERY = gql`
  mutation deleteTime($_id: ID!) {
    deleteTime(_id: $_id) {
      description
      _id
    }
  }
`;

const AmountTime = () => {
    const { loading, error, data } = useQuery(TIMES_QUERY);

    const [deleteTime] = useMutation(DELETE_TIME_QUERY, {
        update(
            cache,
            {
                data: { deleteTime }
            }
        ) {
            const { allTime } = cache.readQuery({ query: TIMES_QUERY });
            const newTime = allTime.filter(time => time._id !== deleteTime._id);

            cache.writeQuery({
                query: TIMES_QUERY,
                data: { allTime: newTime }
            });
        }
    });

    if (loading) return "Loading...";
    if (error) return `Error! ${error.message}`;

    let amountTime = data

    const sum = amountTime.allTime.map(element => element.description);

    var amountArr = sum.reduce(function (prev, curr) {
        return (Number(prev) || 0) + (Number(curr) || 0);
    });

    return (
        <div>
            <article class="message is-info summary">
                <div class="message-body">
                    <strong>Amount Time:</strong>
                    {amountArr} hours
            </div>
            </article>
            <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Project added time (hours)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {amountTime.allTime.map((time) =>
                        <tr key={time._id}>
                            <td>{time.description}</td>
                            <td><button
                                onClick={e => {
                                    e.preventDefault();
                                    deleteTime({ variables: { _id: time._id } });
                                }}
                                className="button is-danger is-outlined card-footer-item"
                            >
                                Delete
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="navbar-end"><strong className="amount">Amount Time: {amountArr} hours</strong></div>
            <AddTime />
        </div>
    );
};

export default AmountTime;