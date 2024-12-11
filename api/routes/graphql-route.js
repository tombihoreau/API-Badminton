const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLBoolean } = require("graphql");


const SlotType = new GraphQLObjectType({
  name: "Slot",
  fields: () => ({
    time: { type: GraphQLString },
    isAvailable: { type: GraphQLBoolean }
  })
});


const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    availableSlots: {
      type: new GraphQLList(SlotType),
      args: {
        date: { type: GraphQLString },
        terrain: { type: GraphQLString }
      },
      resolve(parent, args) {
        const { date, terrain } = args;
        if (date === "2024-11-27" && terrain === "A") {
          return [
            { time: "09:00", isAvailable: true },
            { time: "10:00", isAvailable: false },
            { time: "11:00", isAvailable: true }
          ];
        }
        return [];
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
      emptyMutation: {
        type: GraphQLString,
        resolve: () => "Mutation is not implemented yet"
      }
    }
  });
  
  const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
  });


module.exports = schema;