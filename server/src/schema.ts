import { makeExecutableSchema } from 'graphql-tools';
import { AppUser } from './entity/AppUser';


// currently gql tag is implemented as noop. The reason why I do this is I can 
// get syntax highlighting using Kumar Harsh's GraphQL for VSCode syntax highlighting extension.
// If anybody has a better idea, pls let me know.
const gql = x => x;

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String
    lastName: String
  }
  type Query {
    users: [User]
    user(id: ID): User
  }
  schema {
    query: Query
  }
`;

const resolvers = {
  Query: {
    async users(root, args, context) {
      return await context.connection
        .getRepository(AppUser)
        .createQueryBuilder('user')
        .getMany();
    },
    async user(root, args, context) {
      return await context.connection
        .getRepository(AppUser)
        .createQueryBuilder('user')
        .where(`user.id = :id`, { id: parseInt(args.id, null) })
        .getOne();
    }
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
