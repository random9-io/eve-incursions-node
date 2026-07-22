import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import {buildSchema} from 'type-graphql';
import {SpawnResolver} from './resolvers/SpawnResolver';
import waitPort from 'wait-port';
import {CommunityResolver} from './resolvers/CommunityResolver';
import {SpawnLogResolver} from './resolvers/SpawnLogResolver';
import {RatResolver} from './resolvers/RatResolver';
import {AppDataSource} from './lib/data-source';

async function main() {
  await waitPort({host: process.env.MYSQL_HOST, port: 3306});
  await AppDataSource.initialize();
  const schema = await buildSchema({
    resolvers: [SpawnResolver, CommunityResolver, SpawnLogResolver, RatResolver]
  })
  const server = new ApolloServer({
    schema,
    introspection: false,
    plugins: [
      {
        async requestDidStart() {
          return {
            async didResolveOperation(requestContext) {
              const depth = countDepth(requestContext.document);
              if (depth > 5) {
                throw new Error(`Query depth ${depth} exceeds maximum allowed depth of 5`);
              }
            }
          };
        }
      }
    ]
  })
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
    cors: {
      origin: ['http://frontend:3000'],
      credentials: false,
    },
  });
  console.log(`Server has started at ${url}`)
}

function countDepth(document: any, max = 0): number {
  function visit(node: any, depth: number): void {
    if (depth > max) max = depth;
    if (node.selectionSet) {
      for (const sel of node.selectionSet.selections) {
        visit(sel, depth + 1);
      }
    }
  }
  for (const def of document.definitions) {
    visit(def, 0);
  }
  return max;
}

main().catch(e => console.error(e));
