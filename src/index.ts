import path from 'path';
import { ApolloServer } from 'apollo-server';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
// import initSchema from './schema/resolver';

const gplPath = path.resolve(__dirname, 'schema/resolver.graphql');
const typeDefs = importSchema(gplPath);

async function main() {
    // TODO: use ./schema/resolver create schema
    const schema = makeExecutableSchema({
        typeDefs,
        resolverValidationOptions: {
            requireResolversForResolveType: false,
        },
    });

    const server = new ApolloServer({
        mocks: true,
        schema,
    });

    // Start the server
    const { url } = await server.listen(4000);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
}

main();


