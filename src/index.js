'use strict';

import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();
const graphQlPath = '/graphql';

app.use(cors());

const schema = gql`
	type Query {
		users: [User!]
		user(id: ID!): User
		me: User
	}
	type User {
		id: ID!
		username: String!
	}
`;

let users = {
	1: {
		id: '1',
		username: 'Robin Wieruch',
	},
	2: {
		id: '2',
		username: 'Dave Davids',
	},
};
const me = users[1];
const resolvers = {
	Query: {
		users: () => {
			return Object.values(users);
		},
		user: (parent, { id }) => {
			return users[id];
		},
		me: () => {
			return me;
		},
	},
};

const server = new ApolloServer({
	typeDefs: schema,
	resolvers,
});
server.applyMiddleware({ app, path: graphQlPath });

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen({ port: process.env.PORT }, () => {
	console.log(`Apollo Server on http://localhost:${process.env.PORT}/graphql`);
});
